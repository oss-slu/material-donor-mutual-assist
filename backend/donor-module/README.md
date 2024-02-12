# Test case for the issue #27
To show material donors the impact of their donations.

These are the steps to run test cases:

1. Clone the repository to your local machine.
   # git clone url
2. Naviage to the backend/admin-module using the
   # cd ./backend/donor-module

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