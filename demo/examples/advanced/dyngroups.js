import html from 'html'
import * as form from 'form'

/**
 * If your form reaches this point of complexity, you
 * might be better off not using this library. At least
 * for now, as there is no special support for groups
 * or dynamically adding fields.
 *
 * But just so you know that it's possible, here's how
 * to use `provide` to implement dynamic form-groups
 */

//-- OBJECT MANIPULATION UTILITIES --

//prefix keys of an object
const preKey = (prefix, obj) =>
    Object.keys(obj).reduce(
        (result, key) => ((result[prefix + key] = obj[key]), result),
        {}
    )

//add one object to another with keys prefixed (so it can be extracted)
const objMerge = (prefix, original, news) => ({
    ...original,
    ...preKey(prefix, news),
})

//extracts items from an object based on prefix (stripped out)
// filterKey({fooA:1, fooB: 2, barC: 3, barD: 4}) --> {A: 1, B:2}
const objExtract = (prefix, obj) =>
    Object.keys(obj)
        .filter(k => k.startsWith(prefix))
        .reduce(
            (result, key) => (
                (result[key.replace(prefix, '')] = obj[key]), result
            ),
            {}
        )

//removes all keys from an object starting with prefix
const objPurge = (prefix, obj) =>
    Object.keys(obj)
        .filter(k => !k.startsWith(prefix))
        .reduce((result, key) => ((result[key] = obj[key]), result), {})

// -- DEFINITION OF EXPENSE-ROW CONTEXT --

const SetExpenseValue = (ctx, index) => [
    ctx.SetValues,
    newExpense => ({
        ...ctx.values,
        expenses: ctx.values.expenses.map((x, i) =>
            i === index ? newExpense : x
        ),
    }),
]
const SetExpenseError = (ctx, index) => [
    ctx.SetErrors,
    newErrors => objMerge('expenses.' + index + '.', ctx.errors, newErrors),
]

const AddExpense = ctx => [
    ctx.SetValues,
    {
        ...ctx.values,
        expenses: [
            ...(ctx.values.expenses || []),
            {
                category: '',
                amount: '',
                note: '',
            },
        ],
    },
]

const RemoveExpenseValues = (ctx, index) => [
    ctx.SetValues,
    {
        ...ctx.values,
        expenses: ctx.values.expenses.filter((_, i) => i !== index),
    },
]
const RemoveExpenseErrors = (ctx, index) => [
    ctx.SetErrors,
    () => objPurge('expenses', ctx.errors),
]

const RemoveExpense = (ctx, index) =>
    form.batch(RemoveExpenseValues(ctx, index), RemoveExpenseErrors(ctx, index))

const getExpenseContext = (ctx, index) => ({
    register: (f, ek = 'expenses.' + index + '.') =>
        ctx.register((errors, values) =>
            objMerge(
                ek,
                errors,
                f(objExtract(ek, errors), values.expenses[index])
            )
        ),
    submitted: ctx.submitted,
    values: ctx.values.expenses[index],
    errors: objExtract('expenses.' + index + '.', ctx.errors),
    SetValues: SetExpenseValue(ctx, index),
    SetErrors: SetExpenseError(ctx, index),
    Remove: RemoveExpense(ctx, index),
})

// -- COMPONENTS --

const provideExpenseContext = ({ index }, content) => ctx =>
    form.provide(getExpenseContext(ctx, index), content)

const addExpenseButton = () => ctx => html`
    <${form.button} onclick=${AddExpense(ctx)}>Add<//>
`

const removeExpenseButton = () => ({ Remove }) => html`
    <${form.button} onclick=${Remove}>Remove<//>
`

const expenseError = () => ctx =>
    html`
        <span
            style=${{
                color: 'red',
                fontSize: '10px',
            }}
        >
            ${ctx.errors.category || ctx.errors.amount || ''}
        </span>
    `

const totalExpenses = () => ctx => html`
    <b>
        ${(ctx.values.expenses || []).reduce(
            (total, expense, index) =>
                total === ''
                    ? ''
                    : ctx.errors['expenses.' + index + '.amount']
                    ? ''
                    : total + (+expense.amount || 0),
            0
        )}
    </b>
`

// -- FORM --
const myForm = opts => html`<${form.form} ...${opts}>
        <section>
            <h2>Expenses</h2>
            <${addExpenseButton} />
            <table>
                <tr>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Note</th>
                    <th></th>
                    <th></th>
                </tr>
                ${ctx =>
                    !ctx.values.expenses
                        ? []
                        : ctx.values.expenses.map(
                              (_, index) =>
                                  html`
                <${provideExpenseContext} index=${index}>
                    <tr>
                        <td>
                            <${form.select}
                                name="category"
                                validator=${x =>
                                    !x ? 'Category is required' : ''}
                            >
                                <option value="">Select:</option>
                                <option>Food/Drink</option>
                                <option>Travel</option>
                                <option>Supplies</option>
                                <option>Bills</option>
                                <option>Repairs</option>
                            <//>
                        </td>
                        <td>
                            <${form.input}
                                name="amount"
                                style=${{ width: '50px' }}
                                validator=${x =>
                                    isNaN(+x) || x <= 0
                                        ? 'Amount must be > 0'
                                        : ''}
                                type="text"
                            />
                        </td>
                        <td>
                            <${form.input}
                                name="note"
                                type="text"
                            />
                        </td>
                        <td><${removeExpenseButton} /></td>
                        <td><${expenseError} /></td>
                    </tr>
                </${provideExpenseContext}>
            `
                          )}
            </table>
        </section>
        <section>
            <h2>Total</h2>
            <${totalExpenses} />
        </section>
        <${form.button} type="submit">Submit</${form.button}>
    </${form.form}>
`

// -- MAIN --

const Reset = () => init

const Submit = (state, formdata) => ({ ...state, submitted: formdata })

const Edit = (state, formdata) => ({
    ...state,
    form: form.init(state.submitted),
})

export const init = { form: form.init(), submitted: null }

export const view = state => html`
    <main>
        <section>
            <h1>Controls</h1>
            <button onclick=${Reset}>Reset</button>
            <button onclick=${Edit}>Edit</button>
        </section>
        <section>
            <h1>Expenses</h1>
            <${myForm}
                state=${state.form}
                getFormState=${s => s.form}
                setFormState=${(s, x) => ({ ...s, form: x })}
                onsubmit=${Submit}
            />
        </section>
        <section>
            <h1>Submitted</h1>
            <pre>${JSON.stringify(state.submitted, null, '    ')}</pre>
        </section>
    </main>
`
