const EXAMPLES = {
    '#submitting': 'examples/flow/submitting.js',
    '#validating': 'examples/flow/validating.js',
    '#initvals': 'examples/flow/initvals.js',
    '#initerrors': 'examples/flow/initerrors.js',

    '#radios': 'examples/components/radios.js',
    '#checkboxes': 'examples/components/checkboxes.js',
    '#select': 'examples/components/select.js',

    '#register': 'examples/examples/register.js',
    '#login': 'examples/examples/login.js',
    '#profile': 'examples/examples/profile.js',

    '#custominput': 'examples/advanced/custominput.js',
    '#custominfo': 'examples/advanced/custominfo.js',
    '#custombehavior': 'examples/advanced/custombehavior.js',

    '#simplest': 'examples/old/simplest.js',
    '#advanced': 'examples/old/advanced.js',
    '#newsletter': 'examples/old/newsletter.js',
    '#styling': 'examples/old/styling.js',
}

const current = () => EXAMPLES[window.location.hash] || null
const _watch = (dispatch, { callback }) => {
    const handler = () => dispatch(callback, current())
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
}
const watch = callback => [_watch, { callback }]

export { current, watch }
