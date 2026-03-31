# Setup Guide - Next.js Essentials Bundle

## 🚀 Getting Started in 5 Minutes

### Step 1: Create Next.js Project

```bash
npx create-next-app@latest my-saas-app --typescript --tailwind --app
cd my-saas-app
```

### Step 2: Install Dependencies

```bash
# Core packages
npm install zod jose bcryptjs @prisma/client resend

# Development dependencies
npm install -D prisma @types/bcryptjs

# Optional but recommended
npm install lru-cache google-auth-library speakeasy qrcode
npm install -D @types/speakeasy @types/qrcode
```

### Step 3: Copy Snippets

Copy the `snippets` folder into your project root:

```
my-saas-app/
├── app/
├── snippets/          ← Copy here
├── public/
└── ...
```

### Step 4: Environment Setup

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

**Minimum required variables:**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

### Step 5: Database Setup

```bash
# Initialize Prisma
npx prisma init

# Create your schema.prisma
# (see example in DOCUMENTATION.md)

# Run migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### Step 6: Start Development Server

```bash
# With Docker services
docker-compose up -d

# Start Next.js
npm run dev
```

Visit http://localhost:3000

---

## 📦 Docker Setup (Recommended)

### Quick Start with Docker

```bash
# Start all services
docker-compose up -d

# View running services
docker-compose ps

# Access services:
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
# - Mailhog: http://localhost:8025
# - Adminer: http://localhost:8080
# - MinIO: http://localhost:9001
```

### Individual Services

```bash
# Start only database
docker-compose up -d postgres

# Stop all services
docker-compose down

# Remove all data (careful!)
docker-compose down -v
```

---

## 🔧 Configuration Examples

### Example 1: Authentication Setup

**1. Create auth routes:**

```
app/
├── api/
│   └── auth/
│       ├── login/
│       │   └── route.ts
│       ├── signup/
│       │   └── route.ts
│       └── callback/
│           └── google/
│               └── route.ts
```

**2. Login route (`app/api/auth/login/route.ts`):**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword } from '@/snippets/auth/04-password-hashing';
import { generateToken } from '@/snippets/auth/05-jwt-token-generation';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  const isValid = await verifyPassword(password, user.password);
  
  if (!isValid) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  const token = await generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
```

**3. Protect routes with middleware:**

```typescript
// middleware.ts
export { middleware, config } from './snippets/auth/01-middleware-auth-check';
```

---

### Example 2: Database with Prisma

**1. Install Prisma:**

```bash
npm install @prisma/client
npm install -D prisma
```

**2. Initialize:**

```bash
npx prisma init
```

**3. Update schema (`prisma/schema.prisma`):**

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
  posts     Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
}
```

**4. Create database client (`lib/db.ts`):**

```typescript
export { prisma } from '@/snippets/database/09-connection-pooling';
```

**5. Run migrations:**

```bash
npx prisma migrate dev --name init
npx prisma generate
```

**6. Use CRUD operations:**

```typescript
import { createUser, getUserById } from '@/snippets/database/01-prisma-crud';

// Create user
const newUser = await createUser({
  email: 'user@example.com',
  name: 'John Doe',
  password: hashedPassword,
});

// Get user
const user = await getUserById(newUser.id);
```

---

### Example 3: Email Setup with Resend

**1. Get API key from resend.com**

**2. Add to .env.local:**

```env
RESEND_API_KEY="re_your_api_key"
EMAIL_FROM="noreply@yourdomain.com"
```

**3. Send welcome email:**

```typescript
import { sendWelcomeEmail } from '@/snippets/server-actions/07-email-sending';

await sendWelcomeEmail(user.email, user.name);
```

---

### Example 4: File Upload with Validation

**1. Create upload route:**

```typescript
// app/api/upload/route.ts
import { uploadImage } from '@/snippets/server-actions/03-file-upload';

export async function POST(request: Request) {
  const formData = await request.formData();
  const result = await uploadImage(formData);
  
  return Response.json(result);
}
```

**2. Use in component:**

```typescript
'use client';

export function UploadForm() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    console.log('Uploaded:', result.url);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" name="file" accept="image/*" />
      <button type="submit">Upload</button>
    </form>
  );
}
```

---

## 🧪 Testing Your Setup

### 1. Database Connection Test

```typescript
// scripts/test-db.ts
import { checkDatabaseConnection } from '@/snippets/database/09-connection-pooling';

async function test() {
  const isConnected = await checkDatabaseConnection();
  console.log('Database connected:', isConnected);
}

test();
```

Run: `npx tsx scripts/test-db.ts`

### 2. Email Test

```typescript
import { sendEmail } from '@/snippets/server-actions/07-email-sending';

await sendEmail(
  'test@example.com',
  'Test Email',
  '<p>Hello from Next.js!</p>'
);
```

### 3. Auth Test

```typescript
import { hashPassword, verifyPassword } from '@/snippets/auth/04-password-hashing';

const hashed = await hashPassword('TestPassword123!');
const isValid = await verifyPassword('TestPassword123!', hashed);
console.log('Password verified:', isValid);
```

---

## 📋 Project Structure

Recommended structure:

```
my-saas-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   └── dashboard/
│   ├── api/
│   │   ├── auth/
│   │   └── users/
│   └── layout.tsx
├── components/
│   ├── ui/
│   └── forms/
├── lib/
│   ├── db.ts
│   └── utils.ts
├── snippets/          ← Code snippets
│   ├── auth/
│   ├── server-actions/
│   ├── api-routes/
│   ├── database/
│   └── components/
├── prisma/
│   └── schema.prisma
├── .env.local
├── docker-compose.yml
└── package.json
```

---

## 🎯 Next Steps

1. ✅ Set up authentication
2. ✅ Configure database
3. ✅ Implement user registration/login
4. ✅ Add protected routes
5. ✅ Set up email notifications
6. ✅ Deploy to production

### Production Checklist

- [ ] Update all environment variables for production
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS (set secure cookies)
- [ ] Set up database backups
- [ ] Configure monitoring (Sentry, LogRocket)
- [ ] Add rate limiting to all public endpoints
- [ ] Review security headers
- [ ] Test error handling
- [ ] Set up CI/CD pipeline
- [ ] Document API endpoints

---

## 🆘 Troubleshooting

### Database connection fails

**Check:**
- Docker container is running: `docker ps`
- DATABASE_URL is correct
- PostgreSQL port is not in use: `lsof -i :5432`

**Solution:**
```bash
docker-compose down
docker-compose up -d postgres
```

### Prisma Client not found

**Solution:**
```bash
npx prisma generate
```

### Module not found errors

**Solution:**
```bash
npm install
# or
rm -rf node_modules package-lock.json
npm install
```

### Environment variables not loading

**Check:**
- File is named `.env.local` (not `.env`)
- Restart dev server after changing .env
- For browser variables, use `NEXT_PUBLIC_` prefix

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Resend Documentation](https://resend.com/docs)
- [JWT.io](https://jwt.io/)

---

**Ready to build? Start with the authentication flow and expand from there!**
