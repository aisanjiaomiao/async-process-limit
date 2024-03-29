const QUEUE_STATUS = { FREE: 1, RUNNING: 2, };
module.exports = class Queue {
    constructor(config) {
        this.process = config.process;
        this.error = config.error || (() => { });
        this._list = config.list || [];
        this._limit = config.limit || 1;
        this._start = config.start == true;
        this._retry = config.retry || 0;
        this._safetyLock = false;
        this._finish = config.finish || (() => { });
        this.reset();
        if (this._start) this.check();
    }
    static QUEUE_STATUS = QUEUE_STATUS;
    reset() {
        this._processFlag = {};
        for (let i = 0; i < this._limit; i++)this._processFlag[i] = QUEUE_STATUS.FREE;
    }
    push() {
        if (!arguments||arguments.length === 0) return;
        this._safetyLock = true;
        for (let i = 0; i < arguments.length; i++)this._list.push(arguments[i]);
        this._safetyLock = false;
        this.check();
    }
    concat(list) {
        if (!list || !Array.isArray(list) || !list.length) return;
        this._safetyLock = true;
        this._list = this._list.concat(list);
        this._safetyLock = false;
        this.check();
    }
    check() {
        if (!this._start || !this._list.length) return;
        let self = this;
        let next = (taskId) => {
            if (!self._start || !self._list.length || self._safetyLock || !self._processFlag[taskId]) {
                if (!Object.values(this._processFlag).includes(QUEUE_STATUS.RUNNING)) self._finish();
                return;
            }
            self._safetyLock = true;
            let item = self._list.shift();
            self._safetyLock = false;
            self._processFlag[taskId] = QUEUE_STATUS.RUNNING;
            let tryCount = 0, fn, promise;
            let start = () => { self._processFlag[taskId] = QUEUE_STATUS.FREE; next(taskId); };
            let execute = () => { promise.then(start).catch(onerr); };
            let onerr = (err) => { self.error(err, item, tryCount, taskId), (++tryCount < self._retry ? execute() : start()); };
            try {
                fn = typeof self.process === 'function' ? self.process(item, taskId) : item;
                promise = typeof fn == 'function' ? fn() : (fn && typeof fn.then == 'function' ? fn : (new Promise((resolve) => resolve(fn))));
                (promise.then ? execute : start)();
            } catch (error) {
                onerr(error);
            }
        };
        for (let k in this._processFlag)
            if (this._processFlag[k] === QUEUE_STATUS.FREE) next(k);
    }
    stop() {
        this._start = false;
    }
    start() {
        this._start = true;
        this.check();
    }
    end() {
        this._list = [];
        this._start = false;
        this.reset();
    }
    clear() {
        this.end()
    }
    setLimit(limit) {
        this._limit = limit;
        this.reset();
        this.check();
    }
    get size() {
        return this._list.length;
    }
}