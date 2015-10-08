(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'react', 'react-addons-update'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports, require('react'), require('react-addons-update'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.React, global._update);
    global.Cursors = mod.exports;
  }
})(this, function (exports, _react, _reactAddonsUpdate) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var _React = _interopRequireDefault(_react);

  var _update2 = _interopRequireDefault(_reactAddonsUpdate);

  var size = function size(obj) {
    return Object.keys(obj).length;
  };

  var isEqualArray = function isEqualArray(a, b) {
    if (a.length !== b.length) return false;
    for (var i = 0, l = a.length; i < l; ++i) {
      if (a[i] !== b[i]) return false;
    }return true;
  };

  var isEqualObject = function isEqualObject(a, b) {
    if (size(a) !== size(b)) return false;
    for (var key in a) {
      if (a[key] !== b[key]) return false;
    }return true;
  };

  var isEqualCursor = function isEqualCursor(a, b) {
    if (a == b) return true;
    if (a == null || b == null) return false;
    if (a.root !== b.root || !isEqualArray(a.path, b.path)) return false;
    return true;
  };

  var areEqualCursors = function areEqualCursors(a, b) {
    if (a == b) return true;
    if (a == null || b == null || size(a) !== size(b)) return false;
    for (var key in a) {
      if (!isEqualCursor(a[key], b[key])) return false;
    }return true;
  };

  var wrapWithPath = function wrapWithPath(delta, path) {
    for (var i = path.length - 1; i >= 0; --i) {
      var tmp = {};
      tmp[path[i]] = delta;
      delta = tmp;
    }
    return delta;
  };

  var getCursorState = function getCursorState(cursor) {
    var state = cursor.root.state;
    for (var i = 0, l = cursor.path.length; state && i < l; ++i) {
      state = state[cursor.path[i]];
    }
    return state;
  };

  var getCursorStates = function getCursorStates(cursors) {
    var states = {};
    for (var key in cursors) {
      states[key] = getCursorState(cursors[key]);
    }return states;
  };

  var Mixin = {
    propTypes: {
      cursors: _React['default'].PropTypes.object
    },

    componentWillMount: function componentWillMount() {
      var states = getCursorStates(this.props.cursors);
      if (!this.state) this.state = {};
      for (var key in states) {
        this.state[key] = states[key];
      }
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      this.setState(getCursorStates(nextProps.cursors));
    },

    shouldComponentUpdate: function shouldComponentUpdate(props, state) {
      var delta = { cursors: { $set: null } };
      return !areEqualCursors(this.props.cursors, props.cursors) || !isEqualObject((0, _update2['default'])(this.props, delta), (0, _update2['default'])(props, delta)) || !isEqualObject(this.state, state);
    },

    getCursor: function getCursor(key, path) {
      var cursors = this.props.cursors;
      var cursor = cursors && cursors[key] || { root: this, path: [key] };
      if (path == null) return cursor;
      return { root: cursor.root, path: cursor.path.concat(path) };
    },

    update: function update(deltas) {
      var changes = [];
      for (var key in deltas) {
        var cursor = this.getCursor(key);
        var root = cursor.root;
        var path = cursor.path;
        var change = undefined;
        for (var i = 0, l = changes.length; !change && i < l; ++i) {
          if (root === changes[i].root) change = changes[i];
        }
        if (!change) changes.push(change = { root: root, state: {} });
        var delta = wrapWithPath(deltas[key], path.slice(1));
        var state = change.state[path[0]] || root.state[path[0]];
        change.state[path[0]] = (0, _update2['default'])(state, delta);
      }
      for (var i = 0, l = changes.length; i < l; ++i) {
        var change = changes[i];
        change.root.setState(change.state);
      }
    }
  };

  exports.Mixin = Mixin;

  var Component = (function (_React$Component) {
    _inherits(Component, _React$Component);

    _createClass(Component, null, [{
      key: 'propTypes',
      value: Mixin.propTypes,
      enumerable: true
    }]);

    function Component() {
      var _Mixin$componentWillMount;

      _classCallCheck(this, Component);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _get(Object.getPrototypeOf(Component.prototype), 'constructor', this).apply(this, args);
      return (_Mixin$componentWillMount = Mixin.componentWillMount).call.apply(_Mixin$componentWillMount, [this].concat(args));
    }

    _createClass(Component, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps() {
        var _Mixin$componentWillReceiveProps;

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        if (_get(Object.getPrototypeOf(Component.prototype), 'componentWillReceiveProps', this)) {
          _get(Object.getPrototypeOf(Component.prototype), 'componentWillReceiveProps', this).apply(this, args);
        }
        return (_Mixin$componentWillReceiveProps = Mixin.componentWillReceiveProps).call.apply(_Mixin$componentWillReceiveProps, [this].concat(args));
      }
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate() {
        var _Mixin$shouldComponentUpdate;

        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        if (_get(Object.getPrototypeOf(Component.prototype), 'shouldComponentUpdate', this)) {
          _get(Object.getPrototypeOf(Component.prototype), 'shouldComponentUpdate', this).apply(this, args);
        }
        return (_Mixin$shouldComponentUpdate = Mixin.shouldComponentUpdate).call.apply(_Mixin$shouldComponentUpdate, [this].concat(args));
      }
    }, {
      key: 'getCursor',
      value: function getCursor() {
        var _Mixin$getCursor;

        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        return (_Mixin$getCursor = Mixin.getCursor).call.apply(_Mixin$getCursor, [this].concat(args));
      }
    }, {
      key: 'update',
      value: function update() {
        var _Mixin$update;

        for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          args[_key5] = arguments[_key5];
        }

        return (_Mixin$update = Mixin.update).call.apply(_Mixin$update, [this].concat(args));
      }
    }]);

    return Component;
  })(_React['default'].Component);

  exports.Component = Component;
});
