import {
  LitElement, html, customElement, property
} from 'lit-element';

@customElement('pwb-share')
export class pwbshare extends LitElement {

  @property() title: string;
  @property() text: string;
  @property() url: string;

  public async share() {
    // have to cast to any here
    // because typescript lacks
    // types for the web share api
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({
          title: this.title,
          text: this.text,
          url: this.url,
        });
      } catch (err) {
        console.error('pwb-share: There was an error trying to share this content, make sure you pass a title, text and url');
      }
    }
  }

  render() {
    return html`<button @click="${() => this.share()}">Share</button>`;
  }
}