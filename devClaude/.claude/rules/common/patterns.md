# Common Patterns

## Skeleton Projects

When implementing new functionality:
1. Search for battle-tested skeleton projects
2. Use parallel agents to evaluate options:
   - Security assessment
   - Extensibility analysis
   - Relevance scoring
   - Implementation planning
3. Clone best match as foundation
4. Iterate within proven structure

## Design Patterns

### Data Access Pattern

Call Supabase directly inside Server Actions — no Repository layer:
- Server Actions handle both business logic and data access
- Extract shared queries into a `queries.ts` file only when the same query is used in multiple actions
- Do not abstract Supabase behind a Repository interface

### API Response Format

Use a consistent envelope for all API responses:
- Include a success/status indicator
- Include the data payload (nullable on error)
- Include an error message field (nullable on success)
- Include metadata for paginated responses (total, page, limit)
