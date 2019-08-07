import { LitElement } from 'lit-element';
export declare class pwbclipboard extends LitElement {
    textToCopy: string;
    copyText(): Promise<void>;
    readText(): Promise<string>;
    render(): import("lit-element").TemplateResult;
}
