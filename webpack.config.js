const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        main: path.resolve(__dirname, "./index.js")
    },
    output: {
        path: path.resolve(__dirname, "./www"),
        publicPath: "/",
        filename: "[name]-[contenthash].js"
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [{
                    loader: "babel-loader"
                }]
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            title: "Color recipe performance",
            contentBase: path.resolve(__dirname, "./www")
        })
    ]
}
