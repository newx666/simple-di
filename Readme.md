# Simple Dependency Injection Container for JS

## Basic usage


```javascript
const {DI, I} = require('@newx/simple-di');
const mysql = require('mysql');

const di = new DI();

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
di.bindValue('dbRootPassword', 'secret');

// Set singletone factory returning DB connection instance
di.bindFactory(
    'DB', // dependency name 
    mysqlConnectionFactory, // factory-function
    [ // arguments for factory-function:
        'localhost', // host
        'root', // user
        I('dbRootPassword') // password injection via value-dependency 'dbRootPassword'
    ]
);

// Set singletone object via constructor
di.bindConstructor(
    'SomeRepository', // dependency name 
    ExampleRepository, // Class name
    [I('DB')] // Dependencies (via factory-dependency with name 'DB')
);

 // object instanceof ExampleRepository. All dependency implements via DI
const repo = di.get('SomeRepository');

repo.doSomething(); // <-- In this method this.db implements via mysqlConnectionFactory
```

