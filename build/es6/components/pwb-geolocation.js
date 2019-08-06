var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, customElement, property } from 'lit-element';
/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */
let pwbgeolocation = class pwbgeolocation extends LitElement {
    getLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position.coords);
                this.currentPosition = position.coords;
                return position.coords;
            });
        }
        else {
            console.info("geolocation is not supported in this environment");
        }
    }
    /**
     * Implement `render` to define a template for your element.
     *
     */
    render() {
        /**
         * Use JavaScript expressions to include property values in
         * the element template.
         */
        return html `<h1>Hello world</h1>`;
    }
};
__decorate([
    property()
], pwbgeolocation.prototype, "currentPosition", void 0);
pwbgeolocation = __decorate([
    customElement('pwb-geolocation')
], pwbgeolocation);
export { pwbgeolocation };
//# sourceMappingURL=pwb-geolocation.js.map