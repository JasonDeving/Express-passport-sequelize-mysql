# Express Passport Sequelize MySQL Example

This project demonstrates a simple authentication flow using [Express](https://expressjs.com/), [Passport](http://www.passportjs.org/), and [Sequelize](https://sequelize.org/). It stores user information in a MySQL database and renders pages with Handlebars templates.

## Prerequisites

- Node.js 18 or later
- A running MySQL instance

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Adjust the database settings in `app/sequelize.js` to match your environment.
3. Create the database schema and a default user:
   ```bash
   node setup.js
   ```

## Running the Server

Start the application with:
```bash
npm start
```
Then open `http://localhost:3000` in your browser.

## Application Routes

- `/` – login form
- `/signup` – user registration
- `/forgot` – request password reset (token printed to console)
- `/reset/:token` – set a new password
- `/dashboard` – protected dashboard (requires login)
- `/logout` – sign out

## Tests

Nightwatch end‑to‑end tests are located in the `tests` directory. To run them, make sure Selenium is configured in `nightwatch.json` and execute:
```bash
npx nightwatch
```

## License

MIT
