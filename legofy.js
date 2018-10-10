const isCatchBlockSymbol = Symbol("isCatchBlock")

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
        this.defArr.push(lego)
    }
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
    concat(legoShapes) {
        return new LegoShape(undefined, {
            defArr: [...this.defArr, ...legoShapes.map(e => e.defArr).reduce(
                (agg, cur) => [...agg, ...cur], []
            )]
        })
    },
    reverse() {
        return new LegoShape(undefined, {
            defArr: this.defArr.slice().reverse()
        })
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

function wrapLegoShape(legoShape) {

    var wrapedFun = (args) => legoShape.resolve(args)

    wrapedFun.then = (cb) => wrapLegoShape(legoShape.then(cb))

    wrapedFun.catch = (cb) => wrapLegoShape(legoShape.catch(cb))

    wrapedFun.concat = (...wrapedFuns) => wrapLegoShape(
        legoShape.concat(
            wrapedFuns.map(e => e[legoShapeRefSymbol])
        )
    )

    Object.defineProperty(wrapedFun, 'reverse', {
        get: () => wrapLegoShape(
            legoShape.reverse()
        )
    })


    wrapedFun[legoShapeRefSymbol] = legoShape

    return wrapedFun

}

function legofy(cb) {

    var legoShape;
    {
        var lego = new Lego(cb)
        legoShape = new LegoShape(lego);
    }

    return wrapLegoShape(legoShape)
}

module.exports = legofy