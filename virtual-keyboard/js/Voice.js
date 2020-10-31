/* eslint-disable import/extensions */
import * as storage from './storage.js';
import Key from './Key.js';
import langDict from './layouts/voiceLanguages/index.js';

export default class Voice {
  constructor(langCode, output) {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.isActive = storage.get('kbIsVoiceAtcive', false);
    this.langCode = langCode;
    this.output = output;

    this.recognition = new SpeechRecognition();
    this.recognition.interimResults = true;
    this.recognition.lang = this.#getLangByCode(langCode);

    this.recognition.addEventListener('result', (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');

      const poopScript = transcript.replace(/poop|poo|shit|dump/gi, '💩');

      if (e.results[0].isFinal) {
        this.#printWord(poopScript);
      }
    });
    this.recognition.addEventListener('end', this.recognition.start);

    if (this.isActive) {
      this.recognition.start();
    }

    return this;
  }

  #getLangByCode = (langCode) => {
    const obj = langDict.find((obj) => obj.code === langCode);
    return (obj) ? obj.isoCode : null;
  }

  #printWord = (text) => {
    const outValue = this.output.value;
    let currPos = this.output.selectionStart;
    const leftPart = outValue.slice(0, currPos);
    const rightPart = outValue.slice(currPos);

    this.output.value = leftPart + text + rightPart;
    currPos += text.length;
    this.output.setSelectionRange(currPos, currPos);
  }

  generateLayout(keyObj) {
    const keyButton = new Key(keyObj);
    this.voiceKey = keyButton;
    keyButton.key.addEventListener('click', this.voiceAtcive);
    this.updateLayout();
    return this;
  }

  updateLayout = () => {
    const keyObj = this.voiceKey;
    if (this.isActive) {
      keyObj.letter.classList.remove('md-light', 'md-inactive');
      keyObj.key.classList.add('keyboard__key--dark', 'keyboard__key-press');
    } else {
      keyObj.letter.classList.add('md-light', 'md-inactive');
      keyObj.key.classList.remove('keyboard__key--dark', 'keyboard__key-press');
    }
  }

  voiceAtcive = () => {
    this.isActive = !this.isActive;

    if (this.isActive) {
      this.recognition.start();
      this.recognition.addEventListener('end', this.recognition.start);
    } else {
      this.recognition.abort();
      this.recognition.removeEventListener('end', this.recognition.start);
    }

    this.updateLayout();

    storage.set('kbIsVoiceAtcive', this.isActive);
  }

  changeLanguage = (langCode) => {
    this.recognition.lang = this.#getLangByCode(langCode);
  }
}
