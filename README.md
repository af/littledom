[![Build Status](https://secure.travis-ci.org/af/littledom.png)](http://travis-ci.org/af/littledom)

littledom
=========

littledom is a really tiny (experimental) jQuery work-alike for modern browsers. Think of it
as a curated jQuery subset, optimized for readability and file size.

littledom is *not* a drop-in replacement for jQuery, but it does implement many of its
most commonly used methods. In many cases, not all method signatures are supported either.
This keeps the code lean and pretty simple to read. The following parts of jQuery
are intentionally omitted- if you need them you might consider a best-of-breed
standalone library instead:

    * ajax() and friends
    * promises
    * any polyfills (a standards-compliant browser is assumed)
    * utilities intended for objects and arrays ($.each, $.map, etc)
    * anything else that falls outside out DOM querying and manipulation

Check out [the source code](https://github.com/af/littledom/blob/master/littledom.js),
it's concise and should be easy to read and understand.


Stick with jQuery if:
---------------------
* You need to support IE8 or below
* You need to use jQuery plugins
* You want a really well-tested library (this one is still experimental)


Browser API dependencies:
-------------------------
* document.querySelectorAll() (used for all DOM searches)
* addEventListener() and removeEventListener()
* DOMContentLoaded
* ECMAScript 5 Array methods (map, filter, forEach, etc)


API
---

## Basic API format

    $dom(selectorString, contextElement).<method>(<args>);

## Non-jQuery methods and attributes:

    $dom.ready(callback)    -> equivalent to $(document).ready(callback)
    $dom.browserSupported   -> boolean indicating whether the browser is supported by the library.
    $dom.create(htmlString) -> create a set of elements from an html string (like $(htmlString))

## Supported jQuery API subset:

```
    // Manipulation:
    html()                  -> return the innerHTML of the first matched element
    html(contents)          -> sets innerHTML for all matched elements to the given string
    find(selector)
    remove()                -> remove all matched elements from the document (doesn't take any arguments)
    data(attrName)          -> return the value of the given data-* attribute (for the first matched element where it's set)
    data(attrName, val)     -> set data-attrName to the given value for all matched elements
    append(content, ...)    -> Append content ($dom instances, DOM nodes, or html strings) to each element
    prepend(content, ...)   -> Same as append(), but inserts at the front of the selection

    // Traversal:
    parent()                -> Returns all unique parents of the selected elements
    unique()                -> Returns a unique set of the selected elements
    first()                 -> Returns the first selected element (wrapped)
    last()                  -> Returns the last selected element (wrapped)
    closest(selector)       -> Returns the closest ancestor that matches the given selector
                               (NOTE! only supports simple tag name selectors for now)

    // Classes and attributes:
    addClass(className)
    removeClass(className)
    hasClass(className)     -> returns true if any matched element has the given class
    attr(name)              -> return the attribute of the first matched element
    attr(name, value)       -> for all matched elements, set the attribute with the given name to the given value.
    attr(hash)              -> for each matched element, el[attrName] = attrValue for each key, val pair in the object
    removeAttr(<string>)

    // Styling:
    css(name)
    css(name, value)
    css(hash)
    show()
    hide()                  -> Set "display: none" on all matched elements.

    // Events:
    on(eventName, handler)
    on(eventName, delegationSelector, handler)
    off(eventName, handler)
    off(eventName, delegationSelector, handler)
    trigger(eventName)           -> trigger an event on each matched element
    bind(), unbind(), delegate(), undelegate() (legacy)

    // ES5 Array methods
    each()
    map()
    some()
    every()
    filter()                -> NOTE: works like the ES5 array method, not jquery's method

    // Misc
    toArray()               -> Return the matching DOM nodes in an array

```


## TODO:
    * Add support for:
        .one()
        .children()
    * form serialization: to string, and to Object
