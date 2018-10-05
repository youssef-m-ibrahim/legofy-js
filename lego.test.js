const lego = require('./lego')


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

it('should resolve right (Example 4)', () => {
    var fun = lego(() => 2)
        .then(num => num + 1)
        .then(num => num * 2)
        .then(num => num + 3)
    expect(fun()).toBe(9)
})

it('should reject (Example 1)', (done) => {
    var fun = lego(() => { throw new Error("no way") })
        .catch(e => {
            expect(e.message).toBe("no way")
            done()
        })
    fun()
})

it('should reject (Example 2)', (done) => {
    var fun = lego(() => { throw new Error("no way") })
        .catch(e => {
            expect(e.message).toBe("no way")
            throw new Error("yes way")
        })
        .catch(e => {
            expect(e.message).toBe("yes way")
            done()
        })
    fun()
})


it('should reject (Example 3)', (done) => {
    var fun = lego(() => { throw new Error("no way") })
        .then()
        .catch(e => {
            expect(e.message).toBe("no way")
            throw new Error("yes way")
        })
        .catch(e => {
            expect(e.message).toBe("yes way")
            done()
        })
    fun()
})



it('should reject and then resolve (Example 4)', (done) => {
    var fun = lego(() => { throw new Error("no way") })
        .catch(e => {
            expect(e.message).toBe("no way")
            throw new Error("yes way")
        })
        .then(e => {
            expect(true).toBe(false)
        })
        .catch(e => {
            expect(e.message).toBe("yes way")
            done();
        })
    fun()
})


it('should reject and then resolve (Example 5)', (done) => {
    var fun = lego(() => { throw new Error("no way") })
        .catch(e => {
            expect(e.message).toBe("no way")
            throw new Error("yes way")
        })
        .then(e => {
            expect(true).toBe(false)
        })
        .catch(e => {
            expect(e.message).toBe("yes way")
            return 5
        })
        .then(res => {
            expect(res).toBe(5)
            done()
        })
    fun()
})

it('happy path 1', ()=>{
    var fun = lego(() => arg * 2)
        .then(arg => {
            expect(false).toBe(true)
            expect(arg).toBe(4)
            return arg + 1
        })
        .then(arg => {
            expect(false).toBe(true)
            expect(arg).toBe(4)
            return arg + 1
        })
        .then(arg => {
            expect(false).toBe(true)
            expect(arg).toBe(4)
            return arg + 1
        })
        .catch(e => {
            expect(false).toBe(true)
        })
        .then(res => {
            expect(res).toBe(5)
            done()
        })
    fun(2)
})