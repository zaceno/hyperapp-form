const effect = (g => f => (...a) => [g, { f, a }])((d, { f, a }) => f(d, ...a))

export const preventDefault = effect((_, ev) => ev.preventDefault())

export const dispatch = effect((d, a, x) => d(a, x))
