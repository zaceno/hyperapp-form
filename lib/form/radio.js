import { h } from 'hyperapp'
import widget from './widget.js'
import { batch } from './utils.js'

export default opts =>
    widget(
        opts.name,
        opts.validator,
        ({ value, error, disabled, Set, Validate }) =>
            h('input', {
                ...opts,
                type: 'radio',
                class: [opts.class, { error }],
                value: opts.value || 'on',
                disabled,
                checked: value === (opts.value || 'on'),
                onchange: [batch(Set, Validate), opts.value || 'on'],
            })
    )
