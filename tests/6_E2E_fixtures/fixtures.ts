import {test as baseTest, expect} from '@playwright/test';
import { InventoryPage } from './Pages_2/InventoryPage';
import { CartPage } from './Pages_2/CartPage';
import { Checkout_one } from './Pages_2/Checkout_one';
import { Checkout_two } from './Pages_2/Checkout_two';
import {Checkout_complete} from './Pages_2/Checkout_complete';

//Declare types for typeScript
type Pages={
    inventoryPage: InventoryPage;
    cartpage: CartPage;
    checkout_one: Checkout_one;
    checkout_two: Checkout_two;
    checkout_complete: Checkout_complete;
}

// Extend base test with your page object fixtures
export const test = baseTest.extend<Pages>({
    inventoryPage: async ({page},use)=>{
        await use(new InventoryPage(page));
    },
    cartpage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkout_one: async ({ page }, use) => {
    await use(new Checkout_one(page));
  },
  checkout_two: async ({ page }, use) => {
    await use(new Checkout_two(page));
  },
  checkout_complete: async ({ page }, use) => {
    await use(new Checkout_complete(page));
  },
});

export { expect };

