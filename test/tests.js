// Helper functions for tests:
function assertEqual(val1, val2) {
    if (val1 !== val2) throw new Error('' + val1 + ' !== ' + val2);
}
function QSA(query) {
    return document.querySelectorAll(query);
}

describe('$dom', function() {
    var testHtml = document.querySelector('#test_elements').innerHTML;

    beforeEach(function() {
        document.querySelector('#test_elements').innerHTML = testHtml;
    });

    describe('querying', function() {
        it('works when window is passed in', function() {
            var q = $dom(window);
            assertEqual(q.length, 1);
            assertEqual(q[0], window);
        });

        it('works when document is passed in', function() {
            var q = $dom(document);
            assertEqual(q.length, 1);
            assertEqual(q[0], document);
        });

        it('works when an element from the dom is passed in', function() {
            var q = $dom(document.querySelector('div'));
            assertEqual(q.length, 1);
            assertEqual(q[0].tagName, 'DIV');
        });

        it('h6 query works', function() {
            assertEqual($dom('h6').length, 1);
            assertEqual($dom('h6')[0].tagName, 'H6');
        });

        it('failed query behaves as expected', function() {
            assertEqual($dom('h6.doesnotexist').length, 0);
        });

        it('context argument works', function() {
            var context = QSA('#listTest')[0];
            assertEqual($dom('div', context).length, 1);

            // Shouldn't get any results if we pass in an invalid context:
            assertEqual($dom('div', 123).length, 0);
        });
    });


    describe('array methods', function() {
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
    });

    describe('modification', function() {
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

        it('attr() and removeAttr() work', function() {
            assertEqual($dom('#hideTest').attr('id'), 'hideTest');
            assertEqual($dom('#hideTest').attr('id', 'foo')[0].id, 'foo');
            assertEqual($dom('#foo').removeAttr('id')[0].id, '');
        });
    });

    describe('css', function() {
        it('css() works', function() {
            // Getting style props:
            var selector = '#listTest li:first-child';
            assertEqual($dom(selector).css('color'), 'red');

            // Setting style props:
            $dom(selector).css('color', 'blue');
            assertEqual(QSA(selector)[0].style.color, 'blue');
        });

        it('hide() and show() work', function() {
            assertEqual($dom('#hideTest')[0].style.display, '');
            assertEqual($dom('#hideTest').hide()[0].style.display, 'none');
            assertEqual($dom('#hideTest').show()[0].style.display, 'inherit');
        });
    });

    describe('classes', function() {
        it('hasClass() works', function() {
            assertEqual($dom('li').hasClass('asdfasdf'), false);
            assertEqual($dom('li').hasClass('last'), true);
        });
    });

    describe('events', function() {
        var count = 0;
        var handler = function(evt) { count++; };
        var handler2 = function() { count += 10; };
        var $el = $dom('h6');

        afterEach(function() {
            count = 0;
            $el.off('click', handler);
            $el.off('click', handler2);
            $el.off('foobaz', handler);
        });

        it('on(), off(), and trigger() work for simulated click events', function() {
            $el.on('click', handler);
            assertEqual(count, 0);
            $el.trigger('click');
            assertEqual(count, 1);
            $el.trigger('click');
            assertEqual(count, 2);
            $el.trigger('keyup');
            assertEqual(count, 2);

            // Remove the handler:
            $el.off('click', handler);
            $el.trigger('click');
            assertEqual(count, 2);

            // ...and re-apply it:
            $el.on('click', handler);
            $el.trigger('click');
            assertEqual(count, 3);
        });

        it('on(), off(), and trigger() work with custom event names', function() {
            $el.on('foobaz', handler);
            assertEqual(count, 0);
            $el.trigger('foobaz');
            assertEqual(count, 1);
            $el.trigger('foobaz');
            assertEqual(count, 2);
            $el.trigger('keyup');
            assertEqual(count, 2);

            $el.off('foobaz', handler);
            $el.trigger('foobaz');
            assertEqual(count, 2);
        });

        it('bind() and unbind() work like their jQuery equivalents for the simple case', function() {
            $el.bind('click', handler);
            assertEqual(count, 0);
            $el.trigger('click');
            assertEqual(count, 1);
            $el.trigger('click');
            assertEqual(count, 2);
            $el.trigger('keyup');
            assertEqual(count, 2);

            // Remove the handler:
            $el.unbind('click', handler);
            $el.trigger('click');
            assertEqual(count, 2);

            // ...and re-apply it:
            $el.bind('click', handler);
            $el.trigger('click');
            assertEqual(count, 3);
        });

        it('multiple handlers work as expected', function() {
            $el.on('click', handler);
            $el.on('click', handler2);
            $el.trigger('click');
            assertEqual(count, 11);
            $el.trigger('click');
            assertEqual(count, 22);

            // Remove the first handler and only the second one is invoked:
            $el.off('click', handler);
            $el.trigger('click');
            assertEqual(count, 32);

            // ...and re-apply it:
            $el.on('click', handler);
            $el.trigger('click');
            assertEqual(count, 43);
        });
    });
});
