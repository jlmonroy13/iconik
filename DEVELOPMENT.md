# Development Workflow

## Database Management

This project is configured for **development mode without migrations**. This means:

- ✅ No migration files to manage
- ✅ Direct schema application with `db push`
- ✅ Faster development cycles
- ✅ Easy database resets

### Quick Commands

```bash
# Apply schema changes to database
npm run db:push

# Reset database and seed with initial data
npm run db:reset

# Seed database with initial data
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

### Development Workflow

1. **Make schema changes** in `prisma/schema.prisma`
2. **Apply changes** with `npm run db:push`
3. **Reset when needed** with `npm run db:reset`
4. **Seed data** with `npm run db:seed`

### When to Use Each Command

- **`db:push`**: After making schema changes (add/remove/modify models, fields, etc.)
- **`db:reset`**: When you want to start fresh (drops all data and recreates schema)
- **`db:seed`**: After reset to populate with initial data
- **`db:studio`**: To visually explore and modify data

### Production Considerations

⚠️ **Important**: This setup is for development only. For production, you should:

1. Enable migrations: `npx prisma migrate dev --name init`
2. Use proper migration workflow
3. Set up CI/CD for database deployments

### Troubleshooting

If you encounter issues:

1. **Reset everything**: `npm run db:reset`
2. **Regenerate client**: `npx prisma generate`
3. **Check database state**: `node scripts/check-spas.js`
