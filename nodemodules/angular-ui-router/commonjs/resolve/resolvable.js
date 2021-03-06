"use strict";
/** @module resolve */ /** for typedoc */
var common_1 = require("../common/common");
var hof_1 = require("../common/hof");
var predicates_1 = require("../common/predicates");
var coreservices_1 = require("../common/coreservices");
var trace_1 = require("../common/trace");
/**
 * The basic building block for the resolve system.
 *
 * Resolvables encapsulate a state's resolve's resolveFn, the resolveFn's declared dependencies, the wrapped (.promise),
 * and the unwrapped-when-complete (.data) result of the resolveFn.
 *
 * Resolvable.get() either retrieves the Resolvable's existing promise, or else invokes resolve() (which invokes the
 * resolveFn) and returns the resulting promise.
 *
 * Resolvable.get() and Resolvable.resolve() both execute within a context path, which is passed as the first
 * parameter to those fns.
 */
var Resolvable = (function () {
    function Resolvable(name, resolveFn, preResolvedData) {
        this.promise = undefined;
        common_1.extend(this, {
            name: name,
            resolveFn: resolveFn,
            deps: coreservices_1.services.$injector.annotate(resolveFn, coreservices_1.services.$injector.strictDi),
            data: preResolvedData
        });
    }
    // synchronous part:
    // - sets up the Resolvable's promise
    // - retrieves dependencies' promises
    // - returns promise for async part
    // asynchronous part:
    // - wait for dependencies promises to resolve
    // - invoke the resolveFn
    // - wait for resolveFn promise to resolve
    // - store unwrapped data
    // - resolve the Resolvable's promise
    Resolvable.prototype.resolveResolvable = function (resolveContext, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var _a = this, name = _a.name, deps = _a.deps, resolveFn = _a.resolveFn;
        trace_1.trace.traceResolveResolvable(this, options);
        // First, set up an overall deferred/promise for this Resolvable
        var deferred = coreservices_1.services.$q.defer();
        this.promise = deferred.promise;
        // Load a map of all resolvables for this state from the context path
        // Omit the current Resolvable from the result, so we don't try to inject this into this
        var ancestorsByName = resolveContext.getResolvables(null, { omitOwnLocals: [name] });
        // Limit the ancestors Resolvables map to only those that the current Resolvable fn's annotations depends on
        var depResolvables = common_1.pick(ancestorsByName, deps);
        // Get promises (or synchronously invoke resolveFn) for deps
        var depPromises = common_1.map(depResolvables, function (resolvable) { return resolvable.get(resolveContext, options); });
        // Return a promise chain that waits for all the deps to resolve, then invokes the resolveFn passing in the
        // dependencies as locals, then unwraps the resulting promise's data.
        return coreservices_1.services.$q.all(depPromises).then(function (locals) {
            try {
                var result = coreservices_1.services.$injector.invoke(resolveFn, null, locals);
                deferred.resolve(result);
            }
            catch (error) {
                deferred.reject(error);
            }
            return _this.promise;
        }).then(function (data) {
            _this.data = data;
            trace_1.trace.traceResolvableResolved(_this, options);
            return _this.promise;
        });
    };
    Resolvable.prototype.get = function (resolveContext, options) {
        return this.promise || this.resolveResolvable(resolveContext, options);
    };
    Resolvable.prototype.toString = function () {
        return "Resolvable(name: " + this.name + ", requires: [" + this.deps + "])";
    };
    /**
     * Validates the result map as a "resolve:" style object, then transforms the resolves into Resolvables
     */
    Resolvable.makeResolvables = function (resolves) {
        // If a hook result is an object, it should be a map of strings to functions.
        var invalid = common_1.filter(resolves, hof_1.not(predicates_1.isInjectable)), keys = Object.keys(invalid);
        if (keys.length)
            throw new Error("Invalid resolve key/value: " + keys[0] + "/" + invalid[keys[0]]);
        return common_1.map(resolves, function (fn, name) { return new Resolvable(name, fn); });
    };
    return Resolvable;
}());
exports.Resolvable = Resolvable;
//# sourceMappingURL=resolvable.js.map