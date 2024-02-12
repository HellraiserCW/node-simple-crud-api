# Node CRUD API

This is a simple CRUD (Create, Read, Update, Delete) API built with Node.js. It allows users to perform CRUD operations on a collection of users stored in memory.

## Node

Supported not lower than 20 LTS version of Node.js

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/node-crud-api.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd node-crud-api
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Create a `.env` file or rename `.env.example` to `.env` in the root directory and specify the desired port (default is 4000):**

    ```
    PORT=4000
    ```

## Usage

### Running the Application

To run the application in development mode:

```bash
npm run start:dev
```


To run the application in production mode:

```bash
npm run start:prod
```


To run the horizontally scaled application in production mode via Node.js cluster API:

```bash
npm run start:multi
```

The server will start at http://localhost:4000.

## Endpoints

GET /api/users: Get all users.

GET /api/users/{userId}: Get a specific user by ID.

POST /api/users: Create a new user. Required fields: username (string), age (number), hobbies (array of strings).

PUT /api/users/{userId}: Update an existing user by ID. Required fields: username (string), age (number), hobbies (array of strings).

DELETE /api/users/{userId}: Delete a user by ID.

## Testing

To run tests, use:

```bash
npm test
```

## Author

Kostiantyn Sakharov

## License
This project is licensed under the MIT License.
