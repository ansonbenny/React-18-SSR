import path from 'path'
import fs from 'fs'
import express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'

import App from '../src/App'

const PORT = 3000
const app = express()

app.use('/build', express.static('build'))

app.get('/*', (req, res, next) => {
    if (req.url !== '/') {
        return next();
    }
    
    const context = {}

    const app = ReactDOMServer.renderToString(
        <StaticRouter location={req.url} context={context}>
            <App />
        </StaticRouter>
    )

    const indexFile = path.resolve('./build/index.html')
    fs.readFile(indexFile, 'utf-8', (err, data) => {
        if (err) {
            console.log("Error")
            return res.status(500).send('oops error')
        } else {
            return res.send(data.replace('<div id="root"></div>', `<div id="root">${app}</div>`))
        }
    })
})

app.use(express.static(path.resolve(__dirname, '../build')));

app.listen(PORT, () =>
    console.log('Express server is running on localhost:3000')
)