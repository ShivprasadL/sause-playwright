import {test as setup, expect} from '@playwright/test';
import end_users from './test-data/loginUsers.json';

const authFile='playwright/.auth/user.json';

for (const user of end_users.users) {
setup(`authenticate as ${user.username}`, async({page})=>{
    await page.goto(end_users.baseUrl); // Uses baseURL automatically
    await page.getByPlaceholder('Username').fill(user.username);
    await page.getByPlaceholder('Password').fill(user.password);
    await page.locator('#login-button').click();

    // Verify login was successful
    await page.waitForURL('**/inventory.html');
    //await expect(page.locator('.shopping_cart_link')).toBeVisible();

    // Save the session storage state
    await page.context().storageState({path: authFile});
});
}