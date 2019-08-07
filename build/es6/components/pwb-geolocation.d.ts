import { LitElement } from 'lit-element';
export declare class pwbgeolocation extends LitElement {
    currentPosition: Coordinates;
    watchedPosition: Coordinates;
    getLocation(): Coordinates | null;
    watchLocation(): Coordinates | null;
    render(): import("lit-element").TemplateResult;
}
