const logger = require('./Logger.js');
const config = require('../config.js');

class RegionRestartHandler {
    constructor(client) {
        this.client = client;
        this.SLbot = client.container.SLbot;
        this.nmv = client.container.nmv;
        
        // State management
        this.isEvacuating = false;
        this.currentLocationIndex = 0;
        this.teleportAttempts = 0;
        this.startupLocation = null;
        this.returnTimer = null;
        this.currentRegion = null;
        
        // Get settings from config
        this.settings = config.regionRestartSettings || {};
        this.enabled = this.settings.enabled || false;
        this.teleportRetryDelay = this.parseTimeValue(this.settings.teleportRetryDelay, 5000);
        this.returnToStartupDelay = this.parseTimeValue(this.settings.returnToStartupDelay, 300000);
        this.maxTeleportAttempts = this.settings.maxTeleportAttempts || 3;
        this.fallbackRegions = config.fallbackRegions || new Map();
        this.backupLocations = Array.from(this.fallbackRegions.values());
        
        if (this.enabled) {
            logger.log('Region Restart Handler initialized and enabled', 'log');
        } else {
            logger.log('Region Restart Handler initialized but disabled', 'log');
        }
    }

    /**
     * Parse time value - accepts seconds with 's' or minutes with 'm'
     * Examples: "5s", "30s", "2m", "10m"
     */
    parseTimeValue(value, defaultValue) {
        if (!value) return defaultValue;
        
        // If it's a string, parse it
        if (typeof value === 'string') {
            const str = value.toLowerCase().trim();
            
            // Extract number and unit
            const match = str.match(/^(\d+(?:\.\d+)?)(s|m)$/);
            if (!match) return defaultValue;
            
            const num = parseFloat(match[1]);
            const unit = match[2];
            
            switch (unit) {
                case 's':
                    return num * 1000;
                case 'm':
                    return num * 60 * 1000;
                default:
                    return defaultValue;
            }
        }
        
        return defaultValue;
    }

    /**
     * Set the startup location to return to later
     */
    setStartupLocation(region, x = 128, y = 128, z = 25) {
        this.startupLocation = { region, x, y, z };
        this.currentRegion = region;
        logger.log(`Startup location set to: ${region} (${x}, ${y}, ${z})`, 'log');
    }

    /**
     * Check if a message contains region restart alert
     */
    isRegionRestartAlert(message) {
        if (!message || typeof message !== 'string') return false;
        
        // Check for various restart alert patterns
        const restartPatterns = [
            /Alert info message: RegionRestartSeconds/i
        ];
        
        return restartPatterns.some(pattern => pattern.test(message));
    }

    /**
     * Handle region restart alert
     */
    async handleRegionRestartAlert(message) {
        if (!this.enabled) {
            logger.log('Region restart detected but handler is disabled', 'warn');
            return;
        }

        if (this.isEvacuating) {
            logger.log('Already evacuating, ignoring additional restart alert', 'warn');
            return;
        }

        if (this.backupLocations.length === 0) {
            logger.log('Region restart detected but no backup locations configured', 'error');
            return;
        }

        logger.log(`Region restart alert detected: ${message}`, 'warn');
        this.isEvacuating = true;
        this.currentLocationIndex = 0;
        this.teleportAttempts = 0;

        // Clear any existing return timer
        if (this.returnTimer) {
            clearTimeout(this.returnTimer);
            this.returnTimer = null;
        }

        await this.beginEvacuation();
    }

    /**
     * Begin evacuation process
     */
    async beginEvacuation() {
        if (this.backupLocations.length === 0) {
            logger.log('No backup locations configured, cannot evacuate', 'error');
            this.isEvacuating = false;
            return;
        }

        logger.log('Beginning evacuation process', 'warn');
        await this.tryTeleportToBackupLocation();
    }

    /**
     * Parse URI format location string
     * Format: "uri:RegionName&x&y&z"
     */
    parseLocationURI(uriString) {
        if (!uriString || !uriString.startsWith('uri:')) {
            return null;
        }
        
        const match = uriString.match(/uri:([^&]+)&(\d+)&(\d+)&(\d+)/);
        if (!match) {
            return null;
        }
        
        return {
            region: decodeURIComponent(match[1]),
            x: parseInt(match[2], 10),
            y: parseInt(match[3], 10),
            z: parseInt(match[4], 10)
        };
    }

    /**
     * Try to teleport to the current backup location
     */
    async tryTeleportToBackupLocation() {
        if (this.currentLocationIndex >= this.backupLocations.length) {
            logger.log('All backup locations exhausted, evacuation failed', 'error');
            this.isEvacuating = false;
            return;
        }

        const locationURI = this.backupLocations[this.currentLocationIndex];
        const location = this.parseLocationURI(locationURI);
        
        if (!location) {
            logger.log(`Invalid location URI format: ${locationURI}`, 'error');
            this.currentLocationIndex++;
            this.teleportAttempts = 0;
            setTimeout(async () => {
                await this.tryTeleportToBackupLocation();
            }, this.teleportRetryDelay);
            return;
        }
        
        this.teleportAttempts++;

        logger.log(`Attempting teleport ${this.teleportAttempts}/${this.maxTeleportAttempts} to backup location: ${location.region} (${location.x}, ${location.y}, ${location.z})`, 'log');

        try {
            const { Vector3 } = this.nmv;
            const position = new Vector3(location.x, location.y, location.z);
            const lookAt = position;
            
            await this.SLbot.clientCommands.teleport.teleportTo(location.region, position, lookAt);
            
            logger.log(`Successfully evacuated to: ${location.region}`, 'log');
            this.currentRegion = location.region;
            this.onEvacuationSuccess();
            
        } catch (error) {
            logger.log(`Teleport failed: ${error.message}`, 'error');
            await this.handleTeleportFailure();
        }
    }

    /**
     * Handle successful evacuation
     */
    onEvacuationSuccess() {
        this.isEvacuating = false;
        this.teleportAttempts = 0;
        
        // Schedule return to startup location
        if (this.startupLocation && this.returnToStartupDelay > 0) {
            logger.log(`Scheduling return to startup location in ${this.returnToStartupDelay / 1000} seconds`, 'log');
            
            this.returnTimer = setTimeout(async () => {
                await this.returnToStartupLocation();
            }, this.returnToStartupDelay);
        }
    }

    /**
     * Handle teleport failure
     */
    async handleTeleportFailure() {
        if (this.teleportAttempts >= this.maxTeleportAttempts) {
            // Move to next location
            logger.log(`Max attempts reached for current location, trying next backup location`, 'warn');
            this.currentLocationIndex++;
            this.teleportAttempts = 0;
            
            // Wait before trying next location
            setTimeout(async () => {
                await this.tryTeleportToBackupLocation();
            }, this.teleportRetryDelay);
        } else {
            // Retry current location
            logger.log(`Retrying current location in ${this.teleportRetryDelay / 1000} seconds`, 'log');
            
            setTimeout(async () => {
                await this.tryTeleportToBackupLocation();
            }, this.teleportRetryDelay);
        }
    }

    /**
     * Return to startup location
     */
    async returnToStartupLocation() {
        if (!this.startupLocation) {
            logger.log('No startup location set, cannot return', 'warn');
            return;
        }

        // Check if we're already at the startup location
        if (this.currentRegion === this.startupLocation.region) {
            logger.log('Already at startup location, no need to return', 'log');
            return;
        }

        logger.log(`Attempting to return to startup location: ${this.startupLocation.region}`, 'log');

        try {
            const { Vector3 } = this.nmv;
            const position = new Vector3(this.startupLocation.x, this.startupLocation.y, this.startupLocation.z);
            const lookAt = position;
            
            await this.SLbot.clientCommands.teleport.teleportTo(
                this.startupLocation.region, 
                position, 
                lookAt
            );
            
            logger.log(`Successfully returned to startup location: ${this.startupLocation.region}`, 'log');
            this.currentRegion = this.startupLocation.region;
            
        } catch (error) {
            logger.log(`Failed to return to startup location: ${error.message}`, 'error');
            
            // Schedule another attempt in a bit
            logger.log('Scheduling retry to return to startup location in 60 seconds', 'log');
            this.returnTimer = setTimeout(async () => {
                await this.returnToStartupLocation();
            }, 60000);
        }
    }

    /**
     * Manually trigger evacuation (for testing or manual use)
     */
    async manualEvacuation() {
        logger.log('Manual evacuation triggered', 'warn');
        await this.handleRegionRestartAlert('Manual evacuation triggered');
    }

    /**
     * Get current status
     */
    getStatus() {
        return {
            enabled: this.enabled,
            isEvacuating: this.isEvacuating,
            currentRegion: this.currentRegion,
            startupLocation: this.startupLocation,
            currentLocationIndex: this.currentLocationIndex,
            teleportAttempts: this.teleportAttempts,
            backupLocationsCount: this.backupLocations.length
        };
    }

    /**
     * Cleanup method
     */
    cleanup() {
        if (this.returnTimer) {
            clearTimeout(this.returnTimer);
            this.returnTimer = null;
        }
        this.isEvacuating = false;
    }
}

module.exports = RegionRestartHandler;