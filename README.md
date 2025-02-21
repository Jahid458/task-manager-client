
# Task Manager
A Task Management Application that allows users to add, edit, delete, and reorder tasks using a drag-and-drop interface. Tasks are categorized into To-Do, In Progress, and Done, with changes saved instantly to a MongoDB database via an Express.js backend.

Users must sign in with Google (Firebase Authentication) to access their tasks. The app ensures real-time synchronization using MongoDB Change Streams, WebSockets, or Optimistic UI Updates. Built with Vite + React, it features a modern, minimalistic UI, responsive for both desktop and mobile users.
# Live Links

Task manager Client --> https://github.com/Jahid458/task-manager-client

Task manager Server --> https://github.com/Jahid458/task-manager-server

Live Links --> https://task-management-c81dc.web.app


# Installation Setup


### 1. Clone the Repository
```sh
git clone https://github.com/your-username/task-manager.git
cd task-manager
```
#  Set Up the Backend 

### Navigate to the backend folder
```sh
cd backend
```
### Install dependencies
```sh
npm install
```
### Create a .env file and add the following
```sh
DB_USER=mongodb user name
DB_PASS=mongodb pass 
```

### start the backend 
```sh
npm run start
```
#  Set Up the Frontend


### Install dependencies
```sh
npm install
```

### Create a .env file and add the backend URL
```sh
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_authDomain=your_firebase_authDomain_key
VITE_projectId=your_firebase_projectId_key
VITE_storageBucket=your_firebase_storageBucket_key
VITE_messagingSenderId=your_firebase_messagingSenderId_key
VITE_appId=your_firebase_appId_key
```

### start the server
```sh
npm run dev
```
# Technology Used 
- DaisyUI + TailwindCSS
- React 
- React Router DOM 
- React Hot Toast
- React Icons
