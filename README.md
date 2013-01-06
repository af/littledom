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
* addEventListener() and removeEventListener()
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
    attr(<string>)           -> return the attribute of the first matched element
    attr(<string>, <string>) -> for all matched elements, set the attribute with the given name to the given value.
    attr(<object>)           -> for each matched element, el[attrName] = attrValue for each key, val pair in the object
    removeAttr(<string>)

    on()
    off()
    trigger()
    bind() (legacy)
    unbind() (legacy)


TODO: Add support for:
    .one()
    .find()
    .closest(), .parent(), .children()
    .toggleClass()
    $dom.create(htmlstring)

TODO: rename project (see https://github.com/julienw/dollardom)
