import { preventDefault, dispatch } from './effects.js'

export const Submit = (
    appState,
    { event, onsubmit, validators, getFormState, setFormState }
) => {
    let state = getFormState(appState)
    if (state.submitted) return appState // submitted forms cannot be resubmitted
    let errors = validators.reduce((errors, validator) => validator(errors), {})
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
export const SetValues = (state, opts) => _Set(state, opts, 'values')
export const SetErrors = (state, opts) => _Set(state, opts, 'errors')
