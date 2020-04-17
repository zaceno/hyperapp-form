import html from 'html'
import * as form from 'form'

const validEmail = x =>
    !x
        ? 'You forgot to type your email!'
        : !x.match(/^.+\@.+\..+$/)
        ? 'Looks like you mistyped your email'
        : ''

const validPassword = x => (!x ? 'You need to enter a password!' : '')

const Reset = () => init

const Submit = (state, data) => ({ ...state, submitted: data })

const OkResponse = state => ({ ...state, form: null })

const FailedResponse = state =>
    !state.submitted
        ? state
        : {
              ...state,
              form: form.init(
                  { email: state.submitted.email },
                  { other: 'Wrong password or email' }
              ),
          }

const init = { submitted: null, form: form.init() }
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
        ${!state.form
            ? html`
                  <section>
                      <h1>Logged in</h1>
                      <p>Congratulations. You are now logged in</p>
                  </section>
              `
            : html`
                <section>
                    <h1>Log in</h1>

                    <${form.form}
                        state=${state.form}
                        getFormState=${s => s.form}
                        setFormState=${(s, form) => ({ ...s, form })}
                        onsubmit=${Submit}
                    >
                        <${form.error} />
                        <p class="align">
                            <label>
                                <span>Email:</span>
                                <${form.input}
                                    name="email"
                                    validator=${validEmail}
                                />
                            </label>
                        </p>
                        <p class="align">
                            <label>
                                <span>Password:</span>
                                <${form.input}
                                    type="password"
                                    name="password"
                                    validator=${validPassword}
                                />
                            </label>
                        </p>
                        <${form.button} type="submit">
                            Log in
                        </${form.button}>
                    </${form.form}>
                </section>
            `}
        <section>
            <h1>Submitted</h1>
            <pre>${JSON.stringify(state.submitted, null, '    ')}</pre>
        </section>
    </main>
`
export { init, view }
