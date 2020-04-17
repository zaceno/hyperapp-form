import html from 'html'
import * as form from 'form'

const DEFAULT = { novalue: 'on' }

const Reset = () => init
const Edit = state =>
    !state.submitted ? state : { ...state, form: form.init(state.submitted) }
const Submit = (state, formdata) => ({ ...state, submitted: formdata })

export const init = { submitted: null, form: form.init(DEFAULT) }
export const view = state => html`
    <main>
 
       <section>
            <h1>Controls</h1>
            <button type="button" onclick=${Reset}>Reset</button>
            <button type="button" onclick=${Edit} disabled=${!state.submitted}>Edit</button>
        </section>
 
        <section>
            <h1>Checkboxes</h1>
            <${form.form}
                state=${state.form}
                getFormState=${s => s.form}
                setFormState=${(s, x) => ({ ...s, form: x })}
                onsubmit=${Submit}
            >
                <p>
                    <label>
                        <${form.input} type="checkbox" name="novalue" />
                        <span>No value</span>
                    </label>
                </p>
                <p>
                    <label>
                        <${form.input}
                            type="checkbox"
                            name="foovalue"
                            value="foo"
                        />
                        <span>Value: foo</span>
                    </label>
                </p>
                <section>
                    <h2>Multiple values</h2>
                    <p>
                        <label>
                            <${form.input}
                                type="checkbox"
                                name="multi"
                                value="foo"
                            />
                            <span>Foo</span>
                        </label>
                        <label>
                            <${form.input}
                                type="checkbox"
                                name="multi"
                                value="bar"
                            />
                            <span>Bar</span>
                        </label>
                        <label>
                            <${form.input}
                                type="checkbox"
                                name="multi"
                                value="baz"
                            />
                            <span>Baz</span>
                        </label>
                    </p>                    
                </section>

                <${form.button} type="submit">
                    Submit
                </${form.button}>

            </${form.form}>
        </section>
    
        <section>
            <h1>Submitted</h1>
            <pre>${JSON.stringify(state.submitted, null, '   ')}</pre>
        </section>
    
    </main>
`
