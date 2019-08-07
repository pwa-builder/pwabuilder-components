var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LitElement, html, customElement, property, css } from 'lit-element';
import * as Adaptive from 'adaptivecards';
import { get, set } from 'idb-keyval';
let pwbadapcard = class pwbadapcard extends LitElement {
    constructor() {
        super(...arguments);
        this.title = "Cards";
    }
    static getStyles() {
        return css `
      h3 {
        font-family: sans-serif;
      }
    `;
    }
    firstUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getCards();
        });
    }
    createCard() {
        return __awaiter(this, void 0, void 0, function* () {
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
            const cardJSON = card.toJSON();
            yield this.storeCard(cardJSON);
            yield this.getCards();
            return cardJSON;
        });
    }
    storeCard(cardJSON) {
        return __awaiter(this, void 0, void 0, function* () {
            let cards = yield get("pwbCards");
            if (cards) {
                cards.push(cardJSON);
            }
            else {
                yield set("pwbCards", [cardJSON]);
            }
        });
    }
    getCards() {
        return __awaiter(this, void 0, void 0, function* () {
            const jsonCards = yield get("pwbCards");
            let tempCards = [];
            if (jsonCards && jsonCards.length > 0) {
                jsonCards.forEach((cardJSON) => {
                    let card = new Adaptive.AdaptiveCard();
                    card.parse(cardJSON);
                    let renderedCard = card.render();
                    tempCards.push(renderedCard);
                });
                this.cardsToRender = tempCards;
            }
        });
    }
    render() {
        return html `
      <div>
        <h3>${this.title}</h3>
      </div>
      <ul>
      ${this.cardsToRender ?
            html `
           ${this.cardsToRender.map((card) => {
                return html `
               ${card}
               `;
            })}
         `
            : null}
      </ul>
    `;
    }
};
__decorate([
    property()
], pwbadapcard.prototype, "text", void 0);
__decorate([
    property()
], pwbadapcard.prototype, "imageUrl", void 0);
__decorate([
    property()
], pwbadapcard.prototype, "cardsToRender", void 0);
__decorate([
    property()
], pwbadapcard.prototype, "title", void 0);
pwbadapcard = __decorate([
    customElement('pwb-adapcard')
], pwbadapcard);
export { pwbadapcard };
//# sourceMappingURL=pwb-adapcard.js.map