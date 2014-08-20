(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['react'], factory);
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(require('react'));
  } else {
    root.Cursors = factory(root.React);
  }
})(this, function (React) {
  'use strict';

  var update = React.addons.update;

  var size = function (obj) {
    var l = 0;
    for (var key in obj) ++l;
    return l;
  };

  var isEqualArray = function (a, b) {
    if (a.length !== b.length) return false;
    for (var i = 0, l = a.length; i < l; ++i) if (a[i] !== b[i]) return false;
    return true;
  };

  var isEqualObject = function (a, b) {
    if (size(a) !== size(b)) return false;
    for (var key in a) if (a[key] !== b[key]) return false;
    return true;
  };

  var isEqualCursor = function (a, b) {
    if (a == b) return true;
    if (a == null || b == null) return false;
    if (a.root !== b.root || !isEqualArray(a.path, b.path)) return false;
    return true;
  };

  var areEqualCursors = function (a, b) {
    if (a == b) return true;
    if (a == null || b == null || size(a) !== size(b)) return false;
    for (var key in a) if (!isEqualCursor(a[key], b[key])) return false;
    return true;
  };

  var wrapWithPath = function (delta, path) {
    for (var i = path.length - 1; i >= 0; --i) {
      var tmp = {};
      tmp[path[i]] = delta;
      delta = tmp;
    }
    return delta;
  };

  var getCursorState = function (cursor) {
    var state = cursor.root.state;
    for (var i = 0, l = cursor.path.length; state && i < l; ++i) {
      state = state[cursor.path[i]];
    }
    return state;
  };

  var getCursorStates = function (cursors) {
    var states = {};
    for (var key in cursors) states[key] = getCursorState(cursors[key]);
    return states;
  };

  return {
    propTypes: {
      cursors: React.PropTypes.object
    },

    componentWillMount: function () {
      var states = getCursorStates(this.props.cursors);
      if (!this.state) this.state = {};
      for (var key in states) this.state[key] = states[key];
    },

    componentWillReceiveProps: function (nextProps) {
      this.setState(getCursorStates(nextProps.cursors));
    },

    shouldComponentUpdate: function (props, state) {
      var delta = {cursors: {$set: null}};
      return !areEqualCursors(this.props.cursors, props.cursors) ||
        !isEqualObject(update(this.props, delta), update(props, delta)) ||
        !isEqualObject(this.state, state);
    },

    getCursor: function (key, path) {
      var cursors = this.props.cursors;
      var cursor = (cursors && cursors[key]) || {root: this, path: [key]};
      if (path == null) return cursor;
      return {root: cursor.root, path: cursor.path.concat(path)};
    },

    update: function (deltas) {
      var i, l, change;
      var changes = [];
      for (var key in deltas) {
        var cursor = this.getCursor(key);
        var root = cursor.root;
        var path = cursor.path;
        for (i = 0, l = changes.length, change = null; !change && i < l; ++i) {
          if (root === changes[i].root) change = changes[i];
        }
        if (!change) changes.push(change = {root: root, state: {}});
        var delta = wrapWithPath(deltas[key], path.slice(1));
        change.state[path[0]] = update(root.state[path[0]], delta);
      }
      for (i = 0, l = changes.length; i < l; ++i) {
        change = changes[i];
        if (change.root.isMounted()) change.root.setState(change.state);
      }
    }
  };
});
