import {
  LitElement, html, customElement, property
} from 'lit-element';


@customElement('pwb-geolocation')
export class pwbgeolocation extends LitElement {

  @property() currentPosition: Coordinates;
  @property() watchedPosition: Coordinates;

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
    return html``
  }
}