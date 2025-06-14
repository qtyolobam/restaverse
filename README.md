# Comparer Monolith 🍽️

A monolithic restaurant overview platform that combines customer-facing applications, restaurant comparison in one comprehensive solution.

## Key Features

### Customer Experience

- Rating and review system
- Location-based restaurant discovery
- Restaurant photos and menu viewing
- User reviews and ratings

### Restaurant Information

- Detailed restaurant profiles
- Menu display
- Rating analytics
- Operating hours
- Location and contact details

## Technology Stack

### Frontend

- React.js with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls

### Backend

- Node.js/Express
- Postgres for database
- JWT authentication
- Google Oauth2

## Worker Services

- Python
- Selenium
- bs4

## Prerequisites

- Node.js (v14 or higher)
- PostgresDB
- npm or yarn
- Git

## Installation

1. Clone the repository:

```bash
git clone []
cd tp-monolith
```

2. Install dependencies:

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# Worker
cd ../swiggy-worker
pip intsall -r requirements.txt
```

3. Set up environment variables:
   Will need to setup services:

   - Google cloud acc for auth
   - PostgresDB instance

4. Start the services:

```bash
# Backend
cd backend
npm start


cd swiggy-worker/web-server
npm start

# Frontend
cd frontend
npm run dev
```

## Usage

### Customer Features

- View restaurant details, menus, and photos
- Compare different restaurants
- View ratings and popular dishes

## Security Features

- JWT-based authentication
- User data protection
