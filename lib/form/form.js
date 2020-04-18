import { h } from 'hyperapp'
import { provide, preventDefault, dispatch } from './utils.js'

const Submit = (
    appState,
    { event, onsubmit, validators, getFormState, setFormState }
) => {
    let state = getFormState(appState)
    if (state.submitted) return appState // submitted forms cannot be resubmitted
    let errors = validators.reduce(
        (errors, validator) => validator(errors, state.values),
        {}
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

const _Set = (appState, opts, name, state = opts.getFormState(appState)) =>
    state.submitted
        ? appState
        : [opts.setFormState, { ...state, [name]: opts[name] }]
const SetValues = (state, opts) => _Set(state, opts, 'values')
const SetErrors = (state, opts) => _Set(state, opts, 'errors')

export default ({ state, getFormState, setFormState, onsubmit }, content) => {
    const validators = []
    const register = f => validators.push(f)
    const withFormState = opts => ({ ...opts, setFormState, getFormState })
    return h(
        'form',
        {
            onsubmit: [
                Submit,
                event => withFormState({ event, onsubmit, validators }),
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
