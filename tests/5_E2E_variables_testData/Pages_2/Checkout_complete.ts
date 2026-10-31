import {Page, Locator, expect} from '@playwright/test';

export class Checkout_complete{

    readonly page: Page;
    readonly checkhout_complete_title: Locator;
    readonly successTickIcon: Locator;
    readonly successHeader: Locator;
    readonly successText: Locator;
    readonly generatePDFBtn: Locator;

    // Expected Messages defined as static constants of the page
    static readonly EXPECTED_SUCCESS_HEADER = 'Thank you for your order!';
    static readonly EXPECTED_SUCCESS_TEXT =
    'Your order has been dispatched, and will arrive just as fast as the pony can get there!';

    constructor(page: Page){
        this.page=page;
        this.checkhout_complete_title=page.locator('.title');
        this.successTickIcon=page.getByAltText('Pony Express');
        this.successHeader=page.locator('.complete-header');
        this.successText=page.locator('.complete-text');
        this.generatePDFBtn=page.getByRole('button',{name:'Generate PDF order'});
    }

    // Self-contained verification method
    async verifyOrderSucess(){
        await expect(this.successTickIcon).toBeVisible();
        await expect(this.successHeader).toHaveText(Checkout_complete.EXPECTED_SUCCESS_HEADER);
        await expect(this.successText).toHaveText(Checkout_complete.EXPECTED_SUCCESS_TEXT);
    }


}