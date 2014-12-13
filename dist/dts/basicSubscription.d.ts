declare module evilduck {
    class BasicSubscription implements ISubscription {
        constructor(func: (any: any) => any, guid?: string);
        private _func;
        private _scope;
        private _guid;
        wrap($q: ng.IQService, data: any): ng.IPromise<any>;
        guid: string;
    }
}
