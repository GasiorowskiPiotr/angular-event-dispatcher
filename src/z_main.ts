/// <reference path="../bower_components/DefinitelyTyped/angularjs/angular.d.ts"/> 
/// <reference path="../bower_components/base-event-dispatcher/dist/dts/eventDispatcher.d.ts"/>
/// <reference path="collWrapper.ts"/>
/// <reference path="qWrapper.ts"/>

angular
    .module('evilduck.eventDispatcher', [])
    .service('collWrapper', () => new evilduck.underscore.Underscore())
    .service('qWrapper', ['$q', 'collWrapper', ($q: ng.IQService, collWrapper: evilduck.underscore.Underscore) => new evilduck.angular.QService($q, collWrapper)])
    .service('eventDispatcher', ['qWrapper', 'collWrapper', (q: evilduck.angular.QService, c: evilduck.underscore.Underscore) => new evilduck.EventDispatcher(q, c)]);
