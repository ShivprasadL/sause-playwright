import { test, expect } from '@playwright/test';

test('verify E2E functionality flow', async ({ page }) => {
  // Navigate directly to the authenticated page
  await page.goto('https://www.saucedemo.com/inventory.html');

  // Verify the cart is initially empty
  const cartLink = page.locator('[data-test="shopping-cart-link"]');
  await expect(cartLink).toHaveAttribute('aria-label', 'Cart, empty');

  // Locate product and add to cart
  const productCard = page.locator('.inventory_item').filter({ hasText: 'Test.allTheThings() T-Shirt (Red)' });
  await productCard.getByRole('button', { name: 'Add to cart' }).click();
  await expect(cartLink).toHaveAttribute('aria-label', 'Cart, 1 items');

  // Cart page verification
  await cartLink.click();
  const cartItem = page.locator('.cart_item');
  await expect(cartItem.locator('[data-test="inventory-item-name"]')).toHaveText('Test.allTheThings() T-Shirt (Red)');
  await expect(cartItem.locator('[data-test="inventory-item-price"]')).toHaveText('$15.99');

  // Checkout information
  await page.getByRole('button', { name: 'checkout' }).click();
  await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');

  await page.getByLabel('First Name').fill('John');
  await page.getByPlaceholder('Last Name').fill('Doe');
  await page.getByLabel('Zip/Postal Code').fill('123456');
  await page.locator('[data-test="continue"]').click();

  // Overview verification
  await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
  const cartList = page.locator('.cart_list');
  await expect(cartList.locator('[data-test="inventory-item-name"]')).toHaveText('Test.allTheThings() T-Shirt (Red)');
  await expect(cartList.locator('[data-test="inventory-item-price"]')).toHaveText('$15.99');

  // Price summary & complete order
  const summaryInfo = page.locator('.summary_info');
  await expect(summaryInfo.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $15.99');
  await expect(summaryInfo.locator('[data-test="tax-label"]')).toHaveText('Tax: $1.28');
  await page.getByRole('button', { name: 'finish' }).click();

  // Order confirmation
  await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Complete!');
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  await expect(page.locator('.complete-text')).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');

  // PDF download
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Generate PDF order' }).click();
  const download = await downloadPromise;
  const failure = await download.failure();
  expect(failure).toBeNull();
  expect(download.suggestedFilename()).toContain('.pdf');
});