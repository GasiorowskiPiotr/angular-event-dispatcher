var evilduck;
(function (evilduck) {
    var InnerSubscription = (function () {
        function InnerSubscription(func, guid) {
            if (guid === void 0) { guid = null; }
            this._func = func;
            this._guid = guid;
        }
        InnerSubscription.prototype.wrap = function ($q, data) {
            return $q.when(this._func(data));
        };
        Object.defineProperty(InnerSubscription.prototype, "guid", {
            get: function () {
                return this._guid;
            },
            enumerable: true,
            configurable: true
        });
        return InnerSubscription;
    })();
    evilduck.InnerSubscription = InnerSubscription;
})(evilduck || (evilduck = {}));
