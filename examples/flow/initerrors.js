import html from 'html'
import * as form from 'form'

const Reset = () => init
const Submit = (state, formdata) => ({ ...state, submitted: formdata })

export const init = {
    submitted: null,
    form: form.init(
        {},
        {
            password: 'The password is incorrect. Try again!',
        }
    ),
}
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
                <${form.error} />
    
                <${form.input} type="password" name="password" />

                <${form.button} type="submit">Submit</${form.button}>
            </${form.form}>
        </section>
    
        <section>
            <h1>Submitted</h1>
            <pre>${JSON.stringify(state.submitted, null, '   ')}</pre>
        </section>
    
    </main>
`
