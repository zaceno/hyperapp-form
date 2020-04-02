import { app } from 'hyperapp'

const effect = (g => f => (...a) => [g, { f, a }])((d, { f, a }) => f(d, ...a))

export const importer = effect((dispatch, url, then) =>
    import(url).then(exports => dispatch(then, { exports, url }))
)

export const appRunner = effect((dispatch, selector, { init, view }) => {
    let node = document.querySelector(selector)
    //hydration causes bugs so...
    Array.from(node.children).forEach(child => node.removeChild(child))
    app({ init, view, node })
})

export const fetchText = effect((dispatch, url, then) =>
    fetch(url)
        .then(resp => resp.text())
        .then(text => dispatch(then, { text, url }))
)

export const highlighter = effect(() =>
    requestAnimationFrame(_ => Prism.highlightAll(document.body))
)

export const onHashChange = effect((dispatch, callback) => {
    const handler = () => dispatch(callback, window.location.hash || '')
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
})
