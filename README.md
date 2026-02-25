# healthcare-chatbot-frontend

Frontend application for the Healthcare Chatbot, built with React, TypeScript, Vite, Redux Toolkit, and Radix UI components.

## Tech Stack

- React 19 + TypeScript
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS + Radix UI

## Requirements

- Node.js 18+
- npm 9+

## Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the frontend root.

3. Set the API URL in `.env`:

   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Type-check and build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Environment Variables

The app currently reads:

- `VITE_API_URL`: Backend base URL

Do not commit real `.env` values. `.env` files are gitignored.

## Before Pushing to GitHub

1. Confirm no secret files are staged (`.env`, private keys, local configs).
2. Ensure your `.env` is not tracked:

   ```bash
   git rm --cached .env
   ```

3. Review what will be committed:

   ```bash
   git status
   git diff --staged
   ```

4. Build once before push:

   ```bash
   npm run build
   ```

## Notes

- Frontend auth token is stored in browser `localStorage` as `token`.
- Treat this repository as frontend-only when publishing.
