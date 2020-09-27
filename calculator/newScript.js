const KEY_LIST = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '.',
    '-',
    '=',
    '+',
    '/',
    '*',
    '^',
    'Backspace',
    'Escape',
    'Enter',
    'Delete'
];


const KEYCODE_BACKSPACE = 8;
const KEYCODE_ESCAPE = 27;
const KEYCODE_ENTER = 13;
const KEYCODE_DELETE = 46;


class Calc{
    constructor(previousValueTextElem, currentValueTextElem){
        this.previousValueTextElem = previousValueTextElem;
        this.currentValueTextElem = currentValueTextElem;
        this.clear();
    }


    clear(){
        this.previousValue = '';
        this.currentValue = '';
        this.canEdit = true;
        this.operation = undefined;
    }
    
    calc(action){
        let cur = parseFloat(this.currentValue);
        let prev = parseFloat(this.previousValue);

        if (isNaN(cur) && isNaN(prev)) return;
    

        switch (action) {
            case '*':
                this.previousValue = ((prev * 10) * (cur * 10)) / 100 ;
                break;
            case '+':
                this.previousValue = (prev * 10+ cur * 10) / 10;
                break;
            case '÷':
                this.previousValue = ((prev * 10) / (cur * 10));
                break;
            case '-':
                this.previousValue = (prev * 10 - cur * 10) / 10;
                break;
            case 'root':
                if(this.currentValue){
                    if (cur < 0){
                        this.currentValue = 'Error';
                        this.operation = null;
                    }else{
                        this.currentValue = Math.sqrt(cur);
                        if (this.operation===undefined) this.operation = null;
                    }
                    this.canEdit = false;
                } 
                break;
            case '^':
                // this.currentValue = cur ** 2;
                // if (this.operation===undefined) this.operation = null;
                // this.canEdit = false;
                this.previousValue = prev ** cur ;
                break;
            default:
                this.previousValue = this.currentValue;
                break;
        }
       
        

    }

    execOperation(oper){
        if (this.currentValue && this.currentValue!= '-'){
            if (!oper && this.operation === undefined) return;
        
            this.calc(this.operation);
            this.currentValue = '';
            this.canEdit = true;

            this.operation = oper;
            if (!oper){
                this.currentValue = this.previousValue;
                this.previousValue = '';
            }
        }else{
            if (oper=='-'){
                this.currentValue = '-';
            }
        }
         
    }


    addNumber(number){
        
        if (number == '.' && this.currentValue.toString().indexOf(number) > -1) return;

        if (this.operation === null ||  this.canEdit== false ) {
            this.currentValue = '';
            this.operation = (this.canEdit) ? undefined : this.operation;
            this.canEdit = true;
        }

        let curNum = (this.currentValue)?this.currentValue:0;

        curNum = curNum + number;
        
        this.currentValue = curNum;
        
    }

    delete(){
        let strVal = this.currentValue.toString()
        
        if (this.canEdit){
            this.currentValue = parseFloat(strVal.substring(0, strVal.length - 1));
        }
    }


    getDisplayNumber(num) {
        const stringNumber = (typeof num=='string')? num : num.toString() ;
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
          integerDisplay = '';
        } else {
          integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
          return `${integerDisplay}.${decimalDigits}`;
        } else {
          return integerDisplay;
        }
      }

    showExpression(){
       
        if (this.currentValue =='Error'|| this.currentValue == '-' ){
            this.currentValueTextElem.textContent = this.currentValue;
        }else{
            this.currentValueTextElem.textContent = this.getDisplayNumber(this.currentValue);
        }

        
        this.previousValueTextElem.textContent = this.getDisplayNumber(this.previousValue);
        if (this.operation){
            this.previousValueTextElem.textContent += ' ' + this.operation;
        }

    }
     
}

const   clearBtn    = document.querySelector('[data-all-clear]'),
        delBtn      = document.querySelector('[data-delete]'),
        operBtn     = document.querySelectorAll('[data-operation]'),
        numberBtn   = document.querySelectorAll('[data-number]'),
        equalsBtn   = document.querySelector('[data-equals]'),
        prevOp      = document.querySelector('[data-previous-operand]'),   
        curOp       = document.querySelector('[data-current-operand]'),
        calcGrid    = document.querySelector('.calculator-grid'),
        rootBtn     = document.querySelector('[data-sqrt]'),
        sqrBtn      = document.querySelector('[data-sqr]');   

const calc = new Calc(prevOp, curOp);

const dataNumberHandler = function(number){
    calc.addNumber(number);
    calc.showExpression();
}

const dataOperationHandler = function(oper){
    calc.execOperation(oper);
    calc.showExpression();
}


calcGrid.addEventListener('click', (evt) => {
    if (evt.target.matches('[data-number]')){
        dataNumberHandler(evt.target.textContent);
    } else if(evt.target.matches('[data-operation]')){
        dataOperationHandler(evt.target.textContent);
    }
});


const clearButtonHandler = function(){
    calc.clear();
    calc.showExpression();
}
clearBtn.addEventListener('click', clearButtonHandler)


const deleteButtonHandler = function(){
    calc.delete();
    calc.showExpression();
}
delBtn.addEventListener('click', deleteButtonHandler)


const equalsButtonHandler = function(){
    calc.execOperation(null);
    calc.showExpression();
}
equalsBtn.addEventListener('click', equalsButtonHandler)


const rootButtonHandler = function(){
    calc.calc('root');
    calc.showExpression();
}
rootBtn.addEventListener('click', rootButtonHandler)

const sqrButtonHandler = function(){
    calc.execOperation('^');
    calc.showExpression();
}
sqrBtn.addEventListener('click', sqrButtonHandler)


 

const keyDownHandler = function(evt){
    let key = evt.key;
    const keyCode = evt.keyCode;

    if (KEY_LIST.indexOf(key) < 0) return;

    if (KEY_LIST.indexOf(key) < 11){
        dataNumberHandler(key);
    }else if ('-+*/'.indexOf(key) > -1){
        key = (key == '/') ? '÷' : key;
        dataOperationHandler(key);
    }else if (key == 'Backspace' || keyCode == KEYCODE_BACKSPACE){
        deleteButtonHandler();
    }else if (key == 'Escape'|| key == 'Delete' || keyCode == KEYCODE_ESCAPE || keyCode == KEYCODE_DELETE ){
        clearButtonHandler();
    }else if (key == 'Enter'|| keyCode == KEYCODE_ENTER || key == '='){
        equalsButtonHandler();
    }else if (key == '^'){
        sqrButtonHandler();
    }
}
document.addEventListener('keyup', keyDownHandler);
