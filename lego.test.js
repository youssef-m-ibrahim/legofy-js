const lego = require('./lego')

describe('It should act in a Sync fashion', () => {
    it('should resolve right (Example 1)', () => {
        var fun = lego((num) => num * 2)
        expect(fun(2)).toBe(4)
    })

    it('should resolve right (Example 2)', () => {
        var fun = lego(() => 2)
        expect(fun()).toBe(2)
    })

    it('should resolve right (Example 3)', () => {
        var fun = lego(() => 2)
            .then(num => num + 1)
            .then(num => num * 2)
            .then(num => num + 3)
        expect(fun()).toBe(9)
    })

    it('should reject (Example 1)', () => {
        var fun = lego(() => { throw new Error("no way") })
            .catch(e => {
                expect(e).toBe("no way")
                return "lol"
            })
        expect(fun()).toBe("lol")
    })

    it('should reject (Example 2)', () => {
        var fun = lego(() => { throw new Error("no way") })
            .catch(e => {
                expect(e).toBe("no way")
                throw new Error("yes way")
            })
            .catch(e => {
                expect(e).toBe("yes way")
                return "lol"
            })
        expect(fun(2)).toBe("lol")
    })

    it('should reject (Example 3)', () => {
        var fun = lego(() => { throw new Error("no way") })
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
        expect(fun(2)).toBe(2)
    })

    it('should reject and then resolve (Example 4)', () => {
        var fun = lego(() => { throw new Error("no way") })
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
        expect(fun()).toBe(4)
    })

    it('should reject and then resolve (Example 5)', () => {
        var fun = lego(() => { throw new Error("no way") })
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
        expect(fun()).toBe(4)
    })

    it('happy path (Example 1)', () => {
        var fun = lego((arg) => arg * 2)
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
        expect(fun(2)).toBe(8)
    })

    it('not really (Example 1)', () => {
        var fun = lego((arg) => arg * 2)
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
        expect(fun(2)).toBe(8)
    })

    it('not really (Example 2)', () => {
        var fun = lego((arg) => arg * 2)
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
        expect(fun(2)).toBe(7)
    })

    it('not really (Example 3)', () => {
        var fun = lego((arg) => { throw new Error("watch out!") })
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
        expect(fun(2)).toBe(4)
    })

    it('not really (Example 4)', () => {
        var fun = lego((arg) => { throw new Error("watch out!") })
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
        expect(fun(2)).toBe(6)
    })

    it('not really (Example 5)', () => {
        var fun = lego((arg) => { throw new Error("watch out!") })
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
        expect(fun(2)).toBe(undefined)
    })
})

describe('It should act in an Async fashion', () => {
    it('should resolve right (Example 1)', (done) => {
        var fun = lego((num) => Promise.resolve(num * 2))
        fun(2)
            .then((res) => {
                expect(res).toBe(4)
                done()
            })
    })

    it('should resolve right (Example 2)', (done) => {
        var fun = lego(() => Promise.resolve(2))
        fun()
            .then((res) => {
                expect(res).toBe(2)
                done()
            })
    })

    it('should resolve right (Example 3)', (done) => {
        var fun = lego(() => 2)
            .then(num => Promise.resolve(num + 1))
            .then(num => num * 2)
            .then(num => num + 3)
        fun()
            .then((res) => {
                expect(res).toBe(9)
                done()
            })
    })

    it('should reject (Example 1)', (done) => {
        var fun = lego(() => Promise.reject("no way"))
            .catch(e => {
                expect(e).toBe("no way")
                return "lol"
            })
        fun()
            .then((res) => {
                expect(res).toBe("lol")
                done()
            })
    })

    it('should reject (Example 2)', (done) => {
        var fun = lego(() => { return Promise.reject("no way") })
            .catch(e => {
                expect(e).toBe("no way")
                return Promise.reject("yes way")
            })
            .catch(e => {
                expect(e).toBe("yes way")
                return "lol"
            })
        fun()
            .then((res) => {
                expect(res).toBe("lol")
                done()
            })
    })

    it('should reject (Example 3)', (done) => {
        var fun = lego(() => { return Promise.reject("no way") })
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
        fun()
            .then((res) => {
                expect(res).toBe(2)
                done()
            })
    })

    it('should reject and then resolve (Example 4)', (done) => {
        var fun = lego(() => { return Promise.reject("no way") })
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
        fun()
            .then((res) => {
                expect(res).toBe(4)
                done()
            })
    })

    it('should reject and then resolve (Example 5)', (done) => {
        var fun = lego(() => { return Promise.reject("no way") })
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
        fun()
            .then((res) => {
                expect(res).toBe(4)
                done()
            })
    })

    it('happy path (Example 1)', (done) => {
        var fun = lego((arg) => arg * 2)
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
        fun(2)
            .then((res) => {
                expect(res).toBe(8)
                done()
            })
    })

    it('not really (Example 1)', (done) => {
        var fun = lego((arg) => Promise.resolve(arg * 2))
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
        fun(2)
            .then((res) => {
                expect(res).toBe(8)
                done()
            })
    })

    it('not really (Example 2)', (done) => {
        var fun = lego((arg) => Promise.resolve(arg * 2))
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
        fun(2)
            .then((res) => {
                expect(res).toBe(7)
                done()
            })
    })

    it('not really (Example 3)', (done) => {
        var fun = lego((arg) => { return Promise.reject("watch out!") })
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
        fun(2)
            .then((res) => {
                expect(res).toBe(4)
                done()
            })
    })

    it('not really (Example 4)', (done) => {
        var fun = lego((arg) => { return Promise.reject("watch out!") })
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
        fun(2)
            .then((res) => {
                expect(res).toBe(6)
                done()
            })
    })

    it('not really (Example 5)', (done) => {
        var fun = lego((arg) => { return Promise.reject("watch out!") })
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
        fun(2)
            .then((res) => {
                expect(res).toBe(undefined)
                done()
            })
    })
})