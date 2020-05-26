/* eslint-disable no-undef */
function mock(app, url, data) {
    app.get(url, (request, response) => {
        response.json(data)
    })
}

const mockBookHomeData = require('./src/mock/bookHome')
const mockBookShelfData = require('./src/mock/bookShelf')
const mockBookList = require('./src/mock/bookCategoryList')
const mockBookFlatList = require('./src/mock/bookFlatList')

module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? './'
        : '/',
    devServer: {
        before(app) {
            mock(app, '/book/home', mockBookHomeData)
            mock(app, '/book/shelf', mockBookShelfData)
            mock(app, '/book/list', mockBookList)
            mock(app, '/book/flat-list', mockBookFlatList)
        },
        open: true,
        host: '192.168.0.103',
        port: 8080,
        https: false,
        proxy: {
            '/book': {
                target: 'http://192.168.0.103:8080/book',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/book': ''
                }
            },
            //http://47.99.166.157/epub2
            '/epub2': {
                target: 'http://47.99.166.157/epub2',
                ws: true,
                changOrigin: true,
                pathRewrite: {
                    '^/epub2': ''
                }
            }
        }
    },
    configureWebpack: {
        performance: {
            hints: 'warning',
            maxAssetSize: 524288,
            maxEntrypointSize: 524288
        }
    }
}
