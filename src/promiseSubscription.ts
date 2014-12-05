﻿module evilduck {

    export class PromiseSubscription implements ISubscription {

        private _func: (any) => ng.IPromise<any>;
        private _guid: string;

        constructor(func: (any) => ng.IPromise<any>, guid: string = null) {
            this._func = func;
            this._guid = guid;
        }

        public wrap($q: ng.IQService, data: any): ng.IPromise<any> {
            return this._func(data);
        }

        public get guid() {
            return this._guid;
        }

    }

} 