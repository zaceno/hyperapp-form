import { app } from 'hyperapp'
import html from 'html'
import { fetchText, highlighter, onHashChange } from './effects.js'

const hashToExampleUrl = (hash, m = hash.match(/^#([a-z]+\/[a-z]+)$/)) =>
    !m ? null : `./examples/${m[1]}.js`

const SetURL = (state, hash, url = hashToExampleUrl(hash)) => [
    { url, code: '' },
    !!url && fetchText(url, GotCode),
]
const GotCode = (state, { text: code, url }) =>
    state.url !== url ? state : [{ url, code }, highlighter()]

app({
    init: SetURL(null, window.location.hash),
    view: ({ code, url }) => html`
        <section id="code">
            ${code &&
                html`
                    <pre>
                    <code key=${url} class="language-js">
                        ${code}
                    </code>
                </pre>
                `}
        </section>
    `,
    subscriptions: state => [onHashChange(SetURL)],
    node: document.querySelector('section#code'),
})
