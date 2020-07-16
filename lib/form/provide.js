const provide = (props, node) =>
    !node ? node
    : Array.isArray(node) ? node.map(n => provide(props, n)).flat()
    : typeof node === 'function' ? provide(props, node(props))
    : node.children ? { ...node, children: provide(props, node.children) }
    : node

export default provide
