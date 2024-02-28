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


## Issues

Currently, the application sends emails to users who submit requests through the system directly as code there is no separate service and no queueing functionality, which lags robustness. To address this, we need to integrate a messaging system (NATS) and an email sending service (Amazon SES) to handle email requests asynchronously.

Acceptance Criteria:
Express.js Integration: Set up an endpoint in the Express.js application to receive email requests and publish them to NATS.
NATS Integration: Connect to the NATS server and publish email requests to a designated NATS subject.
Amazon SES Integration: Implement a worker process that subscribes to the NATS subject, consumes email requests, and sends emails using Amazon SES.
Error Handling: Implement error handling and logging for email sending failures.
Security: Ensure sensitive credentials (NATS, Amazon SES) are handled securely and not exposed in the codebase.

Tasks:
Issue 1 :Configure NATS connection in the Express.js application.
-Initialize NATS connection in the Express.js application.
-Ensure proper error handling for connection failures.


Issue 2 :Create an endpoint /sendEmail in the Express.js application to receive email requests.
Issue 3 : Implement message publishing to NATS when a POST request is made to /sendEmail.
Issue 4 : Create a separate worker process to consume messages from NATS and send emails using Amazon SES.
Issue 5: Implement error handling and logging for email sending failures.
Issue 6: Test the end-to-end flow to ensure emails are sent successfully.
Issue 7 : Update documentation with details on how to set up and run the application.)

