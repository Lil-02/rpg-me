import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import '@haxtheweb/rpg-character/rpg-character.js';
import { WiredButton, WiredCard } from "wired-elements";

export class RpgMe extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "rpg-me";
  }

  constructor() {
    super();
    this.title = "RPG Character Manager";
    this.t = { title: "Title" };
    this.seed = null;

    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/rpg-me.ar.json", import.meta.url).href + "/../",
      locales: ["ar", "es", "hi", "zh"],
    });

    this.characters = [this._createDefaultCharacter("John")];
  }

  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      seed: { type: String },
      characters: { type: Object },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: var(--ddd-theme-primary);
          background-color: var(--ddd-theme-accent);
          font-family: var(--ddd-font-navigation);
        }
        .wrapper {
          margin: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-4);
          border-radius: 10px;
          background: #dd8cec;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }
        .characters-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
        }
        .character-card {
          flex: 1 1 300px;
          padding: 20px;
        }
        wired-button {
          margin: 5px;
        }
        .character-inputs label {
          display: block;
          margin-bottom: 5px;
        }
        .character-inputs select,
        .character-inputs input {
          width: 90%;
          padding: 8px;
          margin-bottom: 20px;
        }
      `,
    ];
  }

  render() {
    return html`
      <wired-card class="wrapper">
        <h3>${this.title}</h3>
        <div class="characters-container">
          ${this.characters.map(
            (character, index) => html`
              <div class="character-card">
                <wired-card>
                  <h4>${character.name}</h4>
                  <rpg-character
                    .seed="${this.seed}"
                    .accessories="${character.accessories}"
                    .height="${character.height}"
                    .width="${character.width}"
                    .face="${character.face}"
                    .hair="${character.hair}"
                    .pants="${character.pants}"
                    .shirt="${character.shirt}"
                    .skin="${character.skin}"
                    .hat="${character.hat}"
                    .hatColor="${character.hatColor}"
                    .circle="${character.circle}"
                    .fire="${character.fire}"
                    .demo="${character.demo}"
                  ></rpg-character>
                  <div class="character-inputs">
                    <h5>Customize ${character.name}</h5>
                    ${Object.keys(character).map(
                      (prop) => html`
                        <label>
                          ${prop.charAt(0).toUpperCase() + prop.slice(1)}:
                          ${this._renderInput(prop, character[prop], index)}
                        </label>
                      `
                    )}
                  </div>
                </wired-card>
              </div>
            `
          )}
        </div>
      </wired-card>
    `;
  }

  _createDefaultCharacter(name) {
    return {
      name,
      height: 400,
      width: 400,
      accessories: 0,
      face: 0,
      hair: 0,
      pants: 0,
      shirt: 0,
      skin: 0,
      hat: "none",
      hatColor: 0,
      circle: false,
      fire: false,
      demo: false,
    };
  }

  _renderInput(prop, value, index) {
    const inputs = {
      hat: html`
        <select .value="${value}" @change="${(e) => this._onPropertyChange(e, prop, index)}">
          <option value="none">None</option>
          <option value="Bunny">Bunny</option>
          <option value="coffee">coffee</option>
          <option value="construction">construction</option>
          <option value="cowboy">cowboy</option>
          <option value="education">education</option>
          <option value="knight">knight</option>
          <option value="ninja">ninja</option>
          <option value="party">party</option>
          <option value="pirate">pirate</option>
          <option value="watermelon">watermelon</option>
          
        </select>
      `,
      circle: html`
        <input
          type="checkbox"
          .checked="${value}"
          @change="${(e) => this._onPropertyChange(e, prop, index)}"
        />
      `,
      default: html`
        <input
          type="${prop === "name" ? "text" : "number"}"
          .value="${value}"
          @input="${(e) => this._onPropertyChange(e, prop, index)}"
        />
      `,
    };
    return inputs[prop] || inputs.default;
  }

  _onPropertyChange(event, prop, index) {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    // Update the specific property of the character
    this.characters[index][prop] = value;
  
    // Update the seed based on the current character properties
    this.seed = this._generateSeedFromCharacter(this.characters[index]);
  
    // Request an update to re-render the component
    this.requestUpdate();
  }
  

  _shareCharacter() {
    const params = new URLSearchParams();
    params.append("seed", this.seed);
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?${params.toString()}`;

    navigator.clipboard.writeText(shareUrl)
      .then(() => alert(`Link copied to clipboard: ${shareUrl}`))
      .catch(() => alert(`Failed to copy the link. Here it is: ${shareUrl}`));
  }

  _generateSeed() {
    return String(Math.floor(Math.random() * 1e10)).padStart(10, "0");
  }

  _generateSeedFromCharacter(character) {
    const values = [
     
    ];
    return values.map(String).join("").padStart(10, "0");
  }
}

customElements.define(RpgMe.tag, RpgMe);

