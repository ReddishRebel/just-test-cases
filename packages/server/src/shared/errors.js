const http = require('node:http');

class HttpError extends Error {
  /**
   * @param {Number} code
   * @param {String} message
   * @param {Record<String, unknown>} [data]
   */
  constructor(code, message, data) {
    super();
    this.statusCode = code;
    if (code >= 400 && code < 500) {
      this.message = `${http.STATUS_CODES[code] ?? 'HttpError'}. ${message}`;
    } else {
      this.data = { detail: message, ...data };
      this.message = http.STATUS_CODES[code] ?? 'HttpError';
    }
  }
}

class ApplicationError extends HttpError {
  /**
   * @param {String} message
   * @param {Record<String, unknown>} [data]
   */
  constructor(message, data) {
    super(500, message, data);
  }
}

class NotFoundError extends HttpError {
  /**
   * @param {String} message
   * @param {Record<String, unknown>} [data]
   */
  constructor(message, data) {
    super(404, message, data);
  }
}

module.exports = {
  ApplicationError,
  NotFoundError
};
