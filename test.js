(function (root) {
  'use strict';

  var React = root.React;
  var Cursors = root.Cursors;

  var NumberListItem = React.createClass({
    mixins: [Cursors],

    handleChange: function (ev) {
      var val = parseInt(ev.target.value) || 0;
      if (this.state.number !== val) this.update({number: {$set: val}});
    },

    handleRemove: function () {
      this.props.onRemove(this.props.key);
    },

    render: function () {
      return React.DOM.div(null,
        React.DOM.input({
          value: this.state.number,
          onChange: this.handleChange
        }),
        React.DOM.input({
          type: 'button',
          onClick: this.handleRemove,
          value: 'Remove'
        })
      );
    }
  });

  var NumberList = React.createClass({
    mixins: [Cursors],

    handleAdd: function () {
      this.update({numbers: {$push: [0]}});
    },

    handleRemove: function (i) {
      this.update({numbers: {$splice: [[i, 1]]}});
    },

    renderNumber: function (n, i) {
      return NumberListItem({
        key: i,
        cursors: {number: this.getCursor('numbers', i)},
        onRemove: this.handleRemove
      });
    },

    render: function () {
      return React.DOM.div(null,
        this.state.numbers.map(this.renderNumber),
        React.DOM.input({
          type: 'button',
          onClick: this.handleAdd,
          value: 'Add New Number'
        })
      );
    }
  });

  var Stats = React.createClass({
    mixins: [Cursors],

    getCardinality: function () {
      return this.state.numbers.length;
    },

    getSum: function () {
      return this.state.numbers.reduce(function (sum, n) {
        return sum + n;
      }, 0);
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
    mixins: [Cursors],

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
          NumberList({cursors: {numbers: this.getCursor('numbers')}}),
          Stats({cursors: {numbers: this.getCursor('numbers')}})
        )
      );
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    React.renderComponent(App(), document.body);
  });
})(this);
