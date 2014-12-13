var evilduck;
(function (evilduck) {
    var GeneralSubscription = (function () {
        function GeneralSubscription(func, guid) {
            if (guid === void 0) { guid = null; }
            this._func = func;
            this._guid = guid;
        }
        GeneralSubscription.prototype.wrap = function ($q, data) {
            return $q.when(this._func(data));
        };
        Object.defineProperty(GeneralSubscription.prototype, "guid", {
            get: function () {
                return this._guid;
            },
            enumerable: true,
            configurable: true
        });
        return GeneralSubscription;
    })();
    evilduck.GeneralSubscription = GeneralSubscription;
})(evilduck || (evilduck = {}));
