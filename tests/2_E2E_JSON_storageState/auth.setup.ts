import {test as setup, expect} from '@playwright/test';
import end_users from './end_users.json';

const authFile='playwright/.auth/user.json';

//const user=end_users[4];

for (const user of end_users) {
setup(`authenticate as ${user.username}`, async({page})=>{
    page.goto('https://www.saucedemo.com/');
    await page.getByPlaceholder('Username').fill(user.username);
    await page.getByPlaceholder('Password').fill(user.password);
    await page.locator('#login-button').click();

    // Verify login was successful
    await expect(page.locator('.shopping_cart_link')).toBeVisible({timeout: 15_000});

    // Save the session storage state
    await page.context().storageState({path: authFile});
});
}