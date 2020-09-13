const path = require('path');
const webpack = require('webpack');
const config = require('./config');
const postcssrc = require('./postcss.config')
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = (env) => {
    
	let outPath;
	if (env && env.path) {
		outPath = path.resolve(env.path, 'static');
	} else {
		outPath = path.resolve(__dirname, 'dist/static');
    }
    
    return {
        entry: {
            'famous-teacher':'./src/js/init.js'
        },
        output: {
            path: outPath,
            filename: '[name]-bundle.js',
            publicPath: config['PUBLIC_PATH'],
            chunkFilename: 'jiguang-cet-[chunkhash].js',
        },
        resolve: {
            alias: {
                vue: 'vue/dist/vue.js'
            },
            mainFiles: ['index', 'page', 'widget']
        },
        module: {
            rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },{
                test:/\.scss$/,
                use:['style-loader','css-loader',{loader: 'postcss-loader',options:{plugins:postcssrc.plugins,sourceMap:true,parser: 'postcss-scss'}},'sass-loader']
            }, {
                test: /\.(tpl)$/,
                use: {
                    loader: 'html-loader'
                }
            }, {
                test: /\.(jpeg)|(jpg)|(svg)|(png)|(gif)|(mp3)|(eot)$/,
                use: ['file-loader']
            }, {
		    	test: /\.js$/,
		    	exclude: /(node_modules|bower_components)/,
		    	use: {
		        	loader: 'babel-loader',
		        	options: {
                        presets: ['env'],
                        plugins: ['transform-object-rest-spread']
		        	}
		    	}
		    },{
                test: /\.vue$/,
                loader: 'vue-loader',
            }]
        },
        plugins: (function () {
            var plugins = [
                new HtmlWebpackPlugin({
                    template: './src/html/index.html',
                    filename: '../famous-teacher-fe.html',
                    inject: false
                })
            ];
            new webpack.ProvidePlugin({
                Vue: 'vue'
             })
            if (config['WEBPACK_BUILD_UGLIFY']) {
                plugins.push(new webpack.optimize.UglifyJsPlugin({}));
            }
            return plugins;
        })()
    };
};