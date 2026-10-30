import {test as setup, expect} from '@playwright/test';

const authFile='playwright/.auth/user.json';

setup('authenticate', async({page})=>{
    page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page.locator('.shopping_cart_link')).toBeVisible();

    await page.context().storageState({path: authFile});
});