(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['react/addons'], factory);
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(require('react/addons'));
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
      var temp = {};
      temp[path[i]] = delta;
      delta = temp;
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
    for (var name in cursors) states[name] = getCursorState(cursors[name]);
    return states;
  };

  return {
    propTypes: {
      cursors: React.PropTypes.object
    },

    componentWillMount: function () {
      this.setState(getCursorStates(this.props.cursors));
    },

    componentWillReceiveProps: function (nextProps) {
      this.setState(getCursorStates(nextProps.cursors));
    },

    shouldComponentUpdate: function (props, state) {
      return !isEqual(this.props, props) || !isEqual(this.state, state);
    },

    getCursor: function (name, path) {
      if (path == null) path = [];
      var cursors = this.props.cursors;
      var cursor = (cursors && cursors[name]) || {root: this, path: [name]};
      return {
        root: cursor.root,
        path: cursor.path.concat(path),
        state: getCursorState(cursor)
      };
    },

    update: function (name, delta) {
      var cursor = this.getCursor(name);
      var root = cursor.root;
      root.setState(update(root.state, wrapWithPath(delta, cursor.path)));
    }
  };
});
