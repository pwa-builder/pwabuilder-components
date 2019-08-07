import {
  LitElement, html, customElement, property
} from 'lit-element';

import * as Adaptive from 'adaptivecards';

@customElement('pwb-adapcard')
export class pwbadapcard extends LitElement {

  @property() text: string;
  @property() imageUrl: string;

  public createCard(): any {
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
    return html``;
  }
}