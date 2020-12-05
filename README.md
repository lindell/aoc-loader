# Advent of Code Input Loader

Loads [Advent of Code](http://adventofcode.com/) input data for a specified day and year. In order not to flood the website, the input data is cached in the temporary folder. The following executions, the data will be read from there.

## Install

```sh
npm install aoc-loader
```

## Use

```javascript
const aocLoader = require('aoc-loader');

const year = 2020;
const day = 1;

aocLoader(year, day, sessionCookie).then((data) => {
    console.log(data);
});
```

If no `sessionCookie` is provided, `aocLoader` will try to get it from the `AOC_SESSION` environment variable. This is the recommended way of using this package.

If neither `sessionCookie` nor the `AOC_SESSION` environment variable is defined, then `aocLoader` will throw an error.

## Get the session cookie

1. Sign in to Advent of Code.
2. Open the developer tools of your browser.
3. Locate the cookies for the website.
    - E.g. in Chrome, you will find them under `Application -> Cookies -> https://adventofcode.com`
4. Copy the value of the `session` cookie.
