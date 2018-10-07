const isCatchBlockSymbol = Symbol("isCatchBlock")

function Lego(cb) {
    this.cb = cb
}

Lego.prototype = {
    cb: () => undefined
}

function LegoShape(lego) {
    this.defArr = [lego]
}

LegoShape.prototype = {
    then(cb) {
        var lego = new Lego(cb)
        this.defArr.push(lego)
    },
    catch(cb) {
        var lego = new Lego(cb)
        lego[isCatchBlockSymbol] = true
        this.defArr.push(lego)
    },
    resolve(args) {
        var error = false;
        var result = args;
        for (let i = 0; i < this.defArr.length; i++) {
            var lego = this.defArr[i];
            if (error) {
                if (lego[isCatchBlockSymbol]) {
                    error = false
                    try {
                        result = lego.cb(result)
                    } catch (e) {
                        error = true
                        result = e.message
                    }
                }
                continue;
            }
            if (result !== undefined && result.then && result.catch) {
                result = lego[isCatchBlockSymbol] ? result.catch(lego.cb) : result.then(lego.cb)
            } else {
                if (!lego[isCatchBlockSymbol]) {
                    try {
                        result = lego.cb(result)
                    } catch (e) {
                        error = true
                        result = e.message
                    }
                }
            }
        }
        return result
    }
}

function legofy(cb) {
    var lego = new Lego(cb)
    var legoShape = new LegoShape(lego);
    var wrapedFun = (args) => legoShape.resolve(args)
    wrapedFun.then = (cb) => {
        legoShape.then(cb)
        return wrapedFun
    }
    wrapedFun.catch = (cb) => {
        legoShape.catch(cb)
        return wrapedFun
    }
    return wrapedFun
}

module.exports = legofy