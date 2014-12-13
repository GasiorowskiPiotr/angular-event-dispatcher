angular-event-dispatcher
========================

This is a simple AngularJS service providing a pub-sub communication between Angular components omitting the `$scope.$on(...)`, `$scope.$broadcast(...)` and `$scope.$emit(...)`. 

installing
==========

As I do not want to clutter bower repository, angular-event-dispatcher can be installed using:

```bower install --save GasiorowskiPiotr/angular-event-dispatcher#0.1.1```

usage
=====

angular-event-dispatcher allows you to subscribe for named events and named tags. When subscribing, you may choose to subscribe for a general event, or a tag of event. In the case when an event is fired, it is executes all the subscribtions for all the tags and the subscribtions without tags. 

**Initialization**


```angular.module('your-module-name, [..., 'evilduck.eventDispatcher']); ```

Then, while declaring your service (for example):

``` .service('your-evented-service, ['eventDispatcher', function(eventDispatcher)  { ... }]); ```

**Subscribing and unsubscribing**

In order to subscribe for an event you should call:

```var subscriptionInfo = eventDispatcher.on('event-name', function(data) { ... });```

or if your want to subscribe for a tag of an event:

```var subscriptionInfo = eventDispatcher.on('event-name', function(data) { ... }, 'tag-name');```

This `subscriptionInfo` object lets you unsubscribe from the event at any time, by calling

```subscriptionInfo.destroy(); ```

For the sake of convenience you can use another method, specifically for AngularJS:

``` eventDispatcher.ngOn($scope, 'event-name', function(data) { ... }); ``` or ``` eventDispatcher.ngOn($scope, 'event-name', function(data) { ... }, 'tag-name'); ``` 

which creates a subscription for all the life span of the provided `$scope` object.

The event handler function may return either an object or a promise.

**Dispatching messages**

In order to dispatch a message you should call:

```eventDispatcher.dispatch(data, 'event-name') ``` or ``` eventDispatcher.dispatch(data, 'event-name', 'tag-name') ```.

These functions return a promise which resolves when all the handlers are executed.

Further work
============

Although the name suggest that this component should be used only with AngularJS, I am still working to make it 'framework-independent'. For now, it works **only** with AngularJS, but I plan to change it soon.

Changelog
=========

###v0.1.1
Initial version
