'use strict';

const runProviderTests = require('./test-providers');
const runProgressTests = require('./test-progress-parser');
const runFileDiscoveryTests = require('./test-file-discovery');

function run() {
    runProviderTests();
    runProgressTests();
    runFileDiscoveryTests();
    console.log('All VideoFetch tests passed.');
}

if (require.main === module) {
    run();
}
