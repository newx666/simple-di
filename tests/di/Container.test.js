const {expect} = require('chai');

const {Container, I} = require('../../src/Container');

describe('Container', () => {
    it('bind value', () => {
        const container = new Container();
        const value = {a: 1, b: 2};
        container.bindValue('test', value);

        expect(container.get('test')).to.be.equal(value);

    });

    it('bind factory as singletone', () => {
        const container = new Container();
        let n = 5;
        const factory = (x) => x ** n; // factory return x^n
        container.bindFactory('test', factory, [2]);

        expect(container.get('test')).to.be.equal(2 ** 5);
        n = 1;
        expect(container.get('test')).to.be.equal(2 ** 5);
    });

    it('bind factory as not-singletone', () => {
        const container = new Container();
        let n = 5;
        const factory = (x) => x ** n; // factory return x^n
        container.bindFactory('test', factory, [2], false);

        expect(container.get('test')).to.be.equal(2 ** 5);
        n = 1;
        expect(container.get('test')).to.be.equal(2 ** 1);
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
        expect(obj1).to.be.instanceof(ExampleClass);
        expect(obj1).to.be.equal(obj2);
        expect(obj1).to.deep.include({name: 'Vasily', age: 30})
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
        expect(obj1).to.be.instanceof(ExampleClass);
        expect(obj1).to.not.equal(obj2);
        expect(obj1).to.deep.include({name: 'Vasily', age: 30});
        expect(obj2).to.deep.include({name: 'Vasily', age: 30});
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

        expect(container.get('hello').helloMessage).to.be.equal('Hello Alice!');
    });

});