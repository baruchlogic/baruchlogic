/**
 * Save a value to localStorage by key
 * @param  {string} key
 * @param  {string} value
 * @return {void}
 */
export const saveToLocalStorage = (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

/**
 * Retrieve a value from localStorage by key
 * @param  {string} key
 * @return {any}
 */
export const getValueFromLocalStorageByKey = key => {
  try {
    return JSON.parse(localStorage[key]);
  } catch (e) {
    console.log(e);
  }
};

/**
 * Remove a value from localStorage by key
 * @param  {string} key
 * @return {void}
 */
export const clearKeyFromLocalStorage = key => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
};

/**
 * Clear all student names from local storage
 */
export const RemoveStudentNamesFromLocalStorage = () => {
  try {
    localStorage.removeItem('studentNames');
  } catch (e) {
    console.log(e);
  }
};
