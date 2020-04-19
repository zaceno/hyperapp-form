import test from 'ava'
import init from '../src/init.js'
import { dispatch, preventDefault } from '../src/effects.js'
import { Submit } from '../src/actions.js'

test('submit with no validators', t => {
    let [newState, fx1, fx2] = Submit(
        {
            foo: 'bar',
            form: init({
                value: 'foo',
            }),
        },
        {
            getFormState: state => state.form,
            setFormState: (state, form) => ({ ...state, form }),
            validators: [],
            onsubmit: 'onsubmit',
            event: 'event',
        }
    )
    t.is(newState.foo, 'bar') //didn't affect original state
    t.is(newState.form.submitted, true) //set submitted to true
    t.deepEqual(fx1, dispatch('onsubmit', { value: 'foo' }))
    t.deepEqual(fx2, preventDefault('event'))
})

test('submit with passing validators', t => {
    let [newState, fx1, fx2] = Submit(
        {
            foo: 'bar',
            form: init({
                value: 'foo',
            }),
        },
        {
            getFormState: state => state.form,
            setFormState: (state, form) => ({ ...state, form }),
            validators: [e => ({ ...e, foo: '' }), e => ({ ...e, bar: '' })],
            onsubmit: 'onsubmit',
            event: 'event',
        }
    )
    t.is(newState.foo, 'bar') //didn't affect original state
    t.is(newState.form.submitted, true) //set submitted to true
    t.deepEqual(fx1, dispatch('onsubmit', { value: 'foo' }))
    t.deepEqual(fx2, preventDefault('event'))
})

test('submit with failing validators', t => {
    let [newState, fx1, fx2] = Submit(
        {
            foo: 'bar',
            form: init({
                value: 'foo',
            }),
        },
        {
            getFormState: state => state.form,
            setFormState: (state, form) => ({ ...state, form }),
            validators: [
                e => ({ ...e, foo: '' }),
                e => ({ ...e, bar: 'bar' }),
                e => ({ ...e, baz: '' }),
            ],
            onsubmit: 'onsubmit',
            event: 'event',
        }
    )
    t.is(newState.foo, 'bar') //didn't affect original state
    t.is(newState.form.submitted, false) //set submitted to true
    t.deepEqual(newState.form.errors, { foo: '', bar: 'bar', baz: '' })
    t.false(fx1)
    t.deepEqual(fx2, preventDefault('event'))
})
