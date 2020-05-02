import test from 'ava'
import form from '../src/form.js'
import init from '../src/init.js'
import { h } from 'hyperapp'

const resolveAction = (action, state, ...data) => {
    if (typeof action === 'function')
        return resolveAction(action(state, ...data), state)
    if (Array.isArray(action))
        return resolveAction(action[0], state, ...action.slice(1))
    return [action, data] // will be: [newState, [...effects]]
}

const getFormContext = props => {
    let context
    h(form, props, [c => ((context = c), h('x', {}))])
    return context
}

const formprops = state => ({
    state: state.form,
    getFormState: s => s.form,
    setFormState: (s, f) => ({ ...s, form: f }),
    onsubmit: s => s,
})

const testinit = (x, y) => ({ form: init(x, y) })

test('form provides SetValues', t => {
    let state = testinit({ foo: 'bar' })
    let { SetValues } = getFormContext(formprops(state))
    let [resultState, effects] = resolveAction(SetValues, state, { baz: 'bop' })
    let { values } = getFormContext(formprops(resultState))
    t.deepEqual(values, { baz: 'bop' })
    t.deepEqual(effects, [])
})

test('form provides SetErrors', t => {
    let state = testinit({ foo: 'bar' }, { err: 'bad' })
    let { SetErrors } = getFormContext(formprops(state))
    let [resultState, effects] = resolveAction(SetErrors, state, {
        more: 'badder',
    })
    let { errors } = getFormContext(formprops(resultState))
    t.deepEqual(errors, { more: 'badder' })
    t.deepEqual(effects, [])
})

test('form provides validation registry', t => {
    let { register } = getFormContext(testinit())
    t.truthy(register)
})
