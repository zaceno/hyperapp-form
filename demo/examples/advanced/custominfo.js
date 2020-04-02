import html from 'html'
import * as form from 'form'

const colorView = opts => ctx => html`
    <div
        ...${opts}
        style=${{
            ...opts.style,
            width: '100px',
            height: '100px',
            border: '1px black solid',
            backgroundColor: `hsl(${ctx.values.hue}deg, ${ctx.values
                .saturation * 100}%, ${ctx.values.lightness * 100}%)`,
        }}
    />
`

const Reset = () => init
const Submit = (state, formdata) => ({ ...state, submitted: formdata })

export const init = {
    form: form.init({ hue: 200, saturation: 0.8, lightness: 0.5 }),
    submitted: null,
}
export const view = state => html`
    <main>
        <section>
            <h1>Control</h1>
            <button type="button" onclick=${Reset}>Reset</button>
        </section>
        <section>
            <h1>Pick a color</h1>
            <${form.form}
                state=${state.form}
                getFormState=${s => s.form}
                setFormState=${(s, x) => ({ ...s, form: x })}
                onsubmit=${Submit}
            >
                <${colorView} style=${{ float: 'left' }} />
                <p class="align">
                    <label>
                        <span>Hue</span>
                        <${form.input}
                            name="hue"
                            type="range"
                            min="0"
                            max="360"
                            step="1"
                        />
                    </label>
                </p>
                <p class="align">
                    <label>
                        <span>Saturation</span>
                        <${form.input}
                            name="saturation"
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                        />
                    </label>
                </p>
                <p class="align">
                    <label>
                        <span>Lightness</span>
                        <${form.input}
                            name="lightness"
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                        />
                    </label>
                </p>

                <p style=${{ clear: 'left' }}>
                    <${form.submit}>Submit</${form.submit}>
                </p>
            </${form.form}>
        </section>
        <section>
            <h1>Submitted</h1>
            <pre>${JSON.stringify(state.submitted, null, '    ')}</pre>
        </section>
    </main>
`
