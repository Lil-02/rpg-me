import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/rpg-character/rpg-character.js";
import "wired-elements";

export class RpgMe extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "rpg-me";
  }

  constructor() {
    super();
    this.title = "RPG Character Manager";
    const urlSeed = this.getSeedFromURL();
    this.seed = urlSeed || this.generateSeed();
    this.characterSettings = this.parseSeed(this.seed);
    if (!urlSeed) {
      this.updateURL(); // Ensure the URL reflects the default seed
    }
  }
  

  static get properties() {
    return {
      title: { type: String },
      seed: { type: String },
      characterSettings: { type: Object },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
        color: #333;
      }
      .wrapper {
        max-width: 800px;
        margin: auto;
        background: #f9f9f9;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      }
      wired-button {
        margin: 10px 0;
      }
      .character-inputs label {
        display: block;
        margin-bottom: 10px;
      }
      .character-inputs input,
      .character-inputs select {
        width: 100%;
        padding: 8px;
        margin: 5px 0;
      }
    `;
  }

  getSeedFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("seed");
  }

  generateSeed() {
    const numericAttributes = [
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

    const numericSeed = numericAttributes
      .map(() => Math.floor(Math.random() * 10).toString())
      .join("");

    const boolSeed = `${Math.random() < 0.5 ? "0" : "1"}${Math.random() < 0.5 ? "0" : "1"}`;

    const hatIndex = Math.floor(Math.random() * 11).toString().padStart(2, "0");

    return numericSeed + boolSeed + hatIndex;
  }

  parseSeed(seed) {
    const numericAttributes = [
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

    const settings = {};

    numericAttributes.forEach((attr, index) => {
      settings[attr] = parseInt(seed[index] || "0", 10);
    });

    settings.circle = seed[numericAttributes.length] === "1";
    settings.fire = seed[numericAttributes.length + 1] === "1";

    const hatIndex = parseInt(seed.slice(-2), 10);
    const hats = [
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
    ];

    settings.hat = hats[hatIndex] || "none";

    return settings;
  }

  generateSeedFromSettings() {
    const numericAttributes = [
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

    const numericSeed = numericAttributes
      .map((attr) => this.characterSettings[attr].toString().padStart(1, "0"))
      .join("");

    const boolSeed = `${this.characterSettings.circle ? "1" : "0"}${this.characterSettings.fire ? "1" : "0"}`;

    const hatIndex = [
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
    ].indexOf(this.characterSettings.hat);

    const hatSeed = hatIndex.toString().padStart(2, "0");

    return numericSeed + boolSeed + hatSeed;
  }

  updateCharacterSetting(key, value) {
    const updatedValue =
      key === "circle" || key === "fire" ? value.target.checked : value.target.value;
    this.characterSettings = { ...this.characterSettings, [key]: updatedValue };
    this.seed = this.generateSeedFromSettings();
    this.updateURL();
    this.requestUpdate();
  }

  updateURL() {
    const params = new URLSearchParams(window.location.search);
    params.set("seed", this.seed);
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
  }

  copyLink() {
    const shareUrl = `${window.location.origin}${window.location.pathname}?seed=${this.seed}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert(`Link copied to clipboard: ${shareUrl}`);
    });
  }
  shareToTwitter() {
    const shareUrl = `${window.location.origin}${window.location.pathname}?seed=${this.seed}`;
    const message = `Check out this RPG character I created! Customize your own: ${shareUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(twitterUrl, "_blank");
  }
  
  shareToLinkedIn() {
    const shareUrl = `${window.location.origin}${window.location.pathname}?seed=${this.seed}`;
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=RPG Character&summary=Check out this RPG character I've created!`;
    window.open(linkedInUrl, "_blank");
  }
  
  shareToInstagram() {
    const shareUrl = `${window.location.origin}${window.location.pathname}?seed=${this.seed}`;
    alert(`Instagram doesn't support direct URL sharing. Please share this link manually in your story or post: ${shareUrl}`);
  }
  
  render() {
    return html`
      <div class="wrapper">
        <h1>${this.title}</h1>
        <rpg-character
          .accessories="${this.characterSettings.accessories}"
          .base="${this.characterSettings.base}"
          .face="${this.characterSettings.face}"
          .faceitem="${this.characterSettings.faceitem}"
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
        <wired-button @click="${this.copyLink}">Copy Link</wired-button>  
        <wired-button @click="${this.shareToTwitter}">Share on Twitter</wired-button>
          <wired-button @click="${this.shareToLinkedIn}">Share on LinkedIn</wired-button>
          <wired-button @click="${this.shareToInstagram}">Share on Instagram</wired-button>
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
                      html`<option value="${option}" ?selected="${value === option}">
                        ${option}
                      </option>`
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
