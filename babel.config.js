const server = {
  presets: ['@babel/preset-env', '@babel/preset-flow'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    // 'babel-plugin-dev-expression',
    '@babel/plugin-proposal-object-rest-spread',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: false,
        regenerator: true,
      },
    ],
  ],
}

const client = {
  presets: ['babel-preset-react-app'],
}

module.exports = process.env.WHICH_THING = 'server' ? server : client
