module evilduck {

    export class PromiseSubscription implements ISubscription {

        private _func: () => ng.IPromise<any>;
        private _guid: string;

        constructor(func: () => ng.IPromise<any>, guid: string = null) {
            this._func = func;
            this._guid = guid;
        }

        public wrap($q: ng.IQService): ng.IPromise<any> {
            return this._func();
        }

        public get guid() {
            return this._guid;
        }

    }

} 