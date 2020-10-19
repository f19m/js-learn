
// const keyboardElem = document.querySelector('.keyboard'),
//       textareaElem = document.querySelector('.keyboard__input');

class KeyBoard{
    constructor(){
        this.keyboardElem = {}
        this.inputElem = {}
        this.text = ''
        this.visible = false
        this.upper = false
        this.capslock = {}
        this.keyList = []
        this.init()
        this.show()

    }


    #toUpper(isUpper){
        this.keyList.forEach(item => {
            if (isUpper){
                item.textContent = item.textContent.toUpperCase()
            }else{
                item.textContent = item.textContent.toLowerCase()
            }
        });
    }

    makeAction(evt){
        let text = '';
        if (evt.target.classList.contains('keyboard__key')){
            let key = evt.target
            if (key.querySelector('i')===null){
                text = key.textContent
            }else{
                text = key.querySelector('i').textContent
            }
        }

        if (text == ''){
            return;
        }

        if (text.length == 1){
            this.text = this.text  +  text;
            this.show()
        }else if (text=='keyboard_capslock'){
            this.upper = (this.upper)?false:true;
            
            if (this.upper){
                this.capslock.classList.add('keyboard__key--active')
            }else{
                this.capslock.classList.remove('keyboard__key--active')
            }
            this.#toUpper(this.upper)
        }else if(text == 'check_circle'){
            this.makeInvisible();
        }
    }

    makeVisible(){
        this.visible = true
        this.show()
    }

    init(){
        const KEY_LIST = [
            ['1','2','3','4','5','6','7','8','9','0','backspace'],
            ['q','w','e','r','t','y','u','i','o','p'],
            ['keyboard_capslock','a','s','d','f','g','h','j','k','l','keyboard_return'],
            ['check_circle','z','x','c','v','b','n','m',',','.','?'],
            ['space_bar']
        ]
        
        this.keyboardElem = document.createElement('div');
        this.keyboardElem.classList.add('keyboard')
        document.body.appendChild(this.keyboardElem)

        this.inputElem= document.createElement('textarea');
        this.inputElem.classList.add('keyboard__input')
       
        this.inputElem.addEventListener('click', this.makeVisible)
        document.body.appendChild(this.inputElem)

      
      




        const fragment = document.createDocumentFragment();
        const getItem = function(value, thos){
            let btn = document.createElement('div')
            btn.classList.add('keyboard__key')

            if (value.length == 1)
            {
                btn.textContent = value
                thos.keyList.push(btn)
            }else {
                if (value != 'space_bar')
                {
                    btn.classList.add('keyboard__key--wide')
                }else{
                    btn.classList.add('keyboard__key--extra-wide')
                }
                
                if (value == 'check_circle'){
                    btn.classList.add('keyboard__key--dark')
                }

                if (value == 'keyboard_capslock'){
                    btn.classList.add('keyboard__key--activatable')
                    thos.capslock = btn;
                }

                let icon = document.createElement('i')
                icon.classList.add('material-icons')
                icon.textContent = value
                btn.appendChild(icon);
            }
 
            return btn;
        }


        KEY_LIST.forEach(rowItems => {
            var rowFragment = document.createElement('div');
            rowFragment.classList.add('keyboard__row')
            rowItems.forEach(item => {
                rowFragment.appendChild(getItem(item, this))
            });
            fragment.appendChild(rowFragment);
        });

        this.keyboardElem.appendChild(fragment);
    }

    show(){
        if (this.visible){
            this.keyboardElem.classList.remove('keyboard-hidden')
        }
        else{
            this.keyboardElem.classList.add('keyboard-hidden')
        }
        this.inputElem.value = this.text
    }



    makeInvisible(){
        this.visible = false
        this.show()
    }
}


window.addEventListener("DOMContentLoaded", function () {
    let keyBoard = new KeyBoard()
  });



// const keyboardClickHandler = function(evt){
//     /*
//     if (evt.target.classList.contains('keyboard__key')){
//         let key = evt.target
//         if (key.querySelector('i')===null){
//             keyBoard.makeAction(key.textContent)
//         }else{
//             keyBoard.makeAction(key.querySelector('i').textContent)
//         }
     
//     }
//     */
//    keyBoard.makeAction(evt)

// }
// keyboardElem.addEventListener('click', keyboardClickHandler)

