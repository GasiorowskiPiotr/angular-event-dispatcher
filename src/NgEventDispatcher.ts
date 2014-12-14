/// <reference path="../bower_components/base-event-dispatcher/dist/dts/eventDispatcher.d.ts"/>
/// <reference path="../bower_components/DefinitelyTyped/angularjs/angular.d.ts"/>

module evilduck {
    export module angular {
        export class NgEventDispatcher extends EventDispatcher {

            public ngOn($scope: ng.IScope, event: string, handler: (any: any) => any, tag?: string): void {

                var subsInfo = this.on(event, handler, tag);
                if (subsInfo) {

                    $scope.$on('destroy', () => {
                        subsInfo.destroy();
                    });
                }

            }

        }    
    }
} 