import {
  LitElement, html, customElement, property
} from 'lit-element';

@customElement('pwb-install')
export class pwbinstall extends LitElement {

  @property()
  deferredPrompt: any;

  firstUpdated(): void {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('e', e);
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
    });
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
  }

  render() {
    return html`<button @click="${() => this.install()}">Install</button>`;
  }
}