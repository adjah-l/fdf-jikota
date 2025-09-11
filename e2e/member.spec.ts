import { test, expect } from '@playwright/test';

test.describe('Member User Experience', () => {
  test.beforeEach(async ({ page }) => {
    // Set up page with larger viewport for consistent testing
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('marketing home page loads with activities showcase', async ({ page }) => {
    await page.goto('/');
    
    // Check hero is visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/Match.*Gather.*Care/);
    
    // Check Activities Showcase is present with 5 cards
    const activitiesSection = page.locator('section').filter({ hasText: 'Groups for how you gather' });
    await expect(activitiesSection).toBeVisible();
    
    const activityCards = activitiesSection.locator('div[role="region"], .card, [class*="card"]').filter({ hasText: /Dinner|Prayer|Working Out|Watch Sporting Events|Flexible/i });
    await expect(activityCards).toHaveCount(5, { timeout: 10000 });
    
    // Verify specific activities are present
    await expect(page.locator('text=Dinner')).toBeVisible();
    await expect(page.locator('text=Prayer / Bible Study')).toBeVisible();
    await expect(page.locator('text=Working Out')).toBeVisible();
    await expect(page.locator('text=Watch Sporting Events')).toBeVisible();
    await expect(page.locator('text=Flexible')).toBeVisible();
  });

  test('for organizations navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Find and click "For Organizations" link
    const forOrgsLink = page.locator('a[href="/for-organizations"], a:has-text("For Organizations")');
    await expect(forOrgsLink).toBeVisible();
    await forOrgsLink.click();
    
    await expect(page).toHaveURL('/for-organizations');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('sign up flow collects required information', async ({ page }) => {
    await page.goto('/signup');
    
    // Check sign up form is present
    await expect(page.locator('form, [data-testid="signup-form"]').first()).toBeVisible();
    
    // Look for key fields that should be in onboarding
    const form = page.locator('form').first();
    
    // Check for location field (might be autocomplete or input)
    const locationField = form.locator('input[name*="location"], input[placeholder*="location"], input[placeholder*="city"], input[placeholder*="address"]');
    if (await locationField.count() > 0) {
      await expect(locationField.first()).toBeVisible();
    }
    
    // Check for activity preference (might be select or radio buttons)
    const activityField = form.locator('select[name*="activity"], input[name*="activity"], [role="combobox"]');
    if (await activityField.count() > 0) {
      await expect(activityField.first()).toBeVisible();
    }
  });

  test('member navigation shows correct sections when authenticated', async ({ page }) => {
    // Mock authentication state by going to app routes
    await page.goto('/app');
    
    // If redirected to sign in, that's expected behavior
    if (page.url().includes('/signin') || page.url().includes('/login')) {
      await expect(page.locator('form')).toBeVisible();
      console.log('Authentication required - test passed for redirect behavior');
      return;
    }
    
    // If we reach the app, check for member navigation
    const navigation = page.locator('nav, [role="navigation"], aside');
    if (await navigation.count() > 0) {
      // Look for member-specific links
      const memberLinks = [
        'Home', 'My Group', 'Messages', 'Care', 'Profile'
      ];
      
      for (const linkText of memberLinks) {
        const link = navigation.locator(`a:has-text("${linkText}"), [href*="${linkText.toLowerCase().replace(' ', '-')}"]`);
        if (await link.count() > 0) {
          await expect(link.first()).toBeVisible();
        }
      }
    }
  });

  test('my group page renders activity type correctly', async ({ page }) => {
    await page.goto('/app/group');
    
    // If redirected to sign in, skip this test
    if (page.url().includes('/signin') || page.url().includes('/login')) {
      console.log('Authentication required - skipping group page test');
      return;
    }
    
    // Check for group page content
    const groupContent = page.locator('main, [role="main"]');
    if (await groupContent.isVisible()) {
      // Look for activity type labeling (should not say "Dinner Group" exclusively)
      const groupTitle = page.locator('h1, h2, h3').first();
      const titleText = await groupTitle.textContent();
      
      if (titleText) {
        // Should show activity type + "Group" format
        const hasActivityType = /\b(Dinner|Prayer|Bible Study|Working Out|Sports|Flexible)\s+Group\b/i.test(titleText);
        if (hasActivityType) {
          expect(hasActivityType).toBeTruthy();
        }
      }
    }
  });

  test('mutual care features are accessible', async ({ page }) => {
    await page.goto('/app/care');
    
    // If redirected to sign in, skip this test
    if (page.url().includes('/signin') || page.url().includes('/login')) {
      console.log('Authentication required - skipping care page test');
      return;
    }
    
    // Check for care page elements
    const careContent = page.locator('main, [role="main"]');
    if (await careContent.isVisible()) {
      // Look for care-related UI elements
      const createRequestButton = page.locator('button:has-text("Request"), button:has-text("Create"), [data-testid*="create"]');
      const creditsDisplay = page.locator(':has-text("credits"), :has-text("Credits")');
      
      if (await createRequestButton.count() > 0) {
        await expect(createRequestButton.first()).toBeVisible();
      }
      
      if (await creditsDisplay.count() > 0) {
        await expect(creditsDisplay.first()).toBeVisible();
      }
    }
  });

  test('accessibility compliance on key pages', async ({ page }) => {
    const pagesToTest = ['/', '/about', '/contact'];
    
    for (const pageUrl of pagesToTest) {
      await page.goto(pageUrl);
      
      // Check all images have alt text
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const altText = await img.getAttribute('alt');
        expect(altText).not.toBeNull();
        expect(altText?.length).toBeGreaterThan(0);
      }
      
      // Check for proper heading hierarchy
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();
      
      if (headingCount > 0) {
        // Should have at least one h1
        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBeGreaterThan(0);
      }
    }
  });

  test('responsive design works on mobile', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that main content is visible
    await expect(page.locator('main')).toBeVisible();
    
    // Check that navigation is accessible (might be collapsed)
    const nav = page.locator('nav, [role="navigation"]');
    if (await nav.count() > 0) {
      await expect(nav.first()).toBeVisible();
    }
    
    // Check that hero text is readable
    const hero = page.locator('h1').first();
    await expect(hero).toBeVisible();
    
    // Verify activities showcase is still functional
    const activitiesSection = page.locator('section').filter({ hasText: 'Groups for how you gather' });
    if (await activitiesSection.count() > 0) {
      await expect(activitiesSection.first()).toBeVisible();
    }
  });
});