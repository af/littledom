(function(window) {
    var document = window.document;
    var arrayProto = Array.prototype;

    // Used to store callbacks for event delegation (see on() and off()):
    var delegationHandlers = {};
    function makeDelegationKey(fn, evtName, subselector) {
        return evtName + '-' + subselector + '-' + fn;
    }

    // Helper function to make obj look like an array (where items is an array to copy over)
    function makeArrayLike(obj, items) {
        obj.length = items.length;
        for (var i=0, l=items.length; i<l; i+=1) {
            obj[i] = items[i];
        }
        return obj;
    }

    // Utilities for handling html string inputs to $dom()
    // This code was adapted from zepto.js:
    var htmlStringRE = /^\s*<(\w+|!)[^>]*>/;
    var table = document.createElement('table');
    var tableRow = document.createElement('tr');
    var containers = {
        'tr': document.createElement('tbody'),
        'tbody': table, 'thead': table, 'tfoot': table,
        'td': tableRow, 'th': tableRow,
        '*': document.createElement('div')
    };
    var createElementsFromHtmlString = function(html, name) {
        if (name === undefined) name = htmlStringRE.test(html) && RegExp.$1;
        if (!(name in containers)) name = '*';
        var container = containers[name];
        container.innerHTML = '' + html;
        var els = arrayProto.slice.call(container.childNodes);
        els.forEach(function(el){ container.removeChild(el); });
        return els;
    };


    var $dom = function(query, context) {
        return new $dom.fn.init(query, context);
    }

    $dom.fn = $dom.prototype = {
        length: 0,
        results: [],            // Stores the results of queries (an array of dom nodes)
        context: document,      // May be overridden if a second arg is passed in to $dom()

        init: function(query, context) {
            if (!query) return this;

            // If an html string was passed in, attempt to create new elements:
            if (htmlStringRE.test(query)) {
                this.results = createElementsFromHtmlString(query.trim(), RegExp.$1);
                return makeArrayLike(this, this.results);
            }

            if (context) {
                // Ensure that the context argument is a DOM node:
                if (context.nodeType) this.context = context;
                else return this;
            }

            // Handle case where window or a DOM node was passed in:
            if (query.nodeType || query === window) {
                this.results = [query];
            } else {
                var results = this.qsa(query);
                this.results = arrayProto.slice.call(results);
            }
            return makeArrayLike(this, this.results);
        },

        // Tiny wrapper over browser's doc.QSA
        qsa: function(query) {
            return this.context.querySelectorAll(query);
        },

        // Needed for browser dev tools to treat $dom results as arrays.
        // See http://stackoverflow.com/questions/7261670/
        splice: function() {
            var args = arrayProto.slice.call(arguments);
            return arrayProto.splice.apply(this.results, args);
        },

        // jQuery.find() work-alike
        find: function(subQuery) {
            var results = [];
            this.each(function(el) {
                var els = arrayProto.slice.call(el.querySelectorAll(subQuery));
                results = results.concat(els);
            });

            // Return a new, clean $dom object with the results of the query
            // TODO: save the old object's state somewhere so we can support .end()
            var newObj = new $dom();
            makeArrayLike(newObj, results);
            newObj.results = results;
            return newObj;
        },

        // Remove each element from the DOM.
        // Note that this doesn't support a query argument like jQuery's remove() does
        remove: function() {
            return this.each(function(el) {
                el.parentNode.removeChild(el);
            });
        },

        // jQuery.html() work-alike
        html: function(markup) {
            if (markup) {
                // Set the innerHTML for all matched elements:
                this.each(function(el) { el.innerHTML = String(markup); });
                return this;
            } else {
                // Return the innerHTML for the first matched element
                if (!this.results.length) return null;
                return this.results[0].innerHTML;
            }
        },

        // jQuery.css() clone. Possible call signatures:
        // attr, value: sets each element's el.style[attr] to value
        // attr: returns the value of the first element's el.style[attr]
        // map: sets each element's el.style for each attr, value pair in the map
        css: function(attr, value) {
            var isMap = (typeof attr === 'object');
            if (isMap) {
                var cssString = '';
                for (var k in attr) {
                    if (attr.hasOwnProperty(k)) cssString += (k + ':' + attr[k] + ';');
                }
                this.each(function(el) {
                    el.style.cssText += cssString;
                });
            } else if (attr && value) {
                this.each(function(el) {
                    el.style[attr] = value;
                });
            } else if (attr && this.results[0]) {
                // Return the style on the dom node if one is available,
                // otherwise use window.getComputedStyle:
                return this.results[0].style[attr] ||
                       window.getComputedStyle(this.results[0])[attr];
            }
        },

        // Add class(es) to all matched elements.
        // classNames can be a space-separated list of classes, eg. 'foo bar baz'
        addClass: function(classNames) {
            var classes = (classNames || '').split(' ');
            // FIXME: Don't nest for loops here
            for (var i=0, l=classes.length; i<l; i++) {
                var cls = classes[i];
                var regex = new RegExp('\\b' + cls + '\\b');
                for (var j=0; j<this.length; j++) {
                    var el = this.results[j];
                    if (!el.className.match(regex)) el.className += (' ' + cls);
                }
            }
            return this;
        },

        // Return true if any matched element has the given class.
        hasClass: function(className) {
            var regex = new RegExp('\\b' + className + '\\b');
            return this.some(function(el) {
                if (regex.test(el.className)) return true;
            });
        },

        // Remove class(es) from all matched elements.
        // classNames can be a space-separated list of classes, eg. 'foo bar baz'
        removeClass: function(classNames) {
            var classes = (classNames || '').split(' ');
            var regex = new RegExp('\\b' + classes.join('|') + '\\b', 'g');
            return this.each(function(el) {
                el.className = el.className.replace(regex, '');
            });
        },

        // Toggle a class for all matched elements.
        // The second argument, if provided, is a boolean that, if present,
        // indicates that all elements should have (if true) or not have (if false)
        // the given class.
        // Note that this method currently only accepts a single class name
        toggleClass: function(className, forceExistence) {
            var useSecondArg = (forceExistence !== undefined);
            var toggle = !useSecondArg;
            var forceOn = useSecondArg && forceExistence;
            var forceOff = useSecondArg && !forceExistence;
            var regex = new RegExp('\\b' + className + '\\b');

            return this.each(function(el) {
                var hasClass = el.className.match(regex);
                if (!hasClass && !forceOff) el.className += (' ' + className);
                else if (hasClass && !forceOn) el.className = el.className.replace(regex, '');
            });
        },

        // Hide all matched elements using display: none
        hide: function() {
            this.each(function(el) { el.style.display = 'none'; });
            return this;
        },

        // Show all matched elements.
        // Since display is a "non-inherited" property [1], the browser should
        // automatically choose whether the element(s) are displayed as
        // block/inline/etc when we set display to 'inherit'.
        // [1] https://developer.mozilla.org/en-US/docs/CSS/inheritance
        show: function() {
            this.each(function(el) { el.style.display = 'inherit'; });
            return this;
        },

        // Get/Set attributes for all matched elements.
        // Acceptable call signatures:
        // attr(<string attrName>)  -> return the attribute of the first matched element
        // attr(<string>, <string>) -> for all matched elements, set the attribute with the
        //                             given name to the given value.
        // attr(<object>)           -> for each matched element, el[attrName] = attrValue
        attr: function(attrName, attrValue) {
            var hashArg = (typeof attrName === 'object') ? attrName : undefined;
            var singleStringArg = !attrValue && typeof attrName === 'string';
            if (!attrName) return this;
            else if (singleStringArg) return this.results[0] ? this.results[0][attrName] : undefined;

            var transformFn = function(el) {
                if (attrName === 'class') el.className = attrValue; // Handle "class" key like jQuery does
                else el[attrName] = attrValue;
            };
            if (hashArg) {
                transformFn = function(el) {
                    for (var k in hashArg) {
                        if (k === 'class') el.className = hashArg[k];   // Handle "class" key like jQuery does
                        else if (hashArg.hasOwnProperty(k)) el[k] = hashArg[k];
                    }
                };
            }

            return this.each(transformFn);
        },

        // Naive attribute removal.
        removeAttr: function(attrName) {
            return this.each(function(el) {
                el.removeAttribute(attrName);
            });
        },


        // Events

        // Workhorse method for event binding.
        // $dom does not provide click(), mouseover(), etc so you should use on() for
        // pretty much all event binding.
        on: function(evtName, delegateTo, handler) {
            if (!handler) {
                handler = delegateTo;   // If only two args were provided
                delegateTo = null;
            }

            if (delegateTo) {
                // Create a new event handler that does the actual delegation:
                var that = this;
                var wrappedHandler = function(evt) {
                    var candidateEls = [];
                    that.each(function(el) {
                        var query = el.querySelectorAll(delegateTo);
                        candidateEls = candidateEls.concat(arrayProto.slice.call(query));
                    });

                    // follow evt.target's parentNode chain looking for elements that match
                    // the delegateTo query until we get a match or hit top of the tree:
                    var testEl = evt.target;
                    while (testEl) {
                        if (candidateEls.indexOf(testEl) > -1) return handler(evt);
                        testEl = testEl.parentNode;
                    }
                };

                var key = makeDelegationKey(handler, evtName, delegateTo);
                delegationHandlers[key] = wrappedHandler;

                this.each(function(el) {
                    el.addEventListener(evtName, wrappedHandler, false);
                });
            } else {
                // For regular (non-delegated) event binding, just add the listener directly:
                this.each(function(el) {
                    el.addEventListener(evtName, handler, false);
                });
            }
            return this;
        },

        // Remove an event listener.
        // Note that the handler function must be provided, ie. omitting that parameter
        // to remove all listeners is not supported as in jQuery.
        off: function(evtName, delegateTo, handler) {
            if (!handler) {
                handler = delegateTo;   // If only two args were provided
                delegateTo = null;
            }

            // retrieve the wrapped handler function to be passed to removeEventListener()
            if (delegateTo) {
                var key = makeDelegationKey(handler, evtName, delegateTo);
                handler = delegationHandlers[key];
                delete delegationHandlers[key];
            }

            this.each(function(el) {
                el.removeEventListener(evtName, handler, false);
            });
            return this;
        },

        // Aliases for legacy jquery event binding methods (still used by libs like Backbone):
        delegate: function(delegateTo, evtName, handler) { return this.on(evtName, delegateTo, handler); },
        undelegate: function(delegateTo, evtName, handler) { return this.off(evtName, delegateTo, handler); },
        bind: function(evtName, handler) { return this.on(evtName, null, handler); },
        unbind: function(evtName, handler) { return this.off(evtName, null, handler); },

        // Trigger an event on the matching elements.
        // This is usually just used to manually invoke click handlers, etc, and for the simple
        // case a very basic dummy event object will be passed to the handler(s).
        // However you can optionally pass in your own event object as a second parameter.
        trigger: function(evtName, eventObj) {
            if (!eventObj) {
                // TODO: consider a more intelligent default event object (based on evtName)
                eventObj = document.createEvent('MouseEvent');
                eventObj.initMouseEvent(evtName, true, true, window);
            }
            this.each(function(el) {
                el.dispatchEvent(eventObj);
            });
        },

        // Expose ES5 array methods on query results:
        // TODO: consider rewriting each() with a for loop for speed.
        each: function(fn) { this.results.forEach(fn); return this; },
        forEach: function(fn) { this.results.forEach(fn); return this; },
        map: function(fn) { return this.results.map(fn); },
        filter: function(fn) { return this.results.filter(fn); },
        some: function(fn) { return this.results.some(fn); },
        every: function(fn) { return this.results.some(fn); },

        // Return the result set as an array:
        toArray: function() { return this.results; }
    }

    // Register a callback function for when the document is ready to go.
    // Use this where you would use jQuery(document).ready()
    $dom.ready = function(fn) {
        if (document.readyState === 'complete') fn();
        else window.addEventListener('DOMContentLoaded', fn, false);
    }

    $dom.create = function(htmlString) {
        var results = createElementsFromHtmlString(htmlString.trim(), RegExp.$1);
        var newObj = new $dom();
        return makeArrayLike(newObj, results);
    };

    // Boolean indicating whether the current browser is supported by this library:
    // This is not an exhaustive test (this code also uses DOMContentLoaded and ES5 array methods),
    // but should be true for all browsers in use as of this writing:
    $dom.browserSupported = (!!document.addEventListener && !!document.querySelectorAll);

    // Prototype trickery (copied from jQuery), which ensures that
    // ($dom('div') instanceof $dom) => true
    $dom.fn.init.prototype = $dom.fn;

    window.$dom = $dom;

    // Export using CommonJS or to the window.
    if (typeof(module) !== 'undefined') module.exports = $dom;
    else window.$dom = $dom;

}(window));
