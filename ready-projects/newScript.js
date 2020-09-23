class Calc{
    constructor(previousValueTextElem, currentValueTextElem){
        this.previousValueTextElem = previousValueTextElem;
        this.currentValueTextElem = currentValueTextElem;
        this.clear();
    }


    clear(){
        this.previousValue = '';
        this.currentValue = '';
        this.operation = undefined;
    }

    calc(){
        switch (this.operation) {
            case '*':
                this.previousValue = parseFloat(this.previousValue) * parseFloat(this.currentValue);
                break;
            case '+':
                this.previousValue = parseFloat(this.previousValue) + parseFloat(this.currentValue);
                break;
            case '÷':
                this.previousValue = parseFloat(this.previousValue) / parseFloat(this.currentValue);
                break;
            case '-':
                this.previousValue = parseFloat(this.previousValue) - parseFloat(this.currentValue);
                break
            default:
                this.previousValue = this.currentValue;
                break;
        }
        this.operation = undefined;
        this.currentValue = '';

    }

    execOperation(oper){
        if (!this.currentValue) return;
        if (!oper && this.operation === undefined) return;

        this.calc();

        this.operation = oper;
        if (!oper){
            this.currentValue = this.previousValue;
            this.previousValue = '';
        }

    }


    addNumber(number){

        if (number == '.' && this.currentValue.indexOf(number) > -1) return;

        if (this.operation === null) {
            this.currentValue = '';
            this.operation = undefined;
        }

        let curNum = this.currentValue;

        if (number != '.'){
            curNum = parseFloat(curNum + number).toString();
        } else{
            curNum = curNum + number;
        }
        this.currentValue = curNum;

    }

    delete(){
        this.currentValue = this.currentValue.substring(0, this.currentValue.length - 1);
    }

    showExpression(){
        this.currentValueTextElem.textContent = this.currentValue.toString();
        this.previousValueTextElem.textContent = this.previousValue.toString();
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
        calcGrid    = document.querySelector('.calculator-grid');   

const calc = new Calc(prevOp, curOp);

const dataNumberHandler = function(number){
    calc.addNumber(number);
    calc.showExpression();
}

const dataOperationHandler = function(oper){
    calc.execOperation(oper);
    calc.showExpression();
}

calcGrid.addEventListener('click', (ev) => {
    if (ev.target.matches('[data-number]')){
        dataNumberHandler(ev.target.textContent);
    } else if(ev.target.matches('[data-operation]')){
        dataOperationHandler(ev.target.textContent)
    }
});


const clearHandler = function(){
    calc.clear();
    calc.showExpression();
}
clearBtn.addEventListener('click', (ev) => {
    clearHandler();
})


const deleteHandler = function(){
    calc.delete();
    calc.showExpression();
}
delBtn.addEventListener('click', (ev) => {
    deleteHandler();
})


const equalsHandler = function(){
    calc.execOperation(null);
    calc.showExpression();
}
equalsBtn.addEventListener('click', (ev) => {
    equalsHandler();
})