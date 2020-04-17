import html from 'html'
import * as form from 'form'

const DEFAULT = { power: 'Mind-reading' }

const Reset = () => init
const Submit = (state, formdata) => ({ ...state, submitted: formdata })

const validpower = x => (!x ? 'Please select your preferred superpower!' : '')
const validnemesis = x => (!x ? 'Please select your preferred nemesis!' : '')

export const init = { submitted: null, form: form.init(DEFAULT) }
export const view = state => html`
    <main>
 
       <section>
            <h1>Controls</h1>
            <button type="button" onclick=${Reset}>Reset</button>
        </section>
 
        <section>
            <h1>Select Dropdowns</h1>
            <${form.form}
                state=${state.form}
                getFormState=${s => s.form}
                setFormState=${(s, x) => ({ ...s, form: x })}
                onsubmit=${Submit}
            >

                <p class="align">
                    <label>
                        <span>Super power: </span>
                        <${form.select}
                            name="power"
                            validator=${validpower}
                        >
                            <option value="">None</option>
                            <option>Invisibility</option>
                            <option>Flight</option>
                            <option>Bulletproof</option>
                            <option>Mind-reading</option>
                            <option>Telekinesis</option>
                            <option>Hypnosis</option>
                            <option>Metamorphosis</option>
                            <option>X-ray vision</option>
                        </${form.select}>
                    </label>
                </p>
            
                <p class="align">
                    <label>
                        <span>Nemesis:</span>
                        <${form.select}
                            name="nemesis"
                            validator=${validnemesis}
                        >
                            <option value="">None</option>
                            <option>Captain Calamity</option>
                            <option>Professor Pain</option>
                            <option>Doctor Damage</option>
                            <option>Sergeant Subterfuge</option>
                            <option>Governor Grave</option>
                        </${form.select}>
                    </label>
                </p>
            
                <${form.error} />

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
