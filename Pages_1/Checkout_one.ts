import {Page, Locator} from '@playwright/test';

export class Checkout_one{
    readonly page: Page;
    readonly checkoutPage_title: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly zipCodeInput: Locator;
    readonly continueBtn: Locator;

    constructor(page: Page){
        this.page=page;
        this.checkoutPage_title=page.locator('.title');
        this.firstNameInput=page.locator('#first-name');
        this.lastNameInput=page.getByPlaceholder('Last Name');
        this.zipCodeInput=page.getByLabel('Zip/Postal Code');
        this.continueBtn=page.locator('#continue');
    }

    async enterDetails(firstName:string, lastName:string,zipCode:string){
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.zipCodeInput.fill(zipCode);
        await this.continueBtn.click();
    }


}