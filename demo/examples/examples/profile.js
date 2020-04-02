import html from 'html'
import * as form from 'form'

//capitalizes first letter of a string
const cap = str => str.charAt(0).toUpperCase() + str.slice(1)

//splits an array into chunks of length n
const chunk = (a, n) =>
    n ? [a.slice(0, n), ...(a.length > n ? chunk(a.slice(n), n) : [])] : []

//return required-validator
const required = name => x => (!x ? `${name} is required` : '')

const screenName = () => html`
    <section>
        <h2>Screen name</h2>
        <${form.input} type="text" name="name" validator=${required('Name')} />
    </section>
`

const gender = () => html`
    <p>
        <span class="label">Gender</span>
        <label>
            <${form.input} type="radio" name="gender" value="female" />
            <span>Female</span>
        </label>
        <label>
            <${form.input} type="radio" name="gender" value="non-binary" />
            <span>Non-binary</span>
        </label>
        <label>
            <${form.input} type="radio" name="gender" value="male" />
            <span>Male</span>
        </label>
    </p>
`

const age = () => html`
    <p class="align">
        <label>
            <span>Age</span>
            <${form.select}
                name="age"
                validator=${required('Age')}
            >
                <option value="">Select:</option>
                <option>${'<'}16</option>
                <option>16-21</option>
                <option>21-35</option>
                <option>35-45</option>
                <option>45-65</option>
                <option>65+</option>
            </${form.select}>
        </label>
    </p>
`

const validinterests = x =>
    !x
        ? 'Please check at least one interest!'
        : Array.isArray(x) && x.length > 3
        ? 'No more than three interests please'
        : ''
const interests = () => html`
    <section>
        <h2>Interests</h2>
        <table>
            ${chunk(
                [
                    'arts',
                    'health',
                    'politics',
                    'cooking',
                    'history',
                    'science',
                    'crafts',
                    'movies',
                    'sports',
                    'gaming',
                    'music',
                    'travel',
                ],
                3
            ).map(
                row => html`
                    <tr>
                        ${row.map(
                            int => html`
                                <td>
                                    <label>
                                        <${form.input}
                                            type="checkbox"
                                            name="interests"
                                            value=${int}
                                            validator=${validinterests}
                                        />
                                        <span>${cap(int)}</span>
                                    </label>
                                </td>
                            `
                        )}
                    </tr>
                `
            )}
        </table>
    </section>
`

const myForm = opts => html`
    <${form.form} ...${opts}>
        <${screenName} />
        <section>
        <h2>Personal</h2>
            <${gender} />
            <${age} />
        </section>
        <${interests} />
        <${form.error} />
        <${form.submit}>Save</${form.submit}>
    </${form.form}>
`

const Reset = () => init

const Submit = (state, data) => ({ ...state, submitted: data })

const OkResponse = state => ({ ...state, form: form.init(state.submitted) })

const FailedResponse = state =>
    !state.submitted
        ? state
        : {
              ...state,
              form: form.init(state.submitted, {
                  server: 'There was an error saving. Please try again.',
              }),
          }

const init = {
    submitted: null,
    form: form.init({ name: 'Datadork', age: '35-45' }),
}
const view = state => html`
    <main>
        <section>
            <h1>Controls</h1>
            <p>
                <button type="button" onclick=${Reset}>Reset</button>
                <button
                    type="button"
                    disabled=${!state.submitted}
                    onclick=${OkResponse}
                >
                    OK Response
                </button>
                <button
                    type="button"
                    disabled=${!state.submitted}
                    onclick=${FailedResponse}
                >
                    Failed Response
                </button>
            </p>
        </section>
        <section>
            <h1>Edit profile</h1>
            <${myForm}
                state=${state.form}
                getFormState=${s => s.form}
                setFormState=${(s, form) => ({ ...s, form })}
                onsubmit=${Submit}
            />
        </section>
        <section>
            <h1>Submitted</h1>
            <pre>${JSON.stringify(state.submitted, null, '    ')}</pre>
        </section>
    </main>
`
export { init, view }
