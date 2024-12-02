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

    // Initialize multiple characters with common names
    this.characters = [
      this._createDefaultCharacter("John"),
      this._createDefaultCharacter("Alice"),
      this._createDefaultCharacter("Bob"),
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      characters: { type: Array },
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
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .characters-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
        }
        .character-card {
          flex: 1 1 300px;
          max-width: 400px;
          padding: 20px;
        }
        .character-controls {
          text-align: center;
          margin-bottom: 20px;
        }
        wired-button {
          margin: 5px;
        }
      `
    ];
  }

  render() {
    return html`
      <wired-card class="wrapper">
        <h3>${this.title}</h3>

        <!-- Display all characters in individual cards -->
        <div class="characters-container">
          ${this.characters.map(
            (character, index) => html`
              <div class="character-card">
                <wired-card>
                  <h4>${character.name}</h4>
                  <rpg-character
                    .accessories="${character.accessories}"
                    .height="${character.height}"
                    .width="${character.width}"
                    .base="${character.base}"
                    .face="${character.face}"
                    .faceItem="${character.faceItem}"
                    .hair="${character.hair}"
                    .pants="${character.pants}"
                    .shirt="${character.shirt}"
                    .skin="${character.skin}"
                    .hat="${character.hat}"
                    .hatColor="${character.hatColor}"
                    .walking="${character.walking}"
                    .leg="${character.leg}"
                    .speed="${character.speed}"
                    .circle="${character.circle}"
                    .fire="${character.fire}"
                    .demo="${character.demo}"
                  ></rpg-character>
                  <div class="character-inputs">
                    <h5>Customize ${character.name}</h5>
                    ${Object.keys(character).map(
                      (prop) => html`
                        <label for="${prop}">
                          ${prop.charAt(0).toUpperCase() + prop.slice(1)}:
                          <input
                            id="${prop}"
                            type="number"
                            .value="${character[prop]}"
                            @input="${(e) => this._onPropertyChange(e, prop, index)}"
                            min="0"
                            max="9"
                          />
                        </label>
                      `
                    )}
                  </div>
                </wired-card>
              </div>
            `
          )}
        </div>

        <!-- Add/Remove Character Controls -->
        <div class="character-controls">
          <wired-button @click="${this._addCharacter}">Add Character</wired-button>
          <wired-button
            @click="${this._removeCharacter}"
            ?disabled="${this.characters.length <= 1}"
          >
            Remove Character
          </wired-button>
        </div>
      </wired-card>
    `;
  }

  _createDefaultCharacter(name) {
    return {
      name: name,
      accessories: 0,
      height: 142,
      width: 113,
      base: 0,
      face: 0,
      faceItem: 0,
      hair: 0,
      pants: 0,
      shirt: 0,
      skin: 0,
      hat: "none",
      hatColor: 0,
      walking: false,
      leg: "",
      speed: 500,
      circle: false,
      fire: false,
      demo: false
    };
  }

  _onPropertyChange(event, prop, index) {
    const value = event.target.value;
    this.characters[index][prop] = value;
    this.requestUpdate();
  }

  _addCharacter() {
    // Add character with a default name from a list of common names
    const commonNames = ["John", "Alice", "Bob", "Emma", "Liam", "Sophia", "James", "Olivia"];
    const randomName = commonNames[Math.floor(Math.random() * commonNames.length)];
    this.characters.push(this._createDefaultCharacter(randomName));
    this.requestUpdate();
  }

  _removeCharacter() {
    if (this.characters.length > 1) {
      this.characters.pop();
      this.requestUpdate();
    }
  }
}

globalThis.customElements.define(RpgMe.tag, RpgMe);
