const Queue = require('../index');
const rows = new Array(10).fill(1).map((v, index) => index);
const waitMs = (t) => new Promise((r) => setTimeout(r, t));
const queue = new Queue({
    start: true,
    limit: 3,
    async process(val, taskId) {
        let t = parseInt(Math.random() * 1000) + 400;
        console.log("run ===>", val, " wait(ms)", t, taskId);
        await waitMs(t);
        console.log("end ----", val, " wait(ms)", t, taskId);
    }
});

setInterval(() => {
    queue.push(...rows);
}, 10000);
queue.push(...rows);

