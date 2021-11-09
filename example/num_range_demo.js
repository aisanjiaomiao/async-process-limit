const Queue = require('../index');
const waitMs = (t) => new Promise((r) => setTimeout(r, t));

let limit = 10;
let [start, end] = [1, 1234];
const queue = new Queue({
    list: new Array(limit).fill(1).map((v, index) => index + start),
    limit: limit,
    async process(val, taskId) {
        let t = parseInt(Math.random() * 1000) + 400;
        console.log("run ===>", val, " wait(ms)", t, taskId);
        await waitMs(t);
        if (limit < end) {
            limit++;
            queue.push(limit);
        }
        console.log("end ----", val, " wait(ms)", t, taskId);
    },
    error: (...arg) => {
        console.log('err ', arg)
    }
});
queue.start();