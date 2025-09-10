const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    client: './public/leaderboard-client.ts',
    config: './public/client_config.ts'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/public'),
    clean: true // Cleans the output directory before emit
  },
  devtool: 'source-map'
};
