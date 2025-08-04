# AVAA - Assistant for Vaccination Appointments and Analytics

Project Duration: July 2025 (one month)

## Table of Contents
- [Project Overview](#1-project-overview)
- [Tech Stack](#2-tech-stack)
- [Installation & Setup](#3-installation--setup)
- [Future Steps](#4-future-steps)

---

## 1. Project Overview

AVAA (Assistant for Vaccination Appointments and Analytics) is a proof-of-concept application built with the MERN stack (MongoDB, Express, React, Node.js) to demonstrate a functional end-to-end system for managing vaccination appointments and analytics.

The backend is developed with Express.js, interfacing with a local MongoDB database to handle CRUD operations for user profiles, demographic data, appointment records, and vaccine/hospital listings. The frontend is built with React.js, leveraging reusable components and React-Bootstrap for responsive UI design.

Users can:
- Log in to their accounts.
- Browse available vaccines and hospitals.
- Request vaccination appointments.
- View their past and upcoming appointments.
- Pay for upcoming appointments.

Additionally, users with administrator privileges can create new vaccine listings and approve pending appointments. As a personal design-choice, records are unable to be deleted by patients or medical administrators.

Basic analytics, such as demographic distributions by gender, age, and profession, are publicly accessible to all visitors on the default landing page.

## 2. Tech Stack

### Backend - Express API

The Express API techstack utilizes a number of modern Node packages to build a scalable backend API. The core framework is *Express.js* which handles HTTP requests and routing. *mongoose* is used for interacting with a local *Mongo DB* database. *dotenv* manages environment variables holding sensitive information, and *cors* ensures proper cross-origin resource sharing. For authentication, the app uses *jsonwebtoken* (JWT) for token-based authentication with a graceful 5 minute token-refresh period. User's passwords are hashed using *bcryptjs*. *faker* is used for generating random mock data for development and testing. *pdfmake* is used for generating certificate PDFs for vaccination appointments, and the *AWS-SDK S3* modules are used for interacting with the AWS environment and resources, which includes uploading PDFs and generating presigned URLs for users to download from the bucket directly.

### Frontend - React UI

The React UI techstack utilizes a number of modern UI-related packages to build a clean, navigable client-side user experience. The core framework is *React.js* and its related packages which allows for dynamic component-based UI, routing within React, single-paged applications (SPA), and integration with *Bootstrap* for styling. *redux* is used for state management across a user's site session. *axios* is used for Promise-based communication with the Express API. *d3* is used for dynamic data visualizations. *pdfmake* is used for generating certificate PDFs on client-side (particularly for appointments that have not yet been completed).

Webpack is used to compile and bundle JS, CSS, and other static assets into optimized files that are ready to be served to the browser. For styling, it uses *css-loader* to process CSS imports within JavaScript modules and *style-loader* to inject those styles dynamically into the HTML document at runtime. The *HTML Webpack Plugin* automates the injection of the generated JS and CSS bundles into the root HTML file. *Babel* serves as the JS transpiler, converting modern JS (ES6+ features) and JSX syntax into backwards-compatible ES5 code for a wider range of browser support.

## 3. Installation & Setup

### AWS and .env file configuration

#### AWS S3 Bucket Setup

Using the AWS Console, create an S3 Bucket with default access (this should show as all the access options being checked, resulting in a private bucket). The default encryption is fine for the scope of this project, and versioning is optional as well.
After creating the bucket, copy the **name** and **AWS region** for later usage. Lastly, modify the permissions of the bucket to allow CORS (cross-origin resource sharing) across any requester. In the CORS section of the *Permissions* tab, enter this JSON code:

```
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": [],
        "MaxAgeSeconds": 3000
    }
]
```

#### AWS IAM Role Setup

Using the AWS Console, navigate to the IAM section and create a new policy. Select the *JSON* editor and paste the following code:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::<INSERT THE S3 BUCKET NAME HERE>",
                "arn:aws:s3:::<INSERT THE S3 BUCKET NAME HERE>/*"
            ]
        }
    ]
}
```

Be sure to replace `<INSERT THE S3 BUCKET NAME HERE>` with the actual name of the newly created S3 bucket. Name the policy something unique. This policy will allow programmatic access to specifically the newly created bucket.

Afterwards, navigate in the IAM section to create a new user. Select *Attach Policies Directly*, and search for the policy you had just created and attach it to this new user. Then finalize creating the user.

Lastly, select the newly created IAM user for more info and select *Security Credentials*. Navigate downward on this page to the *Access Keys* section. Create a new access key for this user, selecting either **Local Code** or **Other** as the primary use case for the key. If desired, create a short description for the key as well. Afterwards, finish creating the key and download the **.csv** file that contains the access key and secret key components.

#### Configuring the .env file

This project uses the *dotenv* package to inject sensitive information into the Express API when run. Accordingly, the `.env.txt` file must be configured before the application can run. Upon opening the file, replace the placeholder values with your own custom JWT authentication key (or generate one and paste it in), AWS region provider, S3 bucket name, and IAM user's access key and secret key components. Additionally, the Mongo DB URL can be configured to access a remote database rather than the local computer. After configuration, delete all comments and remove the `.txt` file extension. The new file should be named `.env` and will contain sensitive data.

### Frontend and Backend Application Setup (/node_modules)

Simply open a local terminal and navigate to the `/expressAPI` and `/reactUI` subdirectories, respectively. In each, run:

```
npm install
```

to install all necessary dependencies. Afterwards, both the **backend: Express API** and the **frontend: React UI** are executable by using:

```
npm start
```

through a terminal in their respective directories.

NOTE: The backend runs on port 9000 and the frontend runs on port 9090. Please ensure these ports are available before starting the respective applications.

## 4. Future Steps

To expand on this project into a more fully-developed production style application, future steps could include:
- Integrate secure payment processing through a third-party payment gateway.
- Expand analytics capabilities with advanced visualizations and filtering options based on demographic data (age, gender, profession, etc.).
- Revamp the user interface (UI) with a modern, responsive design for improved user experience across devices.

