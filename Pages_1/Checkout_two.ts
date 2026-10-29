import {Page, Locator} from '@playwright/test';

export class Checkout_two{
    readonly page: Page;
    readonly checkoutTwo_title: Locator;
    readonly itemPrice: Locator;
    readonly tax: Locator;
    readonly finishBtn: Locator;

    constructor(page: Page){
        this.page=page;
        this.checkoutTwo_title=page.locator('.title');
        this.itemPrice=page.locator('.summary_subtotal_label');
        this.tax=page.locator('[data-test="tax-label"]');
        this.finishBtn=page.getByRole('button',{name: 'Finish'});
    }

    async click_finishBtn(){
        this.finishBtn.click();
    }
}