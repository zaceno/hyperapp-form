import { h } from 'hyperapp'
import widget from './widget.js'
import batch from './batch.js'

export default (opts, options) =>
    widget(
        opts.name,
        opts.validator,
        ({ value, error, disabled, Set, Validate }) =>
            h(
                'select',
                {
                    ...opts,
                    class: [opts.class, { error }],
                    name: opts.name,
                    value,
                    disabled,
                    oninput: [batch(Set, Validate), ev => ev.target.value],
                },
                options.map(o =>
                    o.name === 'option' &&
                    value &&
                    (o.props.value === value || o.children[0].name === value)
                        ? {
                              ...o,
                              props: {
                                  ...o.props,
                                  selected: true,
                              },
                          }
                        : o
                )
            )
    )
