/// <reference path="../bower_components/DefinitelyTyped/angularjs/angular.d.ts"/>
/// <reference path="../bower_components/DefinitelyTyped/underscore/underscore.d.ts"/>

/// <reference path="eventDispatcher.ts"/>

angular.module('evilduck.eventDispatcher', []).service('eventDispatcher', ['$q', ($q: ng.IQService) => new evilduck.EventDispatcher($q)]);