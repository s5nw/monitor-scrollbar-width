(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory(root))
    } else if (typeof exports === 'object') {
        module.exports = factory(root)
    } else {
        root.monitorScrollbarWidth = factory(root)
    }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {
    'use strict'

    // Variables
    var monitorScrollbarWidth = {} // Object for public APIs
    var supports = !!root.addEventListener // Feature test
    var settings // Placeholder variables
    var resizeTick
    var currentScrollbarWidth = 0

    // Default settings
    var defaults = {
        writeCssProperty: true,
        cssPropertyName: '--scrollbarWidth',
    }

    // Methods
    /**
     * Merge two or more objects. Returns a new object.
     * Set the first argument to `true` for a deep or recursive merge
     * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
     * @param {Object}   objects  The objects to merge together
     * @returns {Object}          Merged values of defaults and options
     */
    var extend = function () {

        // Variables
        var extended = {}
        var deep = false
        var i = 0
        var length = arguments.length

        // Check if a deep merge
        if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
            deep = arguments[0]
            i++
        }

        // Merge the object into the extended object
        var merge = function (obj) {
            for (var prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    // If deep merge and property is an object, merge properties
                    if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                        extended[prop] = extend(true, extended[prop], obj[prop])
                    } else {
                        extended[prop] = obj[prop]
                    }
                }
            }
        }

        // Loop through each object and conduct a merge
        for (; i < length; i++) {
            var obj = arguments[i]
            merge(obj)
        }

        return extended
    }

    var updateScrollbarWidth = function () {
        currentScrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    }

    var updateCssProperty = function () {
        document.documentElement.style.setProperty(
            settings.cssPropertyName,
            currentScrollbarWidth + 'px',
        )
    }

    var checkScrollbar = function () {
        window.cancelAnimationFrame(resizeTick)
        resizeTick = window.requestAnimationFrame(function () {
            updateScrollbarWidth()

            if (settings.writeCssProperty) {
                updateCssProperty()
            }
        })
    }

    /**
     * Destroy the current initialization.
     * @public
     */
    monitorScrollbarWidth.destroy = function () {

        // If plugin isn't already initialized, stop
        if (!settings) return

        // Remove event listeners
        window.removeEventListener('resize', checkScrollbar, false)

        // Reset variables
        settings = null
    }

    /**
     * Initialize Plugin
     * @public
     * @param {Object} options User settings
     */
    monitorScrollbarWidth.init = function (options) {
        // feature test
        if (!supports) return

        // Destroy existing instance
        monitorScrollbarWidth.destroy()

        // Merge user options
        settings = extend(defaults, options || {})

        // Listen for resize event
        window.addEventListener('resize', checkScrollbar, false)

        // Trigger inital check for scrollbar width
        checkScrollbar()
    }

    /**
     * Get the current scrollbar width
     * @public
     */
    monitorScrollbarWidth.getWidth = function () {
        return currentScrollbarWidth
    }

    return monitorScrollbarWidth
})
