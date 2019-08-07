import {
  LitElement, html, customElement, property, css
} from 'lit-element';

@customElement('pwb-install')
export class pwbinstall extends LitElement {

  @property() deferredPrompt: any;
  @property() manifestPath: string;
  @property() iconPath: string;
  @property() manifestData: any;
  @property() openModal: boolean = false;

  static get styles() {
    return css`
     #installModal {
      background: white;
      position: fixed;
      top: 6em;
      left: 12em;
      right: 12em;
      bottom: 6em;
      padding: 2em;
      font-family: sans-serif;
      box-shadow: 0 28px 48px rgba(0, 0, 0, .4);
     }

     #headerContainer {
      display: flex;
      align-items: center;
     }

     #headerContainer img {
      height: 6em;
      margin-right: 1em;
      background: lightgrey;
      border-radius: 10px;
      padding: 12px;
     }

     #buttonsContainer {
      display: flex;
      justify-content: flex-end;
      position: relative;
      bottom: -4em;
      right: -1em;
     }

     #installButton {
      background: #2b5797;
      color: white;
      border: none;
      font-size: 14px;
      padding-left: 20px;
      padding-right: 20px;
      padding-top: 9px;
      padding-bottom: 9px;
      border-radius: 5px;
      margin-right: 10px;
      text-transform: uppercase;
      outline: none;
      cursor: pointer;
     }

     #cancelButton {
      background: #ee1111;
      color: white;
      border: none;
      font-size: 14px;
      padding-left: 20px;
      padding-right: 20px;
      padding-top: 9px;
      padding-bottom: 9px;
      border-radius: 5px;
      margin-right: 10px;
      text-transform: uppercase;
      outline: none;
      cursor: pointer;
     }

     #screenshots img {
      height: 12em;
      margin-right: 12px;
     }

     #tagsDiv {
      margin-top: 1em;
      margin-bottom: 1em;
     }

     #desc {
      width: 34em;
     }

      #tagsDiv span {
        background: grey;
        color: white;
        padding-left: 12px;
        padding-right: 12px;
        padding-bottom: 4px;
        font-weight: bold;
        border-radius: 24px;
        margin-right: 12px;
        padding-top: 1px;
      }
    `;
  }

  async firstUpdated(): Promise<void> {

    if (this.manifestPath) {
      await this.getManifestData();
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('e', e);
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
    });
  }

  async getManifestData() {
    const response = await fetch(this.manifestPath);
    const data = await response.json();

    console.log(data);
    this.manifestData = data;
  }

  openPrompt() {
    this.openModal = true;
  }

  public async install(): Promise<boolean> {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();

      const choiceResult = await this.deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        console.log('Your PWA has been installed');
        return true;
      } else {
        console.log('User chose to not install your PWA');
        return false;
      }
    }
    else {

    }
  }

  cancel() {
    this.openModal = false;
  }

  render() {
    return html`
      <button @click="${() => this.openPrompt()}">Install</button>

      ${
      this.openModal ?
        html`
          <div id="installModal">
          <div id="headerContainer">
          <img src="${this.iconPath}"></img>

          <div>
            <h1>${this.manifestData.name}</h1>

            ${this.manifestData.categories ? html`<div id="tagsDiv">
              ${this.manifestData.categories.map((tag) => {
          return html`
                  <span>${tag}</span>
                `
        })}
            </div>` : null}

            <p id="desc">
              ${this.manifestData.description}
            </p>
          </div>
        </div>

        <div id="contentContainer">
          ${this.manifestData.screenshots ?
            html`
            <div>
              <h3>Screenshots</h3>
              <div id="screenshots">
                ${
                this.manifestData.screenshots.map((screen) => {
                  return html`
                        <img src="${screen.src}">
                      `
                })}
              </div>
            </div>
            ` : null}
        </div>

        <div id="buttonsContainer">
          <button id="installButton" @click="${() => this.install()}">Install</button>
          <button id="cancelButton"  @click="${() => this.cancel()}">Cancel</button>
        </div>
          </div>
        `
        : null
      }
    `;
  }
}