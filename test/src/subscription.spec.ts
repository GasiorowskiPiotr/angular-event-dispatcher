/// <reference path='../../bower_components/DefinitelyTyped/jasmine/jasmine.d.ts' />
/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/angularjs/angular-mocks.d.ts" />
/// <reference path="../../bower_components/DefinitelyTyped/underscore/underscore.d.ts"/>

/// <reference path="../../bower_components/base-event-dispatcher/dist/dts/eventDispatcher.d.ts"/>
/// <reference path="../../bower_components/base-event-dispatcher/dist/dts/eventSubscription.d.ts"/>
/// <reference path="../../bower_components/base-event-dispatcher/dist/dts/innerSubscription.d.ts"/>
/// <reference path="../../bower_components/base-event-dispatcher/dist/dts/tagSubscription.d.ts"/>

/// <reference path="../../src/qWrapper.ts"/>
/// <reference path="../../src/collWrapper.ts"/>

describe("Inner Subscription Tests", () => {
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

    it('should create a inner subscription from basic function', () => {
        var s = new evilduck.InnerSubscription(basicFunction);
        expect(s).toBeDefined();
    });

    it('should create a inner subscription from promise function', () => {
        var s = new evilduck.InnerSubscription(promiseFunction);
        expect(s).toBeDefined();
    });


    it('should wrap a promise from inner subscription with basic function', (done) => {
        var s = new evilduck.InnerSubscription(basicFunction);
        var promise = s.wrap($q, 1);

        scope.$apply(() => {
            promise.then((res) => {
                expect(res).toEqual(1);
                done();
            });
        });
    });

    it('should wrap a promise from inner subscription with promise function', (done) => {
        var s = new evilduck.InnerSubscription(promiseFunction);
        var promise = s.wrap($q, 1);

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

    it('should create a Tagged Subscription with inner wrapped promise', () => {
        var s1 = evilduck.TagSubscription.General('general-1', basicFunction);
        var s2 = evilduck.TagSubscription.General('general-2', promiseFunction);

        expect(s1).toBeDefined();
        expect(s1.tagName).toEqual('general-1');
        expect(s1.subscription).toBeDefined();

        expect(s2).toBeDefined();
        expect(s2.tagName).toEqual('general-2');
        expect(s2.subscription).toBeDefined();
    });

    it('should wrap a promise from inner subscription built with promise', (done) => {
        var s = evilduck.TagSubscription.General('general-1', promiseFunction);
        var promise = s.wrap($q, 1);

        scope.$apply(() => {
            promise.then((res) => {
                expect(res).toEqual(1);
                done();
            });
        });
    });

    it('should wrap a promise from inner subscription built with basic function', (done) => {
        var s = evilduck.TagSubscription.General('general-2', basicFunction);
        var promise = s.wrap($q, 1);

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
    var collWrapper: evilduck.underscore.Underscore;
    var qWrapper: evilduck.angular.QService;

    beforeEach(module('evilduck.eventDispatcher'));

    beforeEach(inject((_$q_: ng.IQService, _$rootScope_: ng.IRootScopeService) => {
        $q = _$q_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        collWrapper = new evilduck.underscore.Underscore();
        qWrapper = new evilduck.angular.QService($q, collWrapper);
    }));

    it('should create a Event Subscription', () => {
        var e = new evilduck.EventSubscription('event1', qWrapper, collWrapper);
        expect(e).toBeDefined();
        expect(e.eventName).toEqual('event1');
    });

    it('should add subscription with tag', () => {
        var e = new evilduck.EventSubscription('event1', qWrapper, collWrapper);
        e.subscribe(() => 1, 'tag1');

        var item = _.findWhere((<any>e)._tagSubs, { tagName: 'tag1' });
        expect(item).toBeDefined();

        expect((<any>e)._subs.length).toEqual(0);
    });

    it('should add subscription without tag', () => {
        var e = new evilduck.EventSubscription('event1', qWrapper, collWrapper);
        e.subscribe(() => 1);

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

    var collWrapper: evilduck.underscore.Underscore;
    var qWrapper: evilduck.angular.QService;

    var eventSubscription: evilduck.EventSubscription;

    beforeEach(module('evilduck.eventDispatcher'));

    beforeEach(inject((_$q_: ng.IQService, _$rootScope_: ng.IRootScopeService) => {
        $q = _$q_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        collWrapper = new evilduck.underscore.Underscore();
        qWrapper = new evilduck.angular.QService($q, collWrapper);
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

        eventSubscription = new evilduck.EventSubscription('event-1', qWrapper, collWrapper);
        eventSubscription.subscribe(tag1Func1, 'tag1');
        eventSubscription.subscribe(tag1Func2, 'tag1');
        eventSubscription.subscribe(tag2Func1, 'tag2');
        eventSubscription.subscribe(tag2Func2, 'tag2');
        eventSubscription.subscribe(subsFunc1);
        eventSubscription.subscribe(subsFunc2);
    });

    it('should invoke all handlers with tag1 when wrapping tag1', (done) => {

        scope.$apply(() => {
            var promise = eventSubscription.wrap(1, 'tag1');
            promise.then(() => {
                expect(eventCnt.tag1).toEqual(2);
                expect(eventCnt.tag2).toEqual(0);
                expect(eventCnt.sub).toEqual(0);

                done();
            });
        });
    });

    it('should invoke all handlers wrapping empty tag', (done) => {

        scope.$apply(() => {
            var promise = eventSubscription.wrap(1);
            promise.then(() => {
                expect(eventCnt.tag1).toEqual(2);
                expect(eventCnt.tag2).toEqual(2);
                expect(eventCnt.sub).toEqual(2);

                done();
            });
        });
    });
});

describe('Unsubscribing on EventDispatcher', () => {
    var $q: ng.IQService;
    var $rootScope: ng.IRootScopeService;
    var scope: ng.IScope;
    var eventCnt: any;

    var _collWrapper: evilduck.underscore.Underscore;
    var _qWrapper: evilduck.angular.QService;

    var subsInfos: any = {
        s1: null,
        s2: null,
        s3: null,
        s4: null,
        s5: null,
        s6: null,
        s7: null,
        s8: null,
        s9: null,
        s10: null
    };

    var eventDispatcher: evilduck.EventDispatcher;

    beforeEach(module('evilduck.eventDispatcher'));

    beforeEach(inject((_$q_: ng.IQService, _$rootScope_: ng.IRootScopeService) => {
        $q = _$q_;
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        _collWrapper = new evilduck.underscore.Underscore();
        _qWrapper = new evilduck.angular.QService($q, _collWrapper);
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

        eventDispatcher = new evilduck.EventDispatcher(_qWrapper, _collWrapper);
        subsInfos.s1 = eventDispatcher.on('ev1', tag1Func1, 'tag1');
        subsInfos.s2 = eventDispatcher.on('ev1', tag1Func2, 'tag1');
        subsInfos.s3 = eventDispatcher.on('ev1', tag2Func1, 'tag2');
        subsInfos.s4 = eventDispatcher.on('ev1', tag2Func1, 'tag2');
        subsInfos.s5 = eventDispatcher.on('ev1', subsFunc1);
        subsInfos.s6 = eventDispatcher.on('ev1', subsFunc2);

        subsInfos.s7 = eventDispatcher.on('ev2', tag1Func1, 'tag1');
        subsInfos.s8 = eventDispatcher.on('ev2', tag1Func2, 'tag1');
        subsInfos.s9 = eventDispatcher.on('ev2', subsFunc1);
        subsInfos.s10 = eventDispatcher.on('ev2', subsFunc2);
        
    });

    it('should unsubscribe with SubscriptionInfo (tagged)', () => {

        (<evilduck.SubscriptionInfo>subsInfos.s1).destroy();

        expect((<any>eventDispatcher)._innerDict['ev1'].count).toEqual(5);
        expect((<any>eventDispatcher)._innerDict['ev1']._tagSubs.length).toEqual(3);
        
    });

    it('should unsubscribe with SubscriptionInfo (not tagged)', () => {

        (<evilduck.SubscriptionInfo>subsInfos.s5).destroy();

        expect((<any>eventDispatcher)._innerDict['ev1'].count).toEqual(5);
        expect((<any>eventDispatcher)._innerDict['ev1']._subs.length).toEqual(1);

    });
});
