/* eslint-disable import/extensions */
import create from './utils/create.js';
import Sound from './Sound.js';
import * as storage from './storage.js';

export default class SoundList {
  constructor(langCode) {
    this.soundList = {};
    this.sounds = [];
    this.isSoundOn = storage.get('kbIsSoundOn', true);

    this.soundList = create('div', 'keyboard__sounds sounds', null, null, ['language', langCode]);

    return this;
  }

  init(soundDict) {
    if (this.sounds.length) {
      soundDict.forEach((soundObj) => {
        const soundItem = this.sounds.find((item) => soundObj.code === item.code);
        soundItem.url = soundObj.url;
        soundItem.sound.src = soundObj.url;
      });
    } else {
      soundDict.forEach((soundObj) => {
        const soundItem = new Sound(soundObj);
        this.sounds.push(soundItem);
        this.soundList.appendChild(soundItem.sound);
      });
    }

    return this;
  }

  play = (code) => {
    let soundObj = this.sounds.find((sound) => sound.code === code);
    if (!soundObj) {
      soundObj = this.sounds.find((sound) => sound.code === 'Other');
    }

    if (soundObj && this.isSoundOn) {
      soundObj.sound.currentTime = 0;
      soundObj.sound.play();
    }
  }

  soundOff = (isSoundOn) => {
    this.isSoundOn = !this.isSoundOn;
    storage.set('kbIsSoundOn', this.isSoundOn);
  }
}
