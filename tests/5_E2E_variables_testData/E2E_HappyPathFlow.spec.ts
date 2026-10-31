import {test, expect} from '@playwright/test';
import {InventoryPage } from './Pages_2/InventoryPage';
import {CartPage} from './Pages_2/CartPage';
import {Checkout_one } from './Pages_2/Checkout_one';
import {Checkout_two } from './Pages_2/Checkout_two';
import {Checkout_complete } from './Pages_2/Checkout_complete';

import userData from './test-data/orderUsers.json'; // 1. Import JSON data';
import orderData from './test-data/productOrderData.json';

test('E2E-Happy path flow', async({page})=>{
    const inventoryPage= new InventoryPage(page);
    const cartpage=new CartPage(page);
    const checkout_one=new Checkout_one(page);
    const checkout_two=new Checkout_two(page);
    const checkout_complete=new Checkout_complete(page);

    //1.Inventory Page
    await test.step('Add item to cart', async()=>{
            await inventoryPage.goto();

            await inventoryPage.addItemByName(orderData.product.name);
            await expect(inventoryPage.cartLink).toHaveAttribute('aria-label', 'Cart, 1 items');    
            await inventoryPage.cartLink.click();
            await cartpage.verifyPageloaded();
            //await expect(cartpage.cartPage_title).toHaveText(CART_PAGE_TITLE);
    });

    //2.Cart Page
    await test.step('View details & checkout',async()=>{
            await expect(cartpage.itemName).toHaveText(orderData.product.name);
            await expect(cartpage.itemPrice).toHaveText(orderData.product.price);
            await cartpage.clickCheckout();
            await checkout_one.verifyPageLoaded();
    });

    //3.Checkout_one Page
    await test.step('Fill user details', async()=>{
            
            await checkout_one.enterDetails(
                userData.firstName,
                userData.lastName,
                userData.zipCode        
            );

            //Assertion
            await checkout_two.verifyPageLoaded();
            await expect(checkout_two.itemPrice).toHaveText(orderData.product.itemTotal); 
            await expect(checkout_two.tax).toHaveText(orderData.product.tax);      
    });

    //4.Checkout_two Page
    await test.step('Review Details',async()=>{
            await checkout_two.click_finishBtn();
            await checkout_two.verifyPageLoaded();
    
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
