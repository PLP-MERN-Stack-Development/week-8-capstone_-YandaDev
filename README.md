# Tech Job Hub

A comprehensive job seeking and posting platform that connects job seekers with recruiters.

🔗 **Live URLs:**
- Frontend: [https://tech-job-hub.netlifly.app](https://tech-job-hub.netlifly.app)
- Backend: [https://tech-job-hub.netlifly.app](https://tech-job-hub.netlifly.app)

> **Important Note:** We're using free-tier servers which may need a warm-up:
> 1. First open the backend URL and wait for it to load
> 2. Then access the frontend URL for the best experience
> 3. If experiencing delays, please refresh both URLs

## Features

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
![Landing Page](./images/1.png)

### 2. Sign In Interface
![Job Search Interface](./images/2.png)

### 3. Footer
![Profile Management](./images/3.png)

### 4. Chat Bot
![Company Dashboard](./images/4.png)

### 5. Landing Page
![Job Posting Form](./images/5.png)

## Tech Stack

- Frontend: React.js
- Backend: Node.js
- Database: MongoDB
- Cloud Storage: Cloudinary
- AI Integration: Google Gemini

## Environment Variables

### Development Setup (.env.development)
```env
NODE_ENV=development
PORT=8000
MONGO_URI=mongodb://localhost:27017/techjobhub_dev
SECRET_KEY=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

### Production Setup (.env.production)
```env
NODE_ENV=production
PORT=8000
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.example.mongodb.net/techjobhub_prod
SECRET_KEY=your_very_strong_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=https://tech-job-hub.netlifly.app
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

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
