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

  return {
    propTypes: {
      curator: React.PropTypes.component,
      cursor: React.PropTypes.arrayOf(React.PropTypes.string)
    },

    shouldComponentUpdate: function (props, state) {
      return !isEqual(this.props, props) || !isEqual(this.state, state);
    },

    update: function (delta, cursor) {
      if (!cursor) cursor = this.props.cursor;
      var curator = this.props.curator;
      if (curator) return curator.update(delta, cursor);
      this.setState(update(this.state, delta));
    },

    getState: function (cursor) {
      if (!cursor) cursor = this.props.cursor;
      var state = this.props.curator.state;
      for (var i = 0, l = cursor.length; i < l; ++i) state = state[cursor[i]];
      return state;
    },

    getCursor: function (i, cursor) {
      return (cursor || this.props.cursor).concat('' + i);
    }
  };
});
