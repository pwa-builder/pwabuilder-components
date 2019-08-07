import { LitElement } from 'lit-element';
export declare class pwbadapcard extends LitElement {
    text: string;
    imageUrl: string;
    cardsToRender: any[];
    title: string;
    static getStyles(): import("lit-element").CSSResult;
    firstUpdated(): Promise<void>;
    createCard(): Promise<any>;
    storeCard(cardJSON: any): Promise<void>;
    getCards(): Promise<void>;
    render(): import("lit-element").TemplateResult;
}
