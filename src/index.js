import { h } from 'hyperapp'

const effect = (g => f => (...a) => [g, { f, a }])((d, { f, a }) => f(d, ...a))

const preventDefault = effect((_, ev) => ev.preventDefault())

const dispatch = effect((d, a, x) => d(a, x))

const batch = (...a) => (x, p) => [x, ...a.map(b => dispatch(b, p))]

const provide = (props, node) =>
    Array.isArray(node)
        ? node.map(n => provide(props, n)).flat()
        : typeof node === 'function'
        ? provide(props, node(props))
        : typeof node.name === 'function'
        ? provide(props, node.name(props))
        : { ...node, children: provide(props, node.children) }

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
    const validators = []
    const validate = values =>
        validators.reduce((errors, validator) => validator(errors, values), {})
    const register = f => validators.push(f)
    const withFormState = opts => ({ ...opts, setFormState, getFormState })
    return h(
        'form',
        {
            onsubmit: [
                Submit,
                event => withFormState({ event, onsubmit, validate }),
            ],
        },
        provide(
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

const widget = (name, validator, f) => ({
    values,
    errors,
    submitted,
    register,
    SetValues,
    SetErrors,
}) => {
    if (validator)
        register((errors, values) => ({
            ...errors,
            [name]: validator(values[name], values),
        }))
    const Set = [SetValues, x => ({ ...values, [name]: x })]
    const Validate = validator
        ? [SetErrors, x => ({ ...errors, [name]: validator(x, values) })]
        : x => x //noop
    return f({
        disabled: submitted,
        value: values[name],
        error: errors[name],
        Set,
        Validate,
    })
}

const input = opts =>
    opts.type === 'checkbox'
        ? check(opts)
        : opts.type === 'radio'
        ? radio(opts)
        : widget(
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
                      ...(value === undefined
                          ? {}
                          : { onblur: [Validate, value] }),
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

const select = (opts, options) =>
    widget(
        opts.name,
        opts.validator,
        ({ value, error, disabled, Set, Validate }) =>
            h(
                'select',
                {
                    ...opts,
                    class: [opts.class, { error }],
                    name: opts.name,
                    value,
                    disabled,
                    oninput: [batch(Set, Validate), ev => ev.target.value],
                },
                options.map(o =>
                    o.name === 'option' &&
                    value &&
                    (o.props.value === value || o.children[0].name === value)
                        ? {
                              ...o,
                              props: {
                                  ...o.props,
                                  selected: true,
                              },
                          }
                        : o
                )
            )
    )

const button = (opts, content) => ({ submitted }) =>
    h(
        'button',
        {
            ...opts,
            type: opts.type || 'button',
            disabled: submitted,
        },
        content
    )

const error = props => ({ errors }) => {
    let msg = Object.entries(errors).reduce(
        (str, [name, error]) => str || error,
        ''
    )
    return h('p', { ...props, class: 'error', hidden: !msg }, msg)
}

const init = (values = {}, errors = {}) => ({
    values,
    errors,
    submitted: false,
})

export { batch, init, form, provide, widget, error, input, button, select }
