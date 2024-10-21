// Uncomment the code below and write your tests
import {
  // readFileAsynchronously,
  doStuffByTimeout,
  doStuffByInterval,
  readFileAsynchronously,
} from '.';

import setTimeout = jest.setTimeout;
import * as fs from 'node:fs';

describe('doStuffByTimeout', () => {
  beforeAll(() => jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  test('should set timeout with provided callback and timeout', () => {
    const callbackFn = jest.fn();
    jest.spyOn(global, 'setTimeout');
    doStuffByInterval(callbackFn, 5000);
    expect(setTimeout).toHaveBeenCalledWith(callbackFn, setTimeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 1000);
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    jest.spyOn(global, 'setInterval');
    doStuffByInterval(callback, 1000);
    expect(setInterval).toHaveBeenCalledWith(callback, 1000);
  });
  test('should call callback multiple times after multiple intervals', () => {
    const callbackFn = jest.fn();
    jest.spyOn(global, 'setInterval');
    doStuffByInterval(callbackFn, 1000);
    jest.advanceTimersByTime(3000);
    expect(callbackFn).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const mockedPathToFile: string | null = 'mockFile.txt';
  const mockedFileContent = `console.log('Hello, Jest!')`;

  // let spyOnJoin: jest.SpyInstance;
  let spyOnExistSync: jest.SpyInstance;
  let spyOnReadFile;

  beforeEach((): void => {
    // spyOnJoin = jest.spyOn(path, 'join');

    spyOnExistSync = jest.spyOn(fs, 'existsSync');
    spyOnExistSync.mockReturnValue(false);

    spyOnReadFile = jest.spyOn(fs.promises, 'readFile');
    spyOnReadFile.mockResolvedValue(Buffer.from(mockedFileContent));
  });
  afterEach(() => jest.clearAllMocks());

  // test('should call join with pathToFile', async () => {
  //   await readFileAsynchronously(mockedPathToFile);
  //   expect(spyOnJoin).toBeCalled();
  // });

  test('should return null if file does not exist', async () => {
    await expect(readFileAsynchronously(mockedPathToFile)).resolves.toBeNull();
  });

  test('should return file content if file exists', async () => {
    spyOnExistSync.mockReturnValueOnce(true);
    await expect(readFileAsynchronously(mockedPathToFile)).resolves.toBe(
      mockedFileContent,
    );
  });
});
