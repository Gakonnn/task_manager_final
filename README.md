# Node Task Manager API

This is a Node.js task manager API built using Express and MongoDB. It allows users to register, authenticate, and manage their tasks. The API is built to be RESTful and provides endpoints for creating, reading, updating, and deleting tasks.

## Installing Node Task Manager API

To install Node Task Manager API, follow these steps:

1. Clone the repository: `git clone https://github.com/Gakonnn/task_manager_final.git`
2. Install the dependencies: `npm install`
3. Rename `.env.example` to `.env` and update the environment variables with your own values
4. Start the server: `npm start`

## API Endpoints

The following endpoints are available in the API:

| Endpoint         | Method | Description                                |
|------------------|--------|--------------------------------------------|
| /users           | POST   | Create a new user                          |
| /users/login     | POST   | Log in a user                              |
| /users/logout    | POST   | Log out a user                             |
| /users/logoutAll | POST   | Log out a user from all devices            |
| /users/me        | GET    | Get the logged in user profile             |
| /users/me        | PATCH  | Update the logged in user                  |
| /users/me        | DELETE | Delete the logged in user                  |
| /tasks           | POST   | Create a new task                          |
| /tasks           | GET    | Get all tasks for the logged in user       |
| /tasks/:id       | GET    | Get a task by ID for the logged in user    |
| /tasks/:id       | PATCH  | Update a task by ID for the logged in user |
| /tasks/:id       | DELETE | Delete a task by ID for the logged in user |
| /tasks/report/pdf | GET    | Task Report PDF                            |



## Technologies Used
Support ticket app is built using the following technologies:

- Node
- Express
- MongoDB
