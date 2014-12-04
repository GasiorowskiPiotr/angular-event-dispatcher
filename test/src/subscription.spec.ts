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

        scope.$apply(() => {
            promise.then((res) => {
                expect(res).toEqual(1);
                done();
            });
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
        return new evilduck.BasicSubscription(() => 1);
    };

    it('should create a Promise Subscription', () => {
        var s = createSubscription();

        expect(s).toBeDefined();
    });

    it('should wrap a Promise', (done) => {
        var ps = createSubscription();
        var promise = ps.wrap($q);

        scope.$apply(() => {
            promise.then((res) => {
                expect(res).toEqual(1);
                done();
            });
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

        scope.$apply(() => {
            promise.then((res) => {
                expect(res).toEqual(1);
                done();
            });
        });
    });

    it('should wrap a Promise from General subscription with promise function', (done) => {
        var s = new evilduck.GeneralSubscription(promiseFunction);
        var promise = s.wrap($q);

        scope.$apply(() => {
            promise.then((res) => {
                expect(res).toEqual(1);
                done();
            });
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
        var s = evilduck.TagSubscription.Basic('basic', basicFunction);
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
        var s = evilduck.TagSubscription.Basic('basic', basicFunction);
        var promise = s.wrap($q);

        scope.$apply(() => {
            promise.then((res) => {
                expect(res).toEqual(1);
                done();
            });
        });
        
    });

    it('should wrap a Promise from Promise Subscription', (done) => {
        var s = evilduck.TagSubscription.Promise('promise', promiseFunction);
        var promise = s.wrap($q);

        scope.$apply(() => {
            promise.then((res) => {
                expect(res).toEqual(1);
                done();
            });
        });
    });

    it('should wrap a Promise from General Subscription built with promise', (done) => {
        var s = evilduck.TagSubscription.General('general-1', promiseFunction);
        var promise = s.wrap($q);

        scope.$apply(() => {
            promise.then((res) => {
                expect(res).toEqual(1);
                done();
            });
        });
    });

    it('should wrap a Promise from General Subscription built with basic function', (done) => {
        var s = evilduck.TagSubscription.General('general-2', basicFunction);
        var promise = s.wrap($q);

        scope.$apply(() => {
            promise.then((res) => {
                expect(res).toEqual(1);
                done();
            });
        });
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
        e.subscribeBasic(() => 1, 'tag1');

        var item = _.findWhere((<any>e)._tagSubs, { tagName : 'tag1' });
        expect(item).toBeDefined();

        expect((<any>e)._subs.length).toEqual(0);
    });

    it('should add Basic Subscription without tag', () => {
        var e = new evilduck.EventSubscription('event1');
        e.subscribeBasic(() => 1);

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

describe('Wrapping multiple subscriptions', () => {
    var $q: ng.IQService;
    var $rootScope: ng.IRootScopeService;
    var scope: ng.IScope;
    var eventCnt: any;

    var eventSubscription: evilduck.EventSubscription;

    beforeEach(module('evilduck.eventDispatcher'));

    beforeEach(inject((_$q_: ng.IQService, _$rootScope_: ng.IRootScopeService) => {
        $q = _$q_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
    }));

    beforeEach(() => {

        eventCnt = {
            tag1: 0,
            tag2: 0,
            sub: 0
        };

        var tag1Func1 = () => {
            eventCnt.tag1++;
        };

        var tag1Func2 = () => {
            var deferred = $q.defer();
            setTimeout(() => {
                scope.$apply(() => {
                    eventCnt.tag1++;
                    deferred.resolve();
                });
            });

            return deferred.promise;
        };

        var tag2Func1 = () => {
            eventCnt.tag2++;
        };

        var tag2Func2 = () => {

            var deferred = $q.defer();
            setTimeout(() => {
                scope.$apply(() => {
                    eventCnt.tag2++;
                    deferred.resolve();
                });
            });

            return deferred.promise;
        };

        var subsFunc1 = () => {
            eventCnt.sub++;
        };

        var subsFunc2 = () => {

            var deferred = $q.defer();
            setTimeout(() => {
                scope.$apply(() => {
                    eventCnt.sub++;
                    deferred.resolve();
                });
            });

            return deferred.promise;
        };

        eventSubscription = new evilduck.EventSubscription('event-1');
        eventSubscription.subscribe(tag1Func1, 'tag1');
        eventSubscription.subscribeGeneral(tag1Func2, 'tag1');
        eventSubscription.subscribeBasic(tag1Func1, 'tag1');
        eventSubscription.subscribePromise(tag1Func2, 'tag1');

        eventSubscription.subscribe(tag2Func1, 'tag2');
        eventSubscription.subscribeGeneral(tag2Func2, 'tag2');
        eventSubscription.subscribeBasic(tag2Func1, 'tag2');
        eventSubscription.subscribePromise(tag2Func2, 'tag2');

        eventSubscription.subscribe(subsFunc1);
        eventSubscription.subscribeGeneral(subsFunc2);
        eventSubscription.subscribeBasic(subsFunc1);
        eventSubscription.subscribePromise(subsFunc2);
    });

    it('should invoke all handlers with tag1 when wrapping tag1', (done) => {

        scope.$apply(() => {
            var promise = eventSubscription.wrap($q, 'tag1');
            promise.then(() => {
                expect(eventCnt.tag1).toEqual(4);
                expect(eventCnt.tag2).toEqual(0);
                expect(eventCnt.sub).toEqual(0);

                done();
            });
        });
    });

    it('should invoke all handlers wrapping empty tag', (done) => {

        scope.$apply(() => {
            var promise = eventSubscription.wrap($q);
            promise.then(() => {
                expect(eventCnt.tag1).toEqual(4);
                expect(eventCnt.tag2).toEqual(4);
                expect(eventCnt.sub).toEqual(4);

                done();
            });
        });
    });
});
