const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

module.exports = {
    mode: "development",
    devtool: 'cheap-module-source-map',
    entry: {
        popup: path.resolve("./src/popup/popup.tsx"),
        options: path.resolve("./src/options/options.tsx"),
        background: path.resolve("./src/background/background.ts"),
        contentScript: path.resolve("./src/contentScript/contentScript.ts"),
        newTab: path.resolve("./src/tabs/index.tsx")
    },
    module: {
        rules:[
            {
                use: "ts-loader",
                exclude: /node_modules/,
                test: /\.tsx$/
            },
            {
              test: /\.(png|jpe?g|gif|svg)$/i,
              type: 'asset/resource', // This will handle image files
            },
            {
                use: ["style-loader", "css-loader",{
                loader: "postcss-loader",
                options: {
                    postcssOptions: {
                        ident: 'postcss',
                        plugins: [
                            require("tailwindcss"),
                            require("autoprefixer"),
                        ]
                    },
                }
                }],
                test: /\.css$/
            },
            {
              test: /\.(png|svg|jpg|jpeg|gif|tff|woff|woff2)$/i,
              type: 'asset/resource',
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: path.resolve('src/static/manifest.json'),
                to: path.resolve('dist') 
            },
            {
                from: path.resolve('src/static/icon.webp'),
                to: path.resolve('dist')
            }
            ]
        }),
        ...getHtmlPlugins([
            'popup',
            'options',
            'newTab'
        ])
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js"] // to specify the extensions of the files to be compiled
    },
    output: {
        filename: '[name].js',
        assetModuleFilename: 'images/[hash][ext][query]', // Custom directory for images
    },
    optimization: {
        splitChunks: {
          // include all types of chunks
          chunks: 'all',
        },
      },
}

function getHtmlPlugins(chunks){
    return chunks.map(chunk => new HtmlPlugin({
        title: 'Online Shopping Assistant',
        filename: `${chunk}.html`,
        chunks: [chunk]
    }))
}