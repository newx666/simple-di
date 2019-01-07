# Simple Dependency Injection Container for JS

## Installation

```bash
npm i --save @newx/simple-di
```


## Basic usage

```javascript
const {Container, I} = require('@newx/simple-di');
const mysql = require('mysql');

const container = new Container();

const mysqlConnectionFactory = (host, user, password) => mysql.createConnection({host, user, password});

class ExampleRepository{
    constructor(db){
        this.db = db;
    }
    
    doSomething(){
        // use this.db 
    }
}



// Set value-dependency for save password
container.bindValue('dbRootPassword', 'secret');

// Set singletone factory returning DB connection instance
container.bindFactory(
    'DB', // dependency name 
    mysqlConnectionFactory, // factory-function
    [ // arguments for factory-function:
        'localhost', // host
        'root', // user
        I('dbRootPassword') // password injection via value-dependency 'dbRootPassword'
    ]
);

// Set singletone object via constructor
container.bindConstructor(
    'SomeRepository', // dependency name 
    ExampleRepository, // Class name
    [I('DB')] // Dependencies (via factory-dependency with name 'DB')
);

 // object instanceof ExampleRepository. All dependency implements via Container
const repo = container.get('SomeRepository');

repo.doSomething(); // <-- In this method this.db implements via mysqlConnectionFactory
```

## Methods
```javascript
const {Container, I} = require('@newx/simple-di');
const container = new Container();

```

* `container.get(name)` - returning container entity by name. If name `name` not including in container then throw 
                          exception
    * `name {string}` - container entity name

* `container.bindValue(name, value)` - append simple value into container, e.g. for configure application params
    * `name {string}` - container entity name
    * `value - {any}` - binding value for container entity (save by reference - all callings `container.get(name)` will
                        return the same object)

Example:                        
```javascript
container.bindValue('demo1', {a:1});
const d1 = container.get('demo1');
const d2 = container.get('demo1');

console.log(d1.a); // 1
console.log(d2.a); // 1
console.log(d1 === d2); //> true
```

* `container.bindFactory(name, factory, args = [], asSingleton = true)` - append in container entity with name `name` 
via function-factory
    * `name {string}` - container entity name
    * `factory {function}` - factory function returning value for container entity `name`
    * `args {array}` - argument list for function `factory` (default without arguments)
    * `asSingleton {boolean}` - bind as singletone

example:
```javascript
const helloFactory = name => {
    console.log('Run helloFactory');
    return `Hello ${name}`;
};

container.bindFactory('hello', helloFactory, ['Alice']); //binding factory as singletone

const hello1 = container.get('hello'); //> Run helloFactory
const hello2 = container.get('hello'); // function anymore not execute

console.log(hello1); //>  Hello Alice

container.bindFactory('hello-not-singletone', helloFactory, ['Bob'], false); //binding factory as NOT singletone

const hello3 = container.get('hello-not-singletone'); //> Run helloFactory
const hello4 = container.get('hello-not-singletone'); //> Run helloFactory

console.log(hello3); //>  Hello Bob
```

* `container.bindConstructor(name, classItem, args = [], asSingleton = true)` - append in container entity with name 
    `name` via constructor
    * `name {string}` - container entity name
    * `classItem {Constructor}` - class constructor for container entity `name`
    * `args {array}` - argument list for constructor `classItem (new classItem(...args) )` (default without arguments)
    * `asSingleton {boolean}` - bind as singletone
    
example:
```javascript
class HelloClass{
    constructor(name){
        this.name = name;
        console.log('Run hello constructor');
    }
    get helloMessage(){
        return `Hello ${this.name}`;
    }
}

container.bindConstructor('hello', HelloClass, ['Alice']); // binding constructor as singletone

const hello1 = container.get('hello'); //> Run hello constructor
const hello2 = container.get('hello'); //> constructor anymore not execute

console.log(hello1.helloMessage); //> Hello Alice
console.log(hello1 === hello2); //> true

container.bindConstructor('hello-not-singletone', HelloClass, ['Alice'], true); // binding constructor as NOT singletone

const hello3 = container.get('hello-not-singletone'); //> Run hello constructor
const hello4 = container.get('hello-not-singletone'); //> Run hello constructor

console.log(hello1.helloMessage); //> Hello Alice
console.log(hello1 === hello2); //> false
```


## Dependency injection into container

For dependency injection in the factory or constructor arguments, you must use a wrapper `I`

Example:
```javascript
const {Container, I} = require('@newx/simple-di');
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

console.log(container.get('hello').helloMessage); //> Hello Alice!
```

## Global container

If you need to use the same container throughout the application, you can use the `GlobalContainer` object from any file.

```javascript
const {GlobalContainer} = require('@newx/simple-di');
```