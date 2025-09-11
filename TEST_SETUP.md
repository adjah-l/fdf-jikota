# Test Setup Guide

This document explains how to run the comprehensive test suite that locks in quality for the Five Course community platform.

## Test Structure

### End-to-End Tests (Playwright)
- **`e2e/member.spec.ts`** - Member user experience flows
- **`e2e/admin.spec.ts`** - Admin interface and management flows  
- **`e2e/example.spec.ts`** - Basic functionality and accessibility

### Unit Tests (Vitest)
- **`tests/unit/copy.spec.ts`** - Copy regression guards (prevents dinner-only terminology)
- **`tests/unit/activityTypes.spec.ts`** - Activity type label consistency
- **`tests/unit/fiveC.spec.ts`** - 5C framework functionality

## Running Tests Locally

### Prerequisites
```bash
npm install
```

### Unit Tests
```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:ui

# Run specific test file
npm run test tests/unit/copy.spec.ts

# Run copy regression guards only
npm run test:unit
```

### E2E Tests
```bash
# Install browser dependencies (first time only)
npx playwright install --with-deps

# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI (debug mode)
npm run test:e2e:ui

# Run specific test file
npx playwright test e2e/member.spec.ts

# Debug a specific test
npm run test:e2e:debug
```

## Test Coverage

### Member Experience Tests
- ✅ Marketing home page with ActivitiesShowcase (5 activity cards)
- ✅ "For Organizations" navigation
- ✅ Sign up flow captures location and activity preferences
- ✅ Member navigation and group pages show correct activity types
- ✅ Mutual care features are accessible
- ✅ Responsive design on mobile
- ✅ Accessibility compliance (alt text, heading hierarchy)

### Admin Experience Tests  
- ✅ Admin dashboard loads with correct navigation
- ✅ Create activity groups with Prayer/Bible Study option
- ✅ Matching policies page with 5C integration
- ✅ Messaging templates with 5C framework
- ✅ Admin navigation guards and user context
- ✅ Data management features
- ✅ Admin/member view switching

### Copy Regression Guards
- ✅ Activity type labels match refined list (Dinner, Prayer/Bible Study, etc.)
- ✅ No "Dinner Group" terminology in UI (prevents regression)
- ✅ Multi-activity messaging throughout platform
- ✅ Legacy group terminology in code comments
- ✅ Organization domain in email placeholders (@yourdomain.com)
- ✅ Descriptive alt text patterns
- ✅ 5C framework integration
- ✅ Database identifier preservation

## CI/CD Integration

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

### GitHub Actions Workflow
- **Unit Tests**: Run copy regression guards and component tests
- **E2E Tests**: Full user journey testing in headless browsers
- **Accessibility Tests**: WCAG AA compliance verification

## Test Philosophy

### Quality Lock-in Strategy
1. **Regression Prevention**: Copy guards prevent "dinner-only" terminology reintroduction
2. **User Experience**: E2E tests ensure critical workflows function
3. **Accessibility**: Alt text and WCAG compliance built into tests
4. **Multi-Activity Model**: Tests verify support for all 5 activity types

### Test-First Approach
- New features should include corresponding tests
- Copy changes require regression guard updates
- Accessibility fixes include compliance tests
- Database changes need migration compatibility tests

## Debugging Tests

### E2E Test Debugging
```bash
# Run with browser UI visible
npm run test:e2e:ui

# Run specific test with debug
npx playwright test e2e/member.spec.ts --debug

# Generate trace for failed tests
npx playwright test --trace=on
```

### Unit Test Debugging
```bash
# Run with detailed output
npm run test -- --reporter=verbose

# Run specific test with console output
npm run test tests/unit/copy.spec.ts -- --reporter=verbose
```

### Common Issues
1. **Authentication Required**: E2E tests handle auth redirect gracefully
2. **Component Not Found**: Tests use flexible selectors and fallbacks  
3. **Timing Issues**: Tests include appropriate waits and timeouts
4. **Mobile Viewport**: Responsive tests set explicit viewport sizes

## Adding New Tests

### For New Features
1. Add E2E test scenarios to appropriate spec file
2. Create unit tests for new utilities/helpers
3. Update copy regression guards if terminology changes
4. Include accessibility tests for new UI components

### For Bug Fixes
1. Create failing test that reproduces the bug
2. Fix the bug
3. Verify test passes
4. Add regression guard to prevent reintroduction

## Test Data Strategy

- **Mock Data**: Tests use consistent mock data patterns
- **Database Independence**: Tests don't require real database connections
- **Environment Agnostic**: Tests work in development and CI environments
- **Seed Data**: E2E tests can optionally use seeded test accounts

## Performance Considerations

- **Parallel Execution**: E2E tests run in parallel when possible
- **Test Isolation**: Each test is independent and can run in any order
- **Resource Management**: Browser instances are properly cleaned up
- **CI Optimization**: Different test types run in parallel CI jobs

This comprehensive test suite ensures the Five Course platform maintains quality, accessibility, and correct multi-activity messaging as it evolves.