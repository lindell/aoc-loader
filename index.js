const request = require('request-promise-native');
const os = require('os');
const path = require('path');
const fs = require('fs');
const {promisify} = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function getInput(year, day, session) {
    const filename = `aoc-${year}-${day}`
    const tempPath = path.join(os.tmpdir(), filename);

    try {
        const buffer = await readFile(tempPath);
        return buffer.toString('utf8');
    }
    catch (e) {}

    let input = await request({
        url: `http://adventofcode.com/${year}/day/${day}/input`,
        headers: {
            'Cookie': `session=${session}`,
        }
    })
    input = input.replace(/\n$/, "");

    writeFile(tempPath, input);

    return input;
}

module.exports = getInput;
