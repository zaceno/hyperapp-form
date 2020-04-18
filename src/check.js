import { h } from 'hyperapp'
import widget from './widget.js'
import { batch } from './utils.js'

export default opts =>
    widget(
        opts.name,
        opts.validator,
        (
            { value, error, disabled, Set, Validate },
            myval = opts.value || 'on'
        ) =>
            h('input', {
                ...opts,
                type: 'checkbox',
                class: [opts.class, { error }],
                disabled,
                checked: Array.isArray(value)
                    ? value.indexOf(myval) >= 0
                    : value === myval,
                name: opts.name,
                value: myval,
                onchange: [
                    batch(Set, Validate),
                    (
                        ev,
                        nval = [
                            ...(!value
                                ? []
                                : Array.isArray(value)
                                ? value
                                : [value]
                            ).filter(x => x !== myval),
                            ...(ev.target.checked ? [myval] : []),
                        ]
                    ) =>
                        nval.length > 1
                            ? nval
                            : nval.length == 1
                            ? nval[0]
                            : '',
                ],
            })
    )
