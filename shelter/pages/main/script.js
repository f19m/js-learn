'use strict'

document.addEventListener('DOMContentLoaded', function(event) {
    burgerMenuInit();
    sliderInit();
    sliderButtonInit();
    popUpInit();
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
        document.body.classList.toggle('scroll-off');
        burgerMenu.toggle('scroll-off');
        //document.removeEventListener('click',burgherClickHandler);
        
    }
    
    burgerMenuIcon.addEventListener('click', event => {
        burgherClickHandler();
    });

    const burgerOverlay = document.querySelector('.burger__overlay');
    burgerOverlay.addEventListener('click', event => {
        burgherClickHandler();
    });

    // const burgerLinks = document.querySelectorAll('.burger__link');
    // burgerLinks.forEach(element => element.addEventListener('click', event => {
    //   burgerMenuIcon.click();
    // }));
  }
  




  //slider
let pets = [];
let slider_pets = []; //48 elem
let createPets = {};
let petsList;

const sliderInit = function(){
    const req = new XMLHttpRequest();
    req.open('GET', './data.json');

    
    createPets = function(data, isFrontInsert){
        petsList = document.querySelector(".slider__wrapper")
        
        const petsItemTemplate = function(name, imgUrl){
            return  `<img class="list-item__image"
                        src="${imgUrl}"
                        alt="${name}">
                    <p class="list-item__title">${name}</p>
                    <div class="list-item__button button">
                        <a href="javascript:void(0)" class="list-item__link">
                            Learn more
                        </a>
                    </div>`;
        }

        let sliderItemsFragment = document.createDocumentFragment();
        
        let indx = 0;
        data.forEach(item => {
            let petItem = document.createElement('div');
            petItem.classList.add('slider__item')
            petItem.classList.add('list-item')
            petItem.innerHTML = petsItemTemplate(item.name, item.img);
            
            petItem.addEventListener('click', (evt)=>{
                popUpShow(item);
            })
            petItem.querySelector('.list-item__link').addEventListener('click', (evt)=>{
                popUpShow(item);
            })

            sliderItemsFragment.appendChild(petItem);
            indx ++;
        });

    //    if (isFrontInsert){
    //         petsList.insertBefore(sliderItemsFragment, petsList.children[0])
    //     }else{
    //         petsList.appendChild(sliderItemsFragment);
    //     }
        petsList.innerHTML = '';
        petsList.appendChild(sliderItemsFragment);
    }


    req.onload = () => {
        pets = JSON.parse(req.response);
        
        for (let index = 0; index < 3; index++) {
            const element = pets[index];
            slider_pets.push(pets.splice(Math.floor(Math.random() * pets.length) ,1)[0]);
        }
        createPets(slider_pets);
    }

    req.send();
}



const sliderButtonInit = ()=>{
    const sliderPrev = document.querySelector('.slider__control-left'),
    sliderNext = document.querySelector('.slider__control-right');

   
    
    const sliderButtonHandler = (isFrontInsert)=>{
        const new_pets = []
        for (let index = 0; index < 3; index++) {
            const element = pets[index];
            new_pets.push(pets.splice(Math.floor(Math.random() * pets.length) ,1)[0]);
        }
        createPets(new_pets, isFrontInsert);
        pets = [...pets,...slider_pets]; 
        slider_pets = new_pets;
        // вернуть старые данные в список
        // удалить данные из слайдера
        // перелеснуть слайдер
    }

    const makeMove = (isFrontInsert)=>{
        if (isFrontInsert){
            
           petsList.style = `left: calc(${petsList.offsetLeft}px - 1080px)`

            //petsList.classList.add('transition')
            
           // setTimeout(()=>{
                for (let index = 0; index < 3; index++) {
               // petsList.classList.remove('transition')
                petsList.children[petsList.children.length - 1].remove()
                }
                
                petsList.style = `left: 60px`
             //}, 2000)

        }else{
           // petsList.classList.add('transition')
            petsList.style = `margin-left: calc(${petsList.offsetLeft}px - 1080px)`
            
           
           //setTimeout(()=>{
             //   petsList.classList.remove('transition')
                for (let index = 0; index < 3; index++) {
                    petsList.children[0].remove()
                }
                petsList.style = `margin-left: 0px`
          //  }, 2000)
        }

        

    }
    
    sliderPrev.addEventListener('click', ()=>{
        sliderButtonHandler(true);
       // makeMove(true);
    });

    sliderNext.addEventListener('click', ()=>{
        sliderButtonHandler(false);
       // makeMove(false);
    });



}




const popUpInit = ()=>{
    const popUpWrapper = document.querySelector('.popup__wrapper'),
        popUp = document.querySelector('#about-popup'),
        popUpClose = document.querySelector('.popup__close');
    
    const closePopUpHandler = () =>{
        popUp.classList.remove('popup-visible');
        document.body.classList.remove('scroll-off');
    }        
    popUpClose.addEventListener('click', ()=>{closePopUpHandler();});
    popUp.addEventListener('click', (evt)=>{
        if (evt.target == popUp){
            closePopUpHandler();
        }
    });

}


const popUpShow = (data)=>{
    
    const popUpElem = document.querySelector('#about-popup');
    let popUp = {
        img: document.querySelector('.popup__img-image'),
        title: document.querySelector('.pet-info__title'),
        subtitle: document.querySelector('.pet-info__subtitle'),
        descr: document.querySelector('.pet-info__description'),
        list: {
            age: document.querySelector('.info_list__item-age > span'),
            inoculations: document.querySelector('.info_list__item-inoculations > span'),
            diseases: document.querySelector('.info_list__item-diseases > span'),
            parasites: document.querySelector('.info_list__item-parasites > span'),
        }
    }
        
    
    popUpElem.classList.add('popup-visible');
    popUp.img.src = data.img;
    popUp.img.alt = data.name;

    popUp.title.innerHTML = data.name
    popUp.subtitle.innerHTML = `${data.type} - ${data.name}`;
    popUp.descr.innerHTML  = data.description;

    for (const key in popUp.list) {
        if (popUp.list.hasOwnProperty(key)) {
            if (typeof data[key] === 'string'){
                popUp.list[key].innerHTML = data[key]
            }else{
                popUp.list[key].innerHTML = data[key].join(', ')
            }
            
        }
    }

    document.body.classList.add('scroll-off');
 

}