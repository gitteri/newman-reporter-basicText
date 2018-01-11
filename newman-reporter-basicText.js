const exportFile = require('./rollingExport');

module.exports = function(newman, reporterOptions) {
    var basicOutput = '';
    let useRolling = reporterOptions.rolling && reporterOptions.rolling === 'true';
    let useExport = reporterOptions.export && typeof reporterOptions.export === 'string';
    var useCli = reporterOptions.cli && reporterOptions.cli === 'true';
    let newmanCollection = reporterOptions.collection;

    function log(str) {
        if (useRolling || useExport) basicOutput += str;
        if (useCli) process.stdout.write(str);
    }

    // Add time length for all tests
    newman.on('start', () => {
        log(`Start collection run at ${new Date()}\n`);
        this.count = 1;
    });

    newman.on('beforeItem', (err, o) => { });

    newman.on('beforeRequest', (err, o) => { });

    newman.on('request', (err, o) => { });

    newman.on('script', (err, o) => { });

    newman.on('assertion', (err, o) => {
        if (err) {
            log(`✗ Assertion failed! [${this.count} / ${o.item.name}]: "${o.assertion}"\n`);
        } else {
            log(` ✔ Assertion passed! [${this.count} / ${o.item.name}]: "${o.assertion}"\n`);
        }

        this.count++;
    });

    newman.on('beforeDone', (err) => {
        if (err) {
            console.log('there was an error');
            return;
        }

        log(`Collection run completed for collection: ${this.count} tests executed\n`);

        // Export to a single file based on rolling option
        let options = {
            name: 'basic-reporter',
            default: 'newman-run-report.txt',
            path: reporterOptions.export,
            content: basicOutput
        };

        if (useRolling) {
            exportFile(options)
        } else {
            newman.exports.push(options);
        }
    });
}
