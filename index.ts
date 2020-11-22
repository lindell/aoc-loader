import got from 'got';
import os from 'os';
import path from 'path';
import { promises } from 'fs';
import crypto from 'crypto';

const { readFile, writeFile } = promises;

async function getInput(
    year: number,
    day: number,
    session = process.env.AOC_SESSION,
): Promise<string | undefined> {
    if (session === undefined) {
        return Promise.reject(
            new Error('No session provided or exist as the AOC_SESSION environment variable'),
        );
    }

    const hash = crypto.createHash('sha256');
    hash.update(session);
    const hashedSession = hash.digest('hex');

    const filename = `aoc-${year}-${day}-${hashedSession}`;
    const tempPath = path.join(os.tmpdir(), filename);

    let ret: string | undefined;
    try {
        const input = await readFile(tempPath)
            .then((buffer) => buffer.toString('utf8'))
            .catch(() => {
                return got(`https://adventofcode.com/${year}/day/${day}/input`, {
                    headers: {
                        Cookie: `session=${session}`,
                    },
                    resolveBodyOnly: true,
                });
            });

        ret = input.replace(/\n$/, '');
        await writeFile(tempPath, ret);
    } catch (_error) {
        // Don't do anything if it fails
    }

    return ret;
}

export default getInput;

// For CommonJS default export support
module.exports = getInput;
