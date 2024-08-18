const path = require('path');

module.exports = {


  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      return middlewares;
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), 
    },
    extensions: ['.js', '.jsx'], 
  },

};
