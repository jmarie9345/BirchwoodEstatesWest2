/**
 * This module is a stub for core services such as Dependency Injection or Browser Location.
 * Core services may be implemented by a specific framework, such as ng1 or ng2, or be pure javascript.
 *
 * @module common
 */
"use strict";
/** for typedoc */
//import {IQService} from "angular";
//import {IInjectorService} from "angular";
var notImplemented = function (fnname) { return function () {
    throw new Error(fnname + "(): No coreservices implementation for UI-Router is loaded. You should include one of: ['angular1.js']");
}; };
var services = {
    $q: undefined,
    $injector: undefined,
    location: {},
    locationConfig: {},
    template: {}
};
exports.services = services;
["replace", "url", "path", "search", "hash", "onChange"]
    .forEach(function (key) { return services.location[key] = notImplemented(key); });
["port", "protocol", "host", "baseHref", "html5Mode", "hashPrefix"]
    .forEach(function (key) { return services.locationConfig[key] = notImplemented(key); });
//# sourceMappingURL=coreservices.js.map