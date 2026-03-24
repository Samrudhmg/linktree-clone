# Add Testing Setup (Vitest + React Testing Library)

## Goal

Set up a clean and minimal testing environment using **Vitest** and **React Testing Library**, and add initial tests for core logic and UI components.

---

## 1. Install Dependencies

Install the following dev dependencies:

* vitest
* @testing-library/react
* @testing-library/jest-dom
* @testing-library/user-event
* jsdom

---

## 2. Configure Vitest

Update `vite.config.ts`:

* Enable test environment as `jsdom`
* Enable globals

Example:

```
test: {
  environment: 'jsdom',
  globals: true
}
```

---

## 3. Setup Test Environment

Create a `setupTests.ts` file:

* Import `@testing-library/jest-dom`

Ensure this file is included in Vitest config under `setupFiles`.

---

## 4. Folder Structure

Follow this structure:

```
src/
  components/
    ComponentName.tsx
    ComponentName.test.tsx
  utils/
    functionName.ts
    functionName.test.ts
```

Keep test files next to source files.

---

## 5. Write Initial Unit Tests (Logic)

Identify 2–3 utility functions and write tests:

* Cover normal cases
* Cover edge cases

Example:

* Parsing logic
* Formatting functions

---

## 6. Write Initial UI Tests

For at least 2 components:

* Render component
* Check if text/content appears
* Test user interaction (click, input)

Use:

* render
* screen
* userEvent

---

## 7. Testing Principles

Follow these strictly:

* Test behavior, not implementation
* Do not test internal state or hooks directly
* Avoid testing styles or Tailwind classes
* Keep tests small and independent

---

## 8. Mocking

Only mock:

* API calls
* External dependencies

Do not overuse mocks.

---

## 9. Add Test Script

Update `package.json`:

```
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui"
}
```

---

## 10. Scope Control

Do NOT:

* Add end-to-end testing (Cypress/Playwright)
* Add snapshot tests
* Overcomplicate configuration

Keep everything minimal and clean.

---

## Expected Outcome

* Working Vitest setup
* Passing tests
* 2–3 utility tests
* 2 component tests
* Clean, maintainable structure
