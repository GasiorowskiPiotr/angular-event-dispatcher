var evilduck;
(function (evilduck) {
    var PromiseSubscription = (function () {
        function PromiseSubscription(func, guid) {
            if (guid === void 0) { guid = null; }
            this._func = func;
            this._guid = guid;
        }
        PromiseSubscription.prototype.wrap = function ($q, data) {
            return this._func(data);
        };
        Object.defineProperty(PromiseSubscription.prototype, "guid", {
            get: function () {
                return this._guid;
            },
            enumerable: true,
            configurable: true
        });
        return PromiseSubscription;
    })();
    evilduck.PromiseSubscription = PromiseSubscription;
})(evilduck || (evilduck = {}));
