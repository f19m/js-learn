/* eslint-disable import/extensions */
import create from './utils/create.js';
export default class Popup {
    constructor(text){
        const popup = create('div', 'popup', null, null);
        const popup_wrapper = create('div', 'popup__wrapper', popup, null);
        const popup_text = create('p', 'popup__text', null, popup_wrapper);

    }
}