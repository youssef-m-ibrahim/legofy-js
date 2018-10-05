var isCatchBlockSymbol = Symbol("isCatchBlock")

function Lego(cb) {
    this.cb = cb
}

Lego.prototype = {
    cb: () => undefined,
    parent: null,
    then(cb) {
        var lego = new Lego(cb)
        lego.parent = this
        wrapedFun = (args) => lego.resolve(args)
        wrapedFun.then = lego.then.bind(lego)
        wrapedFun.catch = lego.catch.bind(lego)
        return wrapedFun
    },
    catch(cb) {
        var lego = new Lego(cb)
        lego.parent = this
        lego[isCatchBlockSymbol] = true
        wrapedFun = (args) => lego.resolve(args)
        wrapedFun.then = lego.then.bind(lego)
        wrapedFun.catch = lego.catch.bind(lego)
        return wrapedFun
    },
    resolve(args) {
        var result;
        if (this[isCatchBlockSymbol]) {
            try {
                result = args || (this.parent && this.parent.resolve())
            } catch (e) {
                return this.cb(e);
            }
        } else {
            result = args || (this.parent && this.parent.resolve())
            return this.cb(result)
        }
    }
}

function makeLego(cb) {
    var lego = new Lego(cb)
    wrapedFun = (args) => lego.resolve(args)
    wrapedFun.then = lego.then.bind(lego)
    wrapedFun.catch = lego.catch.bind(lego)
    return wrapedFun
}

module.exports = makeLego