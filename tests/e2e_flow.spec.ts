import { test, expect } from '@playwright/test';

test('verify E2E functionality flow', async({page})=>{

    //page->username,password,logBtn->assertion
    page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page.locator('.shopping_cart_link')).toBeVisible();

    // Locate the parent container containing this title, then find its "Add to cart" button
    //1. check container before adding item
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await expect(cartLink).toHaveAttribute('aria-label', 'Cart, empty');
    //2. locate element & click add to cart
    const productCard = page.locator('.inventory_item').filter({ hasText: 'Test.allTheThings() T-Shirt (Red)' });
    await productCard.getByRole('button', { name: 'Add to cart' }).click();
    //3.check container items after adding to cart
    await expect(cartLink).toHaveAttribute('aria-label', 'Cart, 1 items');

    // Click on the cart icon
    //await page.locator('[data-test="shopping-cart-link"]').click();
    await cartLink.click();
    // Wait for the cart item container to appear on cart.html
    const cartItem = page.locator('.cart_item');
    // Assert title and price inside the cart item
    await expect(cartItem.locator('[data-test="inventory-item-name"]')).toHaveText('Test.allTheThings() T-Shirt (Red)');
    await expect(cartItem.locator('[data-test="inventory-item-price"]')).toHaveText('$15.99');

    //Checkout
    await page.getByRole('button',{name: 'checkout'}).click();
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');

    //Information
    await page.getByLabel('First Name').fill('John');
    await page.getByPlaceholder('Last Name').fill('Doe');
    await page.getByLabel('Zip/Postal Code').fill('123456');
    await page.locator('[data-test="continue"]').click();
   
    //overview
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
    const cartList = page.locator('.cart_list');
    // Assert title and price inside the cart item
    await expect(cartList.locator('[data-test="inventory-item-name"]')).toHaveText('Test.allTheThings() T-Shirt (Red)');
    await expect(cartList.locator('[data-test="inventory-item-price"]')).toHaveText('$15.99');
  
    //summary
    const summaryInfo=page.locator('.summary_info');
    await expect(summaryInfo.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $15.99');
    await expect(summaryInfo.locator('[data-test="tax-label"]')).toHaveText('Tax: $1.28');
    await page.getByRole('button',{name:'finish'}).click();

    //complete
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Complete!');
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    await expect(page.locator('.complete-text')).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
    //download file
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button',{name:'Generate PDF order'}).click();
    const download = await downloadPromise;
    const failure = await download.failure();
    expect(failure).toBeNull();
    expect(download.suggestedFilename()).toContain('.pdf');

    //logout
    await page.getByRole('button',{name:'Open Menu'}).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    await expect(page.locator('#login-button')).toHaveText('Login');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    
});