import {
  css, LitElement, html, customElement, property
} from 'lit-element';


@customElement('pwb-geolocation')
export class pwbgeolocation extends LitElement {

  @property() currentPosition: Coordinates;
  @property() watchedPosition: Coordinates;

  static get styles() {
    return css`
      :host {
        font-family: sans-serif;
      }

      #posDiv {
        text-align: center;
        align-content: center;
        align-self: center;
        vertical-align: middle;
        justify-self: flex-end;
        min-width: 223px;
        line-height: 200%;
        flex: 0 0 auto;
        display: inline-block;
        background: #0078d4;
        color: #ffffff;
        cursor: pointer;
        border: solid 1px rgba(0, 0, 0, 0);
      }
    `
  }

  firstUpdated() {
    console.log('first updated');
    this.getLocation();
  }

  public getLocation(): Coordinates | null {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        this.currentPosition = position.coords;
        return position.coords;
      })
    }
    else {
      console.info("geolocation is not supported in this environment");
      return null;
    }
  }

  public watchLocation(): Coordinates | null {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition((position: Position) => {
        this.watchedPosition = position.coords;
        return position.coords;
      })
    }
    else {
      console.info("geolocation is not supported in this environment");
      return null;
    }
  }

  render() {
    return html`
      <div id="posDiv">
        ${
          this.currentPosition ?  html`Location: <span>${this.currentPosition.latitude}, ${this.currentPosition.longitude}</span>` : 'Getting location...'
        }
      </div>
    `
  }
}