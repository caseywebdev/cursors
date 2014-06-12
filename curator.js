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
    for (var key in a) if (b[key] !== a[key]) return false;
    return true;
  };

  var isEqual = function (a, b) {
    return isEqualSubset(a, b) && isEqualSubset(b, a);
  };

  var wrapDeltaWithCursor = function (delta, cursor) {
    for (var i = cursor.length - 1; i >= 0; --i) {
      var temp = {};
      temp[cursor[i]] = delta;
      delta = temp;
    }
    return delta;
  };

  return {
    propTypes: {
      curator: React.PropTypes.component,
      cursor: React.PropTypes.arrayOf(React.PropTypes.string)
    },

    shouldComponentUpdate: function (props, state) {
      return !isEqual(this.props, props) || !isEqual(this.state, state);
    },

    getCurator: function () {
      return this.props.curator || this;
    },

    getCursor: function (i, cursor) {
      if (!cursor) cursor = this.props.cursor || [];
      return i == null ? cursor : cursor.concat(i).map(String);
    },

    getState: function (cursor) {
      if (!cursor) cursor = this.getCursor();
      var state = this.props.curator.state;
      for (var i = 0, l = cursor.length; i < l; ++i) state = state[cursor[i]];
      return state;
    },

    update: function (delta, cursor) {
      if (!cursor) cursor = this.getCursor();
      var curator = this.props.curator;
      if (curator) return curator.update(delta, cursor);
      this.setState(update(this.state, wrapDeltaWithCursor(delta, cursor)));
      return this;
    }
  };
});
