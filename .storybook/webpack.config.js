const path = require("path");
const TSDocgenPlugin = require("react-docgen-typescript-webpack-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { TypedCssModulesPlugin } = require('typed-css-modules-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const packageName = require('../package.json').name;
const { resolve } = require('path');

const SRC_PATH = path.join(__dirname, '../src');
const STORIES_PATH = path.join(__dirname, '../stories');
console.log(resolve(SRC_PATH))
module.exports = {
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: [SRC_PATH, STORIES_PATH],
                exclude: [resolve(__dirname, "../node_modules")],
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            getCustomTransformers: () => ({
                                before: [tsImportPluginFactory({
                                    libraryName: 'antd',
                                    libraryDirectory: 'es',
                                    style: 'css',
                                })]
                            }),
                            compilerOptions: {
                                module: 'es2015'
                            }
                        },
                    },
                    { loader: require.resolve('react-docgen-typescript-loader') }
                ]
            },
            {
                test: /\.css$/,
                include: resolve(SRC_PATH),
                use: [MiniCssExtractPlugin.loader, {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                    },
                }]
            },
            {
                test: /\.less$/,
                include: resolve(SRC_PATH),
                use: [MiniCssExtractPlugin.loader, {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                    },
                }, "less-loader"]
            },
            {
                test: /\.css$/,
                exclude: resolve(SRC_PATH),
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.less$/,
                exclude: resolve(SRC_PATH),
                use: [MiniCssExtractPlugin.loader, 'css-loader', "less-loader"]
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]"
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new TypedCssModulesPlugin({
            globPattern: path.join(SRC_PATH, 'components/**/*.css'),
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new TSDocgenPlugin()
    ],
    devtool: "source-map",
    resolve: {
        extensions: [".js", ".ts", ".tsx", ".css", "png", ".svg", "jpg"],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: path.resolve(__dirname, '../.storybook/tsconfig.json'),
            })
        ]
    }
};