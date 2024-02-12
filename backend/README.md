Instructions for Running the Tests:
For the issue #23: Test case for getting list of donors data using the /donorsList endpoint

## Witten unit tests for admin-module section of /donorsList  endpoint

1. Clone the repository to your local machine.
   # git clone url
2. Naviage to the backend/admin-module using the
   # cd ./backend/admin-module

3. Install dependencies using 
   # npm install
   (or)
   if does not work, try with root user
   # sudo npm install



4. Run the unit test using the command 
   #  npm run test
    --> The unit test is written in tests/donars_List.test.js file
    --> The functionality of geting list of donars is defined in the routes/donars_List.js file
    or to individual test files
    # npm run test donars_List.test




# Test case for the issue #27
To show material donors the impact of their donations.


1. Clone the repository to your local machine.
   # git clone url
2. Naviage to the backend/admin-module using the
   # cd ./backend/admin-module

3. Install dependencies using 
   # npm install
   (or)
   if does not work, try with root user
   # sudo npm install


4. Run the unit test using the command 
   #  npm run test
    --> The unit test is written in tests/donars_List.test.js file
    --> The functionality of geting list of donars is defined in the routes/donars_List.js file
    or to run the individual unit tests
    # npm run test donar_Engagement.test