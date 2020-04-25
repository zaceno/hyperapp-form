# Hyperapp-form

No matter what framework you're using, working with forms
can be frustrating. It often involves lots of plumbing that can feel pretty
tangential to the main logic of your app. This library tries to
alleviate some of this drudgery for developers using Hyperapp (v2)

## Getting it into your project

### ES Module import

You can simply import the form components as es-modules:

```js
import * as form from 'https://unpkg.com/@zxlabs/hyperapp-form'
```

### NPM Package

Alternatively, install it as a dependency in your project

```sh
npm i @zxlabs/hyperapp-form
```

and import the form components from the installed package:

```js
import * as form from '@zxlabs/hyperapp-form'
```

> This library has a peer dependency on hyperapp, so remember to also
> install hyperapp!

### Minified version

The main version is implemented as a number of separate es-modules, for the benefit of tree shaking. If you prefer to import a single, minified version, you can:

```js
import * as form from 'https://unpkg.com/@zxlabs/hyperapp-form/dist/mini.js'
```

### IIFE version

If you imported hyperapp as a script tag, which adds `hyperapp` to the global scope, my guess is you want to do the same with this library.

So add a script after the hyperapp script like this:

```html
<script src="https://unpkg.com/hyperapp/dist/hyperapp.js"></script>
<script src="httos://unpkg.com/@zxlabs/hyperapp-form/dist/iife.js"></script>
```

that will inject an object in the global scope called `hyperappform`, holding all the components descriptbed below.

## Basics

### Initializing

A form using this library, needs to keep some state in the app's global state. Before rendering
the form, make sure to initialize the form state using the `init` function. Typically, in the
initial state of your app, or in the action that causes the form to be rendered

```js
const ShowForm = (state) => ({
    ...state,
    page: 'form',
    form: form.init(),
})
```

### The form component

When you render your form, rather than using a plain `<form></form>` tag pair, use the `form`
component from this library instead.

```jsx
;(state) => (
    <main>
        <h1>My form:</h1>
        <form.form
            state={state.form}
            getFormState={(s) => s.form}
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

### Validation On Submit

Most often you want the data submitted from a form to conform to certain rules. If the entered data is not conformant, you don't want the submission to go through, but to leave the form editable, with hints so users can correct it.

Visit [https://zaceno.github.io/hyperapp-form/#flow/validating](https://zaceno.github.io/hyperapp-form/#flow/validating) for an example.

Try typing some letters in the input box, and hit enter. Notice:

-   The form did not submit. (The submitted value is still null)
-   The form is still editable.
-   The error message "Code must be six digits" is displayed.
-   The input gets a red border and color.

This is all due to the `validator` prop on the input:

```jsx
<form.input type="text" name="code" validator={validcode} />
```

where the `validcode` validator is defined as:

```js
const validcode = (x) =>
    !!x && x.match(/^\d{6}$/) ? '' : 'Code must be six digits'
```

When a form is submitted, each validator attached to a `form.input` is called with the value for that input. If any the validators return a string message (or any truthy value in fact), we will _not_ call the `onsubmit` handler, and we leave the form open.

Moreover, each input whose validator returned an error message, will have "error" added to its class list.

The error message is displayed thanks to this component:

```jsx
<form.error />
```

It returns a virtual node representing the html:

```html
<p class="error" hidden="???">Some error message</p>
```

If any of the validators returned a message, _one_ of those messages will be shown. The `p` tag is rendered always, but it is hidden until there is a message to show.

### Validation while editing

Validators also run as the user types in fields where there is an error. When the error is corrected, the "error" class is removed, and the error message dissapears.

And even if a form is not submitted, when the user blurs a field containing a bad value, that field (not all) is validated. We validate on blur so as not to unnecessarily annoy users.

The onblur validation only applies to text-style inputs (text, password, email et c). Others like radios, checkboxes, select-dropdowns are validated immediately when the value changes.

Give it a try!

### Forms with initial values

Sometimes the form is meant for changing a bunch of values already existing on the server. So we want all pre-existing values set on
the form from the beginning.

You can see how to do that in this example: [https://zaceno.github.io/hyperapp-form/#flow/initvals](https://zaceno.github.io/hyperapp-form/#flow/initvals)

Notice how we initialize the form with an object as the first argument:

```js
const init = {
    submitted: null,
    form: form.init({
        foo: 'default value',
        hidden: 'not editable',
    }),
}
```

You will notice that the input has the value "default value" from the start. That is because the name of the input is `"foo"`.

You do not see the text "not editable" anywhere because there is no `form.input` with the name `"hidden"`. However, if you submit the form, you will see that both values were passed through to the onsubmit handler.

### Forms with initial errors

In the end, all the validation we do on the client side is just
to help the user produce sensible data to send to a server. The real validation happens there, and sometimes it finds problems the client side can't check for.

In those cases, we probably want to present the form again, with the values intact and an error message explaining what went wrong.

See the example [https://zaceno.github.io/hyperapp-form/#flow/initerrors](https://zaceno.github.io/hyperapp-form/#flow/initerrors)

The email input already has the "error" class from the start, and the error message is explaining that something went wrong server side. This, again, is because of how we initialized the form:

```js
const init = {
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
```

As before, we are setting the "email" default value to an email address the user probably typed before. But we are also passing a second argument - these are the errors that the form should register from the start.

These initial errors will be cleared the first time a user validates the input or submits the form (when all inputs are validated).

## More Components

...TBC...
