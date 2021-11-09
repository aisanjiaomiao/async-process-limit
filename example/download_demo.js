const fetch = require("node-fetch");// "node-fetch": "^2.6.6"
const path = require("path");
const fs = require("fs");
const Queue = require('../index');
const rows = new Array(99).fill(1).map((v, index) => index);
const dowanload = (u, p, c) => {
    return new Promise(function (resolve, reject) {
        fetch(u, c || {
            method: 'GET',
            headers: { 'Content-Type': 'application/octet-stream' },
        }).then(res => res.buffer()).then(_ => {
            fs.writeFile(p, _, "binary", function (err) {
                if (err) reject(err);
                else resolve(p);
            });
        }).catch(reject);
    });
};
const urls = ["https://nodejs.org/dist/v16.13.0/SHASUMS256.txt", "https://nodejs.org/dist/v16.13.0/SHASUMS256.txt.asc", "https://nodejs.org/dist/v16.13.0/SHASUMS256.txt.sig", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-aix-ppc64.tar.gz", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-darwin-arm64.tar.gz", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-darwin-arm64.tar.xz", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-darwin-x64.tar.gz", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-darwin-x64.tar.xz", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-headers.tar.gz", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-headers.tar.xz", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-linux-arm64.tar.gz", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-linux-arm64.tar.xz", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-linux-armv7l.tar.gz", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-linux-armv7l.tar.xz", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-linux-ppc64le.tar.gz", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-linux-ppc64le.tar.xz", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-linux-s390x.tar.gz", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-linux-s390x.tar.xz", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-linux-x64.tar.gz", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-linux-x64.tar.xz", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-win-x64.7z", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-win-x64.zip", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-win-x86.7z", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-win-x86.zip", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-x64.msi", "https://nodejs.org/dist/v16.13.0/node-v16.13.0-x86.msi", "https://nodejs.org/dist/v16.13.0/node-v16.13.0.pkg", "https://nodejs.org/dist/v16.13.0/node-v16.13.0.tar.gz", "https://nodejs.org/dist/v16.13.0/node-v16.13.0.tar.xz"];
const queue = new Queue({
    list: urls,
    start: true,
    limit: 5,
    retry: 3,
    async process(val, taskId) {
        console.log("taskId", taskId, "download:", val);
        let filePath = path.join(__dirname, path.basename(val));
        if (fs.existsSync(filePath)) return;//跳过已存在 
        await dowanload(val, filePath);
        console.log(val, '=====>', filePath);
    },
    error(e) {
        console.error(e)
    }
});
