const authFetchHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': `${API_BASE_URL}:5000`,
  Vary: 'Origin'
};

/**
 * Wrapper around native `fetch` that includes fields needed for auth endpoints.
 * @param  {string}  url    - destination URL
 * @param  {string}  method - HTTP method
 * @param  {object}  restParams - Other params for the `fetch` method
 * @return {Promise}        - The result of the fetch request;
 */
export const authFetch = async (url, method = 'GET', restParams) => {
  return await fetch(url, {
    method,
    headers: authFetchHeaders,
    credentials: 'include',
    ...restParams
  });
};
