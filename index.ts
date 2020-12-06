import got from 'got';
import os from 'os';
import path from 'path';
import { promises } from 'fs';
import crypto from 'crypto';

const { readFile, writeFile } = promises;

async function aocLoader(year: number, day: number, session = process.env.AOC_SESSION): Promise<string> {
    if (session === undefined) {
        throw new Error('No session provided or exist as the AOC_SESSION environment variable');
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
            .catch(() =>
                got(`https://adventofcode.com/${year}/day/${day}/input`, {
                    headers: {
                        Cookie: `session=${session}`,
                    },
                    resolveBodyOnly: true,
                }),
            );

        ret = input.replace(/\n$/, '');
        await writeFile(tempPath, ret);
    } catch (error) {
        throw new Error(
            `Failed to fetch AoC data for year ${year} day ${day}${error instanceof Error ? `: ${error.message}` : ''}`,
        );
    }

    return ret;
}

export default aocLoader;

// For CommonJS default export support
module.exports = aocLoader;
