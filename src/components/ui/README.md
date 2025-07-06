# UI Components Library

Reusable component system for the Iconik project. All components follow a consistent pattern with variants and states using `class-variance-authority`.

## Available Components

### Input

Versatile input component with support for various types including currency formatting.

```tsx
import { Input } from '@/components/ui'

// Basic input
<Input
  label="Name"
  placeholder="Enter your name"
  error={errors.name?.message}
/>

// Number input
<Input
  label="Age"
  type="number"
  min={0}
  max={120}
  error={errors.age?.message}
/>

// Currency input with automatic formatting
<Input
  label="Price"
  type="number"
  min={1}
  currency="COP"
  error={errors.price?.message}
/>

// Date input
<Input
  label="Birth Date"
  type="date"
  error={errors.birthDate?.message}
/>

// Email input
<Input
  label="Email"
  type="email"
  error={errors.email?.message}
/>

// URL input
<Input
  label="Website"
  type="url"
  error={errors.website?.message}
/>
```

#### Currency Formatting

The Input component supports automatic currency formatting when the `currency` prop is provided. This is particularly useful for price and cost fields.

```tsx
// Colombian Peso formatting
<Input
  label="Service Price"
  type="number"
  currency="COP"
  {...register('price', { valueAsNumber: true })}
/>

// US Dollar formatting
<Input
  label="Cost"
  type="number"
  currency="USD"
  {...register('cost', { valueAsNumber: true })}
/>
```

**Features:**
- Automatically formats numbers as currency (e.g., "$ 25,000" for COP)
- Maintains numeric value for form handling
- Supports different currencies via the `currency` prop
- Only formats when value is a number and not zero
- Preserves all existing input functionality

### Button

Versatile button with multiple variants and sizes.

```tsx
import { Button } from '@/components/ui'

// Variants
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="link">Link Button</Button>
<Button variant="destructive">Destructive Button</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Using asChild to render as another component
<Button asChild variant="primary">
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>

<Button asChild variant="outline">
  <a href="https://example.com" target="_blank">
    External Link
  </a>
</Button>
```

### IconButton

Specialized buttons for icons only.

```tsx
import { IconButton } from '@/components/ui'

<IconButton
  variant="default"
  size="md"
  icon={<MenuIcon />}
  label="Open menu"
  onClick={handleClick}
/>
```

### Badge

Badges for displaying status or categories.

```tsx
import { Badge } from '@/components/ui'

<Badge variant="default">Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="destructive">Error</Badge>
```

### Card

Modular card system.

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content...</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### StatCard

Specialized cards for displaying statistics.

```tsx
import { StatCard } from '@/components/ui'

<StatCard
  title="Total Sales"
  value="$25,000"
  icon="💰"
  description="This month"
  trend={{
    value: 12.5,
    label: "vs last month",
    isPositive: true
  }}
/>
```

### Avatar

User avatars with fallback to initials.

```tsx
import { Avatar } from '@/components/ui'

<Avatar
  src="/user-photo.jpg"
  alt="User"
  fallback="JD"
  size="md"
  shape="circle"
/>
```

## asChild Functionality

The `asChild` prop allows the Button component to render as another element while maintaining all styles and variants.

### Common use cases:

```tsx
// Button that acts as Next.js Link
<Button asChild variant="primary">
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>

// Button that acts as external link
<Button asChild variant="outline">
  <a href="https://external-site.com" target="_blank" rel="noopener noreferrer">
    External Site
  </a>
</Button>

// Button that acts as form button
<Button asChild variant="secondary">
  <button type="submit" form="my-form">
    Submit Form
  </button>
</Button>
```

## Usage Patterns

### Before (repetitive code)
```tsx
<button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg">
  View Dashboard
</button>

<Link href="/dashboard" className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg">
  View Dashboard
</Link>
```

### After (using components)
```tsx
<Button variant="primary" size="lg">
  View Dashboard
</Button>

<Button asChild variant="primary" size="lg">
  <Link href="/dashboard">View Dashboard</Link>
</Button>
```

## Advantages

1. **Consistency**: All buttons/cards/elements follow the same visual pattern
2. **Maintainability**: Centralized changes in one place
3. **Type Safety**: Typed props with TypeScript
4. **Accessibility**: ARIA props included automatically
5. **Dark Mode**: Full dark mode support
6. **Responsive**: Responsive classes included
7. **Customizable**: Extend with className when needed
8. **Flexibility**: asChild allows style reuse on any element

## Dependencies Installation

The components require these dependencies (already installed):

```bash
npm install class-variance-authority clsx tailwind-merge @radix-ui/react-slot
```
