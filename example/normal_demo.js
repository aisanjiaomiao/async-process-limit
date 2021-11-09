const Queue = require('../index');
const rows = new Array(99).fill(1).map((v, index) => index); 
const queue = new Queue({
    list: rows,
    start: true,
    limit: 3,
    process(val, taskId) {
        return new Promise((r) => {
            let t = parseInt(Math.random() * 1000) + 400;
            console.log("run ===>", taskId, ":", val, " wait(ms)", t,);
            setTimeout(() => {
                console.log("end ----", taskId, ":", val, " wait(ms)", t,);
                r();
            }, t);
        });
    },
});
