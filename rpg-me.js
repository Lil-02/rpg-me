
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import '@haxtheweb/rpg-character/rpg-character.js';
import "wired-elements";

export class RpgMe extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "rpg-me";
  }

  constructor() {
    super();
    this.title = "RPG Character Manager";
    this.seed = this.getSeedFromURL() || this.generateSeed();
    this.characterSettings = this.parseSeed(this.seed);
  }

  static get properties() {
    return {
      title: { type: String },
      seed: { type: String },
      characterSettings: { type: Object },
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
          box-shadow: 100 4px 6px rgba(0, 0, 0, 0.2);
        }
        .characters-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
        }
        .character-card {
          flex: 1 1 300px;
          max-width: 8000px;
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
          margin-bottom: 5px;
        }
        .character-inputs select,
        .character-inputs input {
          width: 90%;
          padding: 8px;
          margin-bottom: 20px;
        }
      `
    ];
  }

  // Extract seed from URL parameters
  getSeedFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("seed");
  }

  // Generate a random 10-digit seed
  generateSeed() {
    return Array(12)
      .fill(0)
      .map(() => Math.floor(Math.random() * 10))
      .join("");
  }

  // Parse the seed into character settings
  parseSeed(seed) {
    const attributes = [
      "accessories",
      "base",
      "face",
      "hair",
      "pants",
      "shirt",
      "skin",
      "hatcolor",
    ];

    // Parse numeric attributes
    const settings = {};
    attributes.forEach((attr, index) => {
      settings[attr] = parseInt(seed[index] || "0", 10);
    });

    // Parse boolean attributes
    const bools = seed.slice(attributes.length).split("");
    settings.circle = bools[0] === "1";
    settings.fire = bools[1] === "1";

    // Parse hat
    const hatIndex = parseInt(bools[2], 10);
    settings.hat = [
      "none",
      "bunny",
      "coffee",
      "construction",
      "cowboy",
      "education",
      "knight",
      "ninja",
      "party",
      "pirate",
      "watermelon",
    ][hatIndex] || "none";

    return settings;
  }

  // Update a character setting and regenerate the seed
  updateCharacterSetting(key, value) {
    const updatedValue = key === "circle" || key === "fire" ? value.target.checked : value.target.value;
    this.characterSettings = { ...this.characterSettings, [key]: updatedValue };
    this.seed = this.generateSeedFromSettings();
    this.updateURL();
    this.requestUpdate();
  }

  // Generate a seed from character settings
  generateSeedFromSettings() {
    const attributes = [
      "accessories",
      "base",
      "face",
      "faceitem",
      "hair",
      "pants",
      "shirt",
      "skin",
      "hatcolor",
    ];
    const bools = [
      this.characterSettings.circle ? "1" : "0",
      this.characterSettings.fire ? "1" : "0",
      [
        "none",
        "bunny",
        "coffee",
        "construction",
        "cowboy",
        "education",
        "knight",
        "ninja",
        "party",
        "pirate",
        "watermelon",
      ].indexOf(this.characterSettings.hat),
    ];

    return (
      attributes
        .map((attr) => this.characterSettings[attr].toString().padStart(1, "0"))
        .join("") + bools.join("")
    );
  }

  // Update the URL to reflect the current seed
  updateURL() {
    const params = new URLSearchParams(window.location.search);
    params.set("seed", this.seed);
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
  }

  // Share the character via a URL
  shareCharacter() {
    const shareUrl = `${window.location.origin}${window.location.pathname}?seed=${this.seed}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert(`Link copied to clipboard: ${shareUrl}`);
    });
  }

  render() {
    return html`
      <div class="wrapper">
        <h1>${this.title}</h1>
        <rpg-character
          .accessories="${this.characterSettings.accessories}"
          .base="${this.characterSettings.base}"
          .face="${this.characterSettings.face}"
          .hair="${this.characterSettings.hair}"
          .pants="${this.characterSettings.pants}"
          .shirt="${this.characterSettings.shirt}"
          .skin="${this.characterSettings.skin}"
          .hat="${this.characterSettings.hat}"
          .hatcolor="${this.characterSettings.hatcolor}"
          .circle="${this.characterSettings.circle}"
          .fire="${this.characterSettings.fire}"
        ></rpg-character>
        <div>
          <wired-button @click="${this.shareCharacter}">Share Character</wired-button>
        </div>
        <div class="character-inputs">
          <h3>Customize Character</h3>
          ${this._renderInputs()}
        </div>
      </div>
    `;
  }

  _renderInputs() {
    const options = {
      hat: [
        "none",
        "bunny",
        "coffee",
        "construction",
        "cowboy",
        "education",
        "knight",
        "ninja",
        "party",
        "pirate",
        "watermelon",
      ],
    };

    return html`
      ${Object.entries(this.characterSettings).map(([key, value]) =>
        key === "hat"
          ? html`
              <label>
                ${key.charAt(0).toUpperCase() + key.slice(1)}:
                <select
                  .value="${value}"
                  @change="${(e) => this.updateCharacterSetting(key, e)}"
                >
                  ${options.hat.map(
                    (option) =>
                      html`<option value="${option}">${option}</option>`
                  )}
                </select>
              </label>
            `
          : typeof value === "boolean"
          ? html`
              <label>
                ${key.charAt(0).toUpperCase() + key.slice(1)}:
                <input
                  type="checkbox"
                  .checked="${value}"
                  @change="${(e) => this.updateCharacterSetting(key, e)}"
                />
              </label>
            `
          : html`
              <label>
                ${key.charAt(0).toUpperCase() + key.slice(1)}:
                <input
                  type="number"
                  .value="${value}"
                  @input="${(e) => this.updateCharacterSetting(key, e)}"
                />
              </label>
            `
      )}
    `;
  }
}

customElements.define(RpgMe.tag, RpgMe);

