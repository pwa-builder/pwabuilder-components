import {
  LitElement, html, customElement, property
} from 'lit-element';

/**
 * Use the customElement decorator to define your class as
 * a custom element. Registers <my-element> as an HTML tag.
 */
@customElement('pwb-geolocation')
export class pwbgeolocation extends LitElement {

  @property() currentPosition: any;

  public getLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords);

        this.currentPosition = position.coords;
        return position.coords;
      })
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
    return html``
  }
}