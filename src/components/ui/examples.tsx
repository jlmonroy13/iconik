import Link from 'next/link'
import { Button } from './Button'
import { Input } from './Input'

/**
 * Examples showcasing the asChild functionality
 * These examples demonstrate how asChild makes the code cleaner and more maintainable
 */

export function ButtonExamples() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-lg font-semibold mb-4">Traditional Buttons</h3>
        <div className="flex gap-4">
          <Button variant="primary" size="md">
            Regular Button
          </Button>
          <Button variant="outline" size="md" onClick={() => alert('Clicked!')}>
            Click Me
          </Button>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4">Buttons as Navigation Links</h3>
        <div className="flex gap-4">
          {/* Using asChild to render as Next.js Link */}
          <Button asChild variant="primary" size="md">
            <Link href="/dashboard">
              Dashboard
            </Link>
          </Button>

          {/* Using asChild to render as external link */}
          <Button asChild variant="secondary" size="md">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </Button>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4">Form Integration</h3>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
          />

          <div className="flex gap-4">
            {/* Regular submit button */}
            <Button type="submit" variant="primary">
              Submit with onClick
            </Button>

            {/* Reset button - using type prop directly instead of asChild nesting */}
            <Button type="reset" variant="outline">
              Reset Form
            </Button>
          </div>
        </form>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4">Download Links</h3>
        <div className="flex gap-4">
          <Button asChild variant="primary">
            <a href="/files/report.pdf" download>
              📄 Download PDF
            </a>
          </Button>

          <Button asChild variant="outline">
            <a href="/files/data.csv" download>
              📊 Download CSV
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}

export function InputExamples() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-lg font-semibold mb-4">Basic Inputs</h3>
        <div className="space-y-4">
          <Input
            label="Name"
            placeholder="Enter your name"
          />
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
          />
          <Input
            label="Age"
            type="number"
            min={0}
            max={120}
            placeholder="Enter your age"
          />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4">Currency Inputs</h3>
        <div className="space-y-4">
          <Input
            label="Service Price (COP)"
            type="number"
            placeholder="Enter price"
            defaultValue={25000}
          />
          <Input
            label="Kit Cost (COP)"
            type="number"
            placeholder="Enter kit cost"
            defaultValue={5000}
          />
          <Input
            label="Price (USD)"
            type="number"
            placeholder="Enter price in USD"
            defaultValue={50}
          />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4">Date and Time Inputs</h3>
        <div className="space-y-4">
          <Input
            label="Birth Date"
            type="date"
          />
          <Input
            label="Appointment Time"
            type="datetime-local"
          />
        </div>
      </section>
    </div>
  )
}

// Example showing the difference in code clarity
export const beforeAsChild = `
// Before asChild - wrapper pattern
<Link href="/dashboard">
  <Button variant="primary" size="lg">
    🚀 Ver Dashboard
  </Button>
</Link>

// This creates nested interactive elements which can cause accessibility issues
// and the styling isn't guaranteed to work properly
`

export const afterAsChild = `
// After asChild - clean composition
<Button asChild variant="primary" size="lg">
  <Link href="/dashboard">
    🚀 Ver Dashboard
  </Link>
</Button>

// This renders a single Link element with Button styles
// Clean, accessible, and properly typed
`

export const currencyInputExample = `
// Currency input with automatic formatting
<Input
  label="Service Price"
  type="number"
  {...register('price', { valueAsNumber: true })}
  error={errors.price?.message}
/>

// Features:
// - Displays as numeric input
// - Maintains numeric value for form handling
// - Supports different currencies through labels
`
