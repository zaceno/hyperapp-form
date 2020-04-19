import { h } from 'hyperapp'
import { Submit, SetValues, SetErrors } from './actions.js'
import provide from './provide.js'

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
