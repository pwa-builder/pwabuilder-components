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
let pwbinstall = class pwbinstall extends LitElement {
    constructor() {
        super(...arguments);
        this.openModal = false;
    }
    static get styles() {
        return css `
     #installModal {
      background: white;
      position: fixed;
      top: 6em;
      left: 12em;
      right: 12em;
      bottom: 6em;
      padding: 2em;
      font-family: sans-serif;
      box-shadow: 0 28px 48px rgba(0, 0, 0, .4);
     }

     #headerContainer {
      display: flex;
      align-items: center;
     }

     #headerContainer img {
      height: 6em;
      margin-right: 1em;
      background: lightgrey;
      border-radius: 10px;
      padding: 12px;
     }

     #buttonsContainer {
      display: flex;
      justify-content: flex-end;
      position: relative;
      bottom: -4em;
      right: -1em;
     }

     #installButton {
      background: #2b5797;
      color: white;
      border: none;
      font-size: 14px;
      padding-left: 20px;
      padding-right: 20px;
      padding-top: 9px;
      padding-bottom: 9px;
      border-radius: 5px;
      margin-right: 10px;
      text-transform: uppercase;
      outline: none;
      cursor: pointer;
     }

     #cancelButton {
      background: #ee1111;
      color: white;
      border: none;
      font-size: 14px;
      padding-left: 20px;
      padding-right: 20px;
      padding-top: 9px;
      padding-bottom: 9px;
      border-radius: 5px;
      margin-right: 10px;
      text-transform: uppercase;
      outline: none;
      cursor: pointer;
     }

     #screenshots img {
      height: 12em;
      margin-right: 12px;
     }

     #tagsDiv {
      margin-top: 1em;
      margin-bottom: 1em;
     }

     #desc {
      width: 34em;
     }

      #tagsDiv span {
        background: grey;
        color: white;
        padding-left: 12px;
        padding-right: 12px;
        padding-bottom: 4px;
        font-weight: bold;
        border-radius: 24px;
        margin-right: 12px;
        padding-top: 1px;
      }
    `;
    }
    firstUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.manifestPath) {
                yield this.getManifestData();
            }
            window.addEventListener('beforeinstallprompt', (e) => {
                console.log('e', e);
                // Prevent Chrome 67 and earlier from automatically showing the prompt
                e.preventDefault();
                // Stash the event so it can be triggered later.
                this.deferredPrompt = e;
            });
        });
    }
    getManifestData() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.manifestPath);
            const data = yield response.json();
            console.log(data);
            this.manifestData = data;
        });
    }
    openPrompt() {
        this.openModal = true;
    }
    install() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.deferredPrompt) {
                this.deferredPrompt.prompt();
                const choiceResult = yield this.deferredPrompt.userChoice;
                if (choiceResult.outcome === 'accepted') {
                    console.log('Your PWA has been installed');
                    return true;
                }
                else {
                    console.log('User chose to not install your PWA');
                    return false;
                }
            }
            else {
            }
        });
    }
    cancel() {
        this.openModal = false;
    }
    render() {
        return html `
      <button @click="${() => this.openPrompt()}">Install</button>

      ${this.openModal ?
            html `
          <div id="installModal">
          <div id="headerContainer">
          <img src="${this.iconPath}"></img>

          <div>
            <h1>${this.manifestData.name}</h1>

            ${this.manifestData.categories ? html `<div id="tagsDiv">
              ${this.manifestData.categories.map((tag) => {
                return html `
                  <span>${tag}</span>
                `;
            })}
            </div>` : null}

            <p id="desc">
              ${this.manifestData.description}
            </p>
          </div>
        </div>

        <div id="contentContainer">
          ${this.manifestData.screenshots ?
                html `
            <div>
              <h3>Screenshots</h3>
              <div id="screenshots">
                ${this.manifestData.screenshots.map((screen) => {
                    return html `
                        <img src="${screen.src}">
                      `;
                })}
              </div>
            </div>
            ` : null}
        </div>

        <div id="buttonsContainer">
          <button id="installButton" @click="${() => this.install()}">Install</button>
          <button id="cancelButton"  @click="${() => this.cancel()}">Cancel</button>
        </div>
          </div>
        `
            : null}
    `;
    }
};
__decorate([
    property()
], pwbinstall.prototype, "deferredPrompt", void 0);
__decorate([
    property()
], pwbinstall.prototype, "manifestPath", void 0);
__decorate([
    property()
], pwbinstall.prototype, "iconPath", void 0);
__decorate([
    property()
], pwbinstall.prototype, "manifestData", void 0);
__decorate([
    property()
], pwbinstall.prototype, "openModal", void 0);
pwbinstall = __decorate([
    customElement('pwb-install')
], pwbinstall);
export { pwbinstall };
//# sourceMappingURL=pwb-install.js.map