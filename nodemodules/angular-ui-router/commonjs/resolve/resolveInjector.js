"use strict";
/** @module resolve */ /** for typedoc */
var common_1 = require("../common/common");
var ResolveInjector = (function () {
    function ResolveInjector(_resolveContext, _state) {
        this._resolveContext = _resolveContext;
        this._state = _state;
    }
    /** Returns a promise to invoke an annotated function in the resolve context */
    ResolveInjector.prototype.invokeLater = function (injectedFn, locals) {
        return this._resolveContext.invokeLater(injectedFn, locals);
    };
    /** Invokes an annotated function in the resolve context */
    ResolveInjector.prototype.invokeNow = function (injectedFn, locals) {
        return this._resolveContext.invokeNow(null, injectedFn, locals);
    };
    /** Returns the a promise for locals (realized Resolvables) that a function wants */
    ResolveInjector.prototype.getLocals = function (injectedFn) {
        var _this = this;
        var resolve = function (r) { return r.get(_this._resolveContext); };
        return common_1.map(this._resolveContext.getResolvablesForFn(injectedFn), resolve);
    };
    return ResolveInjector;
}());
exports.ResolveInjector = ResolveInjector;
//# sourceMappingURL=resolveInjector.js.map