import { h } from 'hyperapp'

export default (opts, content) => ({ submitted }) =>
    h(
        'button',
        {
            ...opts,
            type: opts.type || 'button',
            disabled: submitted,
        },
        content
    )
