const Queue = require('../index');
const waitMs = (t) => new Promise((r) => setTimeout(r, t));
const rows = new Array(99).fill(1).map((v, index) => (async () => {
    let t = parseInt(Math.random() * 1000) + 400;
    console.log("run ===>", index, " wait(ms)", t);
    await waitMs(t);
    console.log("end ----", index, " wait(ms)", t);
}));
const queue = new Queue({
    list: rows,
    limit: 3,
    start: true,
    retry: 3,
});
