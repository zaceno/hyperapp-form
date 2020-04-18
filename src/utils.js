const effect = (g => f => (...a) => [g, { f, a }])((d, { f, a }) => f(d, ...a))

export const preventDefault = effect((_, ev) => ev.preventDefault())

export const dispatch = effect((d, a, x) => d(a, x))

export const batch = (...a) => (x, p) => [x, ...a.map(b => dispatch(b, p))]

export const provide = (props, node) =>
    Array.isArray(node)
        ? node.map(n => provide(props, n)).flat()
        : typeof node === 'function'
        ? provide(props, node(props))
        : typeof node.name === 'function'
        ? provide(props, node.name(props))
        : { ...node, children: provide(props, node.children) }
