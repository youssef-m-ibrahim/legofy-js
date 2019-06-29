let counter = {
    lego: 0,
    legoShape: 0,
    wrapper: 0,
    exec: 0
}


function Wrapper(legoShape) {
    counter.wrapper++;
    this.context = {};
    this.state = {
        idx: 0,
        error: undefined
    };
    this.exec = (args) => {
        counter.exec++;
        var res = legoShape.exec(this.state, args, this.context)
        if (this.state.error) {
            throw this.state.error
        }

        return res;
    }
}

function Lego(cb) {
    counter.lego++;
    this.cb = cb;
}

Lego.prototype = {
    cb: () => undefined
}

function LegoShape(lego, { stages = [] } = {}) {
    counter.legoShape++;
    this.stages = [...stages]

    if (lego != undefined) {
        this.stages.push(lego)
    }

    this.then = (cb) => {
        var lego = new Lego(cb)
        return new LegoShape({ lego, type: 'FORWARD' }, { stages: this.stages })
    }

    this.catch = (cb) => {
        var lego = new Lego(cb)
        return new LegoShape({ lego, type: 'CATCH' }, { stages: this.stages })
    }


    this.exec = (state, args, context) => {
        while (state.idx < this.stages.length) {
            var {
                lego,
                type
            } = this.stages[state.idx] || {}
            switch (type) {
                case 'FORWARD':
                    state.idx++;
                    if (state.error === undefined) {
                        try {
                            if (args[0] instanceof Promise) {
                                args = [args[0].then(
                                    (num) => {
                                        return lego.cb(num)
                                    }
                                )];
                            } else {
                                args = [lego.cb(...args, context)];
                            }
                        } catch (error) {
                            args = [undefined]
                            state.error = error;
                        }
                    }
                    break;
                case 'CATCH':
                    state.idx++;
                    if (args[0] instanceof Promise) {
                        args = [args[0].catch(
                            // lego.cb.bind(this)
                            // ,
                            (error) => {
                                return lego.cb(error, context)
                            }
                        )
                        ];
                    } else {
                        if (state.error) {
                            var error = state.error
                            error = error instanceof Error ? error.message : error;
                            state.error = undefined
                            try {
                                args = [lego.cb(error, context)];
                            } catch (error) {
                                args = [undefined]
                                state.error = error;
                            }
                        }
                    }
                    break;
            }
        }
        return args[0]
    }

    this.pick = (idx = 0) => {
        return (...args) => {
            idx = idx >= this.stages.length ? 0 : idx;
            return this.stages[idx].lego.cb(...args);
        }
    }
    this.pickFirst = this.pick.bind(this, 0);
    this.pickLast = this.pick.bind(this, this.stages.length - 1);


    this.repeat = (num) => {
        let wrapper = new Wrapper(this);
        return (args) => {
            for (let i = 0; i < num + 1; i++) {
                if(args instanceof Promise) {
                    let cb = res => wrapper.exec([res])
                    args = args.then(cb).catch(cb)
                }else{
                    args = wrapper.exec([args]);
                }
                wrapper.state.idx = 0;
            }
            return args;
        }
    }


    return new Proxy((...args) => new Wrapper(this).exec(args), {
        get: (obj, key) => this[key]
    })
}


LegoShape.prototype = {
    [Symbol.iterator]: function* () {
        for (let i = 0; i < this.stages.length; i++) {
            yield new LegoShape(this.stages[i]);
        }
    }
}

function legofy(cb) {
    var lego = new Lego(cb)
    return new LegoShape({ lego, type: 'FORWARD' })
}


var lego = legofy((num) => num * 5).then((num) => Promise.resolve(num * 3)).then(num => { return num * 2 })

lego.repeat(1)(1).then(res => {
    console.log(counter)
    console.log(res);
});






module.exports = legofy

