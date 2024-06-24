import { ApiBaseUrl } from "../constants";

const authFetchHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': `${ApiBaseUrl}`,
  Vary: 'Origin'
};

/**
 * Wrapper around native `fetch` that includes fields needed for auth endpoints.
 * @param  {string}  url    - destination URL
 * @param  {string}  method - HTTP method
 * @param  {object}  restParams - Other params for the `fetch` method
 * @return {Promise}        - The result of the fetch request;
 */
export const authFetch = async (url, method = 'GET', restParams) =>
  await fetch(url, {
    method,
    headers: authFetchHeaders,
    credentials: 'include',
    ...restParams
  });
