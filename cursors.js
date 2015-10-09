(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'react', 'react-addons-update'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('react'), require('react-addons-update'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.React, global._update);
    global.Cursors = mod.exports;
  }
})(this, function (exports, module, _react, _reactAddonsUpdate) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

  module.exports = {
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
});
