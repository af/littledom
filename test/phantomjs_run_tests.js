var page = require('webpage').create();
var system = require('system');
var dir = require('fs').workingDirectory;

var address = 'file://' + dir + '/test/tests.html';
page.open(address, function () {
    // Give some time for in-page tests to run (not sure why we need so much time though):
    setTimeout(function() {
        page.onConsoleMessage = function (msg) { console.log(msg); };

        var testsPassed = page.evaluate(function() {
            var failCount = parseInt(document.querySelector('#stats .failures em').innerText, 10);
            var passCount = parseInt(document.querySelector('#stats .passes em').innerText, 10);

            // Log all error text from mocha's html to the console:
            var failElements = document.querySelectorAll('li.test.fail');
            for (var i=0, l=failElements.length; i<l; i++) {
                console.log('FAILED: ' + failElements[i].innerText + '\n');
            }

            console.log(passCount + ' passed, ' + failCount + ' failed.');
            return (failCount === 0) && (passCount > 0);
        });
        phantom.exit(testsPassed ? 0 : 1);
    }, 4000);
});
