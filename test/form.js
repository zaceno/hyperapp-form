import test from 'ava'
import form from '../src/form.js'
import init from '../src/init.js'
import { h } from 'hyperapp'
import * as actions from '../src/actions.js'

const defaultValues = { foo: 'bar' }
const defaultErrors = { baz: 'bop' }
const formState = init(defaultValues, defaultErrors)
const getFormState = () => {}
const setFormState = () => {}
const onsubmit = () => {}
const getFormContext = () => {
    let context
    h(
        form,
        {
            state: formState,
            getFormState,
            setFormState,
            onsubmit,
        },
        [c => ((context = c), h('x', {}))]
    )
    return context
}

test('form provides state', t => {
    let { values, errors, submitted } = getFormContext()
    t.deepEqual(values, defaultValues)
    t.deepEqual(errors, defaultErrors)
    t.is(submitted, false)
})

test('form provides SetValues', t => {
    let {
        SetValues: [action, filter],
    } = getFormContext()
    t.is(action, actions.SetValues)
    t.deepEqual(filter({ new: 'value' }), {
        values: { new: 'value' },
        getFormState,
        setFormState,
    })
})

test('form provides SetErrors', t => {
    let {
        SetErrors: [action, filter],
    } = getFormContext()
    t.is(action, actions.SetErrors)
    t.deepEqual(filter({ new: 'error' }), {
        errors: { new: 'error' },
        getFormState,
        setFormState,
    })
})

test('form provides validation registry', t => {
    let { register } = getFormContext()
    t.truthy(register)
})
