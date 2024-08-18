# Simplify Assigment

Introduction
This project is a Simplify Assigment. It is built with a focus on providing a seamless user experience with a clean UI and robust backend.

<h1>Features</h1>

Responsive Design: Designed using Material UI for a modern and responsive user interface.
Form Validation: Implemented with react-hook-form for smooth and efficient form validation.
User Authentication: OTP-based user authentication system.
International Support: Integrated countries-list to display ISD codes with corresponding country names.
Backend: Developed with Express.js and Node.js to handle user authentication and data storage.
Deployment: The backend is deployed on Render, and the frontend is hosted on Netlify.

<h1>Technologies Used</h1>


<h2>Frontend</h2>

React: JavaScript library for building user interfaces.
Material UI: For designing the user interface with pre-built components.
React Hook Form: For handling form validation and input management.
Axios: For making HTTP requests to the backend.
countries-list: To display ISD codes with country names.

<h2>Backend</h2>

Express.js: Web application framework for Node.js.
Node.js: JavaScript runtime built on Chrome's V8 JavaScript engine.
MongoDB: Database used for storing user information.

<h2>Deployment</h2>

Frontend: Deployed on Netlify.
Backend: Deployed on Render.


<h1>Installation</h1>

<h2>Clone the Repository</h2>

git clone https://github.com/pgariya/Simplify.git
cd Simplify

<h3>Frontend</h3>

cd frontend
npm install
npm run start

<h3>Backend</h3>

cd backend
npm install
npm run start

<h3>Backend API</h3>
The backend API handles user registration, OTP generation, verification, and more.

POST /api/user/send-otp - Send OTP to the user's email.
POST /api/user/verify-otp - Verify the OTP entered by the user.
POST /api/user/resend-otp - Resend OTP if not received.

<h1>Deployment</h1>

The application is deployed and can be accessed via the following links:

<h2>Frontend</h2>
https://66c088dad9e6ac57a5738ff7--warm-sawine-893a2d.netlify.app/

<h2>Backend</h2>
https://simplifybackend.onrender.com

