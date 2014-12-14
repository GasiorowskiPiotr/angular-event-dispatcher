module evilduck {
    export class EventSubscription implements IEventSubscription {
        private _eventName: string;
        private _tagSubs: TagSubscription[];
        private _subs: ISubscription[];

        constructor(eventName: string) {
            this._eventName = eventName;
            this._tagSubs = new Array<TagSubscription>();
            this._subs = new Array<ISubscription>();
        }

        public get eventName(): string {
            return this._eventName;
        }

        public subscribe(func: (any) => any, tag: string = null): SubscriptionInfo {
            return this.subscribeGeneral(func, tag);
        }

       
        private subscribeGeneral(func: (any) => any, tag: string = null): SubscriptionInfo {
            var guid = this.createGuid();
            if (tag) {
                this._tagSubs.push(TagSubscription.General(tag, func, guid));
                return new SubscriptionInfo(guid, this._eventName, tag);
            } else {
                this._subs.push(new InnerSubscription(func, guid));
                return new SubscriptionInfo(guid, this._eventName);
            }
        }

        public wrap($q: ng.IQService, data: any, tagName: string = null): ng.IPromise<any> {

            var subs: ISubscription[];
            var tagSubs: TagSubscription[];

            if (tagName) {
                subs = new Array<ISubscription>();
                // TODO: Cache it
                tagSubs = _.filter(this._tagSubs, (ts: TagSubscription) => ts.tagName === tagName);
            } else {
                subs = this._subs;
                tagSubs = this._tagSubs;
            }

            var toExec = _.union(subs, tagSubs);
            if (toExec.length == 0) {
                return $q.when();
            }

            var promises = _.map(toExec, (sub: ISubscription) => {
                return sub.wrap($q, data);
            });

            return $q.all(promises);
        }

        public unsubscribe(guid: string, tag: string = null) {
            if (tag) {
                var itemT = _.find(this._tagSubs, (s: TagSubscription) => s.tagName === tag && s.guid === guid);
                var idxT = _.indexOf(this._tagSubs, itemT);
                this._tagSubs.splice(idxT, 1);
            } else {
                var itemS = _.find(this._subs, (s: ISubscription) => s.guid === guid);
                var idxS = _.indexOf(this._subs, itemS);
                this._subs.splice(idxS, 1);
            }
        }

        public get count(): number {
            return this._subs.length + this._tagSubs.length;
        }

        private createGuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    }
} 