import html from 'html'
import * as form from 'form'

const validName = x => (!x ? 'Name is required' : '')

const validEmail = x =>
    !x
        ? 'E-mail address is required'
        : !x.match(/^.+\@.+\..+$/)
        ? 'E-mail address looks mistyped'
        : ''

const validPw1 = x =>
    !x
        ? 'Password is required'
        : x.length < 8
        ? 'Password is too weak. Make it 8 chars or longer.'
        : !!x.match(/^[A-Za-z0-9]+$/)
        ? "Password is too weak. Don't just use letters and numbers."
        : ''

const validPw2 = (pw2, { pw1 }) => (pw1 !== pw2 ? "Passwords don't match!" : '')

const Reset = () => init

const Submit = (state, data) => ({ ...state, submitted: data })

const OkResponse = state => ({ ...state, form: null })

const FailedResponse = state =>
    !state.submitted
        ? state
        : {
              ...state,
              form: form.init(
                  {
                      name: state.submitted.name,
                      email: state.submitted.email,
                  },
                  {
                      email: 'Someone already registered with that email',
                  }
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
                      <h1>Registration successful</h1>
                      <p>Congratulations. You are now registered</p>
                  </section>
              `
            : html`
                <section>
                    <h1>Please register an account</h1>

                    <${form.form}
                        state=${state.form}
                        getFormState=${s => s.form}
                        setFormState=${(s, form) => ({ ...s, form })}
                        onsubmit=${Submit}
                    >
                        <p class="align">
                            <label>
                                <span>Full name:</span>
                                <${form.input}
                                    name="name"
                                    validator=${validName}
                                />
                            </label>
                        </p>
                        <p class="align">
                            <label>
                                <span>Email address:</span>
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
                                    name="pw1"
                                    validator=${validPw1}
                                />
                            </label>
                        </p>
                        <p class="align">
                            <label>
                                <span>Repeat password:</span>
                                <${form.input}
                                    type="password"
                                    name="pw2"
                                    validator=${validPw2}
                                />
                            </label>
                        </p>
                        <${form.error} />
                        <${form.button} type="submit">
                            Submit
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
