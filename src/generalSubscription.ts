module evilduck {
    export class GeneralSubscription implements ISubscription {

        private _func: () => any;
        private _guid: string;

        constructor(func: () => any, guid: string = null) {
            this._func = func;
            this._guid = guid;
        }

        public wrap($q: ng.IQService): ng.IPromise<any> {
            return $q.when(this._func());
        }

        public get guid() {
            return this._guid;
        }
    }
} 