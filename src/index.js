import { h } from 'hyperapp'

const makeContext = (() => {
    const text = txt => ({ name: txt, type: 3, children: [], props: {} })
    return () => {
        const provide = (context, node) => {
            if (Array.isArray(node)) return node.map(n => provide(context, n))
            if (!node.f)
                return { ...node, children: provide(context, node.children) }
            if (!node.provider || node.provider !== provide) return node
            node = node.f(context)
            if (!node.props) return text(node)
            return node
        }
        const consume = f => ({ f, provider: provide })

        return { consume, provide }
    }
})()
const context = makeContext()

const preventDefault = (f => e => [f, { e }])((_, { e }) => e.preventDefault())

const dispatch = (f => (a, p) => [f, { a, p }])((d, { a, p }) => d(a, p))
const batch = (...actions) => (x, p) => [x, ...actions.map(a => dispatch(a, p))]

const Submit = (
    appState,
    { event, onsubmit, validate, getFormState, setFormState }
) => {
    let state = getFormState(appState)
    if (state.submitted) return appState // submitted forms cannot be resubmitted
    let errors = validate(state.values)
    let valid = Object.entries(errors).reduce(
        (ok, [_, error]) => ok && !error,
        true
    )
    return [
        setFormState(appState, { ...state, errors, submitted: valid }),
        valid && dispatch(onsubmit, state.values),
        preventDefault(event),
    ]
}

const _Set = (appState, opts, name, state = opts.getFormState(appState)) =>
    state.submitted
        ? appState
        : [opts.setFormState, { ...state, [name]: opts[name] }]
const SetValues = (state, opts) => _Set(state, opts, 'values')
const SetErrors = (state, opts) => _Set(state, opts, 'errors')

const form = ({ state, getFormState, setFormState, onsubmit }, content) => {
    let validators = {}
    const register = (name, validator) =>
        validator && (validators[name] = validator)
    const validate = values =>
        Object.fromEntries(
            Object.entries(validators).map(([name, f]) => [name, f(values)])
        )
    const withFormState = opts => ({ ...opts, setFormState, getFormState })
    return h(
        'form',
        {
            onsubmit: [
                Submit,
                event => withFormState({ event, onsubmit, validate }),
            ],
        },
        context.provide(
            {
                ...state,
                register,
                SetValues: [SetValues, values => withFormState({ values })],
                SetErrors: [SetErrors, errors => withFormState({ errors })],
            },
            content
        )
    )
}

const widget = (name, validator, f) =>
    context.consume(
        ({ values, errors, submitted, register, SetValues, SetErrors }) => {
            register(name, values => validator(values[name], values))
            const Set = [SetValues, x => ({ ...values, [name]: x })]
            const Validate = [
                SetErrors,
                x => ({ ...errors, [name]: validator(x, values) }),
            ]
            return f({
                disabled: submitted,
                value: values[name],
                error: errors[name],
                Set,
                Validate: [Validate, values[name]],
            })
        }
    )

const text = opts =>
    widget(
        opts.name,
        opts.validator,
        ({ value, error, disabled, Set, Validate }) =>
            h('input', {
                ...opts,
                disabled,
                type: opts.type || 'text',
                class: [opts.class, { error: !!error }],
                value: value,
                oninput: [
                    error ? batch(Set, Validate) : Set,
                    ev => ev.target.value,
                ],
                ...(value === undefined ? {} : { onblur: [Validate, value] }),
            })
    )

const radio = opts =>
    widget(
        opts.name,
        opts.validator,
        ({ value, error, disabled, Set, Validate }) =>
            h('input', {
                ...opts,
                type: 'radio',
                class: [opts.class, { error }],
                value: opts.value || 'on',
                disabled,
                checked: value === (opts.value || 'on'),
                onchange: [batch(Set, Validate), opts.value || 'on'],
            })
    )

const check = opts =>
    widget(
        opts.name,
        opts.validator,
        (
            { value, error, disabled, Set, Validate },
            myval = opts.value || 'on'
        ) =>
            h('input', {
                ...opts,
                type: 'checkbox',
                class: [opts.class, { error }],
                disabled,
                checked: Array.isArray(value)
                    ? value.indexOf(myval) >= 0
                    : value === myval,
                name: opts.name,
                value: myval,
                onchange: [
                    batch(Set, Validate),
                    (
                        ev,
                        nval = [
                            ...(!value
                                ? []
                                : Array.isArray(value)
                                ? value
                                : [value]
                            ).filter(x => x !== myval),
                            ...(ev.target.checked ? [myval] : []),
                        ]
                    ) =>
                        nval.length > 1
                            ? nval
                            : nval.length == 1
                            ? nval[0]
                            : '',
                ],
            })
    )

const input = props =>
    props.type === 'checkbox'
        ? check(props)
        : props.type === 'radio'
        ? radio(props)
        : text(props)

const select = (opts, options) =>
    widget(
        opts.name,
        opts.validator,
        ({ value, error, disabled, Set, Validate }) =>
            h(
                'select',
                {
                    ...opts,
                    /*
                    TODO: this only solves the problem when options
                    don't change. What if they do?
                    
                    probably should process the options passed in, 
                    and modify them adding 'selected' attribute
                    on the vnode rather than real nodes.
                    */
                    appendChild(child) {
                        if (value === child.value)
                            child.setAttribute('selected', 'selected')
                        return Element.prototype.appendChild.call(this, child)
                    },

                    class: [opts.class, { error }],
                    name: opts.name,
                    value,
                    disabled,
                    oninput: [batch(Set, Validate), ev => ev.target.value],
                },
                options
            )
    )

const submit = (opts, content) =>
    context.consume(({ submitted }) =>
        h(
            'button',
            {
                ...opts,
                type: 'submit',
                disabled: submitted,
            },
            content
        )
    )

const error = () =>
    context.consume(({ errors }) =>
        Object.entries(errors).reduce((str, [name, error]) => str || error, '')
    )

const init = (values = {}, errors = {}) => ({
    values,
    errors,
    submitted: false,
})

export {
    init,
    form,
    input,
    check,
    radio,
    submit,
    error,
    select,
    text,
    widget,
    context,
    batch,
}
