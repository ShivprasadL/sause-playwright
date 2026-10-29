import {test, expect} from '@playwright/test';
import {InventoryPage } from '../../Pages_1/InventoryPage';
import {CartPage} from '../../Pages_1/CartPage';
import {Checkout_one } from '../../Pages_1/Checkout_one';
import {Checkout_two } from '../../Pages_1/Checkout_two';
import {Checkout_complete } from '../../Pages_1/Checkout_complete';


test('E2E-Happy path flow', async({page})=>{
    const inventoryPage= new InventoryPage(page);
    const cartpage=new CartPage(page);
    const checkout_one=new Checkout_one(page);
    const checkout_two=new Checkout_two(page);
    const checkout_complete=new Checkout_complete(page);

    //1.Inventory Page
    await test.step('Add item to cart', async()=>{
            await inventoryPage.goto();
            await inventoryPage.addItemByName('Test.allTheThings() T-Shirt (Red)');
            await expect(inventoryPage.cartLink).toHaveAttribute('aria-label', 'Cart, 1 items');    
            await inventoryPage.cartLink.click();
            await expect(cartpage.cartPage_title).toHaveText('Your Cart');
    });

    //2.Cart Page
    await test.step('View details & checkout',async()=>{
            await expect(cartpage.itemName).toHaveText('Test.allTheThings() T-Shirt (Red)');
            await expect(cartpage.itemPrice).toHaveText('$15.99');
            await cartpage.clickCheckout();
            await expect(checkout_one.checkoutPage_title).toHaveText('Checkout: Your Information');
    });

    //3.Checkout_one Page
    await test.step('Fill user details', async()=>{
            await checkout_one.enterDetails('John','Doe','12345');

            //Assertion
            await expect(checkout_two.checkoutTwo_title).toHaveText('Checkout: Overview'); 
            await expect(checkout_two.itemPrice).toHaveText('Item total: $15.99'); 
            await expect(checkout_two.tax).toHaveText('Tax: $1.28');      
    });

    //4.Checkout_two Page
    await test.step('Review Details',async()=>{
            await checkout_two.click_finishBtn();

            await expect(checkout_complete.successTickIcon).toBeVisible();
            await expect(checkout_complete.successHeader).toHaveText('Thank you for your order!');
            await expect(checkout_complete.successText).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
    
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

test.afterAll('Tear Down',async({page})=>{
        await page.close();
});