const request = require('request-promise-native');
const os = require('os');
const path = require('path');
const fs = require('fs');
const {promisify} = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

function getInput(year, day, session = process.env.AOC_SESSION) {
    if (session === undefined) {
        return Promise.reject(new Error("No session provided or exist as the AOC_SESSION environment variable"));
    }

    const filename = `aoc-${year}-${day}-${session}`
    const tempPath = path.join(os.tmpdir(), filename);

    let ret;
    
    return readFile(tempPath)
        .then(buffer => buffer.toString('utf8'))
        .catch(() => {
            return request({
                url: `https://adventofcode.com/${year}/day/${day}/input`,
                headers: {
                    'Cookie': `session=${session}`,
                }
            });
        })
        .then(input => {
            ret = input.replace(/\n$/, "");
            return writeFile(tempPath, ret);
        }, () => {})
        .then(() => ret)
}

module.exports = getInput;
