import fs from 'fs';

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import SystemBellPlugin from 'system-bell-webpack-plugin';
import React from 'react';
import ReactDOM from 'react-dom/server';

import App from './demo/App.jsx';
import pkg from './package.json';

import webpackPresets from './lib/presets';
import evaluatePresets from './lib/evaluate_presets';
import renderJSX from './lib/render_jsx.jsx';

const webpackrc = JSON.parse(fs.readFileSync('./.webpackrc', {
  encoding: 'utf-8'
}));

const RENDER_UNIVERSAL = true;

// XXX: prepush hook bug
const TARGET = process.env.npm_lifecycle_event || 'test';

process.env.BABEL_ENV = TARGET;

const commonConfig = {
  plugins: [
    new SystemBellPlugin()
  ]
};
const evaluate = evaluatePresets.bind(
  null, webpackPresets, webpackrc, TARGET, commonConfig
);

if (TARGET === 'start') {
  module.exports = evaluate({
    plugins: [
      new HtmlWebpackPlugin({
        title: pkg.name + ' - ' + pkg.description,
        templateContent: renderJSX
      })
    ]
  });
}

if (TARGET === 'gh-pages') {
  module.exports = evaluate({
    plugins: [
      new HtmlWebpackPlugin({
        title: pkg.name + ' - ' + pkg.description,
        templateContent: renderJSX.bind(
          null,
          RENDER_UNIVERSAL ? ReactDOM.renderToString(<App />) : ''
        )
      })
    ]
  });
}

module.exports = evaluate();
