/// <reference path="../bower_components/DefinitelyTyped/angularjs/angular.d.ts"/> 
/// <reference path="../bower_components/base-event-dispatcher/dist/dts/eventDispatcher.d.ts"/>
/// <reference path="collWrapper.ts"/>
/// <reference path="qWrapper.ts"/>
angular.module('evilduck.eventDispatcher', []).service('collWrapper', function () { return new evilduck.underscore.Underscore(); }).service('qWrapper', ['$q', 'collWrapper', function ($q, collWrapper) { return new evilduck.angular.QService($q, collWrapper); }]).service('eventDispatcher', ['qWrapper', 'collWrapper', function (q, c) { return new evilduck.angular.NgEventDispatcher(q, c); }]);
