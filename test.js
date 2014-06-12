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
      var val = parseInt(ev.target.value) || 0;
      if (this.getState() !== val) this.update({$set: val});
    },

    render: function () {
      return React.DOM.div(null,
        React.DOM.input({
          value: this.getState(),
          onChange: this.handleChange
        }),
        React.DOM.input({
          type: 'button',
          onClick: this.props.onRemove,
          value: 'Remove'
        })
      );
    }
  });

  var NumberList = React.createClass({
    mixins: [Curator],

    handleAdd: function () {
      this.update({$push: [0]});
    },

    handleRemove: function (i) {
      this.update({$splice: [[i, 1]]});
    },

    renderNumber: function (n, i) {
      return NumberListItem({
        key: i,
        curator: this.getCurator(),
        cursor: this.getCursor(i),
        onRemove: this.handleRemove.bind(this, i)
      });
    },

    render: function () {
      return React.DOM.div(null,
        this.getState().map(this.renderNumber),
        React.DOM.input({
          type: 'button',
          onClick: this.handleAdd,
          value: 'Add New Number'
        })
      );
    }
  });

  var Stats = React.createClass({
    mixins: [Curator],

    getCardinality: function () {
      return this.getState().length;
    },

    getSum: function () {
      return this.getState().reduce(function (sum, n) { return sum + n; }, 0);
    },

    getMean: function () {
      return this.getSum() / this.getCardinality();
    },

    render: function () {
      return React.DOM.div(null,
        React.DOM.div(null, 'Cardinality: ' + this.getCardinality()),
        React.DOM.div(null, 'Sum: ' + this.getSum()),
        React.DOM.div(null, 'Mean: ' + this.getMean())
      );
    }
  });

  var App = React.createClass({
    mixins: [Curator],

    getInitialState: function () {
      return {
        numbers: [1, 2, 3]
      };
    },

    componentWillMount: function () {
      this.undo = [];
      this.redo = [];
    },

    componentWillUpdate: function () {
      if (this.timeTraveling) return this.timeTraveling = false;
      this.undo.push(this.state);
      this.redo = [];
    },

    handleUndo: function () {
      if (!this.undo.length) return;
      this.timeTraveling = true;
      this.redo.push(this.state);
      this.setState(this.undo.pop());
    },

    handleRedo: function () {
      if (!this.redo.length) return;
      this.timeTraveling = true;
      this.undo.push(this.state);
      this.setState(this.redo.pop());
    },

    render: function () {
      return (
        React.DOM.div(null,
          React.DOM.input({
            type: 'button',
            onClick: this.handleUndo,
            value: 'Undo',
            disabled: this.undo.length === 0
          }),
          React.DOM.input({
            type: 'button',
            onClick: this.handleRedo,
            value: 'Redo',
            disabled: this.redo.length === 0
          }),
          NumberList({
            curator: this.getCurator(),
            cursor: this.getCursor('numbers')
          }),
          Stats({
            curator: this.getCurator(),
            cursor: this.getCursor('numbers')
          })
        )
      );
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    React.renderComponent(App(), document.body);
  });
})(this);
