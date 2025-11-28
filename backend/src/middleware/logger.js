const logger = {
  info: (message, data = {}) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] ${message}`, Object.keys(data).length ? JSON.stringify(data, null, 2) : '');
  },
  warn: (message, data = {}) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [WARN] ${message}`, Object.keys(data).length ? JSON.stringify(data, null, 2) : '');
  },
  error: (message, error = {}) => {
    const timestamp = new Date().toISOString();
    console.error(
      `[${timestamp}] [ERROR] ${message}`,
      error?.stack || error?.message || JSON.stringify(error, null, 2)
    );
  },
};

module.exports = logger;