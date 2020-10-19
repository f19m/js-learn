
// //DOM ELEMS
// const time = document.querySelector('.momentum__time'),
// greeting = document.querySelector('.momentum__greeting'),
// name = document.querySelector('.momentum__name'),
// focus = document.querySelector('.momentum__focus');

// //showTime
// const showtime = function(){
//     let today = new Date(),
//         hour = today.getHours(),
//         min = today.getMinutes(),
//         sec = today.getSeconds();
    
//     const amPm = hour >=12 ? 'PM' : 'AM'
//     hour =  hour % 12 || 12

//     time.innerHTML = `${addZero(hour)}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;
//     setTimeout(showtime, 1000);
    
// }

// // add zeri
// const addZero = function(n){
//     return (parseInt(n,10)<10 ? '0': '') + n
// }

// //set BG 
// const setBgGreet = function(){
//     let today = new Date(),
//     hour = today.getHours(),
//     momentSectionBg = document.querySelector('.momentum');


//     if (hour < 12 && hour > 6){
//         //morning
//         momentSectionBg.style.background = `url('./assets/images/morning/01.jpg')`
//         greeting.textContent = 'Good Morning'
//     }else if (hour < 18){
//         //day
//         momentSectionBg.style.background = `url('./assets/images/day/01.jpg')`
//         greeting.textContent = 'Have a nice day'
//     }else if (hour >= 18 && hour < 0 ){
//         // Evening
//         momentSectionBg .style.background= `url('./assets/images/evening/01.jpg')`
//         greeting.textContent = 'Good Evening'
//     } else{
//         // night
//         momentSectionBg.style.background = `url('./assets/images/night/01.jpg')`
//         momentSectionBg.style.color = 'white'
//         greeting.textContent = 'Good Night'
//     }


// }

// //GetName
// const getName = function(){
//     if (localStorage.getItem('name') === null){
//         name.textContent = '[Enter Name]'
//     }else{
//         name.textContent = localStorage.getItem('name')
//     }
// }

// //Get Focis
// const getfocus = function(){
//     if (localStorage.getItem('focus') === null){
//         focus.textContent = '[Enter Focus]'
//     }else{
//         focus.textContent = localStorage.getItem('focus')
//     }
// }

// const setName = function(evt){
//     if (evt.type==='keypress'){
//         if(evt.which == 13 || evt.keyCode == 13){
//             localStorage.setItem('name', evt.target.innerText)
//             name.blur();
//         }
//     }else(
//         localStorage.setItem('name', evt.target.innerText)
//     )
// }
// name.addEventListener('keypress',setName)
// name.addEventListener('blur',setName)


// const setFocus = function(evt){
//     if (evt.type==='keypress'){
//         if(evt.which == 13 || evt.keyCode == 13){
//             localStorage.setItem('focus', evt.target.innerText)
//             focus.blur();
//         }
//     }else(
//         localStorage.setItem('focus', evt.target.innerText)
//     )
// }
// focus.addEventListener('keypress',setFocus)
// focus.addEventListener('blur',setFocus)

// showtime();
// setBgGreet();
// getName();
// getfocus();




const time = document.querySelector('.momentum__time'),
    greeting = document.querySelector('.momentum__greeting'),
    name = document.querySelector('.momentum__name'),
    focus = document.querySelector('.momentum__focus'),
    weather = document.querySelector('.momentum__weather'),
    momentSection = document.querySelector('.momentum');


const Momentum = {
    elements: {
        greeting: null,
        userName: null,
        focus: null,
        wheather:  null,
        time: null
     
    },

    eventHandlers: {
        get: null,
        set: null

    },

    properties: {
        currHour: null,
        curTimeName: null,
        bgImgae: null,

    },

    
    counters: {
        morning: {
            num: 0,
            maxNum: 20
        },
        day: {
            num: 0,
            maxNum: 20
        },
        evening: {
            num: 0,
            maxNum: 20
        },
        night: {
            num: 0,
            maxNum: 20
        },
        current: null

    },

    init(time, greeting, name, focus, weather,momentSection) {
        this.elements.time = time
        this.elements.greeting = greeting
        this.elements.userName = name
        this.elements.focus = focus
        this.elements.wheather = weather
        this.elements.momentum = momentSection
        
        //add zero
        const addZero = function(n){
            return (parseInt(n,10)<10 ? '0': '') + n
        }

        //Greeting
        const setBgGreet = function(){
            this.elements.greeting.textContent = `Good ${this.properties.curTimeName}`;

            const url = `./assets/${this.properties.curTimeName.toLowerCase()}/${addZero(this.counters.current.num)}.jpg`
            this.elements.momentum.style.background = `url('./assets/images/night/01.jpg')`
            if (this.properties.currHour >= 18 || this.properties.currHour < 6){
                this.elements.momentum.style.color = 'white'
            }
           
        }
        this.eventHandlers.setBgGreet = setBgGreet.bind(this);
      
        //showTime
        const showtime = function(){
            let today = new Date(),
                hour = today.getHours(),
                min = today.getMinutes(),
                sec = today.getSeconds();

            this.elements.time.innerHTML = `${addZero(hour)}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;
            if (this.properties.currHour != hour){
                if (hour >= 0 && hour < 6){
                    this.properties.curTimeName = 'Night'
                } else if(hour >= 6 && hour < 12){
                    this.properties.curTimeName = 'Morning'
                } else if(hour >= 12 && hour < 18){
                    this.properties.curTimeName = 'Day'
                }else{
                    this.properties.curTimeName = 'Evening'
                }

                //обновим счетчик
                let counter = this.counters[this.properties.curTimeName.toLowerCase()];
                counter.num = (counter.num >= counter.maxNum)? 1 : counter.num + 1;
                this.counters.current = counter;
                this.properties.currHour = hour
                this.eventHandlers.setBgGreet();
            }
            setTimeout(this.eventHandlers.showtime, 1000);
        }
        this.eventHandlers.showtime = showtime.bind(this);
        this.eventHandlers.showtime()

    




    }

}


Momentum.init(time, greeting, name, focus, weather, momentSection)