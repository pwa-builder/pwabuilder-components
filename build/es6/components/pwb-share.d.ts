import { LitElement } from 'lit-element';
export declare class pwbshare extends LitElement {
    title: string;
    text: string;
    url: string;
    share(): Promise<void>;
    render(): import("lit-element").TemplateResult;
}
