(function(window) {
    var document = window.document;
    var arrayProto = Array.prototype;

    // Helper function to make obj look like an array (where items is an array to copy over)
    function makeArrayLike(obj, items) {
        obj.length = items.length;
        for (var i=0, l=items.length; i<l; i+=1) {
            obj[i] = items[i];
        }
    }

    var $dom = function(query, context) {
        return new $dom.fn.init(query, context);
    }

    $dom.fn = $dom.prototype = {
        constructor: $dom,
        length: 0,
        results: [],
        context: document,

        init: function(query, context) {
            if (!query) return this;
            if (context) {
                // Ensure that the context argument is a DOM node:
                if (context.nodeType) this.context = context;
                else return this;
            }

            // Handle case where a DOM node was passed in:
            if (query.nodeType) {
                this.results = [query];
            } else {
                var results = this.qsa(query);
                this.results = arrayProto.slice.call(results);
            }
            makeArrayLike(this, this.results);
            return this;
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

        // jQuery.html() work-alike
        html: function(markup) {
            if (markup) {
                // Set the innerHTML for all matched elements:
                this.each(function(el) { el.innerHTML = String(markup); })
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
            for (var i=0; i<this.length; i++) {
                if (regex.test(this.results[i].className)) return true;
            }
            return false;
        },

        // Remove class(es) from all matched elements.
        // classNames can be a space-separated list of classes, eg. 'foo bar baz'
        removeClass: function(classNames) {
            var classes = (classNames || '').split(' ');
            var regex = new RegExp('\\b' + classes.join('|') + '\\b', 'g');
            for (var i=0; i<this.length; i++) {
                var el = this.results[i];
                el.className = el.className.replace(regex, '');
            }
            return this;
        },

        // Expose ES5 array methods on query results:
        // TODO: consider rewriting each() with a for loop for speed.
        each: function(fn) { this.results.forEach(fn); },
        forEach: function(fn) { this.results.forEach(fn); },
        map: function(fn) { return this.results.map(fn); },
        filter: function(fn) { return this.results.filter(fn); }
    }

    $dom.ready = function(fn) {
        window.addEventListener('DOMContentLoaded', fn, false);
    }

    // Ripped off from jQuery, replace later:
    $dom.fn.init.prototype = $dom.fn;

    window.$dom = $dom;
}(window));
