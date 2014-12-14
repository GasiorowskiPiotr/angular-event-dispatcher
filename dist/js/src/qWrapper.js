/// <reference path="../bower_components/DefinitelyTyped/angularjs/angular.d.ts"/> 
/// <reference path="../bower_components/base-event-dispatcher/dist/dts/colWrapper.d.ts"/>
/// <reference path="../bower_components/base-event-dispatcher/dist/dts/promiseWrapper.d.ts"/>
/// <reference path="../bower_components/base-event-dispatcher/dist/dts/qWrapper.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var evilduck;
(function (evilduck) {
    var angular;
    (function (angular) {
        var QService = (function (_super) {
            __extends(QService, _super);
            function QService($q, coll) {
                _super.call(this);
                this.$q = $q;
                this.coll = coll;
            }
            QService.prototype.when = function (a) {
                if (a === void 0) { a = null; }
                if (a) {
                    return new QPromise(this.$q.when(a));
                }
                else {
                    return new QPromise(this.$q.when());
                }
            };
            QService.prototype.all = function (promises) {
                return new QPromise(this.$q.all(this.coll.map(promises, function (p) { return p.innerPromise; })));
            };
            return QService;
        })(evilduck.QWrapper);
        angular.QService = QService;
        var QPromise = (function (_super) {
            __extends(QPromise, _super);
            function QPromise(promise) {
                _super.call(this);
                this.promise = promise;
            }
            Object.defineProperty(QPromise.prototype, "innerPromise", {
                get: function () {
                    return this.promise;
                },
                enumerable: true,
                configurable: true
            });
            QPromise.prototype.then = function (func) {
                return new QPromise(this.promise.then(function (r) { return func(r); }));
            };
            QPromise.prototype.catch = function (func) {
                return new QPromise(this.promise.catch(function (r) { return func(r); }));
            };
            QPromise.prototype.finally = function (func) {
                return new QPromise(this.promise.finally(function () { return func(); }));
            };
            return QPromise;
        })(evilduck.PromiseWrapper);
        angular.QPromise = QPromise;
    })(angular = evilduck.angular || (evilduck.angular = {}));
})(evilduck || (evilduck = {}));
