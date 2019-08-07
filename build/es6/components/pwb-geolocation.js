var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, customElement, property } from 'lit-element';
let pwbgeolocation = class pwbgeolocation extends LitElement {
    getLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.currentPosition = position.coords;
                return position.coords;
            });
        }
        else {
            console.info("geolocation is not supported in this environment");
            return null;
        }
    }
    watchLocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.watchPosition((position) => {
                this.watchedPosition = position.coords;
                return position.coords;
            });
        }
        else {
            console.info("geolocation is not supported in this environment");
            return null;
        }
    }
    render() {
        return html ``;
    }
};
__decorate([
    property()
], pwbgeolocation.prototype, "currentPosition", void 0);
__decorate([
    property()
], pwbgeolocation.prototype, "watchedPosition", void 0);
pwbgeolocation = __decorate([
    customElement('pwb-geolocation')
], pwbgeolocation);
export { pwbgeolocation };
//# sourceMappingURL=pwb-geolocation.js.map