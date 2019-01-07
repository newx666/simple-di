const Dependency = require('./Dependency');
const DIStoreItem = require('./DIStoreItem');

const I = (name) => new Dependency(name);

class DI {

    static get TYPE_CONSTRUCTOR() {
        return DIStoreItem.TYPE_CONSTRUCTOR;
    };

    static get TYPE_FACTORY() {
        return DIStoreItem.TYPE_FACTORY;
    }

    static get TYPE_VALUE() {
        return DIStoreItem.TYPE_VALUE;
    }


    constructor() {
        this._store = {};
        this._resolve = {};
    }

    /**
     *
     * @param name {string}
     * @param value {*}
     */
    bindValue(name, value) {
        this._store[name] = new DIStoreItem(name, value, [], DIStoreItem.TYPE_VALUE, true);
        delete this._resolve[name];
        return this;
    }

    /**
     *
     * @param name {string}
     * @param factory {Function}
     * @param args {Array}
     * @param asSingleton {boolean}
     */
    bindFactory(name, factory, args = [], asSingleton = true) {
        this._store[name] = new DIStoreItem(name, factory, args, DIStoreItem.TYPE_FACTORY, asSingleton);
        delete this._resolve[name];
        return this;
    }

    /**
     *
     * @param name {string}
     * @param classItem {Class}
     * @param args {Array}
     * @param asSingleton {boolean}
     */
    bindConstructor(name, classItem, args = [], asSingleton = true) {
        this._store[name] = new DIStoreItem(name, classItem, args, DIStoreItem.TYPE_CONSTRUCTOR, asSingleton);
        delete this._resolve[name];
        return this;
    }

    /**
     * @param item {DIStoreItem}
     * @private
     */
    _makeValue(item) {
        return item.target;
    }

    /**
     * @param item {DIStoreItem}
     * @private
     */
    _makeFactory(item) {
        return item.target(...this._makeArgs(item.args));
    }

    /**
     * @param item {DIStoreItem}
     * @private
     */
    _makeConstructor(item) {
        return new item.target(...this._makeArgs(item.args));
    }

    /**
     *
     * @param args {Array}
     * @returns {Array}
     * @private
     */
    _makeArgs(args) {
        return args.map(arg => {
            if (arg instanceof Dependency) {
                return this.get(arg.name);
            }
            return arg;
        });
    }

    /**
     * @param name {string}
     * @returns {*}
     */
    get(name) {
        if (!this._store[name]) {
            throw new Error(`Dependency not found from '${name}'`);
        }

        if (this._resolve[name]) {
            return this._resolve[name];
        }

        /**
         * @type DIStoreItem
         */
        const item = this._store[name];

        let result;
        switch (item.type) {
            case DIStoreItem.TYPE_VALUE:
                result = this._makeValue(item);
                break;
            case DIStoreItem.TYPE_CONSTRUCTOR:
                result = this._makeConstructor(item);
                break;
            case DIStoreItem.TYPE_FACTORY:
                result = this._makeFactory(item);
                break;
        }

        if (item.isSingleton) {
            this._resolve[name] = result;
        }
        return result;
    }
}

const GlobalContainer = new DI();

module.exports = {DI, I, GlobalContainer};