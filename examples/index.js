(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'react', 'react-dom', 'cursors', 'chart'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('react'), require('react-dom'), require('cursors'), require('chart'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.React, global.ReactDOM, global.Cursors, global.Chart);
    global.index = mod.exports;
  }
})(this, function (exports, module, _react, _reactDom, _cursors, _chart) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _React = _interopRequireDefault(_react);

  var _ReactDOM = _interopRequireDefault(_reactDom);

  var _Cursors = _interopRequireDefault(_cursors);

  var _Chart = _interopRequireDefault(_chart);

  var NumberListItem = _React['default'].createClass({
    displayName: 'NumberListItem',

    mixins: [_Cursors['default']],

    handleChange: function handleChange(ev) {
      var val = parseInt(ev.target.value) || 0;
      if (this.state.number !== val) this.update({ number: { $set: val } });
    },

    handleRemove: function handleRemove() {
      this.update({ numbers: { $splice: [[this.props.index, 1]] } });
    },

    render: function render() {
      return _React['default'].createElement(
        'div',
        null,
        _React['default'].createElement('input', { value: this.state.number, onChange: this.handleChange }),
        _React['default'].createElement('input', { type: 'button', value: 'Remove', onClick: this.handleRemove })
      );
    }
  });

  var NumberList = _React['default'].createClass({
    displayName: 'NumberList',

    mixins: [_Cursors['default']],

    handleAdd: function handleAdd() {
      this.update({ numbers: { $push: [0] } });
    },

    renderNumber: function renderNumber(n, i) {
      return _React['default'].createElement(NumberListItem, {
        key: i,
        index: i,
        cursors: {
          numbers: this.getCursor('numbers'),
          number: this.getCursor('numbers', i)
        }
      });
    },

    render: function render() {
      return _React['default'].createElement(
        'div',
        null,
        this.state.numbers.map(this.renderNumber),
        _React['default'].createElement('input', { type: 'button', value: 'Add Number', onClick: this.handleAdd })
      );
    }
  });

  var Stats = _React['default'].createClass({
    displayName: 'Stats',

    mixins: [_Cursors['default']],

    getCardinality: function getCardinality() {
      return this.state.numbers.length;
    },

    getSum: function getSum() {
      return this.state.numbers.reduce(function (sum, n) {
        return sum + n;
      }, 0);
    },

    getMean: function getMean() {
      return this.getSum() / this.getCardinality();
    },

    render: function render() {
      return _React['default'].createElement(
        'div',
        null,
        _React['default'].createElement(
          'div',
          null,
          'Cardinality: ' + this.getCardinality()
        ),
        _React['default'].createElement(
          'div',
          null,
          'Sum: ' + this.getSum()
        ),
        _React['default'].createElement(
          'div',
          null,
          'Mean: ' + this.getMean()
        )
      );
    }
  });

  // Here's an example using Cursors.Mixin and React.createClass.
  var ChartComponent = _React['default'].createClass({
    displayName: 'ChartComponent',

    mixins: [_Cursors['default']],

    componentDidMount: function componentDidMount() {
      this.draw();
    },

    componentDidUpdate: function componentDidUpdate() {
      this.draw();
    },

    draw: function draw() {
      this.chart = new _Chart['default'](_ReactDOM['default'].findDOMNode(this).getContext('2d'));
      this.chart.Line({
        labels: this.state.numbers.map(function (__, i) {
          return i + 1;
        }),
        datasets: [{ label: 'Numbers', data: this.state.numbers }]
      }, { animation: false });
    },

    render: function render() {
      return _React['default'].createElement('canvas', { key: Math.random() });
    }
  });

  module.exports = _React['default'].createClass({
    displayName: 'index',

    mixins: [_Cursors['default']],

    getInitialState: function getInitialState() {
      return {
        i: 0,
        history: [[1, 2, 3]]
      };
    },

    componentDidUpdate: function componentDidUpdate(__, prev) {
      var i = prev.i;
      var before = prev.history[i];
      var after = this.state.history[i];
      if (this.state.i !== i || this.state.previewI !== prev.previewI) return;
      this.update({
        i: { $set: i + 1 },
        history: { $splice: [[i, Infinity, before, after]] }
      });
    },

    canUndo: function canUndo() {
      return this.state.i > 0;
    },

    canRedo: function canRedo() {
      return this.state.i < this.state.history.length - 1;
    },

    handleUndo: function handleUndo() {
      this.update({ i: { $set: this.state.i - 1 } });
    },

    handleRedo: function handleRedo() {
      this.update({ i: { $set: this.state.i + 1 } });
    },

    renderHistory: function renderHistory() {
      var _this = this;

      return this.state.history.map(function (__, i) {
        var delta = i - _this.state.i;
        return _React['default'].createElement(
          'div',
          {
            key: i,
            className: 'history-item ' + (delta ? delta > 0 ? 'ahead' : 'behind' : 'now'),
            onMouseEnter: _this.update.bind(_this, { previewI: { $set: i } }),
            onMouseLeave: _this.update.bind(_this, { previewI: { $set: null } }),
            onClick: _this.update.bind(_this, { i: { $set: i } })
          },
          delta ? delta > 0 ? '+' + delta : delta : 'now'
        );
      });
    },

    render: function render() {
      var previewI = this.state.previewI;
      var i = previewI == null ? this.state.i : previewI;
      return _React['default'].createElement(
        'div',
        null,
        _React['default'].createElement(
          'div',
          { className: 'history' },
          _React['default'].createElement(
            'h1',
            null,
            'History'
          ),
          _React['default'].createElement(
            'button',
            {
              type: 'button',
              onClick: this.handleUndo,
              disabled: !this.canUndo()
            },
            'Undo'
          ),
          _React['default'].createElement(
            'button',
            {
              type: 'button',
              onClick: this.handleRedo,
              disabled: !this.canRedo()
            },
            'Redo'
          ),
          _React['default'].createElement(
            'div',
            { className: 'history-items' },
            this.renderHistory()
          )
        ),
        _React['default'].createElement(
          'div',
          { className: 'numbers' },
          _React['default'].createElement(
            'h1',
            null,
            'Numbers'
          ),
          _React['default'].createElement(NumberList, { cursors: { numbers: this.getCursor('history', i) } }),
          _React['default'].createElement(Stats, { cursors: { numbers: this.getCursor('history', i) } }),
          _React['default'].createElement(ChartComponent, { cursors: { numbers: this.getCursor('history', i) } })
        )
      );
    }
  });
});
