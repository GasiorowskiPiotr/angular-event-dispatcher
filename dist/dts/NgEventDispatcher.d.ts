/// <reference path="../bower_components/base-event-dispatcher/dist/dts/eventDispatcher.d.ts" />
/// <reference path="../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
declare module evilduck {
    module angular {
        class NgEventDispatcher extends EventDispatcher {
            ngOn($scope: ng.IScope, event: string, handler: (any: any) => any, tag?: string): void;
        }
    }
}
