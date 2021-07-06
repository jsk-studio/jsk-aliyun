const path = require('path')
module.exports = {
    mode: 'none',
    entry: {
      index: './src/index.ts',
    },
    optimization: {
      nodeEnv: process.env.NODE_ENV,
    },
    output: {
      filename: '[name].js',
      path: path.resolve('./build'),
      libraryTarget: 'commonjs',
    },
    target: 'node',
    resolve: {
      extensions: ['scss', 'css', '.ts', '.tsx', '.js', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'awesome-typescript-loader',
            },
          ],
        },
      ],
    },
}
  