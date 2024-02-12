Instructions for Running the Tests:

## Witten unit tests for admin-module section of /donorsList  endpoint

1. Clone the repository to your local machine.

2. Naviage to the backend/admin-module using the
    cd ./backend/admin-module

3. Install dependencies using 
   (i) npm install
   (or)
   if does not work, try with root user
   sudo npm install

3. Run the application using the following command
   npm start

4. Run the unit test using the command 
        npm run test
    --> The unit test is written in tests/donars_List.test.js file
    --> The functionality of geting list of donars is defined in the routes/donars_List.js file