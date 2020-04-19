const provide = (props, node) =>
    Array.isArray(node)
        ? node.map(n => provide(props, n)).flat()
        : typeof node === 'function'
        ? provide(props, node(props))
        : typeof node.name === 'function'
        ? provide(props, node.name(props))
        : { ...node, children: provide(props, node.children) }

export default provide
