import axios from 'axios';
import https from 'https';

/**
 * @function getAuthToken
 * @summary  async function to retrieve TDX auth token to use in API calls
 * @example  const authToken = await getAuthToken({
 *   username: 'your-username',
 *   password: 'super-secret-string',
 *   apiBaseUrl: 'https://tdx.your.domain/TDWebApi/api'
 * });
 * @param    {Object} obj object with parameters
 * @param    {string} obj.username
 * @param    {string} obj.password
 * @param    {string} obj.apiBaseUrl
 * @param    {string} [obj.userAgent='CIT Cloud Team Automation']
 * @returns  {Object} with authToken data
 */
export const getAuthToken = async ({
  username,
  password,
  apiBaseUrl,
  userAgent = 'CIT Cloud Team Automation',
}) => {
  const getTokenConfig = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'User-Agent': userAgent,
    },
    url: `${apiBaseUrl}/auth/login`,
    method: 'POST',
  };
  // add the following manually or the conversion from object to string adds unwanted slashes in password
  getTokenConfig.data = `{ "UserName": "${username}", "Password": "${password}" }`;
  const token = await axios(getTokenConfig).then((response) => response.data);

  return token;
};

/**
 * @function makeApiCall
 * @summary  async function for making calls to the TDX API
 * @example  const apiData = await makeApiCall({
 *   apiBaseUrl: 'https://tdx.your.domain/TDWebApi/api',
 *   endpointPath: '/people/lookup?searchText=',
 *   authToken,
 *   method: 'GET'
 * });
 * @param    {Object} obj object with parameters
 * @param    {string} obj.apiBaseUrl
 * @param    {string} obj.endpointPath
 * @param    {string} obj.authToken
 * @param    {string} [obj.requestMethod='OPTIONS']
 * @param    {string} [obj.userAgent='CIT Cloud Team Automation']
 * @param    {Object} [obj.requestBody=null]
 * @returns  {Object} with JSON data
 */
export const makeApiCall = async ({
  apiBaseUrl,
  endpointPath,
  authToken,
  requestMethod = 'OPTIONS',
  requestBody = null,
  ignoreSslErrors = false,
  userAgent = 'CIT Cloud Team Automation',
}) => {
  const authHeader = {
    Authorization: `Bearer ${authToken}`,
  };

  const httpClientConfig = {
    headers: {
      ...authHeader,
      Accept: 'application/json',
      'User-Agent': userAgent,
    },
  };
  if (ignoreSslErrors) {
    // ignore the self-signed ssl errors
    httpClientConfig.httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    httpClientConfig.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }
  if (
    (requestMethod.toUpperCase() === 'POST' ||
      requestMethod.toUpperCase() === 'PUT') &&
    requestBody
  ) {
    httpClientConfig.body = requestBody;
  }

  const apiData = await axios({
    url: `${apiBaseUrl}${endpointPath}`,
    method: `${requestMethod}`,
    ...httpClientConfig,
  }).then((response) => response.data);

  return apiData;
};

/**
 * @function getTicket
 * @summary  async function for getting an individual TDX ticket
 * @example  const ticketData = await getTicket({
 *   ticketId: 123456,
 *   authToken,
 *   apiBaseUrl: 'https://tdx.your.domain/TDWebApi/api',
 *   appId: 99,
 * });
 * @param    {Object} obj with parameters
 * @param    {number} obj.ticketId
 * @param    {string} obj.authToken
 * @param    {string} obj.apiBaseUrl
 * @param    {number} obj.appId
 * @returns  {Object} with JSON data
 */
export const getTicket = async ({ ticketId, authToken, apiBaseUrl, appId }) => {
  const ticketData = await makeApiCall({
    apiBaseUrl,
    endpointPath: `/${appId}/tickets/${ticketId}`,
    authToken,
    requestMethod: 'GET',
  });

  return ticketData;
};

/**
 * @function getCloudTeamTicketDefaults
 * @summary  async function that returns defaults from endpoint in this repo
 * @example  await getCloudTeamTicketDefaults('https://url-for-endpoint.with/automated-ticket-defaults.json');
 * @returns  {Object} with JSON data
 */
export const getCloudTeamTicketDefaults = async (endpointUrl) => {
  const ticketDefaults = await axios(endpointUrl).then(
    (response) => response.data,
  );

  return ticketDefaults;
};
