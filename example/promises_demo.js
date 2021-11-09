const Queue = require('../index');
const rows = new Array(99).fill(1).map((v, index) => (() => new Promise((r) => {
    let t = parseInt(Math.random() * 1000) + 400;
    console.log("run ===>", index, " wait(ms)", t);
    setTimeout(() => {
        console.log("end ----", index, " wait(ms)", t);
        r(t);
    }, t);
})));
const queue = new Queue({
    list: rows,
    limit: 3,
    start: true,
    retry: 3,
});
