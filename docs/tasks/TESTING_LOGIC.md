# Add Unit Tests for Core Logic

## Goal

Improve test coverage by adding **unit tests for important logic functions** in the codebase. Focus only on meaningful, logic-heavy parts — not UI or trivial code.

---

## 1. Scope of Work

Identify and write tests for:

### ✅ Include:

* Data transformation functions
* Filtering / searching logic
* Mapping / formatting utilities
* Conditional logic (if/else branches)
* Business logic functions

### ❌ Exclude:

* Pure UI rendering (already covered)
* Tailwind / styling
* Simple passthrough functions
* Constants or static values

---

## 2. File Structure

Follow co-located testing:

```
src/
  utils/
    functionName.ts
    functionName.test.ts
  lib/
    logicFile.ts
    logicFile.test.ts
```

Each logic file should have a corresponding `.test.ts` file.

---

## 3. Test Coverage Requirements

For each function, include:

### 1. Normal Case

* Typical valid input
* Expected correct output

### 2. Edge Cases

* Empty input ([], "", null, undefined if applicable)
* Boundary values
* Case sensitivity (if strings involved)

### 3. Failure / Fallback Cases

* Invalid input
* Unexpected values
* Ensure function does not crash

---

## 4. Example Pattern

### Function:

```
filterLinks(links, query)
```

### Tests should cover:

* Returns all items when query is empty
* Filters correctly based on query
* Case-insensitive matching
* Handles empty array
* Handles missing fields safely

---

## 5. Testing Style Guidelines

Follow these strictly:

* Use clear test descriptions
* One behavior per test
* Avoid vague assertions like:

  * `toBeTruthy()`
* Prefer exact matches:

  * `toEqual()`
  * `toStrictEqual()`

Example:

```
test('filters links based on query', () => {
  const input = [...]
  const result = filterLinks(input, 'test')

  expect(result).toEqual([...])
})
```

---

## 6. Do NOT Overcomplicate

* Do not introduce mocks unless required
* Do not test implementation details
* Do not add snapshot tests
* Keep tests simple and readable

---

## 7. Target

* Add tests for at least **3–5 logic functions**
* Each function should have **3–6 test cases**
* Tests must pass successfully (`pnpm test`)

---

## 8. Success Criteria

* New test files added
* Tests are meaningful and readable
* Edge cases are covered
* All tests pass

---

## 9. Notes

Focus on **real-world failure scenarios**:

* Empty data
* Invalid input
* Unexpected values

The goal is to prevent bugs in production logic.

---
## Expected Outcome

* Improved confidence in core logic
* Better test coverage
* Clean, maintainable test suite

---

## ✅ Implementation Summary

### New Files

| File | Description |
|---|---|
| [`lib/link-utils.ts`](file:///c:/dev/linktree-clone/lib/link-utils.ts) | New pure utility module extracted from dashboard logic |
| [`lib/link-utils.test.ts`](file:///c:/dev/linktree-clone/lib/link-utils.test.ts) | 38 tests across 7 suites |
| [`lib/theme-utils.test.ts`](file:///c:/dev/linktree-clone/lib/theme-utils.test.ts) | 12 tests for `getThemeStyles()` |

### Functions Tested

#### `lib/link-utils.ts` (extracted from `app/dashboard/page.tsx`)

| Function | Tests | What it covers |
|---|---|---|
| `sanitizeSlug(raw)` | 8 | Lowercasing, space/special-char replacement, leading/trailing hyphen stripping |
| `isValidSlug(slug)` | 5 | Min-length validation, empty/all-special-char edge cases |
| `normalizeLinkEnabled(value)` | 4 | `true` / `false` / `null` / `undefined` inputs |
| `normalizeLinks(links)` | 4 | Bulk normalization, immutability |
| `filterEnabledLinks(links)` | 4 | All enabled, mixed, all disabled, empty array |
| `searchLinks(links, query)` | 6 | Empty query, case-insensitive, subtext search, null subtext, no match |
| `getLinkClickCount(link)` | 3 | Undefined, empty array, valid count |
| `getTotalClickCount(links)` | 3 | Empty array, all zero, summing across links |

#### `lib/theme-utils.ts`

| Function | Tests | What it covers |
|---|---|---|
| `getThemeStyles(config)` | 12 | All CSS variable mappings + fallback behaviour when `title`/`bio` are missing |

### Test Results

```
✓ utils/cn.test.ts                   (6 tests)
✓ lib/themes.test.ts                (18 tests)
✓ lib/link-utils.test.ts            (38 tests)
✓ lib/theme-utils.test.ts           (12 tests)
✓ components/ThemeToggle.test.tsx    (3 tests)
✓ components/PublicLinkItem.test.tsx  (6 tests)

Test Files  6 passed (6)
     Tests  83 passed (83)
```
