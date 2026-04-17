# Express + Passport + Sequelize + MySQL Example

This project demonstrates a simple authentication flow built with Express, Passport, and Sequelize, using MySQL for persistence and Handlebars for server-rendered views. It includes signup, login, password reset, and a protected dashboard.

## Features

- Local username/password authentication with Passport
- Password reset flow (token printed to the server console)
- Sequelize model for user data stored in MySQL
- Simple Handlebars templates for UI
- Nightwatch end-to-end tests

## Prerequisites

- Node.js 18+
- MySQL 8+ (or compatible)

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure the database connection in `app/sequelize.js`:
   ```js
   // new Sequelize('database', 'user', 'password', { host: 'localhost', dialect: 'mysql' })
   ```
   Update the database name, username, and password to match your local MySQL setup.

3. Set a strong session secret:
   ```bash
   export SESSION_SECRET="replace-with-a-long-random-secret"
   ```
   In production, always set `NODE_ENV=production` and use HTTPS so secure cookies are enforced.

4. Create the database and seed a default user:
   ```bash
   node setup.js
   ```
   This recreates the `users` table and inserts a default user.

5. Start the server:
   ```bash
   npm start
   ```

6. Visit the app:
   - http://localhost:3000

## Default Credentials

After running `node setup.js`, you can sign in with:

- **Username:** `user`
- **Password:** `user`

## Application Routes

- `/` – login form
- `/signup` – user registration
- `/forgot` – request password reset (token printed to console)
- `/reset/:token` – set a new password
- `/dashboard` – protected dashboard (requires login)
- `/logout` – sign out (supports `POST` and `GET`; prefer `POST`)

## Password Reset Notes

When requesting a password reset from `/forgot`, the app prints a reset link to the server console. Copy the URL into your browser to continue the reset flow.

## Tests

Nightwatch end‑to‑end tests are located in the `tests` directory. To run them:

1. Ensure Selenium is configured in `nightwatch.json`.
2. Execute:
   ```bash
   npx nightwatch
   ```

## Troubleshooting

- **Database connection errors:** Verify the credentials in `app/sequelize.js` and confirm the database exists.
- **Port conflicts:** Set a custom port with `PORT=4000 npm start`.
- **Security warning:** If `SESSION_SECRET` is not set, the app uses a development fallback and prints a warning on startup.

## License

MIT
