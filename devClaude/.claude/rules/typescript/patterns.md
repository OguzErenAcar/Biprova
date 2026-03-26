---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
---
# TypeScript/JavaScript Patterns

> This file extends [common/patterns.md](../common/patterns.md) with TypeScript/JavaScript specific content.

## API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}
```

## Custom Hooks Pattern

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

## Data Access Pattern

Call Supabase directly in Server Actions. Extract to `queries.ts` only when a query is reused across multiple actions:

```typescript
// features/markets/queries.ts — only if reused
export async function getMarketById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('markets')
    .select('id, name, status, end_date')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

// features/markets/actions.ts
'use server'
export async function getMarket(id: string) {
  const { supabase } = await getAuthUser()
  return getMarketById(supabase, id)
}
```
