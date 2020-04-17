import html from 'html'
import * as form from 'form'

const Reset = () => init
const Submit = (state, formdata) => ({ ...state, submitted: formdata })

export const init = { submitted: null, form: form.init() }
export const view = state => html`
    <main>
 
       <section>
            <h1>Controls</h1>
            <button type="button" onclick=${Reset}>Reset</button>
        </section>
 
        <section>
            <h1>Submitting a form</h1>
            <${form.form}
                state=${state.form}
                getFormState=${s => s.form}
                setFormState=${(s, x) => ({ ...s, form: x })}
                onsubmit=${Submit}
            >
                <label>
                    <span>Type something:</span>
                    <${form.input}
                        type="text"
                        name="foo"
                        placeholder="anything"
                    />
                </label>

                <${form.button} type="submit">Submit</${form.button}>
            </${form.form}>
        </section>
    
        <section>
            <h1>Submitted</h1>
            <pre>${JSON.stringify(state.submitted, null, '   ')}</pre>
        </section>
    
    </main>
`
