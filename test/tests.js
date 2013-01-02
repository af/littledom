// Helper functions for tests:
function assertEqual(val1, val2) {
    if (val1 !== val2) throw new Error('' + val1 + ' !== ' + val2);
}
function QSA(query) {
    return document.querySelectorAll(query);
}

describe('$dom', function() {
    it('h6 query works', function() {
        assertEqual($dom('h6').length, 1);
        assertEqual($dom('h6')[0].tagName, 'H6');
    });
    it('failed query works', function() {
        assertEqual($dom('h6.doesnotexist').length, 0);
    });

    it('each method works', function() {
        var count = 0;
        $dom('#listTest > li').each(function(el, idx) { count++; });
        assertEqual(count, 4);
    });

    it('map method works', function() {
        var result = $dom('#listTest > li').map(function(el) { return el.innerHTML; });
        assertEqual(result.length, 4);
        result.forEach(function(item, idx) {
            assertEqual(item, String(idx + 1));
        })
    });

    it('filter method works', function() {
        var result = $dom('#listTest > li').filter(function(el) { return el.className === 'last'; });
        assertEqual(result.length, 1);
        assertEqual(result[0].innerHTML, '4');
    });

    it('html() works on single elements', function() {
        assertEqual($dom('#htmlTest').html(), 'foo');
        $dom('#htmlTest').html('bar');
        assertEqual(QSA('#htmlTest')[0].innerHTML, 'bar');
    });

    it('html() works on multiple elements', function() {
        assertEqual($dom('#listTest > li').html(), '1');
        $dom('#listTest > li').html('bar');
        assertEqual(QSA('#listTest > li')[0].innerHTML, 'bar');
        assertEqual(QSA('#listTest > li')[1].innerHTML, 'bar');
        assertEqual(QSA('#listTest > li')[2].innerHTML, 'bar');
        assertEqual(QSA('#listTest > li')[3].innerHTML, 'bar');
    });

    it('css() works', function() {
        // Getting style props:
        var selector = '#listTest li:first-child';
        assertEqual($dom(selector).css('color'), 'red');

        // Setting style props:
        $dom(selector).css('color', 'blue');
        assertEqual(QSA(selector)[0].style.color, 'blue');
    });

    it('hasClass() works', function() {
        assertEqual($dom('li').hasClass('asdfasdf'), false);
        assertEqual($dom('li').hasClass('last'), true);
    });

    it('context argument works', function() {
        var context = QSA('#listTest')[0];
        assertEqual($dom('div', context).length, 1);

        // Shouldn't get any results if we pass in an invalid context:
        assertEqual($dom('div', 123).length, 0);
    });

    it('hide() and show() work', function() {
        assertEqual($dom('#hideTest')[0].style.display, '');
        assertEqual($dom('#hideTest').hide()[0].style.display, 'none');
        assertEqual($dom('#hideTest').show()[0].style.display, 'inherit');
    });

    it('attr() and removeAttr() work', function() {
        assertEqual($dom('#hideTest').attr('id'), 'hideTest');
        assertEqual($dom('#hideTest').attr('id', 'foo')[0].id, 'foo');
        assertEqual($dom('#foo').removeAttr('id')[0].id, '');
    });
});
