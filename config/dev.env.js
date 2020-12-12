'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_ROOT: '"http://localhost:8080"' 
  // API_ROOT: '" http://192.168.1.2:8080"' 
})
