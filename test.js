(function (root) {
  'use strict';

  var React = root.React;
  var Curator = root.Curator;

  var NumberListItem = React.createClass({
    mixins: [Curator],

    renderNumber: function (n, i) {
      return NumberListItem({
        curator: this.getCurator(),
        cursor: this.getCursor(i)
      });
    },

    handleChange: function (ev) {
      this.update({$set: parseInt(ev.target.value) || 0});
    },

    render: function () {
      return React.DOM.input({
        value: this.getState(),
        onChange: this.handleChange
      });
    }
  });

  var NumberList = React.createClass({
    mixins: [Curator],

    renderNumber: function (n, i) {
      return NumberListItem({
        curator: this.getCurator(),
        cursor: this.getCursor(i)
      });
    },

    render: function () {
      return React.DOM.div(null, this.getState().map(this.renderNumber));
    }
  });

  var Stats = React.createClass({
    mixins: [Curator],

    getSum: function () {
      return this.getState().reduce(function (sum, n) { return sum + n; }, 0);
    },

    render: function () {
      return React.DOM.div(null, 'Sum: ' + this.getSum());
    }
  });

  var App = React.createClass({
    mixins: [Curator],

    getInitialState: function () {
      return {
        numbers: [1, 2, 3]
      };
    },

    render: function () {
      return (
        React.DOM.div(null, [
          NumberList({
            curator: this.getCurator(),
            cursor: this.getCursor('numbers')
          }),
          Stats({
            curator: this.getCurator(),
            cursor: this.getCursor('numbers')
          })
        ])
      );
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    React.renderComponent(App(), document.body);
  });
})(this);
