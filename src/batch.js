import { dispatch } from './effects.js'
export default (...a) => (x, p) => [x, ...a.map(b => dispatch(b, p))]
