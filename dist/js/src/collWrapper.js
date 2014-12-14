/// <reference path="../bower_components/DefinitelyTyped/angularjs/angular.d.ts"/> 
/// <reference path="../bower_components/DefinitelyTyped/underscore/underscore.d.ts"/>
/// <reference path="../bower_components/base-event-dispatcher/dist/dts/colWrapper.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var evilduck;
(function (evilduck) {
    var underscore;
    (function (underscore) {
        var Underscore = (function (_super) {
            __extends(Underscore, _super);
            function Underscore() {
                _super.apply(this, arguments);
            }
            Underscore.prototype.map = function (col, func) {
                return _.map(col, func);
            };
            Underscore.prototype.union = function (col1, col2) {
                return _.union(col1, col2);
            };
            Underscore.prototype.find = function (col, pred) {
                return _.find(col, pred);
            };
            Underscore.prototype.indexOf = function (col, item) {
                return _.indexOf(col, item);
            };
            Underscore.prototype.filter = function (col, pred) {
                return _.filter(col, pred);
            };
            return Underscore;
        })(evilduck.CollWrapper);
        underscore.Underscore = Underscore;
    })(underscore = evilduck.underscore || (evilduck.underscore = {}));
})(evilduck || (evilduck = {}));
