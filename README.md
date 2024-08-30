
# NodeJs Authenticator App

NodeJs Authenticator App is the starter code for any webApp that requires authentication. It allows users to register and login either using email or through google login. Users can update their password while they are logged in and can also reset their password in case they forget it.

# Installation
1) git clone [https://github.com/nandinisahu99/Authenticator_Tool](https://github.com/nandinisahu99/Authenticator_Tool)
2) move to the repository folder open with vs code
3) Obtain google OAuth2.0 credentials from google developers console. 
4) Update the callbackUrl in the google developers console with the "{base url}/user/auth/google/callback". For eg. http://localhost:3000/user/auth/google/callback
5) Update all the env variables carefully
6) npm install
7) node index.js

# env variables
1) PORT=
2) MONGO_URL=
3) SESSION_SECRET=
4) GOOGLE_CLIENT_ID=
5) GOOGLE_CLIENT_SECRET=
6) SENDER_PASSWORD=
7) SENDER_EMAIL=
8) BASE_URL=
 
# Features
1) Users can register/login via email or google
2) Users who have registered using email can update their password after logging in
3) Users can reset their password using forgot password link in the login page 

