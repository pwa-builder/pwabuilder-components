import {
  css, LitElement, html, customElement, property
} from 'lit-element';

@customElement('pwb-clipboard')
export class pwbclipboard extends LitElement {

  @property()
  textToCopy: string;

  static get styles() {
    return css`
      button {
        text-align: center;
        align-content: center;
        align-self: center;
        vertical-align: middle;
        justify-self: flex-end;
        max-width: 90px;
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

  public async copyText(): Promise<void> {
    if (navigator.clipboard) {
      try {
        if (this.textToCopy) {
          await navigator.clipboard.writeText(this.textToCopy);
        }
        else {
          console.info("pwb-clipboard: You must pass the property textToCopy. Something like <pwb-clipboard texttocopy='hello world' />");
        }
      }
      catch (err) {
        console.error(err);
      }
    }
  }

  public async readText(): Promise<string> {
    if (navigator.clipboard) {
      try {
        const clipboardText = await navigator.clipboard.readText();

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
  }

  render() {
    /**
     * Use JavaScript expressions to include property values in
     * the element template.
     */
    return html`
      <button @click="${() => this.copyText()}">
        <slot>
          Copy
        </slot>
      </button>
    `;
  }
}