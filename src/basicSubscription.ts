module evilduck {
    export class BasicSubscription implements ISubscription {

        constructor(func: (any) => any, guid: string = null) {
            this._func = func;
            this._guid = guid;
        }

        private _func: (any) => any;
        private _scope: ng.IScope;
        private _guid: string;

        public wrap($q: ng.IQService, data: any): ng.IPromise<any> {
            var deferral = $q.defer();

            try {
                var res = this._func(data);
                deferral.resolve(res);
            } catch (err) {
                deferral.reject(err);
            }

            return deferral.promise;
        }

        public get guid() {
            return this._guid;
        }
    }
} 