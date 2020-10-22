'use strict'

document.addEventListener('DOMContentLoaded', function(event) {
    burgerMenuInit();
    sliderInit();
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

    // const burgerLinks = document.querySelectorAll('.burger__link');
    // burgerLinks.forEach(element => element.addEventListener('click', event => {
    //   burgerMenuIcon.click();
    // }));
  }
  




  //slider
let pets = [];
let fullPetsList = []; //48 elem

const sliderInit = function(){
    const req = new XMLHttpRequest();
    req.open('GET', './data.json');

    
    // const createPets = function(data){
    //     const petsList = document.querySelector(".paging-list__content")
        
    //     const petsItemTemplate = function(name, imgUrl){
    //         return  `<img class="list-item__image"
    //                     src="${imgUrl}"
    //                     alt="${name}">
    //                 <p class="list-item__title">${name}</p>
    //                 <div class="list-item__button button">
    //                     <a href="javascript:void(0)" class="list-item__link">
    //                         Learn more
    //                     </a>
    //                 </div>`;
    //     }

    //     let sliderItemsFragment = document.createDocumentFragment();
        
    //     let indx = 0;
    //     data.forEach(item => {
    //         let petItem = document.createElement('div');
    //         petItem.classList.add('paging-list__item')
    //         petItem.classList.add('list-item')
    //         petItem.innerHTML = petsItemTemplate(item.name, item.img);
    //         petItem.id = indx;

    //         petItem.querySelector('.list-item__link').addEventListener('click', (evt)=>{
    //             console.log(evt.target)
    //             console.log('id= ' + petItem.id)
    //             popUpShow(item);
    //         })

    //         sliderItemsFragment.appendChild(petItem);
    //         indx ++
    //     });

    //     petsList.appendChild(sliderItemsFragment);
    // }

    const sort863 = (list) => {
        let unique8List = [];
        let length = list.length;
        for (let i = 0; i < length / 8; i++) {
        const uniqueStepList = [];
        for (let j = 0; j < list.length; j++) {
            if (uniqueStepList.length >= 8) {
            break;
            }
            const isUnique = !uniqueStepList.some((item) => {
            return item.name === list[j].name;
            });
            if (isUnique) {
            uniqueStepList.push(list[j]);
            list.splice(j, 1);
            j--;
            }
        }
        unique8List = [...unique8List, ...uniqueStepList];
        }
        list = unique8List;
    
    
        list = sort6recursively(list);
    
        return list;
    }
    
    const sort6recursively = (list) => {
        const length = list.length;
    
        for (let i = 0; i < (length / 6); i++) {
        const stepList = list.slice(i * 6, (i * 6) + 6);
    
        for (let j = 0; j < 6; j++) {
            const duplicatedItem = stepList.find((item, ind) => {
            return item.name === stepList[j].name && (ind !== j);
            });
    
            if (duplicatedItem !== undefined) {
            const ind = (i * 6) + j;
            const which8OfList = Math.trunc(ind / 8);
    
            list.splice(which8OfList * 8, 0, list.splice(ind, 1)[0]);
    
            sort6recursively(list);
            }
        }
        }
    
        return list;
    } 

    req.onload = () => {
        pets = JSON.parse(req.response);

        fullPetsList = (() =>{
            let tmpArr = [];
            for (let i = 0; i < 6; i++){
                const newPets = pets;
                for (let j = pets.length; j > 0; j--) {
                    let randIdx = Math.floor(Math.random() * j);
                    const randElem = newPets.splice(randIdx,1)[0]
                    newPets.push(randElem)
                    
                }
                tmpArr = [...tmpArr, ...newPets]

            }

            return tmpArr;

        })();

        fullPetsList = sort863(fullPetsList);

        //createPets(fullPetsList);
    }

    req.send();
}

