module.exports = function(newman, reporterOptions) {
    var basicOutput = '';
    var useCli = reporterOptions.cli && reporterOptions.cli === 'true';
    let newmanCollection = reporterOptions.collection;
    
    function log(str) {
        if (useCli) {
            process.stdout.write(str);
        } else {
            basicOutput += str;
        }
    }

    newman.on('start', () => {
        log(`Start collection run\n`);
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
        newman.exports.push({
            name: 'basic-reporter',
            default: 'newman-run-report.txt',
            path: reporterOptions.export,
            content: basicOutput
        });
    });
}
