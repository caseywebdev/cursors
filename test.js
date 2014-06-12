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
      if (this.state.local !== val) this.update({$set: val});
    },

    handleRemove: function () {
      this.props.onRemove(this.props.key);
    },

    render: function () {
      return React.DOM.div(null,
        React.DOM.input({
          value: this.state.local,
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
        cursor: this.getCursor(i),
        onRemove: this.handleRemove
      });
    },

    render: function () {
      return React.DOM.div(null,
        this.state.local.map(this.renderNumber),
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
      return this.state.local.length;
    },

    getSum: function () {
      return this.state.local.reduce(function (sum, n) { return sum + n; }, 0);
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
        local: {
          numbers: [1, 2, 3]
        },
        undo: [],
        redo: []
      };
    },

    componentDidUpdate: function (__, prevState) {
      if (prevState.undo !== this.state.undo) return;
      if (prevState.redo !== this.state.redo) return;
      this.setState({
        undo: this.state.undo.concat(prevState.local),
        redo: []
      });
    },

    handleUndo: function () {
      var undo = this.state.undo;
      if (!this.state.undo.length) return;
      this.setState({
        local: undo[undo.length - 1],
        undo: undo.slice(0, -1),
        redo: this.state.redo.concat(this.state.local)
      });
    },

    handleRedo: function () {
      var redo = this.state.redo;
      if (!this.state.redo.length) return;
      this.setState({
        local: redo[redo.length - 1],
        redo: redo.slice(0, -1),
        undo: this.state.undo.concat(this.state.local)
      });
    },

    render: function () {
      return (
        React.DOM.div(null,
          React.DOM.input({
            type: 'button',
            onClick: this.handleUndo,
            value: 'Undo',
            disabled: this.state.undo.length === 0
          }),
          React.DOM.input({
            type: 'button',
            onClick: this.handleRedo,
            value: 'Redo',
            disabled: this.state.redo.length === 0
          }),
          NumberList({cursor: this.getCursor('numbers')}),
          Stats({cursor: this.getCursor('numbers')})
        )
      );
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    React.renderComponent(App(), document.body);
  });
})(this);
