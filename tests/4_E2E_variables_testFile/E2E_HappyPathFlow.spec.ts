import {test, expect} from '@playwright/test';
import {InventoryPage } from '../../Pages_1/InventoryPage';
import {CartPage} from '../../Pages_1/CartPage';
import {Checkout_one } from '../../Pages_1/Checkout_one';
import {Checkout_two } from '../../Pages_1/Checkout_two';
import {Checkout_complete } from '../../Pages_1/Checkout_complete';

import userData from './test-data/checkoutUser.json'; // 1. Import JSON data';

const TEST_ITEM ='Test.allTheThings() T-Shirt (Red)';
const TEST_ITEM_PRICE='$15.99';

const CART_PAGE_TITLE='Your Cart';
const CHECKOUT_ONE_TITLE='Checkout: Your Information';
const CHECKOUT_TWO_TITLE='Checkout: Overview';
const SUCCESS_HEADER='Thank you for your order!';
const SUCCESS_TEXT='Your order has been dispatched, and will arrive just as fast as the pony can get there!';


test('E2E-Happy path flow', async({page})=>{
    const inventoryPage= new InventoryPage(page);
    const cartpage=new CartPage(page);
    const checkout_one=new Checkout_one(page);
    const checkout_two=new Checkout_two(page);
    const checkout_complete=new Checkout_complete(page);

    //1.Inventory Page
    await test.step('Add item to cart', async()=>{
            await inventoryPage.goto();
            await inventoryPage.addItemByName(TEST_ITEM);
            await expect(inventoryPage.cartLink).toHaveAttribute('aria-label', 'Cart, 1 items');    
            await inventoryPage.cartLink.click();
            await expect(cartpage.cartPage_title).toHaveText(CART_PAGE_TITLE);
    });

    //2.Cart Page
    await test.step('View details & checkout',async()=>{
            await expect(cartpage.itemName).toHaveText(TEST_ITEM);
            await expect(cartpage.itemPrice).toHaveText(TEST_ITEM_PRICE);
            await cartpage.clickCheckout();

            await expect(checkout_one.checkoutPage_title).toHaveText(CHECKOUT_ONE_TITLE);
    });

    //3.Checkout_one Page
    await test.step('Fill user details', async()=>{
            //await checkout_one.enterDetails('John','Doe','12345');
            // 2. Use values from the JSON file
            await checkout_one.enterDetails(
                userData.firstName,
                userData.lastName,
                userData.zipCode        
            );

            //Assertion
            await expect(checkout_two.checkoutTwo_title).toHaveText(CHECKOUT_TWO_TITLE); 
            await expect(checkout_two.itemPrice).toHaveText('Item total: $15.99'); 
            await expect(checkout_two.tax).toHaveText('Tax: $1.28');      
    });

    //4.Checkout_two Page
    await test.step('Review Details',async()=>{
            await checkout_two.click_finishBtn();

            await expect(checkout_complete.successTickIcon).toBeVisible();
            await expect(checkout_complete.successHeader).toHaveText(SUCCESS_HEADER);
            await expect(checkout_complete.successText).toHaveText(SUCCESS_TEXT);
    
        //download file
        const downloadPromise = page.waitForEvent('download');
        //await page.getByRole('button',{name:'Generate PDF order'}).click();
        await checkout_complete.generatePDFBtn.click();
        const download = await downloadPromise;
        const failure = await download.failure();
        expect(failure).toBeNull();
        expect(download.suggestedFilename()).toContain('.pdf');    
        });

});
