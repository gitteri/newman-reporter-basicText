# Basic text reporter for Newman

## Installation
Run `npm install --save newman-reporter-text`

## Usage
In order to use this custom reporter, simply add 'text' to the list of reporters.

### Options
This text reporter also accepts three options.
* export: If you'd like newman to output the results of the collection to a file, enter the file name under the 'export' property.
* cli: If you'd like newman to output the results of the collection to stdout, set the 'cli' property as 'true' (string not bool).
* rolling: If you'd like newman to output the results to a new file based on the current day set this property to 'true'

Note that you do not have to do `require('newman-reporter-text')` anywhere as newman will automatically require the package when the collection is run.

```
newman.run({
    collection: require('./tests.postman_collection.json'),
    reporters: 'text',
    reporter: {
        'text': {
            // Take output and save it to file
            export: `./logs/${startTime}.txt`,
            // Output to rolling file based on current day
            rolling: 'ture',
            // Output the results to stdout
            cli: 'true'
        }
    }
}, function (err) {
    if (err) { throw err; }
});
```

```
newman run ./tests.postman_collection.json --reporter text --reporter-text-export './logs/output.txt' --reporter-text-rolling 'true' --reporter-text-cli 'true'
```

## Example Output
```
< Start collection run
< ✔ Assertion passed! [1 / 3] "User successfully logged in" (duration 312) ms"
< ✔ Assertion passed! [2 / 3] "User profile should exist for user" (duration 229) ms"
< ✗ Assertion failed! [3 / 3] "No results in elastic search (ADMIN view)" (duration 108) ms"
< Collection run completed for collection: 3 tests executed
```
