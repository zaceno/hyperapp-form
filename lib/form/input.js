import { h } from 'hyperapp'
import check from './check.js'
import radio from './radio.js'
import widget from './widget.js'
import batch from './batch.js'
export default opts =>
    opts.type === 'checkbox'
        ? check(opts)
        : opts.type === 'radio'
        ? radio(opts)
        : widget(
              opts.name,
              opts.validator,
              ({ value, error, disabled, Set, Validate }) =>
                  h('input', {
                      ...opts,
                      disabled,
                      type: opts.type || 'text',
                      class: [opts.class, { error: !!error }],
                      value: value,
                      oninput: (_, ev) => [
                          batch(Set, Validate),
                          ev.target.value,
                      ],
                      ...(value === undefined
                          ? {}
                          : { onblur: [Validate, value] }),
                  })
          )
