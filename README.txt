========================================================================
Project Name: Ethara (Task Manager)
========================================================================

Description:
A modern Task Management application with a Next.js frontend and an Express.js backend.
Includes features like user authentication (with OTP), project management, task assignment,
and AI-generated task descriptions.

========================================================================
Project Structure:
========================================================================
/frontend - Next.js application
/backend  - Express.js API server

========================================================================
How to Run the Project:
========================================================================

Prerequisites:
- Node.js installed
- MongoDB installed and running (or a MongoDB Atlas URI)

1. Backend Setup:
   - Navigate to the backend directory:
     cd backend
   - Install dependencies:
     npm install
   - Set up environment variables (.env file):
     PORT=5000
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRES_IN=10d
     EMAIL_USER=your_email_address
     EMAIL_PASS=your_email_app_password
     EMAIL_HOST=smtp.gmail.com
     OPENROUTER_API_KEY=your_openrouter_api_key (for AI features)
   - Run the server:
     node server.js (or "npm run dev" if configured)

2. Frontend Setup:
   - Navigate to the frontend directory:
     cd frontend
   - Install dependencies:
     npm install
   - Run the development server:
     npm run dev
   - The app will be available at http://localhost:3000

========================================================================
API Endpoints:
========================================================================

Base URL: /api

--- Authentication (/api/auth) ---
POST   /signup           - User registration
POST   /verify-signup    - Verify account via OTP
POST   /login            - User login
POST   /forgot-password  - Request password reset OTP
POST   /verify-otp       - Verify password reset OTP
PATCH  /reset-password   - Reset password
POST   /logout           - Logout (Protected)
GET    /users/search     - Search users for project assignment (Protected)
GET    /me               - Get current user info (Protected)

--- Projects (/api/projects) ---
POST   /                 - Create a new project (Admin only)
GET    /                 - Get all projects for current user (Protected)
GET    /:id              - Get project by ID (Protected)
POST   /member           - Add a member to a project (Admin only)

--- Tasks (/api/tasks) ---
POST   /                 - Create a new task (Admin only)
GET    /user             - Get tasks assigned to current user (Protected)
GET    /:projectId       - Get all tasks for a specific project (Protected)
PUT    /:taskId/status   - Update task status (Protected)

--- AI Features (/api/ai) ---
GET    /generate-description - Generate task description using AI (Protected)

========================================================================
Notes for Vercel Deployment:
========================================================================
- Set the Root Directory to "frontend" for the frontend deployment.
- Ensure all environment variables are added in the Vercel Project Settings.
- If you encounter peer dependency errors during install, use the --legacy-peer-deps flag.

========================================================================
Final Steps (Git Cleanup):
========================================================================
If node_modules were accidentally pushed to GitHub:
1. Ensure node_modules/ is in your root .gitignore file.
2. Run: git rm -r --cached .
3. Run: git add .
4. Run: git commit -m "Removed node_modules from tracking"
5. Run: git push
