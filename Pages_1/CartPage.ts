import {Page, Locator, expect} from '@playwright/test';

export class CartPage{
    readonly page: Page;
    readonly cartPage_title: Locator;
    readonly itemName: Locator;
    readonly itemPrice: Locator;
    readonly checkoutBtn: Locator;

    constructor(page:Page){
        this.page=page;
        this.cartPage_title=page.locator('.title');
        this.itemName= page.locator('.cart_item [data-test="inventory-item-name"]');
        this.itemPrice= page.locator('[data-test="inventory-item-price"]');
        this.checkoutBtn= page.getByRole('button', {name: 'Checkout'});
    }

    async clickCheckout(){
        await this.checkoutBtn.click();
    }


}