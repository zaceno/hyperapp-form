import html from 'html'
import * as form from 'form'

const statusUpdate = ({ name, maxlen }) =>
    form.widget(
        name,
        x =>
            !x
                ? 'Cannot set empty status message'
                : x.length > maxlen
                ? 'Status message is too long'
                : '',
        ({ value = '', error, disabled, Set, Validate }) => html`
            <div
                style=${{
                    border: '1px #ccc solid',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#ddd',
                    width: '250px',
                    position: 'relative',
                    margin: '18px 6px',
                }}
            >
                <textarea
                    style=${{
                        border: 'none',
                        display: 'block',
                        padding: '8px',
                        width: '100%',
                        height: '50px',
                        margin: '0',
                    }}
                    disabled=${disabled}
                    oninput=${(_, ev) => [
                        error ? form.batch(Set, Validate) : Set,
                        ev.target.value,
                    ]}
                    value=${value}
                />
                <p
                    style=${{
                        margin: '0',
                        width: '100%',
                        padding: '8px',
                        position: 'relative',
                        left: '-16px',
                        textAlign: 'right',
                        color: value.length > maxlen ? 'red' : 'black',
                    }}
                >
                    <em>remaining characters:</em> ${maxlen - value.length}
                </p>
            </div>
        `
    )

const Reset = () => init
const Submit = (state, formdata) => ({ ...state, submitted: formdata })

export const init = { form: form.init(), submitted: null }
export const view = state => html`
    <main>
        <section>
            <h1>Controls</h1>
            <button type="button" onclick=${Reset}>Reset</button>
        </section>
        <section>
            <h1>Status update</h1>
            <${form.form}
                state=${state.form}
                getFormState=${s => s.form}
                setFormState=${(s, x) => ({ ...s, form: x })}
                onsubmit=${Submit}
            >
                <${statusUpdate} name="status" maxlen="70" />
                <${form.error} />
                <${form.button} type="submit">
                    Post
                </${form.button}>
            </${form.form}>
       </section>
       <section>
           <h1>Submitted</h1>
            <pre>${JSON.stringify(state.submitted, null, '    ')}</pre>
        </section>
    </main>
`
