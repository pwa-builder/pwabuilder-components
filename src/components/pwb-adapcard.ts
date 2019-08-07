import {
  LitElement, html, customElement, property, css
} from 'lit-element';

import * as Adaptive from 'adaptivecards';

import { get, set } from 'idb-keyval';

@customElement('pwb-adapcard')
export class pwbadapcard extends LitElement {

  @property() text: string;
  @property() imageUrl: string;
  @property() cardsToRender: any[];
  @property() title: string = "Cards";

  static getStyles() {
    return css`
      h3 {
        font-family: sans-serif;
      }
    `
  }

  async firstUpdated() {
    await this.getCards();
  }

  public async createCard(): Promise<any> {
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

    await this.storeCard(cardJSON);

    await this.getCards()

    return cardJSON;
  }

  async storeCard(cardJSON): Promise<void> {
    let cards: any[] = await get("pwbCards");

    if (cards) {
      cards.push(cardJSON);
    }
    else {
      await set("pwbCards", [cardJSON]);
    }
  }

  async getCards() {
    const jsonCards: any[] = await get("pwbCards");

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
  }

  render() {
    return html`
      <div>
        <h3>${this.title}</h3>
      </div>
      <ul>
      ${
      this.cardsToRender ?
        html`
           ${
          this.cardsToRender.map((card) => {
            return html`
               ${card}
               `
          })
          }
         `
        : null
      }
      </ul>
    `;
  }
}