class CountUpAnimation{
    //how many times a variable should be incremented
    static numberOfIterations = 100;

    //how long should the animation last
    static animationDuration;

    static onFinishCallback = () => {};

    static elements;

    static observer = new IntersectionObserver((entries) => {
        this.intersectionHandler.call(this, entries);
    }, {threshold: 0.3});

    static init(animationDuration = 3000){
        this.animationDuration = animationDuration;

        this.elements = document.querySelectorAll('.count-up');
        
        this.elements.forEach((element) => {
            this.observer.observe(element);
        });
    }

    static intersectionHandler(entries){
        entries.forEach((entry) => {
            if(entry.isIntersecting){
                this.countUp(entry.target);
            }
        });
    }

    static countUp(element){
        if(isNaN(element.dataset.targetnumber)){
            console.error('The target number provided is not a valid number!');
            this.updateElement(element, element.dataset.targetnumber);
            this.onFinishCallback(element);
            return;
        }
    
        let targetNumber = Number(element.dataset.targetnumber);
        
        let displayOptions = {
            countMode: 'integer',
            decimalPlaces: 0
        }
    
        if(!Number.isInteger(targetNumber)){
            displayOptions.countMode = 'floating';
            displayOptions.decimalPlaces = targetNumber.toString().split(".")[1].length || 0;
        }
    
        let currentNumber;
        let iterationCount = 0;
        let intervalDuration = this.animationDuration / this.numberOfIterations;
    
        let interval = setInterval(() => {
            if(iterationCount == this.numberOfIterations){
                clearInterval(interval);
                this.updateElement(element, Number(element.dataset.targetnumber), displayOptions);
                this.observer.unobserve(element);
                this.onFinishCallback(element);
                return;
            }
    
            currentNumber = this.getNextNumberLogarithmic(++iterationCount, targetNumber);
            this.updateElement(element, currentNumber, displayOptions);
        }, intervalDuration);
    }

    static getNextNumber(currentIteration, targetNumber){
        const exponentialBase = Math.pow(targetNumber, 1 / this.numberOfIterations);
        return Math.pow(exponentialBase, currentIteration);
    }

    static getNextNumberLinear(currentIteration, targetNumber){
        return (targetNumber / this.numberOfIterations) * currentIteration;
    }

    static getNextNumberExponential(currentIteration, targetNumber){
        return targetNumber ** ((currentIteration - 1) / (this.numberOfIterations));
    }

    static getNextNumberLogarithmic(currentIteration, targetNumber){
        return (targetNumber * Math.log(currentIteration)) / Math.log(this.numberOfIterations);
    }

    static updateElement(element, number, displayOptions){
        let formattedNumber;
    
        if(displayOptions?.countMode == 'floating'){
            formattedNumber = (Math.round(number * 100) / 100).toFixed(displayOptions.decimalPlaces);
        }
        else{
            formattedNumber = Math.floor(number) || number;
        }
        
        element.textContent = formattedNumber.toLocaleString();
    }

    static onFinish(onFinishCallback){
        this.onFinishCallback = onFinishCallback;
    }
}