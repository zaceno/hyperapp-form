import { h } from 'hyperapp'
import { Submit, SetValues, SetErrors } from './actions.js'
import provide from './provide.js'

const _formActions = (getFormState, setFormState) => (
    action,
    getData
) => (_, data) => [action, { ...getData(data), getFormState, setFormState }]

const formActions = (getter, setter, onsubmit, validators) => {
    const action = _formActions(getter, setter)
    return {
        Submit: action(Submit, (event) => ({ event, onsubmit, validators })),
        SetValues: action(SetValues, (x) => ({ values: x })),
        SetErrors: action(SetErrors, (x) => ({ errors: x })),
    }
}

export default ({ state, getFormState, setFormState, onsubmit }, content) => {
    const validators = []
    const register = (f) => validators.push(f)
    const {Submit, SetValues, SetErrors} = formActions(getFormState, setFormState, onsubmit, validators)
    return h(
        'form',
        {
            onsubmit: Submit,
        },
        provide(
            {
                ...state,
                register,
                SetValues,
                SetErrors,
            },
            content
        )
    )
}
