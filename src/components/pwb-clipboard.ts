import {
  css, LitElement, html, customElement, property
} from 'lit-element';

@customElement('pwb-clipboard')
export class pwbclipboard extends LitElement {

  @property()
  textToCopy: string;
  @property() textCopied: boolean = false;

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

  public async copyText(): Promise<void> {
    if (navigator.clipboard) {
      try {
        if (this.textToCopy) {
          await navigator.clipboard.writeText(this.textToCopy);

          this.textCopied = true;

          setTimeout(() => {
            this.textCopied = false;
          }, 1200);
        }
        else {
          console.info("pwb-clipboard: You must pass the property textToCopy, like <pwb-clipboard texttocopy='hello world' />");
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
    return html`
      <button @click="${() => this.copyText()}">
       ${
      this.textCopied ? html`
           Copied!
        ` : html`
          <slot>
            Copy
          </slot>
        `
      }
      </button>
    `;
  }
}