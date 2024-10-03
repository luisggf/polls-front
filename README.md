# Would You Rather Poll Frontend

## Description

This is the frontend application for the "Would You Rather" polling app. The frontend is built using React, TypeScript, and Vite, and it communicates with the backend API to create, vote on, and display poll results in real-time.

## Features

- User interface for creating and participating in polls.
- Real-time updates using WebSockets.
- Responsive design with Radix UI components.
- API integration with Axios.
- State management and routing with React and React Router.

## Libraries and Commands Used in This Project

### 1. Clone the project Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/luisggf/polls-front
cd <repository-directory>
```

### 2. Install Project Dependencies

The `package.json` file is already configured with all the necessary dependencies. To install them, simply run:

```bash
npm install
```

### 3. Available Scripts

The following scripts are available in the `package.json` file:

- **Start the development server**:

  This command will start the Vite development server, enabling hot module replacement (HMR) and fast feedback during development.

  ```bash
  npm run dev
  ```

### 4. Key Dependencies

- **React**: Core library for building user interfaces.
- **React DOM**: The entry point for React into the DOM.
- **React Router DOM**: For handling routing in the application.
- **TypeScript**: For static typing in JavaScript.
- **Vite**: For fast and optimized development and build processes.
- **Radix UI**: For accessible and customizable UI components.
- **Tailwind CSS**: For utility-first CSS styling.
- **Axios**: For making HTTP requests to the backend API.
- **Socket.io Client**: For real-time communication with the backend.

### 5. Project Structure

The project is structured as follows:

```
src/
  ├── assets/            # SVG and Images used for styling
  ├── components/        # Reusable UI Components
  ├── App.tsx            # Main application component
  ├── main.tsx           # Application entry point
  └── index.html         # Main HTML file
```

### 6. Styling

Tailwind CSS is used for styling the application. If you need to customize the default styles, you can modify the Tailwind configuration file (`tailwind.config.js`) in the project.

### 7. Running the Application

To run the application in development mode:

```bash
npm run dev
```

### 8. Connecting to the Backend

Ensure that the backend API is running and accessible.
