module.exports = function(newman, reporterOptions) {
    console.log('Running!');

    let basicOutput = '';
    let newmanCollection = reporterOptions.collection;

    newman.on('start', () => {
        basicOutput += `Start collection run\n`;
        this.count = 1;
    });

    newman.on('beforeItem', (err, o) => { });

    newman.on('beforeRequest', (err, o) => { });

    newman.on('request', (err, o) => { });

    newman.on('script', (err, o) => { });

    newman.on('assertion', (err, o) => {
        if (err) {
            basicOutput += `✗ Assertion failed! [${this.count} / ${o.item.name}]: "${o.assertion}"\n`;
        } else {
            basicOutput += ` ✔ Assertion passed! [${this.count} / ${o.item.name}]: "${o.assertion}"\n`;
        }

        this.count++;
    });

    newman.on('beforeDone', (err) => {
        if (err) {
            console.log('there was an error');
            return;
        }

        basicOutput += `Collection run completed for collection: ${this.count} tests executed\n`;
        newman.exports.push({
            name: 'basic-reporter',
            default: 'newman-run-report.txt',
            path: reporterOptions.export,
            content: basicOutput
        });
    });
}
