declare module evilduck {
    class PromiseSubscription implements ISubscription {
        private _func;
        private _guid;
        constructor(func: (any: any) => ng.IPromise<any>, guid?: string);
        wrap($q: ng.IQService, data: any): ng.IPromise<any>;
        guid: string;
    }
}
