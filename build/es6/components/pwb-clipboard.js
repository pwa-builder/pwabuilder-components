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
let pwbclipboard = class pwbclipboard extends LitElement {
    copyText() {
        return __awaiter(this, void 0, void 0, function* () {
            if (navigator.clipboard) {
                try {
                    if (this.textToCopy) {
                        yield navigator.clipboard.writeText(this.textToCopy);
                    }
                    else {
                        console.info("pwb-clipboard: You must pass the property textToCopy. Something like <pwb-clipboard texttocopy='hello world' />");
                    }
                }
                catch (err) {
                    console.error(err);
                }
            }
        });
    }
    readText() {
        return __awaiter(this, void 0, void 0, function* () {
            if (navigator.clipboard) {
                try {
                    const clipboardText = yield navigator.clipboard.readText();
                    if (clipboardText) {
                        return clipboardText;
                    }
                    else {
                        return null;
                    }
                }
                catch (err) {
                    console.error(err);
                }
            }
        });
    }
    render() {
        /**
         * Use JavaScript expressions to include property values in
         * the element template.
         */
        return html `
      <button @click="${() => this.copyText()}">Copy</button>
    `;
    }
};
__decorate([
    property()
], pwbclipboard.prototype, "textToCopy", void 0);
pwbclipboard = __decorate([
    customElement('pwb-clipboard')
], pwbclipboard);
export { pwbclipboard };
//# sourceMappingURL=pwb-clipboard.js.map