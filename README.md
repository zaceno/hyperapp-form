# Hyperapp-form

No matter what framework you're using, working with forms
can be frustrating. It often involves lots of plumbing that can feel pretty
tangential to the main logic of your app. This library tries to
alleviate some of this drudgery for developers using Hyperapp (v2)

## Getting it into your project

You can simply import the form components as es-modules:

```js
import * as form from 'https://unpkg.com/@zxlabs/hyperapp-form'
```

Alternatively, install it as a dependency in your project

```sh
npm i @zxlabs/hyperapp-form
```

and import the form components from the installed package:

```js
import * as form from '@zxlabs/hyperapp-form'
```

## Basics

### Initializing

A form using this library, needs to keep some state in the app's global state. Before rendering
the form, make sure to initialize the form state using the `init` function. Typically, in the
initial state of your app, or in the action that causes the form to be rendered

```js
const ShowForm = state => ({
    ...state,
    page: 'form',
    form: form.init(),
})
```

### The form component

When you render your form, rather than using a plain `<form></form>` tag pair, use the `form`
component from this library instead.

```jsx
state => (
    <main>
        <h1>My form:</h1>
        <form.form
            state={state.form}
            getFormState={s => s.form}
            setFormState={(s, x) => ({ ...s, form: x })}
            onsubmit={HandleSubmittedForm}
        >
            ... form contents here ...
        </form.form>
    </main>
)
```

You'll need to pass a handfull of props to the form, described below:

`state` is simply to tell the form its current state. However, we take care of updating the form state with actions under the hood. So we need to know how to get and set the form state in the actions as well. That is why you must pass `getFormState` and `setFormState`.

Finally, `onsubmit` is the action where you handle the result of a successfully submitted form. The data entered into the form will be passed as a key-value object in the payload of the action.

```js
const HandleSubmittedForm = (state, data) => [
    state,
    data.sendCopy &&
        sendEmailEffect({
            address: data.email,
            message: data.message,
        }),
]
```

### inputs

In order to get som data to your submit-handler, it needs to be entered in the form somewhere. Instead of adding a plain `<input>` tag, add an `input` component.

```jsx
<form.input type="text" name="foo" placeholder="anything" />
```

This component returns a regular `<input>` tag with all the same properties you set on it, only wired to the `form` component that contains it. This is one of the core ideas of the library: to be as close as possible to writing a regular form in html, and not introduce any surprising elements in the DOM.

### Submitting

Buttons for submitting forms can also be added

```jsx
<form.button type="submit">Submit</form.button>
```

All that we've covered so far, is combined in a live runnable example you can try out (while inspecting the code) here: [https://zaceno.github.io/hyperapp-form/#flow/submitting](https://zaceno.github.io/hyperapp-form/#flow/submitting)

Go there, type "foo" in the input field then click submit. Notice two things:

-   After the form was submitted, the input and submit-button became disabled. A form, once submitted, cannot be submitted again. You must initialize the state to render the form editable once more (Use the "Reset" button in the example to do this).

-   The data submitted was: `{foo: "bar"}`. "bar" is the text you typed, and `foo` is because you typed it in an input with `name="foo"`.

... TBC ...
