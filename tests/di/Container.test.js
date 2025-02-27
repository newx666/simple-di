const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {Container, I} = require('../../src/Container');

describe('Container', () => {
    it('bind value', () => {
        const container = new Container();
        const value = {a: 1, b: 2};
        container.bindValue('test', value);

        assert.equal(container.get('test'), value);
    });

    it('bind factory as singletone', () => {
        const container = new Container();
        let n = 5;
        const factory = (x) => x ** n; // factory return x^n
        container.bindFactory('test', factory, [2]);

        assert.equal(container.get('test'), 2 ** 5);
        n = 1;
        assert.equal(container.get('test'), 2 ** 5);
    });

    it('bind factory as not-singletone', () => {
        const container = new Container();
        let n = 5;
        const factory = (x) => x ** n; // factory return x^n
        container.bindFactory('test', factory, [2], false);

        assert.equal(container.get('test'), 2**5);
        n = 1;
        assert.equal(container.get('test'), 2**1);
    });

    it('bind constructor as singletone', () => {
        const container = new Container();
        const ExampleClass = class {
            constructor(name, age) {
                this.name = name;
                this.age = age;
            }
        };

        container.bindConstructor('test', ExampleClass, ['Vasily', 30]);
        const obj1 = container.get('test');
        const obj2 = container.get('test');
        assert(obj1 instanceof ExampleClass);
        assert.equal(obj1, obj2);
        assert.deepEqual(obj1, new ExampleClass('Vasily', 30));
    });

    it('bind constructor as not-singletone', () => {
        const container = new Container();
        const ExampleClass = class {
            constructor(name, age) {
                this.name = name;
                this.age = age;
            }
        };

        container.bindConstructor('test', ExampleClass, ['Vasily', 30], false);
        const obj1 = container.get('test');
        const obj2 = container.get('test');
        assert(obj1 instanceof ExampleClass);
        assert.notEqual(obj1, obj2);
        assert.deepEqual(obj1, new ExampleClass('Vasily', 30));
        assert.deepEqual(obj2, new ExampleClass('Vasily', 30));
    });

    it('bind dependency', () => {
        const container = new Container();

        const reverseTextFactory = text => text.split('').reverse().join(''); // reverse text

        class HelloClass {
            constructor(name){
                this.name = name;
            }

            get helloMessage(){
                return `Hello ${this.name}!`;
            }
        }

        container.bindConstructor('hello', HelloClass, [I('name')]);

        container.bindFactory('name', reverseTextFactory, [I('reverseName')]);

        container.bindValue('reverseName', 'ecilA');

        assert.equal(container.get('hello').helloMessage, 'Hello Alice!');
    });

});