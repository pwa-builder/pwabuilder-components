import { LitElement } from 'lit-element';
/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */
export declare class pwbgeolocation extends LitElement {
    currentPosition: any;
    getLocation(): void;
    /**
     * Implement `render` to define a template for your element.
     *
     */
    render(): import("lit-element").TemplateResult;
}
