import {test, expect} from '@playwright/test';
import { InventoryPage } from '../../Pages_1/InventoryPage';

test('Navigate and select item', async({page})=>{
    const inventoryPage= new InventoryPage(page);

    //1.Inventory Page
    await test.step('Add item to cart', async()=>{
            await inventoryPage.goto();
            await inventoryPage.addItemByName('Test.allTheThings() T-Shirt (Red)');
            await expect(inventoryPage.cartLink).toHaveAttribute('aria-label', 'Cart, 1 items');    
            await inventoryPage.cartLink.click();
    });

    
})