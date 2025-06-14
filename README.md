# Comparer Monolith 🍽️

A monolithic restaurant overview platform that combines customer-facing applications, restaurant comparison in one comprehensive solution.

## Key Features

## Login Page

![Login](https://github.com/user-attachments/assets/e9477889-2e6c-42c3-bca0-b5dc6efba6c3)


## Restaurant Form

![RestaurantForm](https://github.com/user-attachments/assets/6a304eaf-5e63-44b0-b091-5526a0996db7)


## Menu Form

![MenuForm](https://github.com/user-attachments/assets/54a8445c-f450-42c7-a994-1c75a88b88ab)


## Scrape Request Waiting Page

![ComeBackLater](https://github.com/user-attachments/assets/6d6a90a3-2617-4cf1-a073-6e924868a58d)


## Dashboard

![Dashboard](https://github.com/user-attachments/assets/4d9bb59a-8c80-4cf3-8f5f-6863a9c38c11)


## Restaurant Menu


![MenuPNG](https://github.com/user-attachments/assets/ad3f0420-c47e-4437-bfd1-bbe84bb96bc8)


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
- Python v3
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
