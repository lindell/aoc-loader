Advent of Code Input Loader
----
Loads [Advent of Code](http://adventofcode.com/) the input data for a specified day and year.

Install
----
`npm install aoc-input-loader`

Use
----
````javascript
const inputLoader = require('aoc-input-loader');

inputLoader(year, day, sessionCookie).then(data => {
    console.log(data);
});
````
