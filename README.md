# [lego]() &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/YousifHmada/Lego/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/react.svg?style=flat)](https://www.npmjs.com/package/lego.js-core/v/1.0.0)
Lego is a JavaScript library for building modular extendable functions.

* **Declarative:** Lego let you use your modules in a very declarative way, it makes your code more predictable, simpler to understand, and easier to debug.
* **Focused:** It handles both Sync and Async modules, so that you only focus on the steps and how to connect different modules.
* **Promise-like syntax** You'll notice that we used an Promise-like syntax, so that writing it feels like home.
[Learn how to use Lego in your own project]().

## Examples

We have several examples [on the website](). Here are some to get you started:

```js
var lego = Lego(num => num * 2)
  .then(num=> num +1)
 
 lego(4) // 9
```
```js
var lego = lego((arg) => arg * 2)
    .then(arg => {
        return arg + 2
    })
    .then(arg => {
        return arg * 3
    })
    .then(res => {
        return res - 8
    })
    
lego(2) //10
```
```js
var lego = lego(() => { throw new Error("no way") })
    .catch(e => {
        e; //"no way"
        throw new Error("yes way")
    })
    .then(num => num * 2)
    .catch(e => {
        e; //"yes way"
        return 5
    })
    .then(res => {
        return 4 * res; // 4 * 5
    })
    
lego() //20
```
Those examples show how you can declare legos and start using them in a promise like syntax, they also show how you can attach a catch statement after some step so that you can handle the error and resume the rest of your steps

Legos will act sync when no async code found ie (Functions that returns a promise etc...)

```js
var fun = lego((num) => Promise.resolve(num * 2))

fun(2)
    .then((res) => {
        res; //4
    })
```

```js
var fun = lego(() => 2)
    .then(num => Promise.resolve(num + 1))
    .then(num => num * 2)
    .then(num => num + 3)
fun()
    .then((res) => {
        res; //9
    })
```
```js
var fun = lego(() => Promise.reject("no way"))
    .catch(e => {
        e; //"no way"
        return "lol"
    })

fun()
    .then((res) => {
        res; //"lol"
    })
```
Notice how Legos resolve into promises when async blocks found

```js
var legoPiece = lego((num) => num * 2)

var legoPiecePlus1 = legoPiece
    .then(num => num + 1)
    
var legoPiecePlus2 = legoPiece
    .then(num => num * 5)

legoPiece(3) //6
legoPiecePlus1(3) //7
legoPiecePlus2(3) //30
```
```js
var legoPiece = lego((num) => num * 2)

var legoPiecePlus = legoPiece
    .then(num => num + 1)

var legoPiecePlusPlus = legoPiecePlus
    .then(num => num + 1)

legoPiece(3) //6
legoPiecePlus(3) //7
legoPiecePlusPlus(3) //8
```
```js
var legoPiece = lego((num) => Promise.resolve(num * 2))

var legoPiecePlus = legoPiece
    .then(num => num + 1)

var legoPiecePlusPlus = legoPiecePlus
    .then(num => num + 1)

legoPiece(3)
    .then((res) => {
        res; //6
    })

legoPiecePlus(3)
    .then((res) => {
        res; //7
    })

legoPiecePlusPlus(3)
    .then((res) => {
        res; //8
    })
```
```js
var legoPiece = lego((num) => Promise.resolve(num * 2))

var legoPiecePlus1 = legoPiece
    .then(num => num + 1)

var legoPiecePlus2 = legoPiece
    .then(num => num * 5)

legoPiece(3)
    .then((res) => {
        res; //6
    })

legoPiecePlus1(3)
    .then((res) => {
        res; //7
    })

legoPiecePlus2(3)
    .then((res) => {
        res; //30
    })
```
```js
var legoPiece = lego(() => { throw new Error("lol") })

var legoPiecePlus1 = legoPiece
    .catch(e => {
        e; //"lol"
        return "lol1"
    })

var legoPiecePlus2 = legoPiece
    .catch(e => {
        e; //"lol"
        return "lol2"
    })

legoPiecePlus1() //"lol1"
legoPiecePlus2() //"lol2"
```
```js
var legoPiece = lego(() => { throw new Error("lol") })

var legoPiecePlus1 = legoPiece
    .catch(e => {
        e; //"lol"
        return 1
    })

var legoPiecePlus2 = legoPiece
    .catch(e => {
        e; //"lol"
        return 2
    })

try {
    legoPiece()
} catch (e) {
    e.message //"lol"
}

legoPiecePlus1() //1
legoPiecePlus2() //2
```
```js
var legoPiece = lego(() => { throw new Error("lol") })

var legoPiecePlus1 = legoPiece
    .catch(e => {
        e; //"lol"
        throw new Error("nope")
    })
    .catch(e => {
        e; //"nope"
        return 1
    })
    .then(num => num * 2)

var legoPiecePlus2 = legoPiece
    .catch(e => {
        e; //"lol"
        return 2
    })
    .then(() => { throw new Error("nope") })
    .catch(e => {
        e; //"nope"
    })

try {
    legoPiece()
} catch (e) {
    e.message //"lol"
}

legoPiecePlus1() //2
legoPiecePlus2() //undefined
```
Notice how legos can be easily extended and exchanged

```js
var legoPiece = lego((num) => num * 2)

var legoPiecePlus = legoPiece
    .then(num => Promise.resolve(num + 1))

//no async steps found so it will execute sync
legoPiece(3) //6

//an async step found so it will return a promise
legoPiecePlus(3)
    .then((res) => {
        res //7
    })
```
```js
var legoPiece = lego((num) => num * 2)

var legoPiecePlus = legoPiece
    .then(num => Promise.resolve(num + 1))

var legoPiecePlusPlus = legoPiecePlus
    .then(num => Promise.resolve(num + 1))

//no async steps found so it will execute sync
legoPiece(3) //6

//an async step found so it will return a promise
legoPiecePlus(3)
    .then((res) => {
        res //7
    })
    
//an async step found so it will return a promise
legoPiecePlusPlus(3)
    .then((res) => {
        res //8
    })
```
Notice how legos executes sync till an async step interrupts
```js
var lego1 = lego((num) => num * 2)

var lego2 = lego((num) => num + 1)

var legoCon1 = lego1.concat(lego2)
var legoCon2 = lego2.concat(lego1)

lego1(2) //4
lego2(2) //3
legoCon1(2) //5
legoCon2(2) //6
```
```js
var lego1 = lego((num) => num * 2)

var lego2 = lego((num) => Promise.resolve(num + 1))

var legoCon1 = lego1.concat(lego2)
var legoCon2 = lego2.concat(lego1)

lego1(2) //4

lego2(2).then((res) => {
    res; //3
})

legoCon1(2).then((res) => {
    res; //5
})

legoCon2(2).then((res) => {
    res; //6
})
```
```js
var lego1 = lego(() => { throw new Error("lol") })

var lego2 = lego((num) => num + 1)
    .catch(e => {
        e; //"lol"
        return 5
    })
    .then(num => num * 2)

var legoCon1 = lego1.concat(lego2)
var legoCon2 = lego2.concat(lego1)

try {
    lego1()
} catch (e) {
    e.message; //"lol"
}

try {
    legoCon2()
} catch (e) {
    e.message; //"lol"
}

lego2(2); //6
legoCon1(2); //10
```
```js
var lego1 = lego(() => Promise.reject("no way"))

var lego2 = lego((num) => num + 1)
    .catch(e => {
        e; //"no way"
        return 5
    })
    .then(num => num * 2)

var legoCon1 = lego1.concat(lego2)
var legoCon2 = lego2.concat(lego1)

lego2(2); //6

lego1()
    .catch((res) => {
        res; //"no way"
    })

legoCon1()
    .then((res) => {
        res; //10
    })

legoCon2()
    .catch((res) => {
        res; //"no way"
    })
```
- Lego offers you a new pattern of writing modular reusable code that handles both sync and async callbacks to let you focus on building your logic and declare your steps.
- Legos can be easily extended and you can literally build your app out of small little legos
- Legos make your code very declarative beacause each legoPiece kind of represents a step, so it's alot easier for anyone to reason about your logic 

### License

Lego is [MIT licensed](./LICENSE).
