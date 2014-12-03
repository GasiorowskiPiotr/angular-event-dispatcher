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

describe("Basic Subscription Tests", () => {
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
        return new evilduck.BasicSubscription(() => 1, scope);
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

describe("Tagged Subscription Tests", () => {
    var $q: ng.IQService;
    var $rootScope: ng.IRootScopeService;
    var scope: ng.IScope;

    beforeEach(module('evilduck.eventDispatcher'));

    beforeEach(inject((_$q_: ng.IQService, _$rootScope_: ng.IRootScopeService) => {
        $q = _$q_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
    }));

    var basicFunction = () => 1;

    var promiseFunction = () => {
        var deferred = $q.defer();

        setTimeout(() => {
            $rootScope.$apply(() => {
                deferred.resolve(1);
            });
        }, 1);

        return deferred.promise;
    };

    it('should create a Tagged Subscription with basic function', () => {
        var s = evilduck.TagSubscription.Basic('basic', basicFunction, scope);
        expect(s).toBeDefined();
        expect(s.tagName).toEqual('basic');
        expect(s.subscription).toBeDefined();
    });

    it('should create a Tagged Subscription with promise function', () => {
        var s = evilduck.TagSubscription.Promise('promise', promiseFunction);
        expect(s).toBeDefined();
        expect(s.tagName).toEqual('promise');
        expect(s.subscription).toBeDefined();
    });


    it('should wrap a Promise from Basic Subscription', (done) => {
        var s = evilduck.TagSubscription.Basic('basic', basicFunction, scope);
        var promise = s.wrap($q);

        promise.then((res) => {
            expect(res).toEqual(1);
            done();
        });
    });

    it('should wrap a Promise from Promise Subscription', (done) => {
        var s = evilduck.TagSubscription.Promise('promise', promiseFunction);
        var promise = s.wrap($q);

        promise.then((res) => {
            expect(res).toEqual(1);
            done();
        });
    });
});