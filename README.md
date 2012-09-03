dollardom
=========

dollardom is a really tiny jQuery work-alike. Its goal is to see how much of jQuery's
DOM manipulation functionality can be fit into 1k (minified & gzipped) if old browser
support (IE < 9) is not required.

Depends on
----------
* document.querySelectorAll() (used for all DOM searches)
* DOMContentLoaded
* ECMAScript 5 Array methods (map, filter, forEach, etc)

API
---
$dom.ready() - equivalent to $(document).ready()

html()
css()
each()
map()
filter()

addClass()
removeClass()
hasClass()

TODO: Add support for:
.on(), .off(), .one(), .trigger()
.attr(), .removeAttr()
.find()
.closest(), .parent(), .children()
.toggleClass()

TODO: rename project (see https://github.com/julienw/dollardom)
