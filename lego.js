function Lego(fun) {
    this.fun = fun
}

Lego.prototype = {
    fun: () => undefined,
    next: null,
    parent: null,
    then(cb) {
        var lego = new Lego(cb)
        this.next = lego
        lego.parent = this
        var wrapedFun = () => lego.resolve()
        wrapedFun.then = lego.then.bind(lego)
        wrapedFun.catch = lego.catch.bind(lego)
        return wrapedFun
    },
    catch(cb) {
        var lego = new Lego(cb)
        this.next = lego
        lego.parent = this
        lego.resolve = lego.parent && lego.parent.resolve.bind(lego.parent, true, lego)
        var wrapedFun = () => lego.resolve()
        wrapedFun.then = lego.then.bind(lego)
        wrapedFun.catch = lego.catch.bind(lego)
        return wrapedFun
    },
    resolve(hasFutureCatch, onError) {
        var result;
        try {
            result = this.parent && this.parent.resolve(hasFutureCatch);
            return this.fun(result)
        } catch (e) {
            if (!hasFutureCatch) {
                console.error("Unhandled lego rejection")
                return undefined
            }
            return onError.fun()
        }
    }
}

function makeLego(cb) {
    var lego = new Lego(cb)
    var wrapedFun = () => lego.resolve()
    wrapedFun.then = lego.then.bind(lego)
    wrapedFun.catch = lego.catch.bind(lego)
    return wrapedFun
}

module.exports = makeLego