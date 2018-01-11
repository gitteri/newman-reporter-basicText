const fs = require('fs');
const mkdirp = require('mkdirp');
const parsePath = require('path').parse;
const joinPath = require('path').join;

/**
 * The root path specifier
 *
 * @const
 * @private
 * @type {string}
 */
const E = '';

/**
 * Generate a timestamp from date
 *
 * @param {Date=} date - The timestmap used to mark the exported file.
 * @returns {String} - yyyy-mm-dd
 */
const timestamp = function (date) {
    // use the iso string to ensure left padding and other stuff is taken care of
    return (date || new Date()).toISOString().split('T')[0].replace(/-/g, '');
};

/**
 * Module whose job is to export a file which is in an export format.
 *
 * @param {Object} options - The set of file export options.
 * @param {String} options.path - The path to the exported file.
 * @param {String|Object} options.content - The JSON / stringified content that is to be written to the file.
 * @param {Function} done - The callback whose invocation marks the end of the file export routine.
 * @returns {*}
 */
module.exports = function (options, done) {
    // parse the path if one is available as string
    let path = (typeof options.path === 'string') && parsePath(options.path);
    let content = options.content || E;

    // if a path was not provided by user, we need to prepare the default path, but create the default path only if one
    // is provided.
    if (!path && (typeof options.default === 'string')) {
        path = parsePath(options.default);
        // delete the path and directory if one is detected when parsing defaults
        path.root = E;
        path.dir = 'newman';
    }
    // final check that path is valid
    if (!(path && path.name)) {
        console.log(`path ${path.name} is not valid`)
        return;
    }

    // now sore the unparsed result back for quick re-use during writing and a single place for unparsing
    path.unparsed = joinPath(path.dir, `${path.name}-${timestamp()}${path.ext}`);

    // in case the path has a directory, ensure that the directory is available
    if (path.dir) {
        mkdirp(path.dir, function (err) {
            if (err) {
                err.help = `error creating path for file "${path.unparsed}" for ${options.name || 'unknown-source'}`;
                if (done) {
                    return done(err, path);
                } else {
                    console.log(err);
                    return err;
                }
            }

            fs.appendFile(path.unparsed, content, function (err) {
                if (err) err.help = `error writing file "${path.unparsed}" for ${options.name || 'unknown-source'}`;
                if (done) {
                    done(err, path);
                } else {
                    if (err) console.log(err);
                }
            });
        });
    }
    else {
        fs.appendFile(path.unparsed, content, function (err) {
            if (err) err.help = `error writing file "${path.unparsed}" for ${options.name || 'unknown-source'}`;
            if (done) {
                done(err, path);
            } else {
                if (err) console.log(err);
            }
        });
    }
};
