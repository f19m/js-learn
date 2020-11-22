import './header.sass';
import utils from '../../utils/utils';

export default class Header {
  constructor() {
    this.menuInit();
    this.initSwitch();
    return this;
  }

  menuInit() {
    this.toggle = document.querySelector('.toggle');
    const toggleClickHandler = () => {
      this.toggle.classList.toggle('toggle-open');
      const menu = document.querySelector('.nav__list');
      menu.classList.toggle('nav__list-visible');
      const overlay = document.querySelector('.overlay');
      overlay.classList.toggle('overlay-active');

      // document.removeEventListener('click',burgherClickHandler);
    };

    this.toggle.addEventListener('click', () => {
      toggleClickHandler();
    });
  }

  initSwitch() {
    this.switch = document.querySelector('.switch__check');
    const train = document.querySelector('.switch__train');
    const play = document.querySelector('.switch__play');

    const switchClickHandler = () => {
      train.classList.toggle('switch-off');
      play.classList.toggle('switch-off');
    };

    this.switch.addEventListener('change', () => {
      switchClickHandler();
    });
  }
}
