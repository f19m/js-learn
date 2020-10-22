'use strict'

document.addEventListener('DOMContentLoaded', function(event) {
    burgerMenuInit();
    sliderInit();
    pageMenuInit();
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

    
const createPets = function(data){
    const petsList = document.querySelector(".paging-list__content")
    
    const petsItemTemplate = function(name, imgUrl){
        return  `<img class="list-item__image"
                    src="${imgUrl}"
                    alt="${name}">
                <p class="list-item__title">${name}</p>
                <div class="list-item__button button">
                    <a href="#" class="list-item__link">
                        Learn more
                    </a>
                </div>`;
    }

    let sliderItemsFragment = document.createDocumentFragment();
    data.forEach(item => {
        let petItem = document.createElement('div');
        petItem.classList.add('paging-list__item')
        petItem.classList.add('list-item')
        petItem.innerHTML = petsItemTemplate(item.name, item.img);
        sliderItemsFragment.appendChild(petItem);
    });

    petsList.appendChild(sliderItemsFragment);
}

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

        createPets(fullPetsList);
    }

    req.send();
}



let slider = {
    curPage : 0,
    maxPage : null,
    offset : null
};

const pageMenuInit = ()=>{
    let pageCounter = 0;

    let prevPage = document.querySelector('.slider__control-left'),
        firstPage = document.querySelector('.slider__control-left_big'),
        nextPage = document.querySelector('.slider__control-right'),
        lastPage = document.querySelector('.slider__control-right_big'),
        wraperPage = document.querySelector('.paging-list__wrapper'),
        petsList = document.querySelector('.paging-list__content'),
        pageNum = document.querySelector('.page-num');
    
    const sliderInit = ()=>{
        if (wraperPage.clientWidth >= 1200){
            slider.columns = 4
        }else if(wraperPage.clientWidth >= 580 && wraperPage.clientWidth < 1200) {
            slider.columns = 2
        } else {
            slider.columns = 1
        }
        
        slider.offset = wraperPage.clientHeight;
        slider.rows = 2;
        if (slider.offset == 1365){
            slider.offset += 30;
            slider.rows = 3;
        }
        slider.maxPage= Math.ceil(fullPetsList.length / (slider.columns * slider.rows)) - 1;    
    }
    


    const setPageHandler = (page) => {

        sliderInit();

        if (page === undefined && slider.curPage !== slider.maxPage){
            slider.curPage = slider.maxPage
        } else if (page === 0 && slider.curPage !== 0){
            slider.curPage = 0
        } else{
            if (!(slider.curPage + page > slider.maxPage || slider.curPage  + page < 0)){
                slider.curPage += page;
            }else{
                return;
            }
        }
        
        pageNum.innerText = (slider.curPage + 1);
        petsList.style.top = `${ 0 - slider.offset * slider.curPage  }px`

        if (slider.curPage === 0){
            prevPage.classList.add('slider__control_inactive')
            firstPage.classList.add('slider__control_inactive')
            nextPage.classList.remove('slider__control_inactive')
            lastPage.classList.remove('slider__control_inactive')
        }else if (slider.curPage === slider.maxPage){
            prevPage.classList.remove('slider__control_inactive')
            firstPage.classList.remove('slider__control_inactive')
            nextPage.classList.add('slider__control_inactive')
            lastPage.classList.add('slider__control_inactive')
        }else{
            prevPage.classList.remove('slider__control_inactive')
            firstPage.classList.remove('slider__control_inactive')
            nextPage.classList.remove('slider__control_inactive')
            lastPage.classList.remove('slider__control_inactive')
        }

    }

    prevPage.addEventListener('click',(evt)=>{
        setPageHandler(-1);
    })

    nextPage.addEventListener('click',(evt)=>{
        setPageHandler(1);
    })

    firstPage.addEventListener('click',(evt)=>{
        setPageHandler(0);
    })

    lastPage.addEventListener('click',(evt)=>{
        setPageHandler();
    })






    

}