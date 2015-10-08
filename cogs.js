module.exports = {
  in: {
    es6: {
      out: 'js',
      transformers: [
        {name: 'babel', options: {modules: 'umd', stage: 0}},
        {
          name: 'replace',
          only: 'cursors.es6',
          options: {patterns: {'global.cursors =': 'global.Cursors ='}}
        }
      ]
    }
  },
  builds: {
    'cursors.es6': '.',
    'examples/index.es6': 'examples'
  }
};
