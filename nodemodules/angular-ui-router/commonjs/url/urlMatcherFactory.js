"use strict";
/** @module url */ /** for typedoc */
var common_1 = require("../common/common");
var predicates_1 = require("../common/predicates");
var module_1 = require("./module");
var module_2 = require("../params/module");
function getDefaultConfig() {
    return {
        strict: module_1.matcherConfig.strictMode(),
        caseInsensitive: module_1.matcherConfig.caseInsensitive()
    };
}
/**
 * Factory for [[UrlMatcher]] instances.
 *
 * The factory is available to ng1 services as
 * `$urlMatcherFactor` or ng1 providers as `$urlMatcherFactoryProvider`.
 */
var UrlMatcherFactory = (function () {
    function UrlMatcherFactory() {
        common_1.extend(this, { UrlMatcher: module_1.UrlMatcher, Param: module_2.Param });
    }
    /**
     * Defines whether URL matching should be case sensitive (the default behavior), or not.
     *
     * @param value `false` to match URL in a case sensitive manner; otherwise `true`;
     * @returns the current value of caseInsensitive
     */
    UrlMatcherFactory.prototype.caseInsensitive = function (value) {
        return module_1.matcherConfig.caseInsensitive(value);
    };
    /**
     * Defines whether URLs should match trailing slashes, or not (the default behavior).
     *
     * @param value `false` to match trailing slashes in URLs, otherwise `true`.
     * @returns the current value of strictMode
     */
    UrlMatcherFactory.prototype.strictMode = function (value) {
        return module_1.matcherConfig.strictMode(value);
    };
    /**
     * Sets the default behavior when generating or matching URLs with default parameter values.
     *
     * @param value A string that defines the default parameter URL squashing behavior.
     *    - `nosquash`: When generating an href with a default parameter value, do not squash the parameter value from the URL
     *    - `slash`: When generating an href with a default parameter value, squash (remove) the parameter value, and, if the
     *             parameter is surrounded by slashes, squash (remove) one slash from the URL
     *    - any other string, e.g. "~": When generating an href with a default parameter value, squash (remove)
     *             the parameter value from the URL and replace it with this string.
     * @returns the current value of defaultSquashPolicy
     */
    UrlMatcherFactory.prototype.defaultSquashPolicy = function (value) {
        return module_1.matcherConfig.defaultSquashPolicy(value);
    };
    /**
     * Creates a [[UrlMatcher]] for the specified pattern.
     *
     * @param pattern  The URL pattern.
     * @param config  The config object hash.
     * @returns The UrlMatcher.
     */
    UrlMatcherFactory.prototype.compile = function (pattern, config) {
        return new module_1.UrlMatcher(pattern, common_1.extend(getDefaultConfig(), config));
    };
    /**
     * Returns true if the specified object is a [[UrlMatcher]], or false otherwise.
     *
     * @param object  The object to perform the type check against.
     * @returns `true` if the object matches the `UrlMatcher` interface, by
     *          implementing all the same methods.
     */
    UrlMatcherFactory.prototype.isMatcher = function (object) {
        // TODO: typeof?
        if (!predicates_1.isObject(object))
            return false;
        var result = true;
        common_1.forEach(module_1.UrlMatcher.prototype, function (val, name) {
            if (predicates_1.isFunction(val))
                result = result && (predicates_1.isDefined(object[name]) && predicates_1.isFunction(object[name]));
        });
        return result;
    };
    ;
    /**
     * Registers a custom [[Type]] object that can be used to generate URLs with typed parameters.
     *
     * @param name  The type name.
     * @param definition The type definition. See [[Type]] for information on the values accepted.
     * @param definitionFn A function that is injected before the app
     *        runtime starts.  The result of this function is merged into the existing `definition`.
     *        See [[Type]] for information on the values accepted.
     *
     * @returns - if a type was registered: the [[UrlMatcherFactory]]
     *   - if only the `name` parameter was specified: the currently registered [[Type]] object, or undefined
     *
     * ---
     *
     * This is a simple example of a custom type that encodes and decodes items from an
     * array, using the array index as the URL-encoded value:
     *
     * @example
     * ```
     *
     * var list = ['John', 'Paul', 'George', 'Ringo'];
     *
     * $urlMatcherFactoryProvider.type('listItem', {
     *   encode: function(item) {
     *     // Represent the list item in the URL using its corresponding index
     *     return list.indexOf(item);
     *   },
     *   decode: function(item) {
     *     // Look up the list item by index
     *     return list[parseInt(item, 10)];
     *   },
     *   is: function(item) {
     *     // Ensure the item is valid by checking to see that it appears
     *     // in the list
     *     return list.indexOf(item) > -1;
     *   }
     * });
     *
     * $stateProvider.state('list', {
     *   url: "/list/{item:listItem}",
     *   controller: function($scope, $stateParams) {
     *     console.log($stateParams.item);
     *   }
     * });
     *
     * // ...
     *
     * // Changes URL to '/list/3', logs "Ringo" to the console
     * $state.go('list', { item: "Ringo" });
     * ```
     */
    UrlMatcherFactory.prototype.type = function (name, definition, definitionFn) {
        var type = module_2.paramTypes.type(name, definition, definitionFn);
        return !predicates_1.isDefined(definition) ? type : this;
    };
    ;
    /** @hidden */
    UrlMatcherFactory.prototype.$get = function () {
        module_2.paramTypes.enqueue = false;
        module_2.paramTypes._flushTypeQueue();
        return this;
    };
    ;
    return UrlMatcherFactory;
}());
exports.UrlMatcherFactory = UrlMatcherFactory;
//# sourceMappingURL=urlMatcherFactory.js.map