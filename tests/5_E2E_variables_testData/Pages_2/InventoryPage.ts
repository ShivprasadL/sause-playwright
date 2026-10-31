import {Page, Locator } from '@playwright/test';

export class InventoryPage{

    readonly page: Page;
    readonly cartLink: Locator;

    constructor(page:Page){
        this.page=page;
        this.cartLink=page.locator('[data-test="shopping-cart-link"]');
    }

    async goto(){
        await this.page.goto('https://www.saucedemo.com/inventory.html');       
    }

    async addItemByName(name: string) {
        const product = this.page.locator('.inventory_item').filter({ hasText: name });
        await product.getByRole('button', { name: 'Add to cart' }).click();
    }

    async goToCart() {
        await this.cartLink.click();
    }

}