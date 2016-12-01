var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/js/app.ts',
    output: {
        path: './build',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    devtool: "inline-eval-source-map",
    module: {
        preLoaders: [
            {
                test: /\.ts$/,
                loader: 'tslint-loader'
            }
        ],
        loaders: [
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader?sourceMap']
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style", "css-loader?sourceMap!sass-loader?sourceMap")
            }
        ]
    },
    tslint: {
        configuration: {
            rules: {
                "class-name": true,
                "comment-format": [true, "check-space"],
                "indent": [true, "spaces"],
                "no-duplicate-variable": true,
                "no-eval": true,
                "no-any": true,
                "no-internal-module": true,
                "no-trailing-whitespace": true,
                "no-var-keyword": true,
                "one-line": [true, "check-open-brace", "check-whitespace"],
                "semicolon": false,
                "triple-equals": [true, "allow-null-check"],
                "typedef-whitespace": [true, {
                    "call-signature": "nospace",
                    "index-signature": "nospace",
                    "parameter": "nospace",
                    "property-declaration": "nospace",
                    "variable-declaration": "nospace"
                }],
                "variable-name": [true, "ban-keywords"],
                "whitespace": [true,
                    "check-branch",
                    "check-decl",
                    "check-operator",
                    "check-separator",
                    "check-type"
                ]
            }
        }
    },
    plugins: [
        new ExtractTextPlugin("bundle.css"),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            favicon: 'src/favicon.ico',
            'files': {'ico':['favicon.ico']}
        })
    ]
};