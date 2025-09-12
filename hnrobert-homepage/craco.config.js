module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          stream: require.resolve("stream-browserify"),
        },
      },
    },
  },
  devServer: {
    hot: false,
    webSocketServer: false,
  },
};
