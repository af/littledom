// TODO: Add support for:
// .on(), .off(), .one()
// .attr(), .removeAttr()
// .find()
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
                this.context = this[0] = query;
                this.length = 1;
                return this;
            }

            var results = this.qsa(query);
            this.results = arrayProto.slice.call(results);
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

        // Expose ES5 array methods on query results:
        each: function(fn) { this.results.forEach(fn); },
        forEach: function(fn) { this.results.forEach(fn); },
        map: function(fn) { return this.results.map(fn); },
        filter: function(fn) { return this.results.filter(fn); }
    }

    // Ripped off from jQuery, replace later:
    $dom.fn.init.prototype = $dom.fn;

    window.$dom = $dom;
}(window));
