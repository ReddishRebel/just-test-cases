class ApiError extends Error {
  /** @type {number} */
  code;

  /**
   * @param {number} code
   * @param {string} message
   * @param {ApiErrorDataType} data
   */
  constructor(code, message, data) {
    super(message);
    this.code = code;
    this.data = data;
  }
}

export class ClientApiError extends ApiError {}

export class ServerApiError extends ApiError {}

/** @typedef {{ headers: Record<string, unknown>; url: string; method: string }} ApiErrorDataType */
