(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['react/addons'], factory);
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(require('react/addons'));
  } else {
    root.Curator = factory(root.React);
  }
})(this, function (React) {
  'use strict';

  var update = React.addons.update;

  var isEqualSubset = function (a, b) {
    for (var key in a) {
      if (key === 'cursor') continue;
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

  var getLocalState = function (cursor) {
    var state = cursor.root.state.local;
    for (var i = 0, l = cursor.path.length; state && i < l; ++i) {
      state = state[cursor.path[i]];
    }
    return state;
  };

  var getCursorState = function (cursor) {
    var state = {local: getLocalState(cursor)};
    for (var name in cursor.remotes) {
      state[name] = getLocalState(cursor.remotes[name]);
    }
    return state;
  };

  var types = React.PropTypes;

  return {
    propTypes: {
      cursor: types.shape({
        root: types.component.isRequired,
        path: types.arrayOf(types.string.isRequired).isRequired,
        remotes: types.object.isRequired
      })
    },

    componentWillMount: function () {
      this.setState(getCursorState(this.getCursor()));
    },

    componentWillReceiveProps: function (nextProps) {
      this.setState(getCursorState(nextProps.cursor));
    },

    shouldComponentUpdate: function (props, state) {
      return !isEqual(this.props, props) || !isEqual(this.state, state);
    },

    getCursor: function (path, remotes, cursor) {
      if (path == null) path = [];
      if (!remotes) remotes = {};
      if (!cursor) cursor = this.props.cursor;
      if (!cursor) cursor = {root: this, path: [], remotes: {}};

      cursor = {
        root: cursor.root,
        path: cursor.path.concat(path).map(String),
        remotes: {}
      };

      for (var name in remotes) {
        cursor.remotes[name] = this.getCursor(remotes[name], {}, cursor.root);
      }

      return cursor;
    },

    getRemoteCursor: function (name, path, remotes) {
      return this.getCursor(path, remotes, this.getCursor().remotes[name]);
    },

    update: function (delta, cursor) {
      if (!cursor) cursor = this.getCursor();
      if (cursor.root !== this) return cursor.root.update(delta, cursor);
      var updated = update(this.state.local, wrapWithPath(delta, cursor.path));
      this.setState({local: updated});
      return this;
    },

    updateRemote: function (name, delta) {
      return this.update(delta, this.getRemoteCursor(name));
    }
  };
});
