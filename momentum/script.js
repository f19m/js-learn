
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
        time: null,
        momentum: null
    },

    eventHandlers: {
        get: null,
        set: null,
        imgReloadHandler: function(){
            let counter = this.counters[this.properties.curTimeName.toLowerCase()];
            this.counters.current = counter
            counter.num = (counter.num >= counter.maxNum)? 1 : counter.num + 1;
            this.saveMomentum();
            this.setBgGreet();
        }
    },

    properties: {
        currHour: null,
        curTimeName: null,
        bgImgae: null,
        userName: null,
        focus: null,
        city: null
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
            num: 3,
            maxNum: 20
        },
        night: {
            num: 0,
            maxNum: 20
        },
        current: null

    },
    
    addZero: function(n){
        return (parseInt(n,10)<10 ? '0': '') + n
    },

    setBgGreet: function(){
        this.elements.greeting.textContent = `Good ${this.properties.curTimeName}`;

        const url = `./assets/images/${this.properties.curTimeName.toLowerCase()}/${this.addZero(this.counters.current.num)}.jpg`
       
        this.elements.momentum.classList.add('momentum-white')

        const src = url;
        const img = document.createElement('img');
        img.src = src;
        img.onload = () => {      
          //body.style.backgroundImage = `url(${src})`;
          this.elements.momentum.style.backgroundImage = `url(${src})`
        };   


        // if (this.properties.currHour >= 18 || this.properties.currHour < 12){
        //     //this.elements.momentum.style.color = 'white'
        //     this.elements.momentum.classList.add('momentum-white');
        // }else{
        //     this.elements.momentum.classList.remove('momentum-white');
        // }   
        
    },


    showtime : function(){
        let today = new Date(),
            hour = today.getHours(),
            min = today.getMinutes(),
            sec = today.getSeconds(),
            weekDate = today.getWeekDay(),
            dateMonth = today.getDate() + ' ' + today.getMonthStr();

        //this.elements.time.innerHTML = `<p>${weekDate}</p> <p>${this.addZero(hour)}</p><span>:</span><p>${this.addZero(min)}</p><span>:</span><p>${this.addZero(sec)}</p>`;
        this.elements.time.innerHTML = `${weekDate}, ${dateMonth} <br>${this.addZero(hour)}:${this.addZero(min)}:${this.addZero(sec)}`;
        if (this.properties.currHour != hour){
        //if (this.properties.currHour != sec){
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
            //this.properties.currHour = sec
            this.setBgGreet();
            this.saveMomentum();
        }
        setTimeout(this.showtime.bind(this), 1000);
    },
    
    saveMomentum: function(){
        localStorage.setItem('momentum', JSON.stringify(this))
    },
    
    loadMomentum : function(){
        if (localStorage.getItem('momentum')){
            let momentum =  JSON.parse(localStorage.getItem('momentum'));
            this.counters = momentum.counters
            this.properties.currHour = momentum.properties.currHour
            this.properties.curTimeName = momentum.properties.curTimeName
            this.properties.userName = momentum.properties.userName 
            this.properties.focus = momentum.properties.focus 
            this.properties.city = momentum.properties.city
        } 
        
        if (this.properties.userName){
            this.elements.userName.textContent = this.properties.userName
        }else{
            this.elements.userName.textContent = '[Enter Name]'
        }

        if (this.properties.focus){
            this.elements.focus.textContent = this.properties.focus
        }else{
            this.elements.focus.textContent = '[Enter Focus]'
        }

        if (this.properties.city){
            this.elements.city.textContent = this.properties.city
        }else{
            this.elements.city.textContent = '[Enter City]'
        }
    },
     
    getWheather: async function(){
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.elements.city.textContent}&lang=ru&appid=52fcc881bac63c3dd265c01f6bbad8d3&units=metric`

        const res = await fetch(url);
        const data = await res.json(); 
        //console.log(data.weather[0].id, data.weather[0].description, data.main.temp);

        this.elements.weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        this.elements.temperature.textContent = `${data.main.temp}°C`;
        this.elements.weatherDescription.textContent = data.weather[0].description;
        this.elements.windSpeed.querySelector('span').textContent = `${data.wind.speed} м/с`

    },
    
    getPhrase: async function(){
        const req = await fetch('https://api.forismatic.com/api/1.0/',
        {
            "headers":{"content-type":"application/x-www-form-urlencoded"},
            "body":"method=getQuote&key=457653&format=json&lang=ru",
            "method":"POST"
        })

        const resp = await req.json();
        this.elements.phrase.querySelector('blockquote').innerText = resp.quoteText
        this.elements.phrase.querySelector('figcaption').innerText = resp.quoteAuthor
    },

    init(time, greeting, name, focus, weather,momentSection) {
        this.elements.time = time
        this.elements.greeting = greeting
        this.elements.userName = name
        this.elements.focus = focus
        this.elements.wheather = weather
        this.elements.momentum = momentSection
        this.elements.phrase = document.querySelector('.momentum__phrase')
        this.elements.wheather = document.querySelector('.momentum__weather')
    
        this.elements.weatherIcon = this.elements.wheather.querySelector('.weather-icon');
        this.elements.temperature = this.elements.wheather.querySelector('.temperature');
        this.elements.weatherDescription = this.elements.wheather.querySelector('.weather-description');
        this.elements.windSpeed = this.elements.wheather.querySelector('.wind-speed');
        this.elements.city =  this.elements.wheather.querySelector('.city');

        Date.prototype.getWeekDay = function() {
            let days = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
          
            return days[this.getDay()];
        }

        Date.prototype.getMonthStr = function() {
            let month = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
          
            return month[this.getMonth()];
        }


        const ImgReload = document.querySelector('.momentum__reload').querySelector('svg');
        ImgReload.addEventListener('click', () => {
            ImgReload.classList.add('animate')
            ImgReload.classList.toggle('rotate')
            setTimeout(()=>{
                ImgReload.classList.remove('animate')
                ImgReload.classList.toggle('rotate')               
            }, 600)
            
            this.eventHandlers.imgReloadHandler.call(this);
        })

        // USER_NAME
        const setName = function(evt){
          
            if (evt.type==='keypress'){
                if(evt.which == 13 || evt.keyCode == 13){
                    this.properties.userName = evt.target.innerText
                    evt.target.blur()
                    this.saveMomentum()
                    if (evt.target.innerText == ''){
                        evt.target.innerText = '[Enter Name]'
                    }
                }
            }else{
                this.properties.userName = evt.target.innerText
                this.saveMomentum()
                if (evt.target.innerText == ''){
                    evt.target.innerText = '[Enter Name]'
                }
            }
        }
        
        this.elements.userName.addEventListener('click',  (evt)=>{
            if (evt.target.innerText == '[Enter Name]'){
                evt.target.innerText = ''
            }
        })
        this.elements.userName.addEventListener('keypress',  setName.bind(this))
        this.elements.userName.addEventListener('blur',  setName.bind(this))


        // FOCUS
        const setFocus = function(evt){
            if (evt.type==='keypress'){
                if(evt.which == 13 || evt.keyCode == 13){
                    this.properties.focus = evt.target.innerText
                    evt.target.blur()
                    this.saveMomentum()
                    if (evt.target.innerText == ''){
                        evt.target.innerText = '[Enter Focus]'
                    }
                }
            }else{
                this.properties.focus = evt.target.innerText
                this.saveMomentum()
                if (evt.target.innerText == ''){
                    evt.target.innerText = '[Enter Focus]'
                }
            }
        }
        
        this.elements.focus.addEventListener('click',  (evt)=>{
            if (evt.target.innerText == '[Enter Focus]'){
                evt.target.innerText = ''
            }
        })
        this.elements.focus.addEventListener('keypress',  setFocus.bind(this))
        this.elements.focus.addEventListener('blur',  setFocus.bind(this))


        //CITY WEATHER
        const setCity = function(evt){
            if (evt.type==='keypress'){
                if(evt.which == 13 || evt.keyCode == 13){
                    this.properties.city = evt.target.innerText
                    evt.target.blur()
                    this.saveMomentum()
                    this.getWheather()
                    if (evt.target.innerText == ''){
                        evt.target.innerText = '[Enter City]'
                    }
                }
            }else{
                this.properties.city = evt.target.innerText
                this.saveMomentum()
                this.getWheather()
                if (evt.target.innerText == ''){
                    evt.target.innerText = '[Enter City]'
                }
            }
        }
        
        this.elements.city.addEventListener('click',  (evt)=>{
            if (evt.target.innerText == '[Enter City]'){
                evt.target.innerText = ''
            }
        })
        this.elements.city.addEventListener('keypress',  setCity.bind(this))
        this.elements.city.addEventListener('blur',  setCity.bind(this))






        
        // IMG ERLOAD
        
        this.elements.phrase.addEventListener('click', () => {
            this.getPhrase.call(this);
        })


        this.loadMomentum()
        this.showtime()
        this.setBgGreet()
        this.getPhrase()
        this.getWheather()
       

    
    }

}


Momentum.init(time, greeting, name, focus, weather, momentSection)