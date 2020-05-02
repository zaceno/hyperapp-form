# Hyperapp-form

No matter what framework you're using, working with forms
can be frustrating. It often involves lots of plumbing that can feel pretty
tangential to the main logic of your app. This library tries to
alleviate some of this drudgery for developers using Hyperapp (v2)

## Getting it into your project

### ES Module import

You can simply import the form components as es-modules:

```js
import * as form from 'https://unpkg.com/hyperapp-form'
```

### NPM Package

Alternatively, install it as a dependency in your project

```sh
npm i @zxlabs/hyperapp-form
```

and import the form components from the installed package:

```js
import * as form from 'hyperapp-form'
```

> This library has a peer dependency on hyperapp, so remember to also
> install hyperapp!

### Minified version

The main version is implemented as a number of separate es-modules, for the benefit of tree shaking. If you prefer to import a single, minified version, you can:

```js
import * as form from 'https://unpkg.com/hyperapp-form/dist/mini.js'
```

### IIFE version

If you imported hyperapp as a script tag, which adds `hyperapp` to the global scope, my guess is you want to do the same with this library.

So add a script after the hyperapp script like this:

```html
<script src="https://unpkg.com/hyperapp/dist/hyperapp.js"></script>
<script src="httos://unpkg.com/hyperapp-form/dist/iife.js"></script>
```

that will inject an object in the global scope called `hyperappform`, holding all the components described below.

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

In order to get some data to your submit-handler, it needs to be entered in the form somewhere. Instead of adding a plain `<input>` tag, add an `input` component.

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
const validcode = x =>
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

You've already encountered regular input components in the preceeding examples. But `<input type="checkbox">` and `<input type="radio">` work a bit differently. And there's a couple other components to look at while we're at it.

### Checkboxes

You render a checkbox by using the `form.input` component, with the `type="checkbox"` property. You should also give it a `name` property.

If the `name` of the checkbox is "foo", then if the form is submitted with the checkbox checked, the values submitted will have `{foo: 'on'}`. You can also assign a value, `value="bar"`, in which case the values would have `{foo: "bar"}`

If the form is submitted with multiple checkboxes having the same name, then the values will be listed as an array. For example, consider these:

```jsx
<form.checkbox type="checkbox" name="foo" value="a" />
<form.checkbox type="checkbox" name="foo" value="b" />
<form.checkbox type="checkbox" name="foo" value="c" />
<form.checkbox type="checkbox" name="foo" value="d" />
<form.checkbox type="checkbox" name="foo" value="e" />
```

If the form is submitted with the 'a', 'c' and 'd' boxes checked, the values will have: `{foo: ['a', 'c', 'd']}`

Have a look at [https://zaceno.github.io/hyperapp-form/#components/checkboxes](https://zaceno.github.io/hyperapp-form/#components/checkboxes) for a more in-depth example.

Just like the other inputs, you can set a validator on checkboxes. Validators apply by name, so if you have multiple checkboxes with the same name, you don't need to set the validator on each of them, but it doesn't hurt either. Unlike text-style inputs, validation occurs immediately on input. Not on blur.

### Radio buttons

You render radiobuttins by setting `type="radio"` on a `form.input`. For radio buttons to make sense, there should be more than one having the same `name` but different values. For example if you have:

```jsx
<form.input type="radio" name="foo" value="a" />
<form.input type="radio" name="foo" value="b" />
<form.input type="radio" name="foo" value="c" />
```

Then only one of those can be checked at a time. The one (if any) that is checked when the form is submitted will also be the value submitted for name "foo".
Validation works the same as for checkboxes (see above).

For a more complete example see [https://zaceno.github.io/hyperapp-form/#components/radios](https://zaceno.github.io/hyperapp-form/#components/radios)

### Dropdown menus

To make a dropdown, do as you would with regular html and just replace the `<select>` tag with the `form.select` component, e g:

```jsx
<form.select name="age">
    <option value="">Select your age:</option>
    <option value="age-0">under 18</option>
    <option value="age-1">under 40</option>
    <option value="age-2">under 80</option>
    <option value="age-3">over 80</option>
</form.select>
```

There is no special component for `option` or `optgroup` - just use the regular tags.

You can attach a `validator` to the `form.select` component as well. Like checkboxes and radio-buttons, validation happens immediately on input. Not on blur.

For a complete example, see: [https://zaceno.github.io/hyperapp-form/#components/select](https://zaceno.github.io/hyperapp-form/#components/select)

There is not yet any support for multi-selectable `select`s

### Buttons

You've already seen the `<form.button type="submit">` component in the examples. If you need other buttons for other reasons among the children of your `form.form` component, then you would normally need to make sure to set `type="button"` on them (or they would also submit the form). You'd also need to handle disabling the buttons for submitted forms some other way. Instead you can simply use the `form.button` component with no type, and it will behave as you probably want:

```jsx
<form.button onclick={DoWhatever}>Click me</form.button>
```

## Advanced

### Custom Form Inputs

Perhaps the standard fields aren't enough for you and you'd like to build a more complex type of input. You can do this with the `widget` function.

You call widget with: `form.widget(name, validator, renderer)` and it will return whatever you return from `renderer`. `renderer` is called with a set of props (computed from the form-props as well as `name` and `validator`) and should return a virtual-node which may use those props.

For a concrete example have a look at [https://zaceno.github.io/hyperapp-form/#advanced/custominput](https://zaceno.github.io/hyperapp-form/#advanced/custominput)

The props that the renderer is called with are:

-   `value`: the current value for the given name,
-   `error`: the current error for the given name,
-   `Set`: an action which sets the value for the current name (give as payload)
-   `Validate`: an action which validates the given payload and sets the error maybe for the given name.
-   `disabled`: boolean if the widget should be disabled (because the form is already submitted)

> Notice you might want want to call the `Set` and `Validate` action in one go. To do that, we offer you the `form.batch` action utility. It's not form related but we use it internally so we might as well let you use it too. It defines one action from several. Dispatching `batch(a1, a2, a3)` is the same as dispatching actions a1, a2, a3 in succession (with the same payload, and no rendering in between).

### Context

The secret behind how this library works, is that the `form.form` component provides a _context_ to all the children and grandchildren. That is to say, there is an object of computed values and actions available anywhere in the tree below `form.form`. To define a component which can read the context, instead of returning a virtual-node from your component, return a function which returns the virtual-node. That function will be called with the context as argument.

```jsx
const MyFormAwareComponent = props => context => <div>...</div>
```

The context is an object with the following properties:

-   `values`: all the current values of the form
-   `SetValues`: action to set all the values of the form
-   `errors`: all the current errors of the form
-   `SetErrors`: action to set all the values of the form
-   `submitted`: wether the form has been submitted or not
-   `register`: a function for registering validators

The `register` function is how form widgets can register validators that will be called (reduced) before the form submits. A validator you register here has the signature: `currentErrors => newErrors`

One reason for using context could be to implement a more advanced
type of form-component that `widget` is not enough for. Another reason would be to implement components that visualize some calculation of the currently entered values as in this example (a box shows the color representation of the currently entered hue, saturation & lightness values): [https://zaceno.github.io/hyperapp-form/#advanced/custominfo](https://zaceno.github.io/hyperapp-form/#advanced/custominfo)

### Overriding Context

If you want more control over the widgets of a form, you can modify the context provided by using the `form.provide` function.

```js
form.provide({
    register: ...
    values: ...
    errors: ...
    submitted: ...
    SetValues: ...
    SetErrors: ...
},
 [ ...children]
)
```

Technically, `provide` is not specifically for forms, and you could use it to provide any context to any parts of your app. But if you want to control behavior of components from hyperapp-form, you need to provide a context object that looks and behaves like how they expect.

An example of this can be found here: [https://zaceno.github.io/hyperapp-form/#advanced/custombehavior](https://zaceno.github.io/hyperapp-form/#advanced/custombehavior)
