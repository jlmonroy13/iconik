---
title: Research Session
query: "Want to create a new view to view, edit, create and delete payment methods, take in count the folder structure I have on clients, services and manicurists"
date: 7/7/2025
time: 1:29:31 PM
timestamp: 2025-07-07T18:29:31.278Z
exchanges: 1
---

# Research Session

## Initial Query

**Question:** Want to create a new view to view, edit, create and delete payment methods, take in count the folder structure I have on clients, services and manicurists

**Response:**

## Architectural Overview

To create a robust **Payment Methods Management View** (for viewing, editing, creating, and deleting payment methods) that aligns with your existing folder structure and project conventions, you should:

- **Mirror the modular structure** already used for clients, services, and manicurists.
- **Leverage Next.js app directory routing** for page and API separation.
- **Integrate with your RBAC system** to ensure only authorized roles (e.g., Spa Admin, Superadmin) can manage payment methods.
- **Ensure multi-tenancy/data isolation** by scoping all payment method operations to the current `spaId`.

Below is a detailed, step-by-step approach, including folder structure, backend API, frontend UI, form handling, and integration with existing systems.

---

## 1. Folder and File Structure

Given your current structure under `src/app/dashboard/`, create a new directory for payment methods:

```
src/
  app/
    dashboard/
      payment-methods/
        actions.ts         # Server actions for CRUD
        layout.tsx         # Optional: layout for payment methods section
        page.tsx           # Main list/view page
        [id]/
          edit.tsx         # Edit form for a payment method
        create.tsx         # Create form
        schemas.ts         # Zod schemas for validation
        types.ts           # TypeScript types
```

For API routes (if not using server actions exclusively):

```
src/
  app/
    api/
      payment-methods/
        route.ts           # Handles GET, POST, PATCH, DELETE
```

---

## 2. Database Model

Assuming your `prisma/schema.prisma` already has a `PaymentMethod` model, ensure it includes:

- `id`
- `name`
- `type` (e.g., card, cash, digital wallet)
- `spaId` (for multi-tenancy)
- `createdAt`, `updatedAt`
- Any integration fields (e.g., Stripe ID)

Example:

```prisma
model PaymentMethod {
  id        String   @id @default(uuid())
  name      String
  type      String
  spaId     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // ...other fields
}
```

---

## 3. Backend API/Server Actions

**CRUD Operations** should be implemented in `actions.ts` or via API routes:

- **List**: Fetch all payment methods for the current `spaId`.
- **Create**: Add a new payment method (validate with Zod).
- **Edit**: Update an existing payment method (by `id` and `spaId`).
- **Delete**: Remove a payment method (by `id` and `spaId`).

Example (using server actions):

```typescript
// src/app/dashboard/payment-methods/actions.ts
import { prisma } from '@/lib/prisma';
import { getSpaIdFromSession } from '@/lib/authz';
import { PaymentMethodSchema } from './schemas';

export async function listPaymentMethods(user) {
  const spaId = getSpaIdFromSession(user);
  return prisma.paymentMethod.findMany({ where: { spaId } });
}

export async function createPaymentMethod(data, user) {
  const spaId = getSpaIdFromSession(user);
  const validated = PaymentMethodSchema.parse(data);
  return prisma.paymentMethod.create({ data: { ...validated, spaId } });
}

// ...edit and delete similarly
```

**Edge Cases:**
- Prevent deletion if the payment method is referenced by existing payments.
- Validate uniqueness of name/type per spa.
- Enforce RBAC: Only admins can mutate; clients/manicurists may only view.

---

## 4. Frontend UI Components

**Main List Page (`page.tsx`):**
- Table/grid of payment methods.
- Actions: Edit, Delete, Create New.
- Use your existing UI primitives (e.g., `Card`, `Button`, `Modal`).

**Create/Edit Forms (`create.tsx`, `[id]/edit.tsx`):**
- Use React Hook Form + Zod for validation.
- Fields: Name, Type (dropdown), Integration fields (if any).
- Submit to server actions or API.

**Delete Confirmation:**
- Use a modal dialog (`ConfirmDialog.tsx`).

**Example:**

```tsx
// src/app/dashboard/payment-methods/page.tsx
import { listPaymentMethods } from './actions';
import { Button, Card, ConfirmDialog } from '@/components/ui';

export default function PaymentMethodsPage() {
  const paymentMethods = usePaymentMethods(); // Custom hook or SWR
  return (
    <Card>
      <h2>Payment Methods</h2>
      <Button href="/dashboard/payment-methods/create">Add New</Button>
      <table>
        {/* Render payment methods */}
      </table>
    </Card>
  );
}
```

---

## 5. Integration with RBAC

- Use your RBAC logic (from Task 3) to conditionally render actions.
- Example: Only show "Add New" or "Delete" if `user.role === 'SpaAdmin' || user.role === 'Superadmin'`.

---

## 6. Multi-Tenancy/Data Isolation

- All backend queries must filter by `spaId`.
- On the frontend, ensure the current spa context is loaded (via context/provider or hook).

---

## 7. Payment Integration Considerations

If you plan to integrate with payment processors (e.g., Stripe, Pabau Pay):

- Store external IDs (e.g., Stripe payment method ID) in your model.
- On create/edit, optionally sync with the external provider.
- On delete, ensure the method is not in use or archive it instead of hard delete.

---

## 8. Example: Payment Method Creation Form

```tsx
// src/app/dashboard/payment-methods/create.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PaymentMethodSchema } from './schemas';
import { createPaymentMethod } from './actions';

export default function CreatePaymentMethod() {
  const form = useForm({ resolver: zodResolver(PaymentMethodSchema) });
  const onSubmit = async (data) => {
    await createPaymentMethod(data);
    // Redirect or show success
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Fields: name, type, etc. */}
      <button type="submit">Create</button>
    </form>
  );
}
```

---

## 9. Edge Cases and Pitfalls

- **Deletion:** Prevent deletion if referenced by payments; show a warning or disable the action.
- **Concurrency:** Handle race conditions (e.g., two admins editing at once).
- **Validation:** Enforce strong validation both client and server side.
- **Audit Logging:** Log all create/edit/delete actions for compliance (see Task 8).
- **Accessibility:** Ensure forms and tables are accessible (see Task 9).

---

## 10. Testing

- **Unit tests** for server actions (CRUD).
- **Integration tests** for API endpoints.
- **E2E tests** for UI flows (create, edit, delete, list).
- **RBAC tests** to ensure only authorized roles can mutate.

---

## 11. Example Folder Structure Comparison

| Entity           | Folder Path                                      | Key Files                |
|------------------|--------------------------------------------------|--------------------------|
| Clients          | `dashboard/clients/`                             | `actions.ts`, `page.tsx` |
| Services         | `dashboard/spa-services/`                        | `actions.ts`, `page.tsx` |
| Manicurists      | `dashboard/manicurists/`                         | `actions.ts`, `page.tsx` |
| **PaymentMethods** | `dashboard/payment-methods/`                     | `actions.ts`, `page.tsx` |

---

## 12. Integration with Appointment and Payment Flows

- When booking or processing payments, fetch available payment methods for the current spa.
- Ensure payment method selection is consistent across booking, payment, and reporting modules.
- If using Stripe or similar, ensure payment method tokens are securely handled and not exposed to unauthorized users[1][3].

---

## 13. Security and Compliance

- Enforce RBAC and spaId checks on all backend operations.
- Log all changes for auditability.
- Never store sensitive payment data (e.g., card numbers) unless PCI compliant; use tokens from providers like Stripe[3].

---

## 14. Next Steps

- Scaffold the new folder and files as above.
- Implement backend CRUD logic with spaId and RBAC checks.
- Build frontend UI using your existing design system.
- Integrate with payment flows and test thoroughly.

This approach ensures your payment methods management is modular, secure, multi-tenant, and consistent with your existing architecture.


---

*Generated by Task Master Research Command*  
*Timestamp: 2025-07-07T18:29:31.278Z*
