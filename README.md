# Tech Job Hub

A comprehensive job seeking and posting platform that connects job seekers with recruiters.


## 🔗 Live URLs
- **Frontend:** [https://tech-job-hub.netlify.app](https://tech-job-hub.netlify.app)
- **Backend:** [https://tech-job-hub-backend.onrender.com](https://tech-job-hub-backend.onrender.com)

## 🎥 Video Demonstration
*5-10 minute walkthrough of the application*

**[Video Demo Placeholder – Add your video link here]**

> **Important Note:** We're using free-tier servers which may need a warm-up:
> 1. First open the backend URL and wait for it to load
> 2. Then access the frontend URL for the best experience
> 3. If experiencing delays, please refresh both URLs


## 📖 User Guide

### Getting Started
1. Visit the frontend URL above.
2. Register as a job seeker or recruiter.
3. Explore job listings, apply, or post jobs as appropriate.
4. Use the chatbot for help or questions.

### User Roles
- **Job Seeker:** Register, search/apply for jobs, manage profile, upload resume.
- **Recruiter:** Register company, post/manage jobs, view applicants, manage company profile.

### Tips
- Use the filters to narrow job searches.
- Save jobs to your profile for later.
- Recruiters can track applicants and update job postings.

### For Job Seekers
- Account creation and management
- Job search with advanced filtering
- Save interesting job postings
- Apply to jobs
- Profile customization
- Resume upload and management

### For Recruiters
- Company registration and profile management
- Job posting creation and management
- Access to applicant details (name, phone, resume)
- Applicant tracking and management

## Application Screenshots

### 1. Job Description Page
![Job Posting For](./images/1.png)

### 2. Sign In Interface
![Job Search Interface](./images/2.png)

### 3. Footer
![Profile Management](./images/3.png)

### 4. Chat Bot
![Company Dashboard](./images/4.png)

### 5. Landing Page
![Landing Page](./images/5.png)


## 🏗️ Technical Architecture Overview

- **Frontend:** React.js (Vite, Tailwind CSS, Redux Toolkit, Framer Motion)
- **Backend:** Node.js (Express.js, REST API, JWT Auth, Multer, Sentry, Appwrite)
- **Database:** MongoDB Atlas (production), local MongoDB (development)
- **Cloud Storage:** Appwrite (for file uploads)
- **AI Integration:** Mistral (for chatbot)
- **CI/CD:** GitHub Actions (build, test, deploy)
- **Monitoring:** Sentry (frontend & backend error tracking)
- **Hosting:** Netlify (frontend), Render (backend)



## 🧪 Testing & CI/CD

- **Unit/Integration Tests:**
  - Backend: Run `pnpm test` in `/server` (see test files for coverage)
  - Frontend: (Add tests as needed)
- **End-to-End Tests:** (Add E2E tests if implemented)
- **CI/CD:**
  - Automated with GitHub Actions: runs tests and deploys on push to main
  - See `.github/workflows/` for config

---


### Development Setup (.env.development)
```env
NODE_ENV=development
PORT=8000
MONGO_URI=mongodb://localhost:27017/techjobhub_dev
SECRET_KEY=your_secret_key
APPWRITE_ENDPOINT=your_appwrite_endpoint
APPWRITE_PROJECT_ID=your_appwrite_project_id
APPWRITE_API_KEY=your_appwrite_api_key
APPWRITE_BUCKET_ID=your_appwrite_bucket_id
MISTRAL_API_KEY=your_mistral_api_key
FRONTEND_URL=http://localhost:5173
```


### Production Setup (.env.production)
```env
NODE_ENV=production
PORT=8000
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.example.mongodb.net/techjobhub_prod
SECRET_KEY=your_very_strong_jwt_secret
APPWRITE_ENDPOINT=your_appwrite_endpoint
APPWRITE_PROJECT_ID=your_appwrite_project_id
APPWRITE_API_KEY=your_appwrite_api_key
APPWRITE_BUCKET_ID=your_appwrite_bucket_id
MISTRAL_API_KEY=your_mistral_api_key
FRONTEND_URL=https://tech-job-hub.netlify.app
```

> **📋 Database Strategy:**
> - **Development**: Use local MongoDB (faster, offline-capable)
> - **Production**: Use MongoDB Atlas (managed, scalable)
> - See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed setup instructions

## 🔧 Frontend Configuration

Update the backend URL in `client/src/utils/constant.js`:

```javascript
const BASE_URL = "http://localhost:8000/api/v1";
```

##  Local Development

### Prerequisites
- Node.js (v18+ recommended)
- pnpm (recommended package manager)

Install pnpm if you haven't already:
```bash
npm install -g pnpm
```

### Setup Instructions

1. Clone the repository
2. **Setup Database** (see [DATABASE_SETUP.md](./DATABASE_SETUP.md)):
   - **Development**: Install local MongoDB (recommended)
   - **Production**: Setup MongoDB Atlas account
3. **Configure Environment Variables**:
   - Copy `.env.development` template and update with your values
   - For production, use `.env.production` template
4. Install dependencies:

**Option 1: Using pnpm workspace (Recommended)**
```bash
# Install all dependencies for both frontend and backend
pnpm install

# Start development servers with local MongoDB
pnpm --filter server run dev &
pnpm --filter client run dev
```

**Option 2: Individual setup**
```bash
# Backend
cd server
pnpm install
pnpm run dev

# Frontend (in a new terminal)
cd client
pnpm install
pnpm run dev
```

**Option 3: Using npm (alternative)**
```bash
# Backend
cd server
npm install
npm run dev

# Frontend
cd client  
npm install
npm run dev
```


# 📖 API Documentation

## Base URL

- Production: `https://<your-backend-domain>/api/v1`
- Local: `http://localhost:8000/api/v1`

---

## Authentication

Most endpoints require authentication via JWT in the `Authorization` header:  
`Authorization: Bearer <token>`

---

## Endpoints

### Users

#### Register
- **POST** `/user/register`
- **Body:**  
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**  
  `201 Created` with user info and token

#### Login
- **POST** `/user/login`
- **Body:**  
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**  
  `200 OK` with user info and token

#### Get Profile
- **GET** `/user/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**  
  `200 OK` with user profile

#### Update Profile
- **PUT** `/user/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**  
  ```json
  {
    "name": "string",
    "bio": "string",
    "avatar": "string (URL or file)"
  }
  ```
- **Response:**  
  `200 OK` with updated profile

---

### Companies

#### List Companies
- **GET** `/company`
- **Response:**  
  `200 OK` with array of companies

#### Get Company by ID
- **GET** `/company/:id`
- **Response:**  
  `200 OK` with company details

#### Create Company
- **POST** `/company`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**  
  ```json
  {
    "name": "string",
    "description": "string",
    "website": "string"
  }
  ```
- **Response:**  
  `201 Created` with company info

#### Update Company
- **PUT** `/company/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**  
  ```json
  {
    "name": "string",
    "description": "string",
    "website": "string"
  }
  ```
- **Response:**  
  `200 OK` with updated company

#### Delete Company
- **DELETE** `/company/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**  
  `204 No Content`

---

### Jobs

#### List Jobs
- **GET** `/job`
- **Response:**  
  `200 OK` with array of jobs

#### Get Job by ID
- **GET** `/job/:id`
- **Response:**  
  `200 OK` with job details

#### Create Job
- **POST** `/job`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**  
  ```json
  {
    "title": "string",
    "description": "string",
    "companyId": "string",
    "location": "string",
    "salary": "number"
  }
  ```
- **Response:**  
  `201 Created` with job info

#### Update Job
- **PUT** `/job/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**  
  ```json
  {
    "title": "string",
    "description": "string",
    "location": "string",
    "salary": "number"
  }
  ```
- **Response:**  
  `200 OK` with updated job

#### Delete Job
- **DELETE** `/job/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**  
  `204 No Content`

---

### Applications

#### Apply for Job
- **POST** `/application`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**  
  ```json
  {
    "jobId": "string",
    "resume": "string (URL or file)",
    "coverLetter": "string"
  }
  ```
- **Response:**  
  `201 Created` with application info

#### List Applications (User)
- **GET** `/application/user`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**  
  `200 OK` with array of applications

#### List Applications (Company)
- **GET** `/application/company/:companyId`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**  
  `200 OK` with array of applications

---

### Chatbot

#### Chat
- **POST** `/chatbot/message`
- **Body:**  
  ```json
  {
    "message": "string"
  }
  ```
- **Response:**  
  `200 OK` with chatbot reply

---

## Error Handling

- All errors return a JSON object:
  ```json
  {
    "error": "Error message"
  }
  ```
- Common status codes: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`

---
