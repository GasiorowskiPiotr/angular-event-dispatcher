module evilduck {
    export class TagSubscription implements ISubscription {
        private _tagName: string;
        private _sub: ISubscription;
        private _guid: string;

        public static General(tagName: string, func: (any) => any, guid: string = null): TagSubscription {
            var s = new TagSubscription();
            s._sub = new InnerSubscription(func, guid);
            s._tagName = tagName;

            return s;
        }

        public get tagName(): string {
            return this._tagName;
        }

        public get subscription(): ISubscription {
            return this._sub;
        }

        public get guid(): string {
            return this._guid;
        }

        public wrap($q: ng.IQService, data: any): ng.IPromise<any> {
            return this._sub.wrap($q, data);
        }
    }
} 