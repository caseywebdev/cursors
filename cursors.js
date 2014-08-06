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

  var isEqualSubset = function (a, b) {
    for (var key in a) {
      if (key === 'cursors') continue;
      if (b[key] !== a[key]) return false;
    }
    return true;
  };

  var isEqual = function (a, b) {
    return isEqualSubset(a, b) && isEqualSubset(b, a);
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
      return !isEqual(this.props, props) || !isEqual(this.state, state);
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
        var delta = wrapWithPath(deltas[key], path);
        change.state[path[0]] = update(root.state, delta)[path[0]];
      }
      for (i = 0, l = changes.length; i < l; ++i) {
        change = changes[i];
        if (change.root.isMounted()) change.root.setState(change.state);
      }
    }
  };
});
