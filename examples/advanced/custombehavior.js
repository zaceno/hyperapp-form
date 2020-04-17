import html from 'html'
import * as form from 'form'

const validrange = (_, { min, max }) =>
    max - min > 40 ? 'Difference must be < 40' : ''

const Reset = () => init
const Submit = (state, formdata) => ({ ...state, submitted: formdata })

export const init = {
    form: form.init({ min: 30, max: 40 }),
    submitted: null,
}
export const view = state => html`
    <main>
        <section>
            <h1>Control</h1>
            <button type="button" onclick=${Reset}>Reset</button>
        </section>
        <section>
            <h1>Define a range</h1>
            <${form.form}
                state=${state.form}
                getFormState=${s => s.form}
                setFormState=${(s, x) => ({ ...s, form: x })}
                onsubmit=${Submit}
            >
            ${ctx =>
                form.provide(
                    {
                        ...ctx,
                        SetValues: [
                            ctx.SetValues,
                            newVals => ({
                                ...newVals,
                                max: Math.max(newVals.min, newVals.max),
                                min: Math.min(newVals.min, newVals.max),
                            }),
                        ],
                    },
                    html`
            
                <p class="align">
                    <label>
                        <span>Min: ${ctx.values.min}</span>
                        <${form.input}
                            type="range"
                            name="min"
                            min="0"
                            max="100"
                            step="1"
                            validator=${validrange}
                        />
                    </label>
                </p>

                <p class="align">
                    <label>
                        <span>Max: ${ctx.values.max}</span>
                        <${form.input}
                            type="range"
                            name="max"
                            min="0"
                            max="100"
                            step="1"
                            validator=${validrange}
                        />
                    </label>
                </p>

                <${form.error} />

                <p style=${{ clear: 'left' }}>
                    <${form.button} type="submit">
                        Submit
                    </${form.button}>
                </p>


            `
                )}

            </${form.form}>
        </section>
        <section>
            <h1>Submitted</h1>
            <pre>${JSON.stringify(state.submitted, null, '    ')}</pre>
        </section>
    </main>
`
