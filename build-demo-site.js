const fs = require('fs')
const path = require('path')

const ORIGINAL = path.join(__dirname, 'demo')
const SITE_FOLDER = path.join(__dirname, 'demo-standalone')
const HTML_FILE = path.join(SITE_FOLDER, 'index.html')

function copyFolderSync(from, to) {
    fs.mkdirSync(to)
    fs.readdirSync(from).forEach(element => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element))
        } else {
            copyFolderSync(path.join(from, element), path.join(to, element))
        }
    })
}

const deleteFolderRecursive = function(dirpath) {
    if (fs.existsSync(dirpath)) {
        fs.readdirSync(dirpath).forEach((file, index) => {
            const curPath = path.join(dirpath, file)
            if (fs.lstatSync(curPath).isDirectory()) {
                // recurse
                deleteFolderRecursive(curPath)
            } else {
                // delete file
                fs.unlinkSync(curPath)
            }
        })
        fs.rmdirSync(dirpath)
    }
}

const mapScript = (htmlstring, source, altname) => {
    fs.copyFileSync(__dirname + source, path.join(SITE_FOLDER, 'lib', altname))
    return htmlstring.replace(source, './lib/' + altname)
}

deleteFolderRecursive(SITE_FOLDER)
copyFolderSync(ORIGINAL, SITE_FOLDER)
fs.mkdirSync(path.join(SITE_FOLDER, 'lib'))

let htmlString = fs.readFileSync(HTML_FILE, 'utf-8')

htmlString = mapScript(
    htmlString,
    '/node_modules/es-module-shims/dist/es-module-shims.js',
    'es-module-shims.js'
)
htmlString = mapScript(
    htmlString,
    '/node_modules/hyperapp/src/index.js',
    'hyperapp.js'
)
htmlString = mapScript(
    htmlString,
    '/node_modules/htm/mini/index.module.js',
    'htm.js'
)

copyFolderSync(__dirname + '/src', path.join(SITE_FOLDER, 'lib', 'form'))
htmlString = htmlString.replace('/src/index.js', './lib/form/index.js')

fs.writeFileSync(HTML_FILE, htmlString, 'utf-8')
