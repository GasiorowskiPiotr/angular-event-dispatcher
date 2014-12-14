/// <reference path="../bower_components/base-event-dispatcher/dist/dts/eventDispatcher.d.ts"/>
/// <reference path="../bower_components/DefinitelyTyped/angularjs/angular.d.ts"/>
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
        var NgEventDispatcher = (function (_super) {
            __extends(NgEventDispatcher, _super);
            function NgEventDispatcher() {
                _super.apply(this, arguments);
            }
            NgEventDispatcher.prototype.ngOn = function ($scope, event, handler, tag) {
                var subsInfo = this.on(event, handler, tag);
                if (subsInfo) {
                    $scope.$on('$destroy', function () {
                        subsInfo.destroy();
                    });
                }
            };
            return NgEventDispatcher;
        })(evilduck.EventDispatcher);
        angular.NgEventDispatcher = NgEventDispatcher;
    })(angular = evilduck.angular || (evilduck.angular = {}));
})(evilduck || (evilduck = {}));
