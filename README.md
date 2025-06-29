# pemermaid

Mermaid diagram manager built with Next.js, Prisma and PostgreSQL.

## Setup

1. Install dependencies
   ```bash
   npm install
   ```
2. Set `DATABASE_URL` in `.env` to your Postgres connection string.
3. Run Prisma migrations
   ```bash
   npx prisma migrate dev --name init
   ```
4. Start the dev server
   ```bash
   npm run dev
   ```

## Features

- Create, edit and delete diagrams
- Live preview with Mermaid.js
- Search diagrams by title, description or tag
- Dark mode support
