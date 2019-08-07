import { LitElement } from 'lit-element';
export declare class pwbinstall extends LitElement {
    deferredPrompt: any;
    manifestPath: string;
    iconPath: string;
    manifestData: any;
    openModal: boolean;
    static readonly styles: import("lit-element").CSSResult;
    firstUpdated(): Promise<void>;
    getManifestData(): Promise<void>;
    openPrompt(): void;
    install(): Promise<boolean>;
    cancel(): void;
    render(): import("lit-element").TemplateResult;
}
