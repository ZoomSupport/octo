
function Timer (intervals, clb) {

    this.stepTime = 1000; // How often to call timer (CONST)

    this.stepCur = 0;  // Current step
    this.stepMax = 0; // Maximum step number

    this.intCur = 0; // Current Interval

    this.timeout = null; // Timeout function

    this.tick = function () {
        console.log("TICKED " + this.stepCur + "/" + this.stepMax)
        this.stepCur++

        if (this.stepCur >= this.stepMax) {
            clb()
            this.stop()

            if (this.intCur++ < intervals.length) {
                this.start()
            } else {
                this.stop()
            }
        } else {

            this.timeout = setTimeout(this.tick.bind(this), this.stepTime)
        }

    }
    
    /**
     * Starts Timer
     */
    this.start = function () {
        if (this.intCur < intervals.length) return;

        this.stepMax = Math.floor( intervals[this.intCur] / this.stepTime )
        this.timeout = setTimeout(this.tick.bind(this), this.stepTime)
    }

    /**
     * Pauses Timer on current interval
     */
    this.pause = function () {
        clearTimeout(this.timeout)
    }

    /**
     * Stops timer on current interval
     */
    this.stop = function () {
        clearTimeout(this.timeout)

        this.stepCur = 0
        this.stepMax = 0
    }

    /**
     * Resets timer on current interval 
     */
    this.reset = function () {
        this.stepCur = 0
        this.stepMax = 0
    }

    /**
     * Resets current interval
     */
    this.resetInterval = function () {
        this.intCur = 0
    }
   
}

module.exports = Timer