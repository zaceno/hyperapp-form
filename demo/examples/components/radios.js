import html from 'html'
import * as form from 'form'
//capitalize first letter of string:
const cap = str => str.charAt(0).toUpperCase() + str.slice(1)

const PETS = ['cat', 'dog', 'velociraptor']
const DRINKS = ['coffee', 'tea', 'battery-acid']
const DEFAULT = { drink: 'coffee' }

const validpet = x =>
    x === 'velociraptor' ? 'Velociraptors cannot be pets!' : ''

const validdrink = x =>
    x === 'battery-acid' ? 'Battery-acid is not a beverage!' : ''

const Reset = () => init
const Submit = (state, formdata) => ({ ...state, submitted: formdata })
const Edit = state =>
    !state.submitted ? state : { ...state, form: form.init(state.submitted) }

export const init = { submitted: null, form: form.init(DEFAULT) }
export const view = state => html`
    <main>
 
       <section>
            <h1>Controls</h1>
            <button type="button" onclick=${Reset}>Reset</button>
            <button type="button" disabled=${!state.submitted} onclick=${Edit}>Edit</button>
        </section>
 
        <section>
            <h1>Radio Buttons</h1>
            <${form.form}
                state=${state.form}
                getFormState=${s => s.form}
                setFormState=${(s, x) => ({ ...s, form: x })}
                onsubmit=${Submit}
            >
                <p>
                    Which pet would you prefer?<br/>
                    ${PETS.map(
                        pet => html`
                            <label>
                                <${form.input}
                                    type="radio"
                                    name="pet"
                                    value=${pet}
                                    validator=${validpet}
                                />
                                <span>${cap(pet)}</span>
                            </label>
                            <br />
                        `
                    )}
                </p>
                
                <p>
                    Which beverage do you prefer?<br/>
                    ${DRINKS.map(
                        drink => html`
                            <label>
                                <${form.input}
                                    type="radio"
                                    name="drink"
                                    value=${drink}
                                    validator=${validdrink}
                                />
                                <span>${cap(drink)}</span>
                            </label>
                            <br />
                        `
                    )}
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
