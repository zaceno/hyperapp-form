import html from 'html'
import * as form from 'form'

const Reset = () => init
const Submit = (state, formdata) => ({ ...state, submitted: formdata })

const validcode = x =>
    !!x && x.match(/^\d{6}$/) ? '' : 'Code must be six digits'

export const init = { submitted: null, form: form.init() }
export const view = state => html`
    <main>
 
       <section>
            <h1>Controls</h1>
            <button type="button" onclick=${Reset}>Reset</button>
        </section>
 
        <section>
            <h1>Validating a form</h1>
            <${form.form}
                state=${state.form}
                getFormState=${s => s.form}
                setFormState=${(s, x) => ({ ...s, form: x })}
                onsubmit=${Submit}
            >
                <p>
                    <label>
                        <span>Enter your six-digit code</span>
                        <${form.input}
                            type="text"
                            name="code"
                            validator=${validcode}
                        />
                    </label>
                    <${form.button} type="submit">Submit</${form.button}>
                </p> 

                <${form.error} />

            </${form.form}>
        </section>
    
        <section>
            <h1>Submitted</h1>
            <pre>${JSON.stringify(state.submitted, null, '   ')}</pre>
        </section>
    
    </main>
`
