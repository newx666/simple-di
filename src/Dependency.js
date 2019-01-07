/**
 * Dependency data-value object
 */
class Dependency {
    /**
     * @param name {string}
     */
    constructor(name) {
        this._name = name;
    }

    /**
     *
     * @returns {string}
     */
    get name() {
        return this._name;
    }
}
module.exports = Dependency;