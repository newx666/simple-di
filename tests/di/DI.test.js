const {expect} = require('chai');

const {DI, I, GlobalContainer} = require('../../src/DI');

describe('DI', () => {
    it('bind value', () => {
        const di = new DI();
        const value = {a: 1, b: 2};
        di.bindValue('test', value);

        expect(di.get('test')).to.be.equal(value);

    });

    it('bind factory as singletone', () => {
        const di = new DI();
        let n = 5;
        const factory = (x) => x ** n; // factory return x^n
        di.bindFactory('test', factory, [2]);

        expect(di.get('test')).to.be.equal(2 ** 5);
        n = 1;
        expect(di.get('test')).to.be.equal(2 ** 5);
    });

    it('bind factory as not-singletone', () => {
        const di = new DI();
        let n = 5;
        const factory = (x) => x ** n; // factory return x^n
        di.bindFactory('test', factory, [2], false);

        expect(di.get('test')).to.be.equal(2 ** 5);
        n = 1;
        expect(di.get('test')).to.be.equal(2 ** 1);
    });

    it('bind constructor as singletone', () => {
        const di = new DI();
        const ExampleClass = class {
            constructor(name, age) {
                this.name = name;
                this.age = age;
            }
        };

        di.bindConstructor('test', ExampleClass, ['Vasily', 30]);
        const obj1 = di.get('test');
        const obj2 = di.get('test');
        expect(obj1).to.be.instanceof(ExampleClass);
        expect(obj1).to.be.equal(obj2);
        expect(obj1).to.deep.include({name: 'Vasily', age: 30})
    });

    it('bind constructor as not-singletone', () => {
        const di = new DI();
        const ExampleClass = class {
            constructor(name, age) {
                this.name = name;
                this.age = age;
            }
        };

        di.bindConstructor('test', ExampleClass, ['Vasily', 30], false);
        const obj1 = di.get('test');
        const obj2 = di.get('test');
        expect(obj1).to.be.instanceof(ExampleClass);
        expect(obj1).to.not.equal(obj2);
        expect(obj1).to.deep.include({name: 'Vasily', age: 30});
        expect(obj2).to.deep.include({name: 'Vasily', age: 30});
    });

    it('bind dependency', () => {
        const di = new DI();
        di.bindValue('n', 5);
        di.bindFactory('power', (x, n) => x ** n, [2, I('n')]);

        expect(di.get('power')).to.be.equal(2 ** 5);
    });


});