import html from 'html'
import * as form from 'form'

const validEmail = (x) =>
    !x
        ? 'E-mail address is required'
        : !x.match(/^.+\@.+\..+$/)
        ? 'E-mail address looks mistyped'
        : ''

const Reset = () => init
const Submit = (state, formdata) => ({ ...state, submitted: formdata })

export const init = {
    submitted: null,
    form: form.init(
        {
            email: 'boo@example.com',
        },
        {
            email: 'We could not verify your email, please double check it!',
        }
    ),
}
export const view = (state) => html`
    <main>
 
       <section>
            <h1>Controls</h1>
            <button type="button" onclick=${Reset}>Reset</button>
        </section>
 
        <section>
            <h1>Submitting a form</h1>
            <${form.form}
                state=${state.form}
                getFormState=${(s) => s.form}
                setFormState=${(s, x) => ({ ...s, form: x })}
                onsubmit=${Submit}
            >
                <${form.error} />
    
                <${form.input}
                    type="text"
                    name="email"
                    validator=${validEmail}
                />

                <${form.button} type="submit">Submit</${form.button}>
            </${form.form}>
        </section>
    
        <section>
            <h1>Submitted</h1>
            <pre>${JSON.stringify(state.submitted, null, '   ')}</pre>
        </section>
    
    </main>
`
