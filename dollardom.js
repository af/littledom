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

    var $dom = function(query) {
        return new $dom.fn.init(query);
    }

    $dom.fn = $dom.prototype = {
        constructor: $dom,
        length: 0,
        results: [],

        init: function(query) {
            if (!query) return this;

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
            return document.querySelectorAll(query);
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

        // Expose ES5 array methods on query results:
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
