const Axios = require('axios');
const { setupCache } = require('axios-cache-interceptor');

const MINUTES = 60 * 1000;
const HOURS = 60 * MINUTES;

const axios = Axios.create();

const cache = setupCache({
    maxAge: 168 * HOURS,
});

export const axiosCacheRetry = Axios.create({
    adapter: cache.adapter,
});

axiosRetry(axiosCacheRetry, {
    retries: 5,
    retryDelay: axiosRetry.exponentialDelay,
});

export default axios;