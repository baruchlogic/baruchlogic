![](src/app/assets/baruch-logic-homepage-screencap.png)

**baruchlogic** is a teaching tool for introductory logic.

This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.

________________________________________________
Baruchlogic Teaching Tool Update: February 2023

SETUP STEPS:
    Step 1: Created Local mySQL Database
        Used a mySQL data dump to create a local mySQL database
    Step 2: Hooked up Local Database to Website
        Set environment variables to local database
        Set up ApiBaseUrl to the local server's base url (see constants.js)
        Set up ApiBaseUrl for easy switch between original & local servers (see constants.js) 

PROBLEM SOLVED:
Students losing unsaved answers when logged out or page reloads

Changes Made:
ProblemsetContainer.js file
    localStorage 'problemsetResponses' initialized as empty object if it doesn't exist
    State variable 'problemsetResponses' initialized from local storage instead of an empty object
    'problemsetResponses' saved to local storage using a useEffect hook
    'problemsetResponses' filtered before submitting to server
    'problemsetResponses' reset to empty object after submitting
    'onReset' function UseEffect removed
Result: The data is now saved and displayed properly for 3 out of 4 of the problem types. 

Remaining Issue:
Natural Deduction problemset - User inputs for added lines, did not display data on page reloads

Solution:
Added missing values of user inputs
Made sure input can be removed if user wants to change it
Added an onKeyDown function to handle the backspace key

Below is a more detailed summary than the one above. 
__________________________________________________________________________________

A more detailed summary than the one above:

February 2023 Developer Update - 
SET UP -
-Created a mySQL database locally, from a mySQL data dump, since access to the actual server is unavailable.
-Hooked up the new local database to the front-end & server of the website. (This included setting the environment variables (from the terminal) & Setting up the front-end variable 'API_BASE_URL' to the new server's api base url. (The latter was done in a way to easily switch between local and original servers: A new variable was created in 'constants.js' called 'ApiBaseUrl.' This variable is set to the local server's api base url. All instances of the variable 'API_BASE_URL' found throughout the project were replaced with the variable 'ApiBaseUrl' and an import from constants.js was added in each file that used the variable (See constants.js for details))).

CHANGED FEATURES -
-Fixed the issue of Students losing un-submitted answers, if logged out or the page reloads -
    ProblemsetContainer.js - Added to file: 
        local storage is initialized as an empty object.
        'problemsetResponses' state variable is initialized from local storage (instead of empty object)
        'problemsetResponses' is saved to localStorage in a useEffect hook.
        On submitting to the server - 
           Before submitting - 'problemsetResponses' is filtered to remove saved answers to other problemsets. 
           After submitting - 'problemsetResponses' is reset to empty object.
        'onReset' function UseEffect removed, so that the data doesn't reset on page reload. 
        'onReset' is only called when reset button is clicked
        The issue was completely fixed and data is saved, visible to the user, changeable, and submits to the server properly, 
        but only for 3 out of 4 problem types
        However the Natural Deduction problemset still had issues. Details Below.
    NaturalDeduction.js (Unit 3 Problemsets 8 - 10)
    Problem:
        Any new line inputted by the user, did not display the Propositions & Cited Lines on page refresh.
    Solution: 
        The missing values of the inputs were added by simply adding it from the 'line' parameter for example:
        "value={tempCitedLines[index]}" was changed to "value={tempCitedLines[index] || line.citedLines}"
        However this caused the input to always display one character, even if the user wanted to remove it (to change it).
        The solution to this issue was to simply add a onKeyDown with a function onBackspace that set the input to an empty string if backspace was pressed when only one character is in the input.
        This was done for both Propositions & Cited Lines inputs (see lines 294 & 260 in NaturalDeduction.js). 
____________________________________________________________________________________________________________________

