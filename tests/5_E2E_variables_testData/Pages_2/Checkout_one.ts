import {Page, Locator, expect} from '@playwright/test';

export class Checkout_one{
    readonly page: Page;
    readonly checkoutPage_title: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly zipCodeInput: Locator;
    readonly continueBtn: Locator;

    static readonly EXPECTED_TITLE='Checkout: Your Information';

    constructor(page: Page){
        this.page=page;
        this.checkoutPage_title=page.locator('.title');
        this.firstNameInput=page.locator('#first-name');
        this.lastNameInput=page.getByPlaceholder('Last Name');
        this.zipCodeInput=page.getByLabel('Zip/Postal Code');
        this.continueBtn=page.locator('#continue');
    }

    async verifyPageLoaded(){
        await expect(this.checkoutPage_title).toHaveText(Checkout_one.EXPECTED_TITLE);
    }

    async enterDetails(firstName:string, lastName:string,zipCode:string){
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.zipCodeInput.fill(zipCode);
        await this.continueBtn.click();
    }


}