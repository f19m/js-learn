
const time = document.querySelector('.momentum__time'),
    greeting = document.querySelector('.momentum__greeting'),
    name = document.querySelector('.momentum__name'),
    focus = document.querySelector('.momentum__focus'),
    weather = document.querySelector('.momentum__weather'),
    momentSection = document.querySelector('.momentum');


const Momentum = {
    elements: {
        greeting: null,
        name: null,
        focus: null,
        wheather:  null,
        time: null,
        momentum: null
    },

    eventHandlers: {
        get: null,
        set: null,
        imgReloadHandler: function(){
            this.counterNum = (this.counterNum + 1) % 24
            this.saveMomentum();
            this.setBgGreet();
        }
    },

    properties: {
        currHour: null,
        curTimeName: null,
        bgImgae: null,
        name: null,
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
        this.elements.momentum.classList.add('momentum-white')

        const src = this.imgSet[this.counterNum];
        const img = document.createElement('img');
        img.src = src;
        img.onload = () => {      
          //body.style.backgroundImage = `url(${src})`;
          this.elements.momentum.style.backgroundImage = `url(${src})`
        };   
        this.elements.reload.title = `${this.counterNum} - ${this.imgSet[this.counterNum]}`;
        
    },


    showtime : function(tmp){
        let today = new Date(),
            hour = today.getHours(),
            min = today.getMinutes(),
            sec = today.getSeconds(),
            weekDate = today.getWeekDay(),
            dateMonth = today.getDate() + ' ' + today.getMonthStr();

        //this.elements.time.innerHTML = `<p>${weekDate}</p> <p>${this.addZero(hour)}</p><span>:</span><p>${this.addZero(min)}</p><span>:</span><p>${this.addZero(sec)}</p>`;
        this.elements.time.innerHTML = `${weekDate}, ${dateMonth} <br>${this.addZero(hour)}:${this.addZero(min)}:${this.addZero(sec)}`;
        if (!(tmp === undefined)){
            hour = tmp;
        }
        
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
            //let counter = this.counters[this.properties.curTimeName.toLowerCase()];
           //counter.num = (counter.num >= counter.maxNum)? 1 : counter.num + 1;
            
            this.properties.currHour = hour;
            this.counterNum = (this.counterNum) ? (this.counterNum + 1) % 24 : hour;     
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
            //this.properties.currHour = momentum.properties.currHour
            this.properties.curTimeName = momentum.properties.curTimeName
            this.properties.name = momentum.properties.name 
            this.properties.focus = momentum.properties.focus 
            this.properties.city = momentum.properties.city
        } 
        
        if (this.properties.name){
            this.elements.name.textContent = this.properties.name
        }else{
            this.elements.name.textContent = '[Enter Name]'
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

        try{
        const res = await fetch(url);
        const data = await res.json(); 
        //console.log(data.weather[0].id, data.weather[0].description, data.main.temp);

        this.elements.weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        this.elements.temperature.textContent = `${Math.trunc(data.main.temp)}°C`;
        this.elements.weatherDescription.textContent = data.weather[0].description;
        this.elements.windSpeed.querySelector('span').textContent = `${Math.trunc(data.wind.speed)} м/с`
        }catch(e){
            ///this.elements.city.textContent = 'Погода не доступна, укажите другой город
            this.elements.weatherDescription.textContent  = 'Погода недоступна, укажите другой город'
        }

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
        this.elements.name = name
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
        this.elements.reload = document.querySelector('.momentum__reload');

        Date.prototype.getWeekDay = function() {
            let days = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
          
            return days[this.getDay()];
        }

        Date.prototype.getMonthStr = function() {
            let month = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
          
            return month[this.getMonth()];
        }

        this.imgSet = [];
        const times = ['night', 'morning', 'day','evening'];
        for (let i = 0; i < times.length; i++) {
            let imgSet = Array.apply(null, {length: 21}).map(Number.call, Number).splice(1,21).map((vl)=>{return (vl<10)?`0${vl.toString()}`:vl.toString()})

            for (let j = 0; j < 6; j++) {
                this.imgSet.push(`./assets/images/${times[i]}/${imgSet.splice(Math.floor(Math.random() * imgSet.length) ,1)}.jpg`);
            }
        }


        
        const ImgReload = this.elements.reload .querySelector('svg');
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
        const setEditableParam = (paramName, evt)=>{
            const setParam = (blur)=>{
                evt.target.classList.toggle('bordered');
                if (evt.target.innerText == ''){
                    evt.target.innerText = this.properties[paramName]? this.properties[paramName] :`[Enter ${paramName[0].toUpperCase() + paramName.slice(1)}]`;
                    return;
                }
                this.properties[paramName] = evt.target.innerText
                if (blur)  evt.target.blur();
                this.saveMomentum()
                if (evt.target.innerText == ''){
                    evt.target.innerText = `[Enter ${paramName[0].toUpperCase() + paramName.slice(1)}]`
                }

            }

            if (evt.type==='keypress'){
                if(evt.which == 13 || evt.keyCode == 13){
                    setParam(true)
                    //if (evt.target.innerText){
                    // this.properties[paramName] = evt.target.innerText
                    // evt.target.blur()
                    // this.saveMomentum()
                    // if (evt.target.innerText == ''){
                    //     evt.target.innerText = `[Enter ${paramName[0].toUpperCase() + paramName.slice(1)}]`
                    // }
                }
            }else{
                setParam();
            }
        }

        const clearText = (evt) =>{
            evt.target.innerText = ''
            evt.target.classList.toggle('bordered');
        }

        this.elements.name.addEventListener('click',  (evt)=>{
            clearText(evt);
        })
        this.elements.name.addEventListener('keypress',  (evt) => {
            setEditableParam.call(this, 'name', evt)
        })
        this.elements.name.addEventListener('blur',  (evt) => {
            setEditableParam.call(this, 'name', evt)
        })


        // FOCUS
        this.elements.focus.addEventListener('click',  (evt)=>{
            clearText(evt);
        })
        this.elements.focus.addEventListener('keypress',  (evt) => {
            setEditableParam.call(this, 'focus', evt)
        })
        this.elements.focus.addEventListener('blur', (evt) => {
            setEditableParam.call(this, 'focus', evt)
        })


        //CITY WEATHER
        this.elements.city.addEventListener('click',  (evt)=>{
            clearText(evt);
        })
        this.elements.city.addEventListener('keypress',  (evt) => {
            setEditableParam.call(this, 'city', evt)
            this.getWheather()
        })
        this.elements.city.addEventListener('blur',  (evt) => {
            setEditableParam.call(this, 'city', evt)
            this.getWheather()
        })






        
        // IMG ERLOAD
        
        this.elements.phrase.addEventListener('click', () => {
            this.getPhrase.call(this);
        })


        this.loadMomentum()
        this.showtime()
        this.getPhrase()
        this.getWheather()
       

    
    }

}




document.addEventListener('DOMContentLoaded', function(event) {

    Momentum.init(time, greeting, name, focus, weather, momentSection)

    document.querySelector('.toolbar').classList.toggle('toolbar-visilbe')
    setTimeout( ()=>{
        document.querySelector('.toolbar').classList.toggle('toolbar-visilbe')
    }
        , 3000);
});
