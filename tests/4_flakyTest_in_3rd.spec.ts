import { test, expect } from '@playwright/test';

test('E2E Order Checkout Journey', async ({ page }) => {
  // Already logged in via storageState!

  await test.step('1. Navigate and add item to cart', async () => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    const productCard = page.locator('.inventory_item').filter({ hasText: 'Test.allTheThings() T-Shirt (Red)' });
    await productCard.getByRole('button', { name: 'Add to cart' }).click();

    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await expect(cartLink).toHaveAttribute('aria-label', 'Cart, 1 items');
  });

  await test.step('2. Verify cart details', async () => {
    await page.locator('[data-test="shopping-cart-link"]').click();
    const cartItem = page.locator('.cart_item');
    await expect(cartItem.locator('[data-test="inventory-item-name"]')).toHaveText('Test.allTheThings() T-Shirt (Red)');
    await expect(cartItem.locator('[data-test="inventory-item-price"]')).toHaveText('$15.99');
  });

  await test.step('3. Fill customer checkout information', async () => {
    await page.getByRole('button', { name: 'checkout' }).click();
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');

    await page.getByLabel('First Name').fill('John');
    await page.getByPlaceholder('Last Name').fill('Doe');
    await page.getByLabel('Zip/Postal Code').fill('123456');
    await page.locator('[data-test="continue"]').click();
  });

  await test.step('4. Verify summary and place order', async () => {
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
    const summaryInfo = page.locator('.summary_info');
    await expect(summaryInfo.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $15.99');
    await expect(summaryInfo.locator('[data-test="tax-label"]')).toHaveText('Tax: $1.28');
    await page.getByRole('button', { name: 'finish' }).click();
  });

  await test.step('5. Confirm order completion and download invoice', async () => {
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Complete!');
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');

    // const downloadPromise = page.waitForEvent('download');
    // await page.getByRole('button', { name: 'Generate PDF order' }).click();
    //const download = await downloadPromise;

    const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 15000 }),
    page.getByRole('button', { name: 'Generate PDF order' }).click(),
    ]);

    const failure = await download.failure();
    expect(failure).toBeNull();
    expect(download.suggestedFilename()).toContain('.pdf');
  });
});