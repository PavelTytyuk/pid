
export default {
    
    pGain: 0,
    iGain: 0,
    dGain: 0,

    lastError: 0,
    integrationStored: 0,
    onProcessEnd: null,


    dInitiated: false,

    processStarted: false,
    processTime: 0,
    processTimeEntries: [],

    setup(pGain, iGain, dGain) {        
        this.pGain = pGain;
        this.iGain = iGain;
        this.dGain = dGain;

        return this;
    },

    update(dt, currentVal, targetVal) {
        let P = 0;
        let I = 0;
        let D = 0;

        let error = targetVal - currentVal;
                

        P = this.pGain * error;
        

        this.integrationStored = this.integrationStored + (error * dt);

        I = this.iGain * this.integrationStored;


        let errorRate = 0;
        if (this.dInitiated) {
            errorRate = (error - this.lastError) / dt;                
            if (this.processStarted) {
                this.processTick(dt, error);
                if (Math.abs(errorRate) < 0.00001) {
                    this.endProcess();
                }
            }
        } else {            
            this.dInitiated = true;
        }       
        this.lastError = error; 

        D = this.dGain * errorRate;

        return P + I + D;
    },
    processTick(dt, value) {
        this.processTime += dt;
        this.processTimeEntries.push({time: this.processTime, value: value})
    },
    startProcess(onProcessEnd) {
        this.onProcessEnd = onProcessEnd || function(time, processTimeEntries) { console.log(time, processTimeEntries)};
        this.processStarted = true;
    },
    endProcess() {
        this.onProcessEnd(this.processTime, this.processTimeEntries, {p: this.pGain, i: this.iGain, d: this.dGain});
        this.processTime = 0;
        this.processStarted = false;
        this.processTimeEntries = [];
    }
}