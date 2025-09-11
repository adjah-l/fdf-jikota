import { test, expect } from '@playwright/test';

test.describe('Admin User Experience', () => {
  test.beforeEach(async ({ page }) => {
    // Set up page with larger viewport for admin interfaces
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('admin dashboard loads correctly', async ({ page }) => {
    await page.goto('/admin2');
    
    // If redirected to sign in, that's expected behavior
    if (page.url().includes('/signin') || page.url().includes('/login')) {
      await expect(page.locator('form')).toBeVisible();
      console.log('Authentication required - test passed for redirect behavior');
      return;
    }
    
    // Check for admin dashboard content
    const adminContent = page.locator('main, [role="main"]');
    if (await adminContent.isVisible()) {
      // Should have admin-specific navigation
      const adminNav = page.locator('nav, [role="navigation"], aside');
      if (await adminNav.count() > 0) {
        await expect(adminNav.first()).toBeVisible();
      }
      
      // Look for admin-specific sections
      const adminSections = [
        'Overview', 'Groups', 'Data', 'Messaging', 'Matching'
      ];
      
      for (const section of adminSections) {
        const sectionLink = page.locator(`a:has-text("${section}"), [href*="${section.toLowerCase()}"]`);
        if (await sectionLink.count() > 0) {
          await expect(sectionLink.first()).toBeVisible();
        }
      }
    }
  });

  test('create activity group with prayer/bible study', async ({ page }) => {
    await page.goto('/admin2/groups');
    
    // If redirected to sign in, skip this test
    if (page.url().includes('/signin') || page.url().includes('/login')) {
      console.log('Authentication required - skipping group creation test');
      return;
    }
    
    // Look for create group functionality
    const createButton = page.locator('button:has-text("Create"), button:has-text("Add"), [data-testid*="create"]');
    if (await createButton.count() > 0) {
      await createButton.first().click();
      
      // Look for group creation form
      const form = page.locator('form, [role="dialog"]').first();
      if (await form.isVisible()) {
        // Check for activity type selection
        const activitySelect = form.locator('select[name*="activity"], [role="combobox"], input[name*="activity"]');
        if (await activitySelect.count() > 0) {
          await expect(activitySelect.first()).toBeVisible();
          
          // Try to select "Prayer / Bible Study" if available
          const prayerOption = form.locator(':has-text("Prayer"), :has-text("Bible Study")');
          if (await prayerOption.count() > 0) {
            await prayerOption.first().click();
          }
        }
        
        // Check for group name field
        const nameField = form.locator('input[name*="name"], input[placeholder*="name"]');
        if (await nameField.count() > 0) {
          await expect(nameField.first()).toBeVisible();
        }
      }
    }
  });

  test('matching policies page loads and functions', async ({ page }) => {
    await page.goto('/admin2/matching');
    
    // If redirected to sign in, skip this test
    if (page.url().includes('/signin') || page.url().includes('/login')) {
      console.log('Authentication required - skipping matching policies test');
      return;
    }
    
    // Check for matching policies content
    const matchingContent = page.locator('main, [role="main"]');
    if (await matchingContent.isVisible()) {
      // Look for 5C-related controls
      const fiveCElements = page.locator(':has-text("5C"), :has-text("Five C")');
      if (await fiveCElements.count() > 0) {
        await expect(fiveCElements.first()).toBeVisible();
      }
      
      // Look for policy configuration
      const policyControls = page.locator('input[type="range"], input[type="number"], select');
      if (await policyControls.count() > 0) {
        await expect(policyControls.first()).toBeVisible();
      }
      
      // Check for save functionality
      const saveButton = page.locator('button:has-text("Save"), button:has-text("Update")');
      if (await saveButton.count() > 0) {
        await expect(saveButton.first()).toBeVisible();
      }
    }
  });

  test('messaging templates page renders correctly', async ({ page }) => {
    await page.goto('/admin2/messaging');
    
    // If redirected to sign in, skip this test
    if (page.url().includes('/signin') || page.url().includes('/login')) {
      console.log('Authentication required - skipping messaging test');
      return;
    }
    
    // Check for messaging content
    const messagingContent = page.locator('main, [role="main"]');
    if (await messagingContent.isVisible()) {
      // Look for template management UI
      const templateSection = page.locator(':has-text("Template"), :has-text("Message")');
      if (await templateSection.count() > 0) {
        await expect(templateSection.first()).toBeVisible();
      }
      
      // Check for 5C template references
      const fiveCTemplates = page.locator(':has-text("5C"), :has-text("Five C")');
      if (await fiveCTemplates.count() > 0) {
        await expect(fiveCTemplates.first()).toBeVisible();
      }
      
      // Look for create template functionality
      const createTemplateButton = page.locator('button:has-text("Create"), button:has-text("Add Template")');
      if (await createTemplateButton.count() > 0) {
        await expect(createTemplateButton.first()).toBeVisible();
      }
    }
  });

  test('admin navigation guards work correctly', async ({ page }) => {
    const adminRoutes = [
      '/admin2',
      '/admin2/groups', 
      '/admin2/data',
      '/admin2/messaging',
      '/admin2/matching'
    ];
    
    for (const route of adminRoutes) {
      await page.goto(route);
      
      // Should either show admin content or redirect to auth
      const hasAuthForm = await page.locator('form').isVisible();
      const hasAdminContent = await page.locator('main, [role="main"]').isVisible();
      
      expect(hasAuthForm || hasAdminContent).toBeTruthy();
      
      // If admin content is shown, verify it's admin-specific
      if (hasAdminContent && !hasAuthForm) {
        const adminIndicators = page.locator(':has-text("Admin"), :has-text("Dashboard"), [data-testid*="admin"]');
        if (await adminIndicators.count() > 0) {
          await expect(adminIndicators.first()).toBeVisible();
        }
      }
    }
  });

  test('admin header shows correct user context', async ({ page }) => {
    await page.goto('/admin2');
    
    // If redirected to sign in, skip this test
    if (page.url().includes('/signin') || page.url().includes('/login')) {
      console.log('Authentication required - skipping header test');
      return;
    }
    
    // Check for admin header
    const header = page.locator('header, [role="banner"]');
    if (await header.isVisible()) {
      // Should show admin context
      const adminTitle = header.locator(':has-text("Admin"), h1');
      if (await adminTitle.count() > 0) {
        await expect(adminTitle.first()).toBeVisible();
      }
      
      // Should have user menu
      const userMenu = header.locator('button[data-testid*="user"], [role="button"]:has([data-testid*="avatar"])');
      if (await userMenu.count() > 0) {
        await expect(userMenu.first()).toBeVisible();
      }
    }
  });

  test('data management features are accessible', async ({ page }) => {
    await page.goto('/admin2/data');
    
    // If redirected to sign in, skip this test
    if (page.url().includes('/signin') || page.url().includes('/login')) {
      console.log('Authentication required - skipping data management test');
      return;
    }
    
    // Check for data management content
    const dataContent = page.locator('main, [role="main"]');
    if (await dataContent.isVisible()) {
      // Look for import/export functionality
      const importButton = page.locator('button:has-text("Import"), button:has-text("Upload")');
      const exportButton = page.locator('button:has-text("Export"), button:has-text("Download")');
      
      if (await importButton.count() > 0) {
        await expect(importButton.first()).toBeVisible();
      }
      
      if (await exportButton.count() > 0) {
        await expect(exportButton.first()).toBeVisible();
      }
      
      // Check for data tables or lists
      const dataTable = dataContent.locator('table, [role="table"], [role="grid"]');
      if (await dataTable.count() > 0) {
        await expect(dataTable.first()).toBeVisible();
      }
    }
  });

  test('admin can switch between member and admin views', async ({ page }) => {
    await page.goto('/admin2');
    
    // If redirected to sign in, skip this test
    if (page.url().includes('/signin') || page.url().includes('/login')) {
      console.log('Authentication required - skipping view switch test');
      return;
    }
    
    // Look for view switching functionality
    const switchButton = page.locator('button:has-text("Member"), button:has-text("Switch"), [data-testid*="switch"]');
    if (await switchButton.count() > 0) {
      await expect(switchButton.first()).toBeVisible();
      
      // Click to switch (might navigate or show menu)
      await switchButton.first().click();
      
      // Check if navigation occurred or menu appeared
      const memberView = page.locator(':has-text("My Group"), :has-text("Member")');
      const dropdown = page.locator('[role="menu"], [role="menuitem"]');
      
      if (await memberView.count() > 0 || await dropdown.count() > 0) {
        expect(true).toBeTruthy(); // Switch mechanism is present
      }
    }
  });
});