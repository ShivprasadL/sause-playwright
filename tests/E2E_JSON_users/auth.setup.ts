import {test as setup, expect} from '@playwright/test';
import end_users from '../E2E_JSON_users/end_users.json';

const authFile='playwright/.auth/user.json';

for (const user of end_users) {
setup(`authenticate as ${user.username}`, async({page})=>{
    page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.locator('#login-button').click();

    // Verify login was successful
    await expect(page.locator('.shopping_cart_link')).toBeVisible();

    // Save the session storage state
    await page.context().storageState({path: authFile});
});
}