import { h, text } from 'hyperapp'
export default props => ({ errors }) => {
    let msg = Object.entries(errors).reduce(
        (str, [name, error]) => str || error,
        ''
    )
    return h('p', { ...props, class: 'error', hidden: !msg }, [text(msg)])
}
