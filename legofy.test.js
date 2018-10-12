const legofy = require('./legofy')

describe('It should act in a Sync fashion', () => {

    it('should resolve right (Example 1)', () => {
        var lego = legofy((num) => num * 2)
        expect(lego(2)).toBe(4)
    })

    it('should resolve right (Example 2)', () => {
        var lego = legofy(() => 2)
        expect(lego()).toBe(2)
    })

    it('should resolve right (Example 3)', () => {
        var lego = legofy(() => 2)
            .then(num => num + 1)
            .then(num => num * 2)
            .then(num => num + 3)
        expect(lego()).toBe(9)
    })

    it('should reject (Example 1)', () => {
        var lego = legofy(() => { throw new Error("no way") })
            .catch(e => {
                expect(e).toBe("no way")
                return "lol"
            })
        expect(lego()).toBe("lol")
    })

    it('should reject (Example 2)', () => {
        var lego = legofy(() => { throw new Error("no way") })
            .catch(e => {
                expect(e).toBe("no way")
                throw new Error("yes way")
            })
            .catch(e => {
                expect(e).toBe("yes way")
                return "lol"
            })
        expect(lego(2)).toBe("lol")
    })

    it('should reject (Example 3)', () => {
        var lego = legofy(() => { throw new Error("no way") })
            .then(() => {
                expect(true).toBe(false)
            })
            .catch(e => {
                expect(e).toBe("no way")
                throw new Error("yes way")
            })
            .catch(e => {
                expect(e).toBe("yes way")
                return 2
            })
        expect(lego(2)).toBe(2)
    })

    it('should reject and then resolve (Example 4)', () => {
        var lego = legofy(() => { throw new Error("no way") })
            .catch(e => {
                expect(e).toBe("no way")
                throw new Error("yes way")
            })
            .then(e => {
                expect(true).toBe(false)
            })
            .catch(e => {
                expect(e).toBe("yes way")
                return 4
            })
        expect(lego()).toBe(4)
    })

    it('should reject and then resolve (Example 5)', () => {
        var lego = legofy(() => { throw new Error("no way") })
            .catch(e => {
                expect(e).toBe("no way")
                throw new Error("yes way")
            })
            .then(e => {
                expect(true).toBe(false)
            })
            .catch(e => {
                expect(e).toBe("yes way")
                return 5
            })
            .then(res => {
                expect(res).toBe(5)
                return 4
            })
        expect(lego()).toBe(4)
    })

    it('happy path (Example 1)', () => {
        var lego = legofy((arg) => arg * 2)
            .then(arg => {
                expect(arg).toBe(4)
                return arg + 1
            })
            .then(arg => {
                expect(arg).toBe(5)
                return arg + 1
            })
            .then(arg => {
                expect(arg).toBe(6)
                return arg + 1
            })
            .then(res => {
                expect(res).toBe(7)
                return 8
            })
        expect(lego(2)).toBe(8)
    })

    it('not really (Example 1)', () => {
        var lego = legofy((arg) => arg * 2)
            .then(arg => {
                expect(arg).toBe(4)
                return arg + 1
            })
            .catch(m => {
                expect(true).toBe(false)
            })
            .then(arg => {
                expect(arg).toBe(5)
                return arg + 1
            })
            .then(arg => {
                expect(arg).toBe(6)
                return arg + 1
            })
            .catch(e => {
                expect(true).toBe(false)
            })
            .then(res => {
                expect(res).toBe(7)
                return 8
            })
        expect(lego(2)).toBe(8)
    })

    it('not really (Example 2)', () => {
        var lego = legofy((arg) => arg * 2)
            .catch(m => {
                expect(true).toBe(false)
            })
            .catch(m => {
                expect(true).toBe(false)
            })
            .then(arg => {
                expect(arg).toBe(4)
                return arg + 1
            })
            .then(arg => {
                expect(arg).toBe(5)
                return arg + 1
            })
            .catch(e => {
                expect(true).toBe(false)
            })
            .catch(m => {
                expect(true).toBe(false)
            })
            .then(res => {
                expect(res).toBe(6)
                return res + 1
            })
        expect(lego(2)).toBe(7)
    })

    it('not really (Example 3)', () => {
        var lego = legofy((arg) => { throw new Error("watch out!") })
            .catch(e => {
                expect(e).toBe("watch out!")
                return 1
            })
            .catch(m => {
                expect(true).toBe(false)
            })
            .then(arg => {
                expect(arg).toBe(1)
                return arg + 1
            })
            .then(arg => {
                expect(arg).toBe(2)
                return arg + 1
            })
            .catch(e => {
                expect(true).toBe(false)
            })
            .catch(m => {
                expect(true).toBe(false)
            })
            .then(res => {
                expect(res).toBe(3)
                return res + 1
            })
        expect(lego(2)).toBe(4)
    })

    it('not really (Example 4)', () => {
        var lego = legofy((arg) => { throw new Error("watch out!") })
            .catch(e => {
                expect(e).toBe("watch out!")
                return 1
            })
            .catch(m => {
                expect(true).toBe(false)
            })
            .then(arg => {
                expect(arg).toBe(1)
                return arg + 1
            })
            .then(arg => {
                expect(arg).toBe(2)
                throw new Error()
            })
            .catch(e => {
                expect(e).toBe('')
                return 5
            })
            .catch(m => {
                expect(true).toBe(false)
            })
            .then(res => {
                expect(res).toBe(5)
                return 6
            })
        expect(lego(2)).toBe(6)
    })

    it('not really (Example 5)', () => {
        var lego = legofy((arg) => { throw new Error("watch out!") })
            .catch(e => {
                expect(e).toBe("watch out!")
                return 1
            })
            .catch(m => {
                expect(true).toBe(false)
            })
            .then(arg => {
                expect(arg).toBe(1)
                return arg + 1
            })
            .then(arg => {
                expect(arg).toBe(2)
                throw new Error()
            })
            .catch(e => {
                expect(e).toBe('')
                throw new Error("nope")
            })
            .catch(e => {
                expect(e).toBe("nope")
            })
            .then(res => {
                expect(res).toBe(undefined)
                return res
            })
        expect(lego(2)).toBe(undefined)
    })

})

describe('It should act in an Async fashion', () => {

    it('should resolve right (Example 1)', (done) => {
        var lego = legofy((num) => Promise.resolve(num * 2))
        lego(2)
            .then((res) => {
                expect(res).toBe(4)
                done()
            })
    })

    it('should resolve right (Example 2)', (done) => {
        var lego = legofy(() => Promise.resolve(2))
        lego()
            .then((res) => {
                expect(res).toBe(2)
                done()
            })
    })

    it('should resolve right (Example 3)', (done) => {
        var lego = legofy(() => 2)
            .then(num => Promise.resolve(num + 1))
            .then(num => num * 2)
            .then(num => num + 3)
        lego()
            .then((res) => {
                expect(res).toBe(9)
                done()
            })
    })

    it('should reject (Example 1)', (done) => {
        var lego = legofy(() => Promise.reject("no way"))
            .catch(e => {
                expect(e).toBe("no way")
                return "lol"
            })
        lego()
            .then((res) => {
                expect(res).toBe("lol")
                done()
            })
    })

    it('should reject (Example 2)', (done) => {
        var lego = legofy(() => { return Promise.reject("no way") })
            .catch(e => {
                expect(e).toBe("no way")
                return Promise.reject("yes way")
            })
            .catch(e => {
                expect(e).toBe("yes way")
                return "lol"
            })
        lego()
            .then((res) => {
                expect(res).toBe("lol")
                done()
            })
    })

    it('should reject (Example 3)', (done) => {
        var lego = legofy(() => { return Promise.reject("no way") })
            .then(() => {
                expect(true).toBe(false)
            })
            .catch(e => {
                expect(e).toBe("no way")
                return Promise.reject("yes way")
            })
            .catch(e => {
                expect(e).toBe("yes way")
                return 2
            })
        lego()
            .then((res) => {
                expect(res).toBe(2)
                done()
            })
    })

    it('should reject and then resolve (Example 4)', (done) => {
        var lego = legofy(() => { return Promise.reject("no way") })
            .catch(e => {
                expect(e).toBe("no way")
                return Promise.reject("yes way")
            })
            .then(e => {
                expect(true).toBe(false)
            })
            .catch(e => {
                expect(e).toBe("yes way")
                return 4
            })
        lego()
            .then((res) => {
                expect(res).toBe(4)
                done()
            })
    })

    it('should reject and then resolve (Example 5)', (done) => {
        var lego = legofy(() => { return Promise.reject("no way") })
            .catch(e => {
                expect(e).toBe("no way")
                return Promise.reject("yes way")
            })
            .then(e => {
                expect(true).toBe(false)
            })
            .catch(e => {
                expect(e).toBe("yes way")
                return 5
            })
            .then(res => {
                expect(res).toBe(5)
                return 4
            })
        lego()
            .then((res) => {
                expect(res).toBe(4)
                done()
            })
    })

    it('happy path (Example 1)', (done) => {
        var lego = legofy((arg) => arg * 2)
            .then(arg => {
                expect(arg).toBe(4)
                return arg + 1
            })
            .then(arg => {
                expect(arg).toBe(5)
                return Promise.resolve(arg + 1).then(() => 4).then(() => 2)
            })
            .then(arg => {
                expect(arg).toBe(2)
                return 7
            })
            .then(res => {
                expect(res).toBe(7)
                return 8
            })
        lego(2)
            .then((res) => {
                expect(res).toBe(8)
                done()
            })
    })

    it('not really (Example 1)', (done) => {
        var lego = legofy((arg) => Promise.resolve(arg * 2))
            .then(arg => {
                expect(arg).toBe(4)
                return arg + 1
            })
            .catch(m => {
                expect(true).toBe(false)
            })
            .then(arg => {
                expect(arg).toBe(5)
                return arg + 1
            })
            .then(arg => {
                expect(arg).toBe(6)
                return arg + 1
            })
            .catch(e => {
                expect(true).toBe(false)
            })
            .then(res => {
                expect(res).toBe(7)
                return 8
            })
        lego(2)
            .then((res) => {
                expect(res).toBe(8)
                done()
            })
    })

    it('not really (Example 2)', (done) => {
        var lego = legofy((arg) => Promise.resolve(arg * 2))
            .catch(m => {
                expect(true).toBe(false)
            })
            .catch(m => {
                expect(true).toBe(false)
            })
            .then(arg => {
                expect(arg).toBe(4)
                return arg + 1
            })
            .then(arg => {
                expect(arg).toBe(5)
                return arg + 1
            })
            .catch(e => {
                expect(true).toBe(false)
            })
            .catch(m => {
                expect(true).toBe(false)
            })
            .then(res => {
                expect(res).toBe(6)
                return res + 1
            })
        lego(2)
            .then((res) => {
                expect(res).toBe(7)
                done()
            })
    })

    it('not really (Example 3)', (done) => {
        var lego = legofy((arg) => { return Promise.reject("watch out!") })
            .catch(e => {
                expect(e).toBe("watch out!")
                return 1
            })
            .catch(m => {
                expect(true).toBe(false)
            })
            .then(arg => {
                expect(arg).toBe(1)
                return arg + 1
            })
            .then(arg => {
                expect(arg).toBe(2)
                return arg + 1
            })
            .catch(e => {
                expect(true).toBe(false)
            })
            .catch(m => {
                expect(true).toBe(false)
            })
            .then(res => {
                expect(res).toBe(3)
                return res + 1
            })
        lego(2)
            .then((res) => {
                expect(res).toBe(4)
                done()
            })
    })

    it('not really (Example 4)', (done) => {
        var lego = legofy((arg) => { return Promise.reject("watch out!") })
            .catch(e => {
                expect(e).toBe("watch out!")
                return 1
            })
            .catch(m => {
                expect(true).toBe(false)
            })
            .then(arg => {
                expect(arg).toBe(1)
                return arg + 1
            })
            .then(arg => {
                expect(arg).toBe(2)
                return Promise.reject()
            })
            .catch(e => {
                expect(e).toBe(undefined)
                return 5
            })
            .catch(m => {
                expect(true).toBe(false)
            })
            .then(res => {
                expect(res).toBe(5)
                return 6
            })
        lego(2)
            .then((res) => {
                expect(res).toBe(6)
                done()
            })
    })

    it('not really (Example 5)', (done) => {
        var lego = legofy((arg) => { return Promise.reject("watch out!") })
            .catch(e => {
                expect(e).toBe("watch out!")
                return 1
            })
            .catch(m => {
                expect(true).toBe(false)
            })
            .then(arg => {
                expect(arg).toBe(1)
                return arg + 1
            })
            .then(arg => {
                expect(arg).toBe(2)
                return Promise.reject()
            })
            .catch(e => {
                expect(e).toBe(undefined)
                return Promise.reject("nope")
            })
            .catch(e => {
                expect(e).toBe("nope")
            })
            .then(res => {
                expect(res).toBe(undefined)
                return res
            })
        lego(2)
            .then((res) => {
                expect(res).toBe(undefined)
                done()
            })
    })

})

describe('legos can be extendable', () => {

    it('sync happy path (Example 1)', () => {
        var legoPiece = legofy((num) => num * 2)
        var legoPiecePlus = legoPiece
            .then(num => num + 1)
        expect(legoPiece(3)).toBe(6)
        expect(legoPiecePlus(3)).toBe(7)
    })

    it('sync happy path (Example 2)', () => {
        var legoPiece = legofy((num) => num * 2)
        var legoPiecePlus = legoPiece
            .then(num => num + 1)
        var legoPiecePlusPlus = legoPiecePlus
            .then(num => num + 1)
        expect(legoPiece(3)).toBe(6)
        expect(legoPiecePlus(3)).toBe(7)
        expect(legoPiecePlusPlus(3)).toBe(8)
    })

    it('sync happy path (Example 3)', () => {
        var legoPiece = legofy((num) => num * 2)
        var legoPiecePlus1 = legoPiece
            .then(num => num + 1)
        var legoPiecePlus2 = legoPiece
            .then(num => num * 5)
        expect(legoPiece(3)).toBe(6)
        expect(legoPiecePlus1(3)).toBe(7)
        expect(legoPiecePlus2(3)).toBe(30)
    })

    it('Async happy path (Example 1)', () => {
        var legoPiece = legofy((num) => Promise.resolve(num * 2))
        var legoPiecePlus = legoPiece
            .then(num => num + 1)
        Promise.all([
            legoPiece(3)
                .then((res) => {
                    expect(res).toBe(6)
                }),
            legoPiecePlus(3)
                .then((res) => {
                    expect(res).toBe(7)
                })
        ])
    })

    it('Async happy path (Example 2)', () => {
        var legoPiece = legofy((num) => Promise.resolve(num * 2))
        var legoPiecePlus = legoPiece
            .then(num => num + 1)
        var legoPiecePlusPlus = legoPiecePlus
            .then(num => num + 1)
        Promise.all([
            legoPiece(3)
                .then((res) => {
                    expect(res).toBe(6)
                }),
            legoPiecePlus(3)
                .then((res) => {
                    expect(res).toBe(7)
                }),
            legoPiecePlusPlus(3)
                .then((res) => {
                    expect(res).toBe(8)
                })
        ])
    })

    it('Async happy path (Example 3)', () => {
        var legoPiece = legofy((num) => Promise.resolve(num * 2))
        var legoPiecePlus1 = legoPiece
            .then(num => num + 1)
        var legoPiecePlus2 = legoPiece
            .then(num => num * 5)
        Promise.all([
            legoPiece(3)
                .then((res) => {
                    expect(res).toBe(6)
                }),
            legoPiecePlus1(3)
                .then((res) => {
                    expect(res).toBe(7)
                }),
            legoPiecePlus2(3)
                .then((res) => {
                    expect(res).toBe(30)
                })
        ])
    })

    it('(Sync || Async) happy path (Example 1)', () => {
        var legoPiece = legofy((num) => num * 2)
        var legoPiecePlus = legoPiece
            .then(num => Promise.resolve(num + 1))
        expect(legoPiece(3)).toBe(6)
        Promise.all([
            legoPiecePlus(3)
                .then((res) => {
                    expect(res).toBe(7)
                })
        ])
    })

    it('(Sync || Async) happy path (Example 2)', () => {
        var legoPiece = legofy((num) => num * 2)
        var legoPiecePlus = legoPiece
            .then(num => Promise.resolve(num + 1))
        var legoPiecePlusPlus = legoPiecePlus
            .then(num => Promise.resolve(num + 1))
        expect(legoPiece(3)).toBe(6)
        Promise.all([
            legoPiecePlus(3)
                .then((res) => {
                    expect(res).toBe(7)
                }),
            legoPiecePlusPlus(3)
                .then((res) => {
                    expect(res).toBe(8)
                })
        ])
    })

    it('(Sync || Async) happy path (Example 3)', () => {
        var legoPiece = legofy((num) => num * 2)
        var legoPiecePlus1 = legoPiece
            .then(num => Promise.resolve(num + 1))
        var legoPiecePlus2 = legoPiece
            .then(num => Promise.resolve(num * 5))
        expect(legoPiece(3)).toBe(6)

        Promise.all([
            legoPiecePlus1(3)
                .then((res) => {
                    expect(res).toBe(7)
                }),
            legoPiecePlus2(3)
                .then((res) => {
                    expect(res).toBe(30)
                })
        ])
    })

    it('sync rejection scenario (Example 1)', () => {
        var legoPiece = legofy(() => { throw new Error("lol") })
        var legoPiecePlus1 = legoPiece
            .catch(e => e + 1)
        var legoPiecePlus2 = legoPiece
            .catch(e => e + 2)
        expect(legoPiecePlus1()).toBe("lol1")
        expect(legoPiecePlus2()).toBe("lol2")
    })

    it('sync rejection scenario (Example 2)', () => {
        var legoPiece = legofy(() => { throw new Error("lol") })
        var legoPiecePlus1 = legoPiece
            .catch(e => 1)
        var legoPiecePlus2 = legoPiece
            .catch(e => 2)
        try {
            legoPiece()
        } catch (e) {
            expect(e.message).toBe("lol")
        }
        expect(legoPiecePlus1()).toBe(1)
        expect(legoPiecePlus2()).toBe(2)
    })

    it('sync rejection scenario (Example 3)', () => {
        var legoPiece = legofy(() => { throw new Error("lol") })
        var legoPiecePlus1 = legoPiece
            .catch(e => {
                expect(e).toBe("lol")
                throw new Error("nope")
            })
            .catch(e => {
                expect(e).toBe("nope")
                return 1
            })
            .then(num => num * 2)
        var legoPiecePlus2 = legoPiece
            .catch(e => {
                expect(e).toBe("lol")
                return 2
            })
            .then(() => { throw new Error("nope") })
            .catch(e => {
                expect(e).toBe("nope")
            })
        try {
            legoPiece()
        } catch (e) {
            expect(e.message).toBe("lol")
        }
        expect(legoPiecePlus1()).toBe(2)
        expect(legoPiecePlus2()).toBe(undefined)
    })

})

describe('legos concatenation', () => {

    it('sync happy path (Example 1)forceErrorSybmol', () => {
        var lego1 = legofy((num) => num * 2)
        var lego2 = legofy((num) => num + 1)
        var legoCon1 = lego1.concat(lego2)
        var legoCon2 = lego2.concat(lego1)
        expect(lego1(2)).toBe(4)
        expect(lego2(2)).toBe(3)
        var lego1 = null
        var lego2 = null
        expect(legoCon1(2)).toBe(5)
        expect(legoCon2(2)).toBe(6)
    })

    it('Async happy path (Example 1)', () => {
        var lego1 = legofy((num) => num * 2)
        var lego2 = legofy((num) => Promise.resolve(num + 1))
        var legoCon1 = lego1.concat(lego2)
        var legoCon2 = lego2.concat(lego1)
        expect(lego1(2)).toBe(4)
        var p1 = lego2(2).then((res) => {
            expect(res).toBe(3)
        })
        var lego1 = null
        var lego2 = null
        Promise.all([
            p1,
            legoCon1(2).then((res) => {
                expect(res).toBe(5)
            }),
            legoCon2(2).then((res) => {
                expect(res).toBe(6)
            })
        ])
    })

    it('Sync regection scenario (Example 1)', () => {
        var lego1 = legofy(() => { throw new Error("lol") })
        var lego2 = legofy((num) => num + 1)
            .catch(e => {
                expect(e).toBe("lol")
                return 5
            })
            .then(num => num * 2)
        var legoCon1 = lego1.concat(lego2)
        var legoCon2 = lego2.concat(lego1)
        try {
            lego1()
        } catch (e) {
            expect(e.message).toBe("lol")
        }
        try {
            legoCon2()
        } catch (e) {
            expect(e.message).toBe("lol")
        }
        expect(lego2(2)).toBe(6)
        expect(legoCon1(2)).toBe(10)
    })

    it('Async regection scenario (Example 1)', (done) => {
        var lego1 = legofy(() => Promise.reject("no way"))
        var lego2 = legofy((num) => num + 1)
            .catch(e => {
                expect(e).toBe("no way")
                return 5
            })
            .then(num => num * 2)
        var legoCon1 = lego1.concat(lego2)
        var legoCon2 = lego2.concat(lego1)
        expect(lego2(2)).toBe(6)
        Promise.all([
            lego1()
                .catch((res) => {
                    expect(res).toBe("no way")
                }),
            legoCon1()
                .then((res) => {
                    expect(res).toBe(10)
                }),
            legoCon2()
                .catch((res) => {
                    expect(res).toBe("no way")
                })
        ]).then(() => done())
    })

})

describe('Reverse method', () => {

    it('Sync happy path (Example1)', () => {
        var lego = legofy(num => num * 2)
            .then(num => num + 3)

        expect(lego(2)).toBe(7)
        expect(lego.reverse(2)).toBe(10)
    })

    it('Sync happy path (Example2)', () => {
        var lego = legofy(num => num + 1)
            .then(num => num * 2)
            .then(num => num * 3)

        var reverseLego = lego.reverse;

        var reverseLegoPlus = reverseLego.then(num => num + 20)

        var legoPlus = lego.then(num => num + 5)

        expect(lego(2)).toBe(18)
        expect(reverseLego(2)).toBe(13)
        expect(legoPlus(2)).toBe(23)
        expect(reverseLegoPlus(2)).toBe(33)

        lego = legofy(num => num + 1)
        expect(reverseLego(2)).toBe(13)
        expect(legoPlus(2)).toBe(23)
        expect(reverseLegoPlus(2)).toBe(33)
    })

    it('Sync happy path (Example 3)', () => {
        var lego = legofy(num => num * 2)
            .catch(num => num + 3)

        expect(lego(2)).toBe(4)
        expect(lego.reverse(2)).toBe(4)
    })

    it('Sync happy path (Example 4)', () => {
        var lego = legofy(num => num + 1)
            .catch(num => num * 2)
            .catch(num => num * 3)

        var reverseLego = lego.reverse;

        var reverseLegoPlus = reverseLego.then(num => num + 20)

        var legoPlus = lego.then(num => num + 5)

        expect(lego(2)).toBe(3)
        expect(reverseLego(2)).toBe(3)
        expect(legoPlus(2)).toBe(8)
        expect(reverseLegoPlus(2)).toBe(23)

        lego = legofy(num => num + 2)
        expect(lego(2)).toBe(4)
        expect(reverseLego(2)).toBe(3)
        expect(legoPlus(2)).toBe(8)
        expect(reverseLegoPlus(2)).toBe(23)
    })


    it('Async happy path (Example1)', () => {
        var lego = legofy(num => Promise.resolve(num * 2))
            .then(num => num + 3)

        Promise.all([
            lego(2).then((r) => expect(r).toBe(7)),
            lego.reverse(2).then((r) => expect(r).toBe(10))
        ])
    })

    it('Async happy path (Example2)', () => {
        var lego = legofy(num => Promise.resolve(num + 1))
            .then(num => num * 2)
            .then(num => num * 3)

        var reverseLego = lego.reverse;

        var reverseLegoPlus = reverseLego.then(num => num + 20)

        var legoPlus = lego.then(num => num + 5)

        Promise.all([
            Promise.all([
                lego(2).then((r) => expect(r).toBe(18)),
                reverseLego(2).then((r) => expect(r).toBe(13)),
                legoPlus(2).then((r) => expect(r).toBe(23)),
                reverseLegoPlus(2).then((r) => expect(r).toBe(33))
            ]).then(() => {
                lego = legofy(num => num + 1)
                return Promise.all([
                    reverseLego(2).then((r) => expect(r).toBe(13)),
                    legoPlus(2).then((r) => expect(r).toBe(23)),
                    reverseLegoPlus(2).then((r) => expect(r).toBe(33))
                ])
            })
        ])
    })

    it('Async happy path (Example 3)', () => {
        var lego = legofy(num => Promise.resolve(num * 2))
            .catch(num => num + 3)

        Promise.all([
            lego(2).then((r) => expect(r).toBe(4)),
            lego.reverse(2).then((r) => expect(r).toBe(4))
        ])
    })

    it('Async happy path (Example 4)', () => {
        var lego = legofy(num => Promise.resolve(num + 1))
            .catch(num => num * 2)
            .catch(num => num * 3)

        var reverseLego = lego.reverse;

        var reverseLegoPlus = reverseLego.then(num => num + 20)

        var legoPlus = lego.then(num => num + 5)
        Promise.all([
            lego(2).then((r) => expect(r).toBe(3)),
            reverseLego(2).then((r) => expect(r).toBe(3)),
            legoPlus(2).then((r) => expect(r).toBe(8)),
            reverseLegoPlus(2).then((r) => expect(r).toBe(23))
        ]).then(() => {
            lego = legofy(num => Promise.resolve(num + 2))
            return Promise.all([
                lego(2).then((r) => expect(r).toBe(4)),
                reverseLego(2).then((r) => expect(r).toBe(3)),
                legoPlus(2).then((r) => expect(r).toBe(8)),
                reverseLegoPlus(2).then((r) => expect(r).toBe(23))
            ])
        })

    })

    it('Sync & Async happy path (Example1)', () => {
        var lego = legofy(num => num + 1)
            .then(num => num * 2)
            .then(num => num * 3)

        var reverseLego = lego.reverse;

        var reverseLegoPlus = reverseLego.then(num => Promise.resolve(num + 20))

        var legoPlus = lego.then(num => num + 5)
        Promise.all([
            expect(lego(2)).toBe(18),
            expect(reverseLego(2)).toBe(13),
            expect(legoPlus(2)).toBe(23),
            reverseLegoPlus(2).then((r) => expect(r).toBe(33))
        ]).then(() => {
            lego = legofy(num => num + 1)
            return Promise.all([
                expect(lego(2)).toBe(3),
                expect(legoPlus(2)).toBe(23),
                reverseLegoPlus(2).then((r) => expect(r).toBe(33))
            ])
        })
    })

    it('Sync & Async happy path (Example 3)', () => {
        var lego = legofy(num => num * 2)
            .catch(num => num + 3)
        Promise.all([
            expect(lego(2)).toBe(4),
            lego.then((num) => Promise.resolve(num)).reverse(2).then((r) => expect(r).toBe(4))
        ])
    })

    it('Sync & Async happy path (Example 4)', () => {
        var lego = legofy(num => num + 1)
            .catch(num => num * 2)
            .catch(num => num * 3)

        var reverseLego = lego.reverse;

        var reverseLegoPlus = reverseLego.then(num => Promise.resolve((num + 20)))

        Promise.all([
            expect(lego(2)).toBe(3),
            expect(reverseLego(2)).toBe(3),
            reverseLegoPlus(2).then((r) => expect(r).toBe(23))
        ]).then(() => {
            var legoPlus = lego.then(num => num + 5)
            lego = legofy(num => Promise.resolve(num + 2))
            return Promise.all([
                lego(2).then((r) => expect(r).toBe(4)),
                expect(reverseLego(2)).toBe(3),
                reverseLegoPlus(2).then((r) => expect(r).toBe(23))
            ])
        })
    })
})

describe('Make it array like', () => {

    it('Make it iterable (Example 1)', () => {
        var legoChunk = legofy(num => num * 1)
            .then(num => num * 2)
            .then(num => num * 3)

        var legoPieces = [...legoChunk]
        expect(legoPieces[0](1)).toBe(1)
        expect(legoPieces[1](1)).toBe(2)
        expect(legoPieces[2](1)).toBe(3)
    })

    it('Have length property (Example 1)', () => {
        var legoChunk = legofy(num => num * 1)
            .then(num => num * 2)
            .then(num => num * 3)

        var legoChunkPlus = legoChunk.catch(e => e)

        var legoChunkCon = legoChunk.concat(legoChunkPlus)

        expect(legoChunk.length).toBe(3)
        expect(legoChunk.reverse.length).toBe(3)
        expect(legoChunkPlus.length).toBe(4)
        expect(legoChunkPlus.reverse.length).toBe(4)
        expect(legoChunkCon.length).toBe(7)
    })

    it('Have length property (Example 2)', () => {
        var legoChunk1 = legofy(num => num * 1)
            .then(num => num * 2)
            .then(num => num * 3)

        var legoChunk2 = legofy(num => num * 1)
            .then(num => num * 2)

        expect(legoChunk1.concat(legoChunk2).length).toBe(5)
        expect(legoChunk2.concat(legoChunk1).length).toBe(5)
        expect(legoChunk1.length).toBe(3)
        expect(legoChunk2.length).toBe(2)
        expect(legoChunk1.concat(legoChunk2).reverse.length).toBe(5)
        expect(legoChunk2.concat(legoChunk1).reverse.length).toBe(5)
    })

})

describe('Another extendable way', () => {
    it('Should work (Example 1)', () => {
        var lego1 = legofy((arg) => arg * 2)
            .then(() => {
                throw { message: "Nope" }
            })
            .catch(() => {
                throw { message: "Yup" }
            })
        var lego2 = legofy((arg) => arg * 2)
            .then(() => {
                throw { message: "xDD" }
            })
        try {
            lego1()
        } catch (e) {
            expect(e.message).toBe("Yup")
        }
        try {
            lego2
        } catch (e) {
            expect(e.message).toBe("xDD")
        }
        try {
            lego1.concat(lego2)()
        } catch (e) {
            expect(e.message).toBe("Yup")
        }
        try {
            lego2.concat(lego1)()
        } catch (e) {
            expect(e.message).toBe("Yup")
        }
        try {
            lego1.then(lego2)()
        } catch (e) {
            expect(e.message).toBe("Yup")
        }
        try {
            lego2.then(lego1)()
        } catch (e) {
            expect(e.message).toBe("xDD")
        }
        try {
            lego1.catch(lego2)()
        } catch (e) {
            expect(e.message).toBe("xDD")
        }
        try {
            lego2.catch(lego1)()
        } catch (e) {
            expect(e.message).toBe("Yup")
        }
    })
})