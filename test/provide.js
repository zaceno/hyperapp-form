import test from 'ava'
import { h, text } from 'hyperapp'
import provide from '../src/provide.js'


test('provide context to all children', t => {
    const component = props => ctx => h('x', { a: ctx.a, c: props.c }, [text(ctx.b)])
    const tree = h(
        'x',
        {},
        provide({ a: 'a', b: 'b' }, [
            h('x', { y: 'y' }, [text('z')]),
            component({ c: 'c' }),
            h('x', { y: 'y' }, [text('z')]),
            component({ c: 'c' }),
            h('x', { y: 'y' }, [text('z')]),
        ])
    )
    const expect = h('x', {}, [
        h('x', { y: 'y' }, [text('z')]),
        h('x', { a: 'a', c: 'c' }, [text('b')]),
        h('x', { y: 'y' }, [text('z')]),
        h('x', { a: 'a', c: 'c' }, [text('b')]),
        h('x', { y: 'y' }, [text('z')]),
    ])
    t.deepEqual(tree, expect)
})

test('provide goes deep', t => {
    const component1 = (props, content) => ctx =>
        h('x1', { a: ctx.a }, [
            h('x', { y: 'y' }, text('z')),
            component2({}),
            ...content,
        ])
    const component2 = (props, content) => ctx => h('x2', { b: ctx.b })
    const component3 = (props, content) => ctx =>
        h('x3', { a: ctx.a, b: ctx.b })
    const tree = h(
        'x',
        {},
        provide({ a: 'a', b: 'b' }, [
            h('x', { y: 'y' }, text('z')),
            component1({}, [h('x', { y: 'y' }, text('z')), component3({})]),
            h('x', { y: 'y' }, text('z')),
        ])
    )
    const expect = h('x', {}, [
        h('x', { y: 'y' }, text('z')),
        h('x1', { a: 'a' }, [
            h('x', { y: 'y' }, text('z')),
            h('x2', { b: 'b' }),
            h('x', { y: 'y' }, text('z')),
            h('x3', { a: 'a', b: 'b' }),
        ]),
        h('x', { y: 'y' }, text('z')),
    ])
    t.deepEqual(tree, expect)
})
