# Halo-Doc-Server

Halo-Doc is an online Doctor Consultancy Platform complete with real-time chat using Socket.IO and seamless video calling functionality. The platform is designed to offer a seamless and secure experience to both doctors and patients, making remote healthcare accessible to everyone.

## Installation

Clone the project

```bash
  git clone https://github.com/Mahesward/Halo-Doc-Server.git
```
Go to the project directory

```bash
  cd server
```

Install dependencies

```bash
  npm install
```

Add environment variables

```bash
  touch .env
``` 
add environment variables

```bash
MONGODB_URL = <--mongodb_url-->
JWT_SECRET = "$2b$10$.XeHdd3KmOWvRK.ase5GJuRKhQduYNo5wPJpPqXAUhQvD4cNrQGe2"

#PAYMENT
STRIPE_SECRET = <--stripe-secret-->
STRIPE_END_POINT_SECRET = <--stripe-endpoint-secret-->

CLIENT_URL = <--client url-->

### nodemailer

SMTP_USER = <--gmail-->
SMTP_PASS = <--password-->


GOOGLE_APPLICATION_CREDENTIALS = keys\FIREBASE.json

```
## Run Locally

Build the application

```bash
  npm run build
```

Start the server

```bash
  npm start
```

## Tech Stack

`typescript`  `node.js`  `express`  `mongodb`  `mongoose`  `nodemailer`  `JWT`  `Cloudinary`  `socket.io`  `eslint`  `firebase`  `stripe payment`  `zego cloud API`
