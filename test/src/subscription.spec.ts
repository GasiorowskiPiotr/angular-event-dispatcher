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

describe("General Subscription Tests", () => {
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

    it('should create a General subscription from basic function', () => {
        var s = new evilduck.GeneralSubscription(basicFunction);
        expect(s).toBeDefined();
    });

    it('should create a General Subscription from promise function', () => {
        var s = new evilduck.GeneralSubscription(promiseFunction);
        expect(s).toBeDefined();
    });


    it('should wrap a Promise from General subscription with basic function', (done) => {
        var s = new evilduck.GeneralSubscription(basicFunction);
        var promise = s.wrap($q);

        promise.then((res) => {
            expect(res).toEqual(1);
            done();
        });

        scope.$digest();
    });

    it('should wrap a Promise from General subscription with promise function', (done) => {
        var s = new evilduck.GeneralSubscription(promiseFunction);
        var promise = s.wrap($q);

        promise.then((res) => {
            expect(res).toEqual(1);
            done();
        });

        scope.$digest();
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

    it('should create a Tagged Subscription with general wrapped promise', () => {
        var s1 = evilduck.TagSubscription.General('general-1', basicFunction);
        var s2 = evilduck.TagSubscription.General('general-2', promiseFunction);

        expect(s1).toBeDefined();
        expect(s1.tagName).toEqual('general-1');
        expect(s1.subscription).toBeDefined();

        expect(s2).toBeDefined();
        expect(s2.tagName).toEqual('general-2');
        expect(s2.subscription).toBeDefined();
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

    it('should wrap a Promise from General Subscription built with promise', (done) => {
        var s = evilduck.TagSubscription.General('general-1', promiseFunction);
        var promise = s.wrap($q);

        promise.then((res) => {
            expect(res).toEqual(1);
            done();
        });
    });

    it('should wrap a Promise from General Subscription built with basic function', (done) => {
        var s = evilduck.TagSubscription.General('general-2', basicFunction);
        var promise = s.wrap($q);

        promise.then((res) => {
            expect(res).toEqual(1);
            done();
        });

        scope.$digest();
    });
});

describe("Event Subscription", () => {
    var $q: ng.IQService;
    var $rootScope: ng.IRootScopeService;
    var scope: ng.IScope;

    beforeEach(module('evilduck.eventDispatcher'));

    beforeEach(inject((_$q_: ng.IQService, _$rootScope_: ng.IRootScopeService) => {
        $q = _$q_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
    }));

    it('should create a Event Subscription', () => {
        var e = new evilduck.EventSubscription('event1');
        expect(e).toBeDefined();
        expect(e.eventName).toEqual('event1');
    });

    it('should add general (default) Subscription with tag', () => {
        var e = new evilduck.EventSubscription('event1');
        e.subscribe(() => 1, 'tag1');

        var item = _.findWhere((<any>e)._tagSubs, { tagName: 'tag1' });
        expect(item).toBeDefined();

        expect((<any>e)._subs.length).toEqual(0);
    });

    it('should add general (default) Subscription without tag', () => {
        var e = new evilduck.EventSubscription('event1');
        e.subscribe(() => 1);

        var item = _.findWhere((<any>e)._tagSubs, { tagName: 'tag1' });
        expect(item).toBeFalsy();

        expect((<any>e)._subs.length).toEqual(1);
    });

    it('should add Basic Subscription with tag', () => {
        var e = new evilduck.EventSubscription('event1');
        e.subscribeBasic(scope, () => 1, 'tag1');

        var item = _.findWhere((<any>e)._tagSubs, { tagName : 'tag1' });
        expect(item).toBeDefined();

        expect((<any>e)._subs.length).toEqual(0);
    });

    it('should add Basic Subscription without tag', () => {
        var e = new evilduck.EventSubscription('event1');
        e.subscribeBasic(scope, () => 1);

        var item = _.findWhere((<any>e)._tagSubs, { tagName: 'tag1' });
        expect(item).toBeFalsy();

        expect((<any>e)._subs.length).toEqual(1);
    });

    it('should add Promise Subscription with tag', () => {
        var e = new evilduck.EventSubscription('event1');
        e.subscribePromise(() => {
            var deferred = $q.defer();

            setTimeout(() => {
                $rootScope.$apply(() => {
                    deferred.resolve(1);
                });
            }, 1);

            return deferred.promise;
        }, 'tag1');

        var item = _.findWhere((<any>e)._tagSubs, { tagName: 'tag1' });
        expect(item).toBeDefined();

        expect((<any>e)._subs.length).toEqual(0);
    });

    it('should add Promise Subscription without tag', () => {
        var e = new evilduck.EventSubscription('event1');
        e.subscribePromise(() => {
            var deferred = $q.defer();

            setTimeout(() => {
                $rootScope.$apply(() => {
                    deferred.resolve(1);
                });
            }, 1);

            return deferred.promise;
        });

        var item = _.findWhere((<any>e)._tagSubs, { tagName: 'tag1' });
        expect(item).toBeFalsy();

        expect((<any>e)._subs.length).toEqual(1);
    });
});
