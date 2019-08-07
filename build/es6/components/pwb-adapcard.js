var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, customElement, property } from 'lit-element';
import * as Adaptive from 'adaptivecards';
let pwbadapcard = class pwbadapcard extends LitElement {
    createCard() {
        let card = new Adaptive.AdaptiveCard();
        card.version = new Adaptive.Version(1, 0);
        if (this.text) {
            let textBlock = new Adaptive.TextBlock();
            textBlock.text = "Hello World";
            card.addItem(textBlock);
        }
        if (this.imageUrl) {
            let imageBlock = new Adaptive.Image();
            imageBlock.url = this.imageUrl;
            card.addItem(imageBlock);
        }
        return card.toJSON();
    }
    render() {
        return html ``;
    }
};
__decorate([
    property()
], pwbadapcard.prototype, "text", void 0);
__decorate([
    property()
], pwbadapcard.prototype, "imageUrl", void 0);
pwbadapcard = __decorate([
    customElement('pwb-adapcard')
], pwbadapcard);
export { pwbadapcard };
//# sourceMappingURL=pwb-adapcard.js.map