# EcoSphere

EcoSphere is a full-stack web application designed to connect individuals, organizations, and educational institutes for sustainable community initiatives. The project is divided into two main parts:

- **client/**: Frontend built with React and Vite, styled with Tailwind CSS.
- **server/**: Backend built with Node.js and Express, using PostgreSQL for data storage.

## Features

- User authentication and authorization
- Organization and individual account management
- Community and event management
- File uploads
- RESTful API structure

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL

### Installation & Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/ChaitraliWaikar/EcoSphere.git
   cd EcoSphere
   ```

2. **Install dependencies:**
   - For the client:
     ```sh
     cd client
     npm install
     ```
   - For the server:
     ```sh
     cd ../server
     npm install
     ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` in both `client/` and `server/` directories and update the values as needed.
   - Example:
     ```sh
     cp client/.env.example client/.env
     cp server/.env.example server/.env
     # Then edit the .env files to add your secrets and connection strings
     ```

4. **Set up the database:**
   - Ensure PostgreSQL is running and update the connection string in `server/config/db.js` or `server/config/postgres.js`.
   - Run migrations and seed data if provided:
     ```sh
     cd server
     node create-tables.js
     node seed_pro.js
     ```

5. **Start the development servers:**
   - In separate terminals:
     - **Client:**
       ```sh
       cd client
       npm run dev
       ```
     - **Server:**
       ```sh
       cd server
       npm start
       ```

## Environment Variables

Sensitive information (API keys, database URLs, secrets) must be placed in `.env` files, which are **not committed to git**. Only the variable names and example values are provided in `.env.example` files. You must create your own `.env` files in both `client/` and `server/` directories.

### Required Variables

#### client/.env

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key   # Get from Clerk dashboard after registering your app
VITE_CLERK_SIGN_IN_URL=/sign-in
VITE_CLERK_SIGN_UP_URL=/sign-up
VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
DATABASE_URL=your_postgres_connection_url   # Use the same as server if needed
```

#### server/.env

```
MONGODB_URI=your_mongodb_connection_string   # Get from your MongoDB Atlas or local MongoDB setup
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_key   # Generate a long, random string
CORS_ORIGIN=http://localhost:5173
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
DATABASE_URL=your_postgres_connection_url   # Get from your PostgreSQL instance
PGSSL=false
```

**How to get values:**

- Clerk keys: Sign up at https://clerk.com, create an application, and copy the publishable key.
- MongoDB URI: Create a cluster at https://cloud.mongodb.com or use your local MongoDB instance.
- PostgreSQL URL: Use your local or cloud PostgreSQL instance connection string.
- JWT secret: Generate a secure random string (e.g., with https://generate-random.org/ or `openssl rand -base64 32`).

**Never commit your real `.env` files or secrets to the repository.**

## Hiding Sensitive & Unnecessary Files

This project uses a `.gitignore` file to prevent committing sensitive or unnecessary files such as:

- `node_modules/`
- `venv/` (Python virtual environments)
- `.env` and `.env.*`
- build outputs (`dist/`, `build/`)
- log files, OS files, IDE configs, etc.

## Folder Structure

```
client/
  src/
    components/
    context/
    hooks/
    services/
  public/
  ...
server/
  controllers/
  middleware/
  models/
  routes/
  config/
  ...
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
