import test from 'ava'
import init from '../src/init.js'
import { dispatch, preventDefault } from '../src/effects.js'
import form from '../src/form.js'
import {h} from 'hyperapp'

const resolveAction = (action, state, ...data) => {
    if (typeof action === 'function')
        return resolveAction(action(state, ...data), state)
    if (Array.isArray(action))
        return resolveAction(action[0], state, ...action.slice(1))
    return [action, data.filter(x => !!x)] // will be: [newState, [...effects]]
}


const getFormContext = props => {
    let context
    let node = h(form, props, [c => ((context = c), h('x', {}))])
    return [context, node.props.onsubmit]
}

const formprops = state => ({
    state: state.form,
    getFormState: s => s.form,
    setFormState: (s, f) => ({ ...s, form: f }),
    onsubmit: 'onsubmit',
})

const testinit = (x, y) => ({ form: init(x, y) })

test('submit with no validators', t => {
    let state = testinit({value: 'foo'})
    let [_, onsubmit] = getFormContext(formprops(state))
    let [result, effects] = resolveAction(onsubmit, state, 'event')
    t.deepEqual(effects, [
        dispatch('onsubmit', {value: 'foo'}),
        preventDefault('event')
    ])
    let [{submitted}] = getFormContext(formprops(result))
    t.true(submitted)
})

test('submit with passing validators', t => {
    let state = testinit({value: 'foo'})
    let [{register}, onsubmit] = getFormContext(formprops(state))
    register(e => ({...e, foo:''}))
    register(e => ({...e, bar: ''}))
    let [result, effects] = resolveAction(onsubmit, state, 'event')
    t.deepEqual(effects, [
        dispatch('onsubmit', {value: 'foo'}),
        preventDefault('event')
    ])
    let [{submitted}] = getFormContext(formprops(result))
    t.true(submitted)
})

test('submit with failing validators', t => {
    let state = testinit({value: 'foo'})
    let [{register}, onsubmit] = getFormContext(formprops(state))
    register(e => ({ ...e, foo: '' }))
    register(e => ({ ...e, bar: 'bar' }))
    register(e => ({ ...e, baz: '' }))
    let [result, effects] = resolveAction(onsubmit, state, 'event')
    t.deepEqual(effects, [
        preventDefault('event')
    ])
    let [{submitted, errors}] = getFormContext(formprops(result))
    t.false(submitted)
    t.deepEqual(errors, {foo: '', bar: 'bar', baz: ''})
})
