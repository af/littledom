dollardom
=========

dollardom is a really tiny jQuery work-alike. Its goal is to see how much of jQuery's
DOM manipulation functionality can be fit into 1k (minified & gzipped) if old browser
support (IE < 9) is not required.

dollardom is *not* a drop-in replacement for jQuery, but it does implement most of its
most commonly used methods.

Depends on
----------
* document.querySelectorAll() (used for all DOM searches)
* DOMContentLoaded
* ECMAScript 5 Array methods (map, filter, forEach, etc)

API
---

## Non-jQuery methods:

    $dom.ready() - equivalent to $(document).ready()

## Supported jQuery API subset:

    html()
    each()
    map()
    filter()

    addClass()
    removeClass()
    hasClass()

    css()
    show()
    hide()
    attr()
    removeAttr()

TODO: Add support for:
.on(), .off(), .one()
.find()
.closest(), .parent(), .children()
.toggleClass()
$dom.create(htmlstring)

TODO: rename project (see https://github.com/julienw/dollardom)
