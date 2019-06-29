const isCatchBlockSymbol = Symbol("isCatchBlock")
const isAnyBlockSymbol = Symbol("isAnyBlock")
const legoShapeRefSymbol = Symbol("legoShapeRef")


function Lego(cb) {
    this.cb = cb
}

Lego.prototype = {
    cb: () => undefined
}

function LegoShape(lego, { defArr = [] } = {}) {
    this.defArr = [...defArr]
    if (lego != undefined) {
        this.defArr.push({ lego, type: 'FORWARD' })
    }
    return new Proxy((...args) => this.resolve(...args), {
        get: (obj, key) => this[key]
    })
}

LegoShape.prototype = {
    then(cb) {
        var lego = new Lego(cb)
        return new LegoShape(lego, { defArr: this.defArr })
    },
    catch(cb) {
        var lego = new Lego(cb)
        lego[isCatchBlockSymbol] = true
        return new LegoShape(lego, { defArr: this.defArr })
    },
    any(cb) {
        var lego = new Lego(cb)
        lego[isAnyBlockSymbol] = true
        return new LegoShape(lego, { defArr: this.defArr })
    },
    concat(...legoShapes) {
        return new LegoShape(undefined, {
            defArr: [...this.defArr, ...legoShapes.map(e => e.defArr).reduce(
                (agg, cur) => [...agg, ...cur], []
            )]
        })
    },
    resolve(...args) {
        var error = false;
        var result;
        for (let i = 0; i < this.defArr.length; i++) {
            var lego = this.defArr[i];

            if (error) {
                if (lego[isCatchBlockSymbol] || lego[isAnyBlockSymbol]) {
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
                result = (lego[isCatchBlockSymbol] || lego[isAnyBlockSymbol]) ?
                    result.catch(lego.cb) : result.then(lego.cb)
            } else {
                if (!lego[isCatchBlockSymbol]) {
                    try {
                        if (args !== null) {
                            result = lego.cb(...args)
                        } else {
                            result = lego.cb(result)
                        }
                    } catch (e) {
                        error = true
                        result = e.message
                    }
                    args = null
                }
            }
        }

        if (error) {
            throw new Error(result)
        }

        return result
    },
    get reverse() {
        return new LegoShape(undefined, {
            defArr: this.defArr.slice().reverse()
        })
    },
    get length() {
        return this.defArr.length
    },
    [Symbol.iterator]: function* () {
        for (let i = 0; i < this.defArr.length; i++) {
            yield new LegoShape(this.defArr[i]);
        }
    }
}

function legofy(cb) {

    var lego = new Lego(cb)

    return new LegoShape(lego)

}

module.exports = legofy