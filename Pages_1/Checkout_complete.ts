import {Page, Locator} from '@playwright/test';

export class Checkout_complete{

    readonly page: Page;
    readonly checkhout_complete_title: Locator;
    readonly successTickIcon: Locator;
    readonly successHeader: Locator;
    readonly successText: Locator;
    readonly generatePDFBtn: Locator;

        constructor(page: Page){
        this.page=page;
        this.checkhout_complete_title=page.locator('.title');
        this.successTickIcon=page.getByAltText('Pony Express');
        this.successHeader=page.locator('.complete-header');
        this.successText=page.locator('.complete-text');
        this.generatePDFBtn=page.getByRole('button',{name:'Generate PDF order'});
        }


}