const ADMIN_EMAIL = 'baruchlogic@gmail.com';
const TEXTBOOK_URL =
  'https://github.com/baruchlogic/textbook/blob/master/README.md';
const MOMENT_FORMAT = 'ddd MMMM Do YYYY, h:mm A';

/* API BASE URL - See "README.md" February 2023 Update for details. (should this be moved to separate file?)*/
// const ApiBaseUrl = `http://localhost:5000`; //Turn on only for development. Turn off for live website. 
const ApiBaseUrl = API_BASE_URL; //Turn off for development. Turn on for live website.

module.exports = {
  ADMIN_EMAIL,
  MOMENT_FORMAT,
  TEXTBOOK_URL,
  ApiBaseUrl
};
