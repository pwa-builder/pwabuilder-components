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
let pwbinstall = class pwbinstall extends LitElement {
    /**
     * Use the customElement decorator to define your class as
     * a custom element. Registers <my-element> as an HTML tag.
     */
    constructor() {
        super(...arguments);
        /**
         * Create an observed property. Triggers update on change.
         */
        this.foo = 'foo';
    }
    /**
     * Implement `render` to define a template for your element.
     */
    render() {
        /**
         * Use JavaScript expressions to include property values in
         * the element template.
         */
        return html `<p>${this.foo}</p>`;
    }
};
__decorate([
    property()
], pwbinstall.prototype, "foo", void 0);
pwbinstall = __decorate([
    customElement('pwb-install')
], pwbinstall);
export { pwbinstall };
//# sourceMappingURL=pwb-install.js.map