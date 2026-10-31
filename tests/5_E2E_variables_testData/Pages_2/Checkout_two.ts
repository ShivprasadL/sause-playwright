import {Page, Locator, expect} from '@playwright/test';

export class Checkout_two{
    readonly page: Page;
    readonly checkoutTwo_title: Locator;
    readonly itemPrice: Locator;
    readonly tax: Locator;
    readonly finishBtn: Locator;

    static readonly EXPECTED_TITLE='Checkout: Overview';

    constructor(page: Page){
        this.page=page;
        this.checkoutTwo_title=page.locator('.title');
        this.itemPrice=page.locator('.summary_subtotal_label');
        this.tax=page.locator('[data-test="tax-label"]');
        this.finishBtn=page.getByRole('button',{name: 'Finish'});
    }

    async verifyPageLoaded(){
        await expect(this.checkoutTwo_title).toHaveText(Checkout_two.EXPECTED_TITLE);
    }

    async click_finishBtn(){
        this.finishBtn.click();
    }
}