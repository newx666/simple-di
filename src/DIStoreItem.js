const TYPE_CONSTRUCTOR = 'constructor';
const TYPE_FACTORY = 'factory';
const TYPE_VALUE = 'value';

/**
 * data-value object
 */
class DIStoreItem {
    static get TYPE_CONSTRUCTOR() {
        return TYPE_CONSTRUCTOR;
    }

    static get TYPE_FACTORY() {
        return TYPE_FACTORY;
    }

    static get TYPE_VALUE() {
        return TYPE_VALUE;
    }

    static get ALLOWED_TYPE_LIST() {
        return [
            TYPE_CONSTRUCTOR,
            TYPE_FACTORY,
            TYPE_VALUE
        ];
    }


    /**
     *
     * @param name {string}
     * @param target {*}
     * @param args {Array}
     * @param type {string}
     * @param isSingleton {boolean}
     */
    constructor(name, target, args, type, isSingleton) {
        if (!this.constructor.ALLOWED_TYPE_LIST.includes(type)) {
            throw new Error(`Invalid type: '${type}'`);
        }
        this._name = name;
        this._target = target;
        this._args = args;
        this._type = type;
        this._isSingleton = isSingleton;
    }


    get name() {
        return this._name;
    }

    get args() {
        return this._args;
    }

    get type() {
        return this._type;
    }

    get isSingleton() {
        return this._isSingleton;
    }

    get target() {
        return this._target;
    }
}

module.exports = DIStoreItem;