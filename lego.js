const isCatchBlockSymbol = Symbol("isCatchBlock")

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
                result = (this.parent === null) ? args : this.parent.resolve(args)
            } catch (e) {
                result = e && e.message
                return this.cb(result)
            }
            if (result !== undefined && result.then && result.catch) {
                return result.catch(this.cb)
            }
            return result
        } else {
            result = (this.parent === null) ? args : this.parent.resolve(args)
            if (result !== undefined && result.then && result.catch) {
                return result.then(this.cb)
            }
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