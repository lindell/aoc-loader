# Advent of Code Input Loader

Loads [Advent of Code](http://adventofcode.com/) input data for a specified day and year.

## Install

```sh
npm install aoc-loader
```

## Use

```javascript
const aocLoader = require('aoc-loader');

aocLoader(year, day, sessionCookie).then((data) => {
    console.log(data);
});
```

If no `sessionCookie` is provided, aoc-loander will try to get i from the `AOC_SESSION` environment variable. This is recomended the recomended way of using this package.

## Get the session cookie

First sign in to advent of code. Then you can open the developer options of your browser and you should be able to find the session set as a cookie.
In Chrome, you will find it under `Application -> Cookies -> https://adventofcode.com`
