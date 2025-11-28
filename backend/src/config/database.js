const path = require('path');

const config = {
  DB_FILE: path.join(__dirname, '../../database.json'),
  UPLOAD_DIR: path.join(__dirname, '../../uploads'),
};

module.exports = config;