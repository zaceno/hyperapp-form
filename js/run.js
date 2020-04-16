import { app } from 'hyperapp'
import { appRunner, importer, onHashChange } from './effects.js'

const hashToExampleUrl = (hash, m = hash.match(/^#([a-z]+\/[a-z]+)$/)) =>
    m ? `../examples/${m[1]}.js` : null

const Import = (state, hash, url = hashToExampleUrl(hash)) => [
    url,
    !!url && importer(url, Start),
]

const Start = (state, { exports, url }) =>
    state !== url ? state : [url, appRunner('main#run', exports)]

app({
    init: Import(null, window.location.hash),
    subscriptions: state => [onHashChange(Import)],
})
