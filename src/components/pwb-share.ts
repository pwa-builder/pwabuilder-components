import {
  css, LitElement, html, customElement, property
} from 'lit-element';

@customElement('pwb-share')
export class pwbshare extends LitElement {

  @property() title: string;
  @property() text: string;
  @property() url: string;

  static get styles() {
    return css`
      button {
        text-align: center;
        align-content: center;
        align-self: center;
        vertical-align: middle;
        justify-self: flex-end;
        min-width: 90px;
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

  public async share(): Promise<void> {
    if (this.title && this.text && this.url) {
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
          console.error(`pwb-share: ${err}`);
        }
      }
    }
    else {
      console.info('pwb-share: There was an error trying to share this content, make sure you pass a title, text and url like <pwb-share title="hello world" text="text to copy" url="https://microsoft.com" /> ');
    }
  }

  render() {
    return html`<button @click="${() => this.share()}">Share</button>`;
  }
}