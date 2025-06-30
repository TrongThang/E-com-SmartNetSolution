# SmartNet Solutions Backend

This is the backend service for the SmartNet Solutions E-commerce platform.

## Project Setup

### Prerequisites
- Node.js (v20 or later recommended)
- Docker and Docker Compose (optional, for containerized deployment)
- Git (to clone the repository)

### Environment Variables
The application uses the following environment variables:

- `PORT`: The port on which the server will run (default: 8081)
- `EMAIL_USER` and `EMAIL_PASS`: Credentials for sending emails
- `JWT_SECRET`: Secret key for JWT token generation
- `AIVEN_URL`: Connection string for the Aiven hosted MySQL database
- `FIREBASE_KEY_JSON`: Firebase configuration for authentication

These variables are already configured in the `.env` file.

## Running the Application

### Using the Start Script (Recommended)

The easiest way to run the application is using the provided start script:

- **Windows**: Double-click on `start.bat` or run it from the command line
- **Linux/macOS**: Run `./start.sh` (you may need to make it executable first with `chmod +x start.sh`)

The script will automatically detect if Docker is installed and choose the appropriate method to start the application.

### Using Docker Manually

To build and run the application with Docker manually:

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### Without Docker

If you prefer to run the application directly:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the application:
   ```bash
   npm run dev   # Development mode with hot-reload
   npm start     # Production mode
   ```

## Database Information

This application uses an Aiven hosted MySQL database. The connection details are already configured in the `.env` file.

To run Prisma migrations:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

## API Documentation
API documentation is available at `/api-docs` when the server is running.
