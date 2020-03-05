import { h } from 'hyperapp'

const preventDefault = (f => e => [f, { e }])((_, { e }) => e.preventDefault())

const dispatch = (f => (a, p) => [f, { a, p }])((d, { a, p }) => d(a, p))

const HandleSubmit = (
    appState,
    { event, onsubmit, validators, getFormState, setFormState }
) => {
    let state = getFormState(appState)
    if (state.submitted) return appState // submitted forms cannot be resubmitted
    let errors = Object.fromEntries(
        Object.entries(validators).map(([name, validator]) => [
            name,
            validator(state.values[name], state.values),
        ])
    )
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

const Set = (
    appState,
    { name, value, getFormState, setFormState },
    state = getFormState(appState)
) =>
    state.submitted
        ? appState
        : setFormState(appState, {
              ...state,
              values: {
                  ...state.values,
                  [name]: value,
              },
          })

const Validate = (
    appState,
    { name, validators, getFormState, setFormState },
    state = getFormState(appState)
) =>
    state.submitted
        ? appState
        : setFormState(appState, {
              ...state,
              errors: {
                  ...state.errors,
                  [name]: validators[name]
                      ? validators[name](state.values[name], state.values)
                      : '',
              },
          })

const SetAndValidate = (state, data) => [
    state,
    dispatch(Set, data),
    dispatch(Validate, data),
]

const provideFormContext = (context, node) => {
    if (Array.isArray(node))
        return node.map(n => provideFormContext(context, n))
    if (!node.f)
        return { ...node, children: provideFormContext(context, node.children) }
    if (!node.provider || node.provider !== provideFormContext) return node
    node = node.f(context)
    if (!node.props) return { name: node, type: 3, children: [], props: {} }
    return node
}

const withFormContext = f => ({ f, provider: provideFormContext })

const form = ({ appState, getFormState, setFormState, onsubmit }, content) => {
    let validators = {}
    return h(
        'form',
        {
            onsubmit: [
                HandleSubmit,
                event => ({
                    event,
                    onsubmit,
                    validators,
                    getFormState,
                    setFormState,
                }),
            ],
        },
        provideFormContext(
            {
                validators,
                state: getFormState(appState),
                getFormState,
                setFormState,
            },
            content
        )
    )
}
const widget = (name, validator, f) =>
    withFormContext(({ state, validators, getFormState, setFormState }) => {
        if (validator) validators[name] = validator
        return f({
            value: state.values[name],
            error: state.errors[name],
            disabled: state.submitted,
            Set: [
                Set,
                value => ({
                    getFormState,
                    setFormState,
                    name,
                    value,
                    validators,
                }),
            ],
            Validate: [
                Validate,
                { name, getFormState, setFormState, validators },
            ],
            SetAndValidate: [
                SetAndValidate,
                value => ({
                    name,
                    value,
                    validators,
                    getFormState,
                    setFormState,
                }),
            ],
        })
    })

const text = opts =>
    widget(
        opts.name,
        opts.validator,
        ({ value, error, disabled, Set, Validate, SetAndValidate }) =>
            h('input', {
                ...opts,
                type: opts.type || 'text',
                class: [opts.class, { error: !!error }],
                disabled,
                name: name,
                value: value,
                oninput: [error ? SetAndValidate : Set, ev => ev.target.value],
                ...(value === undefined ? {} : { onblur: Validate }),
            })
    )

const radio = opts =>
    widget(
        opts.name,
        opts.validator,
        ({ value, error, disabled, SetAndValidate }) =>
            h('input', {
                ...opts,
                type: 'radio',
                class: [opts.class, { error }],
                name: opts.name,
                value: opts.value || 'on',
                disabled,
                checked: value === (opts.value || 'on'),
                onchange: [SetAndValidate, opts.value || 'on'],
            })
    )

const check = opts =>
    widget(
        opts.name,
        opts.validator,
        (
            { value, error, disabled, SetAndValidate },
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
                    SetAndValidate,
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
        ({ value, error, disabled, SetAndValidate }) =>
            h(
                'select',
                {
                    ...opts,
                    appendChild(child) {
                        if (value === child.value)
                            child.setAttribute('selected', 'selected')
                        return Element.prototype.appendChild.call(this, child)
                    },

                    class: [opts.class, { error }],
                    name: opts.name,
                    value,
                    disabled,
                    oninput: [SetAndValidate, ev => ev.target.value],
                },
                options
            )
    )

const submit = (opts, content) =>
    withFormContext(({ state }) =>
        h(
            'button',
            {
                ...opts,
                type: 'submit',
                disabled: state.submitted,
            },
            content
        )
    )

const error = () =>
    withFormContext(({ state }) =>
        Object.entries(state.errors).reduce(
            (str, [name, error]) => str || error,
            ''
        )
    )

const init = (values = {}, errors = {}) => ({
    values,
    errors,
    submitted: false,
})

export { init, form, input, check, radio, submit, error, select, text, widget }
