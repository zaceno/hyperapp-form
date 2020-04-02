import test from 'ava'
import * as form from '../src/'
import 'undom/register'
import { app, h } from 'hyperapp'

const step = ((
    _step = (f, n, g = x => setTimeout((y = f(x)) => n && n(y), 0)) => (
        (g.step = f => ((n = _step(f)), n)), g
    )
) => (f, s = _step(f)) => (s(), s))()

const find = (node, id) => {
    if (node.getAttribute('id') == id) return node
    for (let i = 0; i < node.childNodes.length; i++) {
        let ret = find(node.childNodes[i], id)
        if (ret) return ret
    }
}

const trigger = (node, event) => node.dispatchEvent(new Event(event))

const hasError = node =>
    (node.getAttribute('class') || '').indexOf('error') > -1

test.cb('text-input: onblur: validate field', t => {
    const validator = x => (x === 'aaa' ? '' : 'should be aaa')
    const root = document.createElement('main')
    app({
        init: { form: form.init() },
        view: state =>
            h('main', {}, [
                h(
                    form.form,
                    {
                        id: 'form',
                        state: state.form,
                        getFormState: s => s.form,
                        setFormState: (s, form) => ({ ...s, form }),
                        onsubmit: s => s,
                    },
                    [
                        h('p', {}, [
                            h(form.input, {
                                id: 'input-A',
                                type: 'text',
                                name: 'foo',
                                validator,
                            }),
                        ]),
                        h('p', {}, [
                            h(form.input, {
                                id: 'input-B',
                                type: 'text',
                                name: 'bar',
                                validator,
                            }),
                        ]),
                    ]
                ),
            ]),
        node: root,
    })
    step(_ => {
        const inpA = find(root, 'input-A')
        const inpB = find(root, 'input-B')

        trigger(inpA, 'blur') //should have no effect because nothing entered
        return { inpA, inpB }
    })
        .step(({ inpA, inpB }) => {
            t.false(hasError(inpA))

            inpA.value = 'bbb'
            trigger(inpA, 'input') //since no error, input does not cause validation
            return { inpA, inpB }
        })

        .step(({ inpA, inpB }) => {
            t.false(hasError(inpA))

            inpB.value = 'bbb'
            trigger(inpB, 'input')
            return { inpA, inpB }
        })
        .step(({ inpA, inpB }) => {
            t.false(hasError(inpA))
            t.false(hasError(inpB))

            trigger(inpA, 'blur') //now a has value, so should validate
            return { inpA, inpB }
        })
        .step(({ inpA, inpB }) => {
            t.true(hasError(inpA)) //...and does
            t.false(hasError(inpB)) //but b does not because b wasn't blurred
            t.end()
        })
})

test.cb('checkboxes', t => {
    const validator = x =>
        Array.isArray(x) && x.length === 3 ? "Don't select all three!" : ''
    const root = document.createElement('main')
    app({
        init: { form: form.init() },
        view: state =>
            h('main', {}, [
                h(
                    form.form,
                    {
                        id: 'form',
                        state: state.form,
                        getFormState: s => s.form,
                        setFormState: (s, form) => ({ ...s, form }),
                        onsubmit: x => x,
                    },
                    [
                        h('p', {}, [
                            h(form.input, {
                                id: 'chkA',
                                type: 'checkbox',
                                name: 'checks',
                                value: 'aaa',
                                validator,
                            }),
                        ]),
                        h('p', {}, [
                            h(form.input, {
                                id: 'chkB',
                                type: 'checkbox',
                                name: 'checks',
                                value: 'bbb',
                                validator,
                            }),
                        ]),
                        h('p', {}, [
                            h(form.input, {
                                id: 'chkC',
                                type: 'checkbox',
                                name: 'checks',
                                value: 'ccc',
                                validator,
                            }),
                        ]),
                    ]
                ),
            ]),
        node: root,
    })

    step(() => {
        let boxes = {
            a: find(root, 'chkA'),
            b: find(root, 'chkB'),
            c: find(root, 'chkC'),
        }
        boxes.a.checked = true
        trigger(boxes.a, 'change')
        return boxes
    })
        .step(boxes => {
            t.false(hasError(boxes.a))
            t.false(hasError(boxes.b))
            t.false(hasError(boxes.c))
            boxes.b.checked = true
            trigger(boxes.b, 'change')
            return boxes
        })
        .step(boxes => {
            t.false(hasError(boxes.a))
            t.false(hasError(boxes.b))
            t.false(hasError(boxes.c))
            boxes.c.checked = true
            trigger(boxes.c, 'change')
            return boxes
        })
        .step(boxes => {
            t.true(hasError(boxes.a))
            t.true(hasError(boxes.b))
            t.true(hasError(boxes.c))
            t.end()
        })
})

test.cb('radios', t => {
    const validator = x => (x === 'bbb' ? 'Dont select the second option' : '')
    const root = document.createElement('main')
    app({
        init: { form: form.init() },
        view: state =>
            h('main', {}, [
                h(
                    form.form,
                    {
                        id: 'form',
                        state: state.form,
                        getFormState: s => s.form,
                        setFormState: (s, form) => ({ ...s, form }),
                        onsubmit: x => x,
                    },
                    [
                        h('p', {}, [
                            h(form.input, {
                                id: 'r-a',
                                type: 'radio',
                                name: 'radios',
                                value: 'aaa',
                                validator,
                            }),
                        ]),
                        h('p', {}, [
                            h(form.input, {
                                id: 'r-b',
                                type: 'radio',
                                name: 'radios',
                                value: 'bbb',
                                validator,
                            }),
                        ]),
                    ]
                ),
            ]),
        node: root,
    })

    step(() => {
        let radios = {
            a: find(root, 'r-a'),
            b: find(root, 'r-b'),
        }
        radios.a.checked = true
        trigger(radios.a, 'change')
        return radios
    })
        .step(radios => {
            t.false(hasError(radios.a))
            t.false(hasError(radios.b))
            radios.b.checked = true
            trigger(radios.b, 'change')
            return radios
        })
        .step(radios => {
            t.true(hasError(radios.a))
            t.true(hasError(radios.b))
            t.end()
        })
})

test.cb('custom widgets', t => {
    const errorMessage = 'You set an invalid value'
    const validator = x => (x === 'invalid' ? errorMessage : '')
    const root = document.createElement('main')
    app({
        init: { form: form.init() },
        view: state =>
            h('main', {}, [
                h(
                    form.form,
                    {
                        id: 'form',
                        state: state.form,
                        getFormState: s => s.form,
                        setFormState: (s, form) => ({ ...s, form }),
                        onsubmit: x => x,
                    },
                    [
                        h('p', {}, [
                            form.widget(
                                'aaa',
                                validator,
                                ({ error, value, Set, Validate }) =>
                                    h('span', {
                                        id: 'widget-a',
                                        class: {
                                            error: error === errorMessage,
                                        },
                                        onset: [Set, 'invalid'],
                                        onvalidate: [Validate, value],
                                    })
                            ),
                        ]),
                        h('p', {}, [
                            form.widget(
                                'bbb',
                                validator,
                                ({ error, Set, Validate }) =>
                                    h('span', {
                                        id: 'widget-b',
                                        class: {
                                            error: error === errorMessage,
                                        },
                                        onboth: [
                                            form.batch(Set, Validate),
                                            'invalid',
                                        ],
                                    })
                            ),
                        ]),
                    ]
                ),
            ]),
        node: root,
    })

    step(() => {
        let widgets = {
            a: find(root, 'widget-a'),
            b: find(root, 'widget-b'),
        }

        trigger(widgets.a, 'set')
        return widgets
    })
        .step(widgets => {
            t.false(hasError(widgets.a))
            t.false(hasError(widgets.b))

            trigger(widgets.a, 'validate')
            return widgets
        })
        .step(widgets => {
            t.true(hasError(widgets.a))
            t.false(hasError(widgets.b))

            trigger(widgets.b, 'both')
            return widgets
        })
        .step(widgets => {
            t.true(hasError(widgets.a))
            t.true(hasError(widgets.b))

            t.end()
        })
})
