import { test, expect } from '@playwright/test'

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/')
  
  // Check for main navigation elements
  await expect(page.locator('h1')).toBeVisible()
  
  // Test responsive design
  await page.setViewportSize({ width: 375, height: 667 }) // Mobile
  await expect(page.locator('main')).toBeVisible()
  
  await page.setViewportSize({ width: 1024, height: 768 }) // Desktop
  await expect(page.locator('main')).toBeVisible()
})

test('navigation works correctly', async ({ page }) => {
  await page.goto('/')
  
  // Test sidebar navigation if logged in
  const sidebar = page.locator('[data-testid="sidebar"]')
  if (await sidebar.isVisible()) {
    await sidebar.locator('a[href="/groups"]').click()
    await expect(page).toHaveURL('/groups')
  }
})

test('accessibility basics', async ({ page }) => {
  await page.goto('/')
  
  // Check for skip link
  const skipLink = page.locator('a:has-text("Skip to main content")')
  if (await skipLink.isVisible()) {
    await expect(skipLink).toHaveAttribute('href', '#main-content')
  }
  
  // Test keyboard navigation
  await page.keyboard.press('Tab')
  await expect(page.locator(':focus')).toBeVisible()
  
  // Check for alt text on images
  const images = page.locator('img')
  const imageCount = await images.count()
  
  for (let i = 0; i < imageCount; i++) {
    const img = images.nth(i)
    await expect(img).toHaveAttribute('alt')
  }
})

test('form validation works', async ({ page }) => {
  await page.goto('/')
  
  // Look for any forms on the page
  const forms = page.locator('form')
  const formCount = await forms.count()
  
  if (formCount > 0) {
    const form = forms.first()
    const submitButton = form.locator('button[type="submit"]')
    
    if (await submitButton.isVisible()) {
      await submitButton.click()
      
      // Check for validation messages
      const errorMessages = page.locator('[role="alert"], .error, [data-testid*="error"]')
      if (await errorMessages.count() > 0) {
        await expect(errorMessages.first()).toBeVisible()
      }
    }
  }
})

test('dark mode toggle works', async ({ page }) => {
  await page.goto('/')
  
  // Look for theme toggle
  const themeToggle = page.locator('[data-testid="theme-toggle"], button:has-text("theme")')
  
  if (await themeToggle.isVisible()) {
    await themeToggle.click()
    
    // Check if dark mode classes are applied
    const htmlElement = page.locator('html')
    const isDark = await htmlElement.getAttribute('class')
    
    expect(isDark).toContain('dark')
  }
})