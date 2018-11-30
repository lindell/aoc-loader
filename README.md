Advent of Code Input Loader
----
Loads [Advent of Code](http://adventofcode.com/) input data for a specified day and year.

Install
----
`npm install aoc-loader`

Use
----
````javascript
const aocLoader = require('aoc-loader');

aocLoader(year, day, sessionCookie).then(data => {
    console.log(data);
});
````

If no `sessionCookie` is provided, aoc-loander will try to get i from the `AOC_SESSION` environment variable. This is recomended the recomended way of using this package.