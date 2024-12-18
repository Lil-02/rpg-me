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
   this.characters = [this._createDefaultCharacter("John")];  
   this._readSeedFromUrl();  
  }  
  
  static get properties() {  
   return {  
    ...super.properties,  
    title: { type: String },  
    characters: { type: Array },  
    seed: { type: String },  
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
  
  // Update a character setting and regenerate the seed  
  _onPropertyChange(event, prop, index) {  
   const value =  
    prop === "name"  
      ? event.target.value  
      : event.target.type === "checkbox"  
      ? event.target.checked  
      : Number.isNaN(Number(event.target.value))  
      ? event.target.value  
      : Number(event.target.value);  
  
   // Update the specific property of the character  
   this.characters[index] = {  
    ...this.characters[index],  
    [prop]: value,  
   };  
  
   // Regenerate the seed  
   this._generateSeedFromSettings();  
  
   // Request an update to re-render  
   this.requestUpdate();  
  }  
  
  // Generate a seed from character settings  
  _generateSeedFromSettings() {  
   const attributes = [  
    "accessories",  
    "face",  
    "hair",  
    "pants",  
    "shirt",  
    "skin",  
    "hatColor",  
   ];  
   const bools = [  
    this.characters[0].circle ? "1" : "0",  
    this.characters[0].fire ? "1" : "0",  
   ];  
   const hatIndex = [  
    "none",  
    "Bunny",  
    "Cowboy",  
    "Education",  
    "Construction",  
    "Warning",  
    "Watermelon",  
    "Coffee",  
    "Knight",  
    "Ninja",  
    "Party",  
    "Pirate",  
    "Error",  
    "Edit",  
   ].indexOf(this.characters[0].hat);  
  
   this.seed = (  
    attributes  
      .map((attr) => this.characters[0][attr].toString().padStart(1, "0"))  
      .join("") + bools.join("") + hatIndex.toString().padStart(2, "0")  
   ).padStart(10, "0");  
   this._updateURL();  
  }  
  
  // Read the seed from the URL  
  _readSeedFromUrl() {  
   const params = new URLSearchParams(window.location.search);  
   const seed = params.get("seed");  
   if (seed) {  
    this.seed = seed;  
    this._applySeedToCharacter();  
   }  
  }  
  
  // Apply the seed to the character  
  _applySeedToCharacter() {  
   const attributes = [  
    "accessories",  
    "face",  
    "hair",  
    "pants",  
    "shirt",  
    "skin",  
    "hatColor",  
   ];  
   const bools = ["circle", "fire"];  
  
   attributes.forEach((attr, index) => {  
    this.characters[0][attr] = Number(this.seed[index]);  
   });  
  
   bools.forEach((bool, index) => {  
    this.characters[0][bool] = this.seed[attributes.length + index] === "1";  
   });  
  
   const hatIndex = Number(this.seed.slice(8, 10));  
   this.characters[0].hat = [  
    "none",  
    "Bunny",  
    "Cowboy",  
    "Education",  
    "Construction",  
    "Warning",  
    "Watermelon",  
    "Coffee",  
    "Knight",  
    "Ninja",  
    "Party",  
    "Pirate",  
    "Error",  
    "Edit",  
   ][hatIndex];  
  
   this.requestUpdate();  
  }  
  
  // Update the URL to reflect the current seed  
  _updateURL() {  
   const params = new URLSearchParams(window.location.search);  
   params.set("seed", this.seed);  
   window.history.replaceState({}, "", `${window.location.pathname}?${params}`);  
  }  
  
  // Share the character via a URL  
  shareCharacter() {  
   const shareUrl = `$${window.location.origin}$$ {window.location.pathname}?seed=${this.seed}`;  
   navigator.clipboard.writeText(shareUrl).then(() => {  
    alert(`Link copied to clipboard: ${shareUrl}`);  
   });  
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
  
      <!-- Share button -->  
      <div>  
       <wired-button @click="${this.shareCharacter}">Share Character</wired-button>  
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
    face: 0, // Dropdown 0-5  
    hair: 0, // Dropdown 0-9  
    pants: 0, // Dropdown 0-9  
    shirt: 0, // Dropdown (shirt options)  
    skin: 0, // Dropdown (skin options)  
    hat: "none", // Default hat  
    hatColor: 0, // Dropdown for hat color  
    circle: false, // Checkbox  
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
        <option value="none">Normal</option>  
        <option value="Bunny">Bunny</option>  
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
    // Repeat similar logic for other properties...  
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
}  
  
globalThis.customElements.define(RpgMe.tag, RpgMe);
