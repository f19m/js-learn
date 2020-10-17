'use strict'

document.addEventListener('DOMContentLoaded', function(event) {
    console.log(PETS_DATA)
    burgerMenuInit();
});



const burgerMenuInit = () => {
    const burgerMenuIcon = document.querySelector('.header__burger');
    const burgherClickHandler = function(){
        burgerMenuIcon.classList.toggle('rotate');
        const burgerMenu = document.querySelector('.burger__menu');
        burgerMenu.classList.toggle('unvisible');
        const burgerOverlay = document.querySelector('.burger__overlay');
        burgerOverlay.classList.toggle('unvisible');
        const header = document.querySelector('.header');
        header.classList.toggle('header-burger-opened');
        const logo = document.querySelector('.header__logo');
        logo.classList.toggle('logo-burger-opened');
        //document.removeEventListener('click',burgherClickHandler);
        
    }
    
    burgerMenuIcon.addEventListener('click', event => {
        burgherClickHandler();
    });

    const burgerOverlay = document.querySelector('.burger__overlay');
    burgerOverlay.addEventListener('click', event => {
        burgherClickHandler();
    });

    const burgerLinks = document.querySelectorAll('.burger__link');
    burgerLinks.forEach(element => element.addEventListener('click', event => {
      burgerMenuIcon.click();
    }));
  }
  