const logger = require("../modules/Logger.js");
module.exports = async (client, error) => {
  logger.error(`An error event was sent by Discord.js: \n${JSON.stringify(error)}`);
};
