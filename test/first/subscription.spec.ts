/// <reference path='../../bower_components/DefinitelyTyped/jasmine/jasmine.d.ts' />
/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular-mocks.d.ts" />
/// <reference path="../../src/subscriptions.ts"/>

describe("Promise Subscription Tests", () => {

    var $q: ng.IQService;
    var $rootScope: ng.IRootScopeService;
    var scope: ng.IScope;

    beforeEach(module('evilduck.eventDispatcher'));

    beforeEach(inject((_$q_: ng.IQService, _$rootScope_: ng.IRootScopeService) => {
        $q = _$q_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
    }));

    var createSubscription = () => {
        return new evilduck.PromiseSubscription(() => {
            var deferred = $q.defer();

            setTimeout(() => {
                $rootScope.$apply(() => {
                    deferred.resolve(1);
                });
            }, 1);

            return deferred.promise;
        });
    };

    it('should create a Promise Subscription', () => {
        var s = createSubscription();

        expect(s).toBeDefined();
    });

    it('should wrap a Promise', (done) => {
        var ps = createSubscription();
        var promise = ps.wrap($q);

        promise.then((res) => {
            expect(res).toEqual(1);
            done();
        });
    });
});