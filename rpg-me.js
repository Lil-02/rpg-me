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
        .character-inputs label {
          display: block;
          margin-bottom: 10px;
        }
        .character-inputs select,
        .character-inputs input {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
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
      name,
      accessories: 0,
      height: 142,
      width: 113,
      base: false, // checkbox
      face: 0, // Dropdown 0-5
      faceItem: 0, // Dropdown 0-9
      hair: 0, // Dropdown 0-9
      pants: 0, // Dropdown 0-9
      shirt: 0, // Dropdown (shirt options)
      skin: 0, // Dropdown (skin options)
      hat: "none", // Default hat
      hatColor: 0, // Dropdown for hat color
      base: false, // Number input
      circle: true, // Checkbox
      fire: false, // Checkbox
      demo: false, // Checkbox
    };
  }

  _renderInput(prop, value, index) {
    switch (prop) {
      case "hat":
        return html`
          <select
            .value="${value}"
            @change="${(e) => this._onPropertyChange(e, prop, index)}"
          >
            <option value="none">None</option>
            <option value="bunny">Bunny</option>
            <option value="cowboy">Cowboy</option>
            <option value="education">Education</option>
            <option value="construction">Construction</option>
            <option value="warning">Warning</option>
            <option value="watermelon">Watermelon</option>
            <option value="coffee">Coffee</option>
            <option value="knight">Knight</option>
            <option value="ninja">Ninja</option>
            <option value="party">Party</option>
            <option value="pirate">Pirate</option>
            <option value="error">Error</option>
            <option value="edit">Edit</option>
          </select>
        `;
      case "hatColor":
        return html`
          <select
            .value="${value}"
            @change="${(e) => this._onPropertyChange(e, prop, index)}"
          >
            <option value= 0 >Grey</option>
            <option value= 1>Red</option>
            <option value= 2>Blue</option>
            <option value= 3>Black</option>
            <option value= 4>Teal</option>
            <option value= 5>Yellow</option>
            <option value= 6>Purple</option>
            <option value= 7>Green</option>
            <option value= 8>Orange</option>
            <option value= 9>Pink</option>
          </select>
        `;
      case "pants":
        return html`
          <select
            .value="${value}"
            @change="${(e) => this._onPropertyChange(e, prop, index)}"
          >
            <option value= 0 >Grey</option>
            <option value= 1>Red</option>
            <option value= 2>Blue</option>
            <option value= 3>Black</option>
            <option value= 4>Teal</option>
            <option value= 5>Yellow</option>
            <option value= 6>Purple</option>
            <option value= 7>Green</option>
            <option value= 8>Orange</option>
            <option value= 9>Pink</option>
          </select>
        `;
      case "shirt":
        return html`
          <select
            .value="${value}"
            @change="${(e) => this._onPropertyChange(e, prop, index)}"
          >
            <option value= 0 >black short sleeve</option>
            <option value= 1>white tank top </option>
            <option value= 2>white striped shirt</option>
            <option value= 3>Salmon short sleeve</option>
            <option value= 4>salmon long sleeve</option>
            <option value= 5>blue long sleeve</option>
            <option value= 6>white long sleeve</option>
            <option value= 7>blue short sleeve</option>
            <option value= 8>white short sleeve</option>
            <option value= 9>black long sleeve</option>
          </select>
        `;
      case "skin":
        return html`
          <select
            .value="${value}"
            @change="${(e) => this._onPropertyChange(e, prop, index)}"
          >
            <option value= 0 >pale</option>
            <option value= 1>white</option>
            <option value= 2>grey</option>
            <option value= 3>light brown</option>
            <option value= 4>brown</option>
            <option value= 5>dark brown</option>
            <option value= 6>yellow</option>
            <option value= 7>blue</option>
            <option value= 8>green</option>
            <option value= 9>Pink</option>
          </select>
        `;
    
      case "face":
        return html`
        <select
          .value="${value}"
          @change="${(e) => this._onPropertyChange(e, prop, index)}"
        >
          <option value= 0 >nothing</option>
          <option value= 1>mustache</option>
          <option value= 2>bruh</option>
          <option value= 3>sad</option>
          <option value= 4>nose and bruh</option>
          <option value= 5>happy</option>
        </select>
      `;
      case "faceItem":
        return html`
        <select
          .value="${value}"
          @change="${(e) => this._onPropertyChange(e, prop, index)}"
        >
          <option value= 0 >nothing</option>
          <option value= 1>white necklace</option>
          <option value= 2>brown bowtie</option>
          <option value= 3>black bowtie</option>
          <option value= 4>blue bowtie</option>
          <option value= 5>blue tie</option>
          <option value= 6>brown tie</option>
          <option value= 7>purple tie</option>
          <option value= 8>necklace with gold gem</option>
          <option value= 9>necklace with green gem</option>
        </select>
      `;
      case "hair":
        return html`
        <select
          .value="${value}"
          @change="${(e) => this._onPropertyChange(e, prop, index)}"
        >
          <option value= 0 >grey</option>
          <option value= 1>black</option>
          <option value= 2>auburn</option>
          <option value= 3>light brown</option>
          <option value= 4>gold</option>
          <option value= 5>green</option>
          <option value= 6>teal</option>
          <option value= 7>purple</option>
          <option value= 8>brown</option>
          <option value= 9>blonde</option>
        </select>
      `;
      case "accessories":
        return html`
        <select
          .value="${value}"
          @change="${(e) => this._onPropertyChange(e, prop, index)}"
        >
          <option value= 0 >nothing</option>
          <option value= 1>white necklace</option>
          <option value= 2>brown bowtie</option>
          <option value= 3>black bowtie</option>
          <option value= 4>blue bowtie</option>
          <option value= 5>blue tie</option>
          <option value= 6>brown tie</option>
          <option value= 7>purple tie</option>
          <option value= 8>necklace with gold gem</option>
          <option value= 9>necklace with green gem</option>
        </select>
      `;
     
     case "circle":
      case "fire":
      case "demo":
      case "base":
      case "walking":
        return html`
          <input
            type="checkbox"
            .checked="${value}"
            @change="${(e) => this._onPropertyChange(e, prop, index)}"
          />
        `;
      default:
        return html`
          <input
            type="${prop === "name" ? "text" : "number"}"
            .value="${value}"
            @input="${(e) => this._onPropertyChange(e, prop, index)}"
            min="${prop === "name" ? '' : '0'}"
          />
        `;
    }
  }

  _getOptionsForProp(prop) {
    switch (prop) {
      case "hatColor":
        return [
          "grey", "red", "blue", "black", "teal", "yellow", "purple", "green", "orange", "pink"
        ];
      case "shirt":
        return [
          "black short sleeve", "white tank top", "white striped shirt", "Salmon short sleeve", "salmon long sleeve",
          "blue long sleeve", "white long sleeve", "blue short sleeve", "white short sleeve", "black long sleeve"
        ];
      case "skin":
        return [
          "pale", "white", "grey", "light brown", "brown", "dark brown", "yellow", "blue", "green", "pink"
        ];
        case "hair":
        return [
          "grey", "black", "auburn", "light brown", "gold", "green", "teal", "brown", "purple","blonde"
        ];
        case "face":
        return [
          "nothing", "mustache", "bruh", "sad", "nose and bruh", "happy"
        ];
      default:
        return [];
    }
  }

  _onPropertyChange(event, prop, index) {
    const value =
      prop === "name" || prop === "demo" || prop === "base" || prop === "fire" 
        ? event.target.value
        : event.target.type === "checkbox"
        ? event.target.clicked
        : Number(event.target.value);
    this.characters[index][prop] = value;
    this.requestUpdate();
  }

  _addCharacter() {
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
