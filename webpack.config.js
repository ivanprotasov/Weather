var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: './src/app.ts',
    output: {
        path: './bin',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    devtool: "inline-source-map",
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader']
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style", "css-loader?sourceMap!sass-loader?sourceMap")
            }
        ]
    },plugins: [
        new ExtractTextPlugin("bundle.css")
    ]
};