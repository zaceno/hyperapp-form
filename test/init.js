import test from 'ava'
import init from '../src/init.js'

test('default initialization', t => {
    t.deepEqual(init(), { values: {}, errors: {}, submitted: false })
})
test('initialize with default values', t => {
    let vals = { foo: 'bar', baz: 2 }
    t.deepEqual(init(vals), { values: vals, errors: {}, submitted: false })
})
test('init with default values and errors', t => {
    let vals = { foo: 'bar', baz: 2 }
    let errs = { foo: 'no', zoo: 'too' }
    t.deepEqual(init(vals, errs), {
        values: vals,
        errors: errs,
        submitted: false,
    })
})
