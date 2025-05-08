# ShebaXpert

A platform designed to connect users with skilled low-income workers such as carpenters, plumbers, painters, pest controllers, and electricians. The project integrates map-based location tracking and automated Facebook posting for easy service accessibility.

## Features

- **Map-Based Service Locator**: Easily find nearby service providers based on user location.
- **Automated Facebook Posting**: Helps in broadcasting service availability to a wider audience.
- **User-Friendly Interface**: Simple and intuitive UI for seamless navigation.
- **Verified Service Providers**: Ensures reliability and trustworthiness.
- **Real-Time Updates**: Live tracking of service requests and provider availability.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (React/Next.js preferred)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB / PostgreSQL
- **Map Integration**: Google Maps API / OpenStreetMap
- **Automation**: Facebook Graph API
- **Hosting & Deployment**: Vercel / Firebase / AWS

## Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/service-locator.git
   ```

2. Navigate to the project folder:

   ```bash
   cd service-locator
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables (create a `.env` file and add required keys):

   ```env
   MAP_API_KEY=your_google_maps_api_key
   FACEBOOK_API_KEY=your_facebook_api_key
   ```

5. Run the development server:

   ```bash
   npm start
   ```

## Frontend Setup

### Frontend Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Steps to Run the Frontend

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

### Tailwind CSS

The project uses Tailwind CSS for styling. Ensure that the `tailwind.config.js` file is properly configured. If you make changes to the configuration, restart the development server.

### Environment Variables

Create a `.env` file in the `frontend` directory and add the following variables:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
```

## Backend Setup

### Backend Prerequisites

- Node.js (v14 or higher)
- MySQL or PostgreSQL database

### Steps to Run the Backend

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   - Create a database named `shebaxpert`.
   - Import the schema from `schema.sql`:

     ```bash
     mysql -u your_username -p shebaxpert < schema.sql
     ```

4. Create a `.env` file in the `backend` directory and add the following variables:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=shebaxpert
   JWT_SECRET=your_jwt_secret
   FB_PAGE_ID=your_facebook_page_id
   FB_ACCESS_TOKEN=your_facebook_access_token
   FB_WEBHOOK_TOKEN=your_webhook_verify_token
   FB_WEBHOOK_SECRET=your_webhook_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

5. Start the backend server:

   ```bash
   npm start
   ```

6. The backend will be available at `http://localhost:5000`.

## Full-Stack Integration

Ensure that the `REACT_APP_API_URL` in the frontend `.env` file matches the backend URL. This allows the frontend to communicate with the backend APIs seamlessly.

## Contribution

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature-branch
   ```

3. Make changes and commit:

   ```bash
   git commit -m "Added new feature"
   ```

4. Push to your fork:

   ```bash
   git push origin feature-branch
   ```

5. Create a pull request.

## License

