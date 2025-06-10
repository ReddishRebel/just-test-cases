import { ClientApiError, ServerApiError } from '../shared/errors';

const API_BASE = '/api';

/** @param {number} statusCode */
const isOK = statusCode => statusCode >= 200 && statusCode < 300;

/** @param {number} statusCode */
const isClientError = statusCode => statusCode >= 400 && statusCode < 500;

/**
 * @param {string} path
 * @param {string} method
 * @param {string | null} body
 * @param {Record<string, string>} headers
 * @param {boolean} [parseResponse=false] Default is `false`
 */
export const request = async (path, method, body, headers, parseResponse = false) => {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    method,
    headers,
    body
  });

  if (isOK(response.status)) {
    if (parseResponse === true) {
      return response.json();
    }
  } else {
    const data = await response.json();
    if (isClientError(response.status)) {
      throw new ClientApiError(response.status, data?.message ?? '', { headers, method, url });
    } else {
      throw new ServerApiError(response.status, data?.message ?? '', { headers, method, url });
    }
  }
};
