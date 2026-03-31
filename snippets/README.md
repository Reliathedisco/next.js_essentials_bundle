# Next.js Essentials Code Snippets

A curated collection of 50+ production-ready TypeScript/Next.js 14 code snippets organized by category.

## Categories

### 🔐 Authentication (10 snippets)
- Middleware auth checks
- Session validation
- OAuth (Google) integration
- Password hashing
- JWT token generation
- Magic link authentication
- Role-based access control (RBAC)
- Rate limiting
- Two-factor authentication (2FA)
- CSRF protection

### ⚡ Server Actions (10 snippets)
- Form submission with validation
- Optimistic UI updates
- File upload handling
- Data mutations (CRUD)
- Batch operations
- Search and filtering
- Email sending
- Cache revalidation
- Webhook handlers
- Background job processing

### 🌐 API Routes (10 snippets)
- Basic GET/POST handlers
- Dynamic routes with params
- CORS middleware
- Pagination
- API key authentication
- Webhook receivers
- File streaming
- Batch operations
- Caching strategies
- Error handling

### 🗄️ Database (10 snippets)
- Prisma CRUD operations
- Transactions
- Relations handling
- Aggregations
- Raw SQL queries
- Soft delete pattern
- Cursor pagination
- Optimistic locking
- Connection pooling
- Search optimization

### 🎨 Components (10 snippets)
- Form with validation
- Modal dialog
- Data table with sorting
- Infinite scroll
- Toast notifications
- File upload with preview
- Search autocomplete
- Tabs component
- Dropdown menu
- Skeleton loaders

### 🪝 Hooks (1 snippet)
- useDebounce

## Usage

Each snippet is self-contained and can be copied directly into your project. They follow Next.js 14 App Router conventions and use modern React patterns.

### Installation of Dependencies

Many snippets use these common packages:

```bash
npm install zod jose bcryptjs google-auth-library speakeasy qrcode lru-cache resend
npm install -D @types/bcryptjs @types/speakeasy @types/qrcode
```

For Prisma snippets:
```bash
npm install @prisma/client
npm install -D prisma
```

## File Structure

```
snippets/
├── auth/           # Authentication & security
├── server-actions/ # Next.js server actions
├── api-routes/     # API route handlers
├── database/       # Database operations
├── components/     # Client components
└── hooks/          # Custom React hooks
```

## Best Practices

- All snippets use TypeScript for type safety
- Error handling is included in all operations
- Security best practices are followed (CSRF, rate limiting, etc.)
- Components are accessible (ARIA attributes)
- Database queries are optimized
- Proper loading and error states

## License

MIT - Use freely in your projects!
