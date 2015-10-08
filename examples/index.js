(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'react', 'react-dom', 'cursors', 'chart'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('react'), require('react-dom'), require('cursors'), require('chart'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.React, global.ReactDOM, global.cursors, global.Chart);
    global.index = mod.exports;
  }
})(this, function (exports, module, _react, _reactDom, _cursors, _chart) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var _React = _interopRequireDefault(_react);

  var _ReactDOM = _interopRequireDefault(_reactDom);

  var _Chart = _interopRequireDefault(_chart);

  var NumberListItem = (function (_Component) {
    _inherits(NumberListItem, _Component);

    function NumberListItem() {
      _classCallCheck(this, NumberListItem);

      _get(Object.getPrototypeOf(NumberListItem.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(NumberListItem, [{
      key: 'handleChange',
      value: function handleChange(ev) {
        var val = parseInt(ev.target.value) || 0;
        if (this.state.number !== val) this.update({ number: { $set: val } });
      }
    }, {
      key: 'handleRemove',
      value: function handleRemove() {
        this.update({ numbers: { $splice: [[this.props.index, 1]] } });
      }
    }, {
      key: 'render',
      value: function render() {
        return _React['default'].createElement(
          'div',
          null,
          _React['default'].createElement('input', { value: this.state.number, onChange: this.handleChange.bind(this) }),
          _React['default'].createElement('input', { type: 'button', value: 'Remove', onClick: this.handleRemove.bind(this) })
        );
      }
    }]);

    return NumberListItem;
  })(_cursors.Component);

  var NumberList = (function (_Component2) {
    _inherits(NumberList, _Component2);

    function NumberList() {
      _classCallCheck(this, NumberList);

      _get(Object.getPrototypeOf(NumberList.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(NumberList, [{
      key: 'handleAdd',
      value: function handleAdd() {
        this.update({ numbers: { $push: [0] } });
      }
    }, {
      key: 'renderNumber',
      value: function renderNumber(n, i) {
        return _React['default'].createElement(NumberListItem, {
          key: i,
          index: i,
          cursors: {
            numbers: this.getCursor('numbers'),
            number: this.getCursor('numbers', i)
          }
        });
      }
    }, {
      key: 'render',
      value: function render() {
        return _React['default'].createElement(
          'div',
          null,
          this.state.numbers.map(this.renderNumber.bind(this)),
          _React['default'].createElement('input', { type: 'button', value: 'Add Number', onClick: this.handleAdd.bind(this) })
        );
      }
    }]);

    return NumberList;
  })(_cursors.Component);

  var Stats = (function (_Component3) {
    _inherits(Stats, _Component3);

    function Stats() {
      _classCallCheck(this, Stats);

      _get(Object.getPrototypeOf(Stats.prototype), 'constructor', this).apply(this, arguments);
    }

    // Here's an example using Cursors.Mixin and React.createClass.

    _createClass(Stats, [{
      key: 'getCardinality',
      value: function getCardinality() {
        return this.state.numbers.length;
      }
    }, {
      key: 'getSum',
      value: function getSum() {
        return this.state.numbers.reduce(function (sum, n) {
          return sum + n;
        }, 0);
      }
    }, {
      key: 'getMean',
      value: function getMean() {
        return this.getSum() / this.getCardinality();
      }
    }, {
      key: 'render',
      value: function render() {
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
    }]);

    return Stats;
  })(_cursors.Component);

  var ChartComponent = _React['default'].createClass({
    displayName: 'ChartComponent',

    mixins: [_cursors.Mixin],

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

  var App = (function (_Component4) {
    _inherits(App, _Component4);

    function App() {
      _classCallCheck(this, App);

      _get(Object.getPrototypeOf(App.prototype), 'constructor', this).apply(this, arguments);

      this.state = {
        i: 0,
        history: [[1, 2, 3]]
      };
    }

    _createClass(App, [{
      key: 'componentDidUpdate',
      value: function componentDidUpdate(__, prev) {
        var i = prev.i;
        var before = prev.history[i];
        var after = this.state.history[i];
        if (this.state.i !== i || this.state.previewI !== prev.previewI) return;
        this.update({
          i: { $set: i + 1 },
          history: { $splice: [[i, Infinity, before, after]] }
        });
      }
    }, {
      key: 'canUndo',
      value: function canUndo() {
        return this.state.i > 0;
      }
    }, {
      key: 'canRedo',
      value: function canRedo() {
        return this.state.i < this.state.history.length - 1;
      }
    }, {
      key: 'handleUndo',
      value: function handleUndo() {
        this.update({ i: { $set: this.state.i - 1 } });
      }
    }, {
      key: 'handleRedo',
      value: function handleRedo() {
        this.update({ i: { $set: this.state.i + 1 } });
      }
    }, {
      key: 'renderHistory',
      value: function renderHistory() {
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
      }
    }, {
      key: 'render',
      value: function render() {
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
                onClick: this.handleUndo.bind(this),
                disabled: !this.canUndo()
              },
              'Undo'
            ),
            _React['default'].createElement(
              'button',
              {
                type: 'button',
                onClick: this.handleRedo.bind(this),
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
    }]);

    return App;
  })(_cursors.Component);

  module.exports = App;
});
