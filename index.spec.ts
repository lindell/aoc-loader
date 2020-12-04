import got from 'got';
import crypto from 'crypto';
import { promises } from 'fs';
import { mocked } from 'ts-jest/utils';
import aocLoader from '.';

jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn().mockRejectedValue(Error("No such file or directory, open 'filename'")),
        writeFile: jest.fn(),
    },
}));

jest.mock('got', () => jest.fn().mockResolvedValue('Input from web'));

const readFileMock = mocked(promises.readFile);
const writeFileMock = mocked(promises.writeFile);
const gotMock = mocked(got);

describe('aocLoader', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw if no session token is given nor AOC_SESSION is set', async () => {
        await expect(aocLoader(2020, 1)).rejects.toThrow(
            'No session provided or exist as the AOC_SESSION environment variable',
        );
    });

    it('should use the session argument before AOC_SESSION', async () => {
        process.env.AOC_SESSION = 'env-var-token';
        const sessionArgument = 'argument-token';

        await aocLoader(2020, 1, sessionArgument);

        expect(gotMock).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ headers: { Cookie: `session=${sessionArgument}` } }),
        );
    });

    it('should use the AOC_SESSION environment if no session argument is given', async () => {
        const envVar = 'env-var-token';
        process.env.AOC_SESSION = envVar;

        await aocLoader(2020, 1);

        expect(gotMock).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ headers: { Cookie: `session=${envVar}` } }),
        );
    });

    it('should throw if the input is not cached and request fails', async () => {
        gotMock.mockRejectedValueOnce(Error('Failed to fetch input'));

        await expect(aocLoader(2020, 1, 'session-token')).rejects.toThrow(
            'Failed to fetch AoC data for year 2020 day 1: Failed to fetch input',
        );
    });

    it('should not write to cache if request fails', async () => {
        gotMock.mockRejectedValueOnce('Failed to fetch input');

        await expect(aocLoader(2020, 1, 'session-token')).rejects.toThrow();

        expect(writeFileMock).not.toHaveBeenCalled();
    });

    it('should fetch input data from adventofcode.com', async () => {
        await expect(aocLoader(2017, 25, 'session-token')).resolves.toEqual('Input from web');

        expect(gotMock).toHaveBeenCalledWith('https://adventofcode.com/2017/day/25/input', expect.anything());
    });

    it('should write to cache file if request is successful and cache does not exist', async () => {
        const sessionToken = 'session-token';

        await aocLoader(2020, 1, sessionToken);

        const hash = crypto.createHash('sha256');
        hash.update(sessionToken);
        const hashedSession = hash.digest('hex');

        expect(writeFileMock).toHaveBeenCalledWith(`/tmp/aoc-2020-1-${hashedSession}`, 'Input from web');
    });

    it('should read cache file if it exist and not request input anew', async () => {
        readFileMock.mockResolvedValueOnce(Buffer.from('Input from file', 'utf8'));

        const sessionToken = 'session-token';

        await expect(aocLoader(2019, 5, sessionToken)).resolves.toEqual('Input from file');

        const hash = crypto.createHash('sha256');
        hash.update(sessionToken);
        const hashedSession = hash.digest('hex');

        expect(readFileMock).toHaveBeenCalledWith(`/tmp/aoc-2019-5-${hashedSession}`);
        expect(gotMock).not.toHaveBeenCalled();
    });

    it('should remove trailing newline from input', async () => {
        gotMock.mockResolvedValueOnce('Input from web\n');

        await expect(aocLoader(2020, 1, 'session-token')).resolves.toEqual('Input from web');
    });
});
