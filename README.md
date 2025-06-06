# Express Passport Sequelize MySQL Example

This repository demonstrates a basic authentication flow using **Express**, **Passport** and **Sequelize**. It stores user data in a MySQL database and renders pages with **express-handlebars**.

## Requirements

- Node.js 18 or later
- A running MySQL server

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure the database connection in `app/sequelize.js`.
   The default configuration connects to a local `login` database as user `root` with no password. Adjust it to match your environment.
3. Populate the database and create a default user (`user`/`user`):
   ```bash
   node setup.js
   ```

## Running the application

Start the server with:
```bash
npm start
```
Visit `http://localhost:3000` to see the login page. The main routes are:

- `/` – log in
- `/signup` – registration form
- `/forgot` – request password reset (link logged to console)
- `/reset/:token` – set a new password
- `/dashboard` – protected dashboard (requires authentication)
- `/logout` – end the session

## Testing

End‑to‑end tests using Nightwatch are located in the `tests` folder. Configure Selenium in `nightwatch.json`, run the server and then execute:
```bash
npx nightwatch
```

## License

MIT
