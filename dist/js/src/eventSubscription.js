var evilduck;
(function (evilduck) {
    var EventSubscription = (function () {
        function EventSubscription(eventName) {
            this._eventName = eventName;
            this._tagSubs = new Array();
            this._subs = new Array();
        }
        Object.defineProperty(EventSubscription.prototype, "eventName", {
            get: function () {
                return this._eventName;
            },
            enumerable: true,
            configurable: true
        });
        EventSubscription.prototype.subscribe = function (func, tag) {
            if (tag === void 0) { tag = null; }
            return this.subscribeGeneral(func, tag);
        };
        EventSubscription.prototype.subscribeBasic = function (func, tag) {
            if (tag === void 0) { tag = null; }
            var guid = this.createGuid();
            if (tag) {
                this._tagSubs.push(evilduck.TagSubscription.Basic(tag, func, guid));
                return new evilduck.SubscriptionInfo(guid, this._eventName, tag);
            }
            else {
                this._subs.push(new evilduck.BasicSubscription(func, guid));
                return new evilduck.SubscriptionInfo(guid, this._eventName);
            }
        };
        EventSubscription.prototype.subscribePromise = function (func, tag) {
            if (tag === void 0) { tag = null; }
            var guid = this.createGuid();
            if (tag) {
                this._tagSubs.push(evilduck.TagSubscription.Promise(tag, func, guid));
                return new evilduck.SubscriptionInfo(guid, this._eventName, tag);
            }
            else {
                this._subs.push(new evilduck.PromiseSubscription(func, guid));
                return new evilduck.SubscriptionInfo(guid, this._eventName);
            }
        };
        EventSubscription.prototype.subscribeGeneral = function (func, tag) {
            if (tag === void 0) { tag = null; }
            var guid = this.createGuid();
            if (tag) {
                this._tagSubs.push(evilduck.TagSubscription.General(tag, func, guid));
                return new evilduck.SubscriptionInfo(guid, this._eventName, tag);
            }
            else {
                this._subs.push(new evilduck.GeneralSubscription(func, guid));
                return new evilduck.SubscriptionInfo(guid, this._eventName);
            }
        };
        EventSubscription.prototype.wrap = function ($q, data, tagName) {
            if (tagName === void 0) { tagName = null; }
            var subs;
            var tagSubs;
            if (tagName) {
                subs = new Array();
                // TODO: Cache it
                tagSubs = _.filter(this._tagSubs, function (ts) { return ts.tagName === tagName; });
            }
            else {
                subs = this._subs;
                tagSubs = this._tagSubs;
            }
            var toExec = _.union(subs, tagSubs);
            if (toExec.length == 0) {
                return $q.when();
            }
            var promises = _.map(toExec, function (sub) {
                return sub.wrap($q, data);
            });
            return $q.all(promises);
        };
        EventSubscription.prototype.unsubscribe = function (guid, tag) {
            if (tag === void 0) { tag = null; }
            if (tag) {
                var itemT = _.find(this._tagSubs, function (s) { return s.tagName === tag && s.guid === guid; });
                var idxT = _.indexOf(this._tagSubs, itemT);
                this._tagSubs.splice(idxT, 1);
            }
            else {
                var itemS = _.find(this._subs, function (s) { return s.guid === guid; });
                var idxS = _.indexOf(this._subs, itemS);
                this._subs.splice(idxS, 1);
            }
        };
        Object.defineProperty(EventSubscription.prototype, "count", {
            get: function () {
                return this._subs.length + this._tagSubs.length;
            },
            enumerable: true,
            configurable: true
        });
        EventSubscription.prototype.createGuid = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
        return EventSubscription;
    })();
    evilduck.EventSubscription = EventSubscription;
})(evilduck || (evilduck = {}));
