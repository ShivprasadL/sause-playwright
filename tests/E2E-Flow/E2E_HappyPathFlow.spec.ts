import {test, expect} from '@playwright/test';
import {InventoryPage } from '../../Pages_1/InventoryPage';
import {CartPage} from '../../Pages_1/CartPage';
import {Checkout_one } from '../../Pages_1/Checkout_one';

test('Navigate and select item', async({page})=>{
    const inventoryPage= new InventoryPage(page);
    const cartpage=new CartPage(page);
    const checkout_one=new Checkout_one(page);

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
        
    });

    

    
})