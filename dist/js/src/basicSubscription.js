var evilduck;
(function (evilduck) {
    var BasicSubscription = (function () {
        function BasicSubscription(func, guid) {
            if (guid === void 0) { guid = null; }
            this._func = func;
            this._guid = guid;
        }
        BasicSubscription.prototype.wrap = function ($q, data) {
            var deferral = $q.defer();
            try {
                var res = this._func(data);
                deferral.resolve(res);
            }
            catch (err) {
                deferral.reject(err);
            }
            return deferral.promise;
        };
        Object.defineProperty(BasicSubscription.prototype, "guid", {
            get: function () {
                return this._guid;
            },
            enumerable: true,
            configurable: true
        });
        return BasicSubscription;
    })();
    evilduck.BasicSubscription = BasicSubscription;
})(evilduck || (evilduck = {}));
