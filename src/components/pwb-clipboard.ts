import {
  LitElement, html, customElement, property
} from 'lit-element';

@customElement('pwb-clipboard')
export class pwbclipboard extends LitElement {

  @property()
  textToCopy: string;

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
      <button @click="${() => this.copyText()}">Copy</button>
    `;
  }
}