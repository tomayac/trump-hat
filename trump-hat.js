/**
 * Copyright 2016 Thomas Steiner
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-env browser */
window.customElements.define('trump-hat', class extends HTMLElement {

  get embroidery() {
    return this.getAttribute('embroidery');
  }
  set embroidery(embroidery) {
    if (embroidery) {
      this.setAttribute('embroidery', embroidery);
    } else {
      this.removeAttribute('embroidery');
    }
  }

  get width() {
    return this.getAttribute('width');
  }
  set width(width) {
    if (width) {
      this.setAttribute('width', width);
    } else {
      this.removeAttribute('width');
    }
  }

  get height() {
    return this.getAttribute('height');
  }
  set height(height) {
    if (height) {
      this.setAttribute('height', height);
    } else {
      this.removeAttribute('height');
    }
  }

  get color() {
    return this.getAttribute('color');
  }
  set color(color) {
    if (color) {
      this.setAttribute('color', color);
    } else {
      this.removeAttribute('color');
    }
  }

  static get observedAttributes() {
    return ['embroidery', 'color', 'width', 'height'];
  }

  attributeChangedCallback(attrName) {
    if (attrName === 'color') {
      this.img.src = `${this.color}.png`;
      this.style.setProperty('--text-color', this.color === 'red' ?
          'white' : 'black');
    } else if (attrName === 'embroidery') {
      this.figcaption.innerHTML = this.embroidery.replace(/\\n/g, '<br>');
    } else if (attrName === 'width' || attrName === 'height') {
      const [, value, unit] = this[attrName].match(
          /^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/);
      if ((attrName === 'width')) {
        this.style.setProperty('--hat-width', this.width);
        this.style.setProperty('--hat-height', (value / this.ratio) + unit);
      } else {
        this.style.setProperty('--hat-height', this.height);
        this.style.setProperty('--hat-width', (value * this.ratio) + unit);
      }
      this._adjustFontSize();
    }
  }

  /* eslint no-useless-constructor: 0 */
  constructor() {
    super();
  }

  connectedCallback() {
    // Attach a shadow root to the element.
    let shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = `
      <style>
        :host {
          --hat-width: ${this.width ? this.width : 'auto'};
          --hat-height: ${this.height ? this.height : 'auto'};
          --text-color: ${this.color === 'red' ? 'white' : 'black'};
        }
        * {
          box-sizing: border-box;
        }
        figure {
          height: var(--hat-height);
          width: var(--hat-width);
        }
        img {
          height: var(--hat-height);
          width: var(--hat-width);
        }
        figcaption {
          font-family: Times New Roman, serif;
          font-weight: bold;
          text-shadow: 1px 1px 1px #ccc;
          position: relative;
          top: calc(-0.75 * var(--hat-height));
          color: var(--text-color);
          text-align: center;
        }
      </style>
      <figure>
        <img src="${this.color === 'red' ? 'red' : 'white'}.png">
        <figcaption>${this.embroidery.replace(/\\n/g, '<br>')}</figcaption>
      </figure>`;

    this.img = this.shadowRoot.querySelector('img');
    this.figcaption = this.shadowRoot.querySelector('figcaption');
    this.style = this.shadowRoot.host.style;
    this.img.addEventListener('load', () => {
      this.ratio = this.img.width / this.img.height;
      const [, value, unit] = this.width.match(
          /^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/);
      this.style.setProperty('--hat-height', (value / this.ratio) + unit);
      this._adjustFontSize();
    });
  }

  _adjustFontSize() {
    const numChars = Math.ceil(this.figcaption.textContent.trim().length / 2);
    this.figcaption.style.fontSize = `${(parseFloat(getComputedStyle(
        this.img).width.replace('px', '')) / numChars / 16)}em`;
  }
});
