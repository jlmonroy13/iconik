This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Database Management (Development Mode)

This project is configured for development mode without migrations. The database schema is applied directly using `db push`.

### Prisma Studio

To open Prisma Studio and visually explore/modify the database:

```bash
npm run db:studio
# or
npx prisma studio
```

### Database Operations

To apply schema changes to your database:

```bash
npm run db:push
# or
npx prisma db push
```

To reset the database and seed with initial data:

```bash
npm run db:reset
# or
npx prisma db push --force-reset && npm run db:seed
```

To seed the database with initial data:

```bash
npm run db:seed
# or
npx prisma db seed
```

To manually regenerate the Prisma client (if needed):

```bash
npx prisma generate
```
