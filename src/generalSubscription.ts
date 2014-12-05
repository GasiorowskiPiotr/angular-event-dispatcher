module evilduck {
    export class GeneralSubscription implements ISubscription {

        private _func: (any) => any;
        private _guid: string;

        constructor(func: (any) => any, guid: string = null) {
            this._func = func;
            this._guid = guid;
        }

        public wrap($q: ng.IQService, data: any): ng.IPromise<any> {
            return $q.when(this._func(data));
        }

        public get guid() {
            return this._guid;
        }
    }
} 