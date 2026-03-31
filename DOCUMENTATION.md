# Next.js Essentials Bundle - Complete Documentation

## Table of Contents

1. [Quick Start](#quick-start)
2. [Installation](#installation)
3. [Authentication Snippets](#authentication-snippets)
4. [Server Actions](#server-actions)
5. [API Routes](#api-routes)
6. [Database Operations](#database-operations)
7. [Client Components](#client-components)
8. [Custom Hooks](#custom-hooks)
9. [Configuration](#configuration)
10. [Best Practices](#best-practices)

---

## Quick Start

### Prerequisites

```bash
Node.js 18+ and npm/pnpm/yarn
Next.js 14+
TypeScript 5+
```

### Basic Setup

1. Copy the snippets you need into your project
2. Install required dependencies
3. Configure environment variables
4. Import and use the snippets

### Dependencies Installation

```bash
# Core dependencies
npm install next@14 react react-dom typescript

# Authentication & Security
npm install jose bcryptjs zod
npm install -D @types/bcryptjs

# Database (choose one)
npm install @prisma/client
npm install -D prisma

# Email
npm install resend

# File handling
npm install sharp

# OAuth
npm install google-auth-library

# 2FA
npm install speakeasy qrcode
npm install -D @types/speakeasy @types/qrcode

# Rate limiting
npm install lru-cache
```

---

## Authentication Snippets

### 1. Middleware Auth Check

**Location:** `snippets/auth/01-middleware-auth-check.ts`

**Purpose:** Protect routes and redirect unauthenticated users

**Usage:**

```typescript
// middleware.ts
export { middleware, config } from './snippets/auth/01-middleware-auth-check';
```

**Features:**
- Redirects unauthenticated users from protected routes
- Redirects authenticated users away from auth pages
- Configurable route patterns

**Customization:**
```typescript
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/signup'],
};
```

---

### 2. Session Validation

**Location:** `snippets/auth/02-session-validation.ts`

**Purpose:** Validate JWT sessions server-side

**Usage:**

```typescript
// In a server component or API route
import { validateSession, requireAuth } from './snippets/auth/02-session-validation';

// Optional auth
const session = await validateSession();
if (session) {
  console.log('User:', session.userId);
}

// Required auth (throws if not authenticated)
const user = await requireAuth();
```

**Returns:**
```typescript
{
  userId: string;
  email: string;
  role: string;
  exp: number;
}
```

---

### 3. OAuth Google Handler

**Location:** `snippets/auth/03-oauth-google-handler.ts`

**Purpose:** Handle Google OAuth callback

**Setup:**

1. Get credentials from Google Cloud Console
2. Add to `.env`:
```env
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/callback/google"
```

3. Create route:
```typescript
// app/api/auth/callback/google/route.ts
export { GET } from '@/snippets/auth/03-oauth-google-handler';
```

**Flow:**
1. User clicks "Sign in with Google"
2. Redirect to Google authorization
3. Google redirects back to callback URL
4. Handler exchanges code for tokens
5. Creates session and redirects to dashboard

---

### 4. Password Hashing

**Location:** `snippets/auth/04-password-hashing.ts`

**Purpose:** Securely hash and verify passwords

**Usage:**

```typescript
import { 
  hashPassword, 
  verifyPassword, 
  validatePasswordStrength 
} from './snippets/auth/04-password-hashing';

// Registration
const validation = validatePasswordStrength(password);
if (!validation.valid) {
  return { errors: validation.errors };
}

const hashedPassword = await hashPassword(password);
// Save hashedPassword to database

// Login
const isValid = await verifyPassword(inputPassword, storedHashedPassword);
if (isValid) {
  // Create session
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

### 5. JWT Token Generation

**Location:** `snippets/auth/05-jwt-token-generation.ts`

**Purpose:** Create and verify JWT tokens

**Usage:**

```typescript
import { generateToken, verifyToken, refreshToken } from './snippets/auth/05-jwt-token-generation';

// Generate token after successful login
const token = await generateToken({
  userId: user.id,
  email: user.email,
  role: user.role,
}, '7d'); // Expires in 7 days

// Set as HTTP-only cookie
cookies().set('session', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7,
});

// Verify token
const payload = await verifyToken(token);
if (payload) {
  console.log('User ID:', payload.userId);
}

// Refresh expired token
const newToken = await refreshToken(oldToken);
```

---

### 6. Magic Link Authentication

**Location:** `snippets/auth/06-magic-link-email.ts`

**Purpose:** Passwordless authentication via email

**Setup:**

```env
RESEND_API_KEY="re_your_api_key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Usage:**

```typescript
import { sendMagicLink, verifyMagicLink } from './snippets/auth/06-magic-link-email';

// Send magic link
await sendMagicLink('user@example.com');

// Verify magic link (in callback route)
const email = await verifyMagicLink(token);
if (email) {
  // Create session for user
}
```

**Flow:**
1. User enters email
2. Generate unique token
3. Send email with magic link
4. User clicks link
5. Verify token and create session

---

### 7. Role-Based Access Control

**Location:** `snippets/auth/07-role-based-access.ts`

**Purpose:** Implement RBAC with permissions

**Usage:**

```typescript
import { requireRole, requirePermission, hasPermission, Permission, Role } from './snippets/auth/07-role-based-access';

// Check permission before operation
const session = await requirePermission(Permission.DELETE_USERS);

// Require specific role
const adminSession = await requireRole(Role.ADMIN);

// Check permission conditionally
if (hasPermission(userRole, Permission.WRITE_CONTENT)) {
  // Allow editing
}
```

**Roles & Permissions:**
```typescript
enum Role {
  USER = 'user',        // Read content only
  MODERATOR = 'moderator', // Read/write content, read users
  ADMIN = 'admin',      // All permissions
}
```

---

### 8. Rate Limiting

**Location:** `snippets/auth/08-rate-limiting.ts`

**Purpose:** Prevent brute force attacks

**Usage:**

```typescript
import { RateLimiter, getRateLimitHeaders } from './snippets/auth/08-rate-limiting';

const limiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

// In API route
const identifier = request.ip || 'anonymous';
const { success, remaining } = limiter.check(10, identifier); // 10 requests per minute

if (!success) {
  return new Response('Too many requests', { 
    status: 429,
    headers: getRateLimitHeaders(10, 0, Date.now() + 60000),
  });
}
```

---

### 9. Two-Factor Authentication

**Location:** `snippets/auth/09-two-factor-auth.ts`

**Purpose:** Add TOTP-based 2FA

**Setup Flow:**

```typescript
import { generateTwoFactorSecret, verifyTwoFactorToken } from './snippets/auth/09-two-factor-auth';

// Enable 2FA
const { secret, qrCode, backupCodes } = await generateTwoFactorSecret(
  user.email,
  'Your App Name'
);

// Save secret and backup codes to database
// Show QR code to user for scanning with authenticator app

// Verify TOTP code during login
const isValid = verifyTwoFactorToken(userInputCode, storedSecret);
if (isValid) {
  // Complete login
}
```

---

### 10. CSRF Protection

**Location:** `snippets/auth/10-csrf-protection.ts`

**Purpose:** Prevent cross-site request forgery

**Usage:**

```typescript
import { setCsrfToken, validateCsrfToken } from './snippets/auth/10-csrf-protection';

// Generate and set CSRF token (in form page)
const token = await setCsrfToken();

// Include in form
<input type="hidden" name="csrf_token" value={token} />

// Validate in form handler
const formToken = formData.get('csrf_token');
const isValid = await validateCsrfToken(formToken);
if (!isValid) {
  throw new Error('Invalid CSRF token');
}
```

---

## Server Actions

### 1. Form Submission

**Location:** `snippets/server-actions/01-form-submission.ts`

**Purpose:** Handle form submissions with validation

**Usage:**

```typescript
'use client';

import { useFormState } from 'react-dom';
import { submitContactForm } from './snippets/server-actions/01-form-submission';

export function ContactFormComponent() {
  const [state, formAction] = useFormState(submitContactForm, {
    success: false,
    message: '',
  });

  return (
    <form action={formAction}>
      <input name="name" />
      <input name="email" />
      <textarea name="message" />
      <button type="submit">Send</button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

**Features:**
- Zod schema validation
- Field-level error messages
- Cache revalidation

---

### 2. Optimistic Updates

**Location:** `snippets/server-actions/02-optimistic-update.ts`

**Purpose:** Instant UI updates with server sync

**Usage:**

```typescript
'use client';

import { useOptimistic } from 'react';
import { toggleTodo } from './snippets/server-actions/02-optimistic-update';

export function TodoList({ todos }) {
  const [optimisticTodos, updateOptimistic] = useOptimistic(todos);

  async function handleToggle(id: string) {
    updateOptimistic((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    
    await toggleTodo(id);
  }

  return (
    <ul>
      {optimisticTodos.map((todo) => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => handleToggle(todo.id)}
          />
          {todo.title}
        </li>
      ))}
    </ul>
  );
}
```

---

### 3. File Upload

**Location:** `snippets/server-actions/03-file-upload.ts`

**Purpose:** Handle file uploads server-side

**Usage:**

```typescript
'use client';

import { uploadImage } from './snippets/server-actions/03-file-upload';

export function UploadForm() {
  async function handleSubmit(formData: FormData) {
    const result = await uploadImage(formData);
    
    if (result.success) {
      console.log('Uploaded:', result.url);
    } else {
      console.error(result.error);
    }
  }

  return (
    <form action={handleSubmit}>
      <input type="file" name="file" accept="image/*" />
      <button type="submit">Upload</button>
    </form>
  );
}
```

**Features:**
- File type validation
- Size limits
- Automatic filename generation
- Error handling

---

[Continue with more sections...]

## Database Operations

### Prisma Setup

**schema.prisma example:**

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## Client Components

### Using Components

All client components are built with accessibility in mind and follow React best practices.

**Example - Using Toast Notifications:**

```typescript
// app/layout.tsx
import { ToastProvider } from './snippets/components/05-toast-notifications';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

// Any component
'use client';

import { useToast } from './snippets/components/05-toast-notifications';

export function MyComponent() {
  const { addToast } = useToast();

  function handleClick() {
    addToast({
      type: 'success',
      message: 'Action completed successfully!',
      duration: 5000,
    });
  }

  return <button onClick={handleClick}>Show Toast</button>;
}
```

---

## Best Practices

### Security

1. **Never expose secrets:** Use environment variables
2. **Validate all inputs:** Use Zod schemas
3. **Use HTTPS in production:** Enable secure cookies
4. **Implement rate limiting:** Protect API endpoints
5. **Hash passwords:** Never store plain text
6. **Use CSRF tokens:** For state-changing operations

### Performance

1. **Use server components by default:** Add 'use client' only when needed
2. **Implement pagination:** Don't load all data at once
3. **Use caching strategies:** Leverage Next.js cache
4. **Optimize images:** Use Next.js Image component
5. **Code splitting:** Use dynamic imports

### Database

1. **Use indexes:** For frequently queried fields
2. **Implement soft deletes:** For data recovery
3. **Use transactions:** For related operations
4. **Connection pooling:** Reuse database connections
5. **Query optimization:** Use select to limit fields

---

## Troubleshooting

### Common Issues

**Issue:** "Module not found: jose"
**Solution:** `npm install jose`

**Issue:** "Database connection failed"
**Solution:** Check DATABASE_URL in .env file

**Issue:** "CSRF token validation failed"
**Solution:** Ensure cookies are enabled and same-origin

---

## Support

For issues or questions:
- Check documentation
- Review code comments
- Consult Next.js 14 documentation
- Review error messages carefully

---

## License

MIT License - Use freely in your projects!

---

**Last Updated:** 2024
**Version:** 1.0.0
**Compatible with:** Next.js 14+, React 18+
