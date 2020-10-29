/* eslint-disable import/extensions */
import create from './utils/create.js';
import Sound from './Sound.js';

export default class SoundList {
  constructor(langCode) {
    this.soundList = {};
    this.sounds = [];

    this.soundList = create('div', 'keyboard__sounds sounds', null, null, ['language', langCode]);

    return this;
  }

  init(soundDict) {
    soundDict.forEach((soundObj) => {
      const soundItem = new Sound(soundObj);
      this.sounds.push(soundItem);
      this.soundList.appendChild(soundItem.sound);
    });

    return this;
  }
}
