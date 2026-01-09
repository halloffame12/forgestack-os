# Multi-Tenancy

ForgeStack OS comes with built-in support for multi-tenancy, allowing you to build SaaS applications where multiple organizations (tenants) share the same infrastructure while keeping their data isolated.

## 🏗️ Architecture

We use a **logical isolation** approach (shared database, shared schema) with tenant-specific IDs. This is the most cost-effective and scalable approach for most SaaS apps.

### Data Isolation
Every tenant-specific record in your database is tagged with a `tenantId`. Our generated code ensures that queries are automatically filtered by this ID.

## 🛠️ Implementation Details

### Prisma (SQL)
In Prisma-based stacks, we add a `tenantId` to key models (like `User`, `Project`, etc.).

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  tenantId  String   // The owner organization
  // ...
  @@index([tenantId])
}
```

### Mongoose (NoSQL)
In MongoDB stacks, we include a `tenantId` field and use it in our indexing strategy for fast, isolated lookups.

---

## 🔐 How it Works (Flow)

1. **Authentication**: When a user logs in, their `tenantId` is retrieved from their profile (or Clerk/Supabase session).
2. **Context**: In the backend, we extract this `tenantId` and store it in the request context (via middleware or interceptors).
3. **Filtering**: When the backend queries the database, it automatically adds `.findMany({ where: { tenantId: ctx.tenantId } })` to ensure users only see their own organization's data.

## 🚀 Benefits
- **Zero-Config Isolation**: Data privacy is handled at the infrastructure level.
- **Scalability**: One database can hold thousands of tenants.
- **Performance**: High-performance indexes on `tenantId` ensure queries remain fast.

---

## ⚠️ Important Note
While ForgeStack OS provides the *structure* for multi-tenancy, you should always verify your authorization logic (guards/policies) to ensure that `tenantId` checks are strictly enforced in every sensitive endpoint.
