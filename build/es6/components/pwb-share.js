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
import { LitElement, html, customElement, property } from 'lit-element';
let pwbshare = class pwbshare extends LitElement {
    share() {
        return __awaiter(this, void 0, void 0, function* () {
            // have to cast to any here
            // because typescript lacks
            // types for the web share api
            if (navigator.share) {
                try {
                    yield navigator.share({
                        title: this.title,
                        text: this.text,
                        url: this.url,
                    });
                }
                catch (err) {
                    console.error('pwb-share: There was an error trying to share this content, make sure you pass a title, text and url');
                }
            }
        });
    }
    render() {
        return html `<button @click="${() => this.share()}">Share</button>`;
    }
};
__decorate([
    property()
], pwbshare.prototype, "title", void 0);
__decorate([
    property()
], pwbshare.prototype, "text", void 0);
__decorate([
    property()
], pwbshare.prototype, "url", void 0);
pwbshare = __decorate([
    customElement('pwb-share')
], pwbshare);
export { pwbshare };
//# sourceMappingURL=pwb-share.js.map