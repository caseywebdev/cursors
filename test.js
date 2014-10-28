(function (root) {
  'use strict';

  var React = root.React;
  var Cursors = root.Cursors;
  var Chart = root.Chart;

  var NumberListItem = React.createFactory(React.createClass({
    mixins: [Cursors],

    handleChange: function (ev) {
      var val = parseInt(ev.target.value) || 0;
      if (this.state.number !== val) this.update({number: {$set: val}});
    },

    handleRemove: function () {
      this.props.onRemove(this.props.key);
    },

    render: function () {
      return React.createElement('div', null,
        React.createElement('input', {
          value: this.state.number,
          onChange: this.handleChange
        }),
        React.createElement('input', {
          type: 'button',
          onClick: this.handleRemove,
          value: 'Remove'
        })
      );
    }
  }));

  var NumberList = React.createFactory(React.createClass({
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
      return React.createElement('div', null,
        this.state.numbers.map(this.renderNumber),
        React.createElement('input', {
          type: 'button',
          onClick: this.handleAdd,
          value: 'Add New Number'
        })
      );
    }
  }));

  var Stats = React.createFactory(React.createClass({
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
      return React.createElement('div', null,
        React.createElement('div', null,
          'Cardinality: ' + this.getCardinality()
        ),
        React.createElement('div', null, 'Sum: ' + this.getSum()),
        React.createElement('div', null, 'Mean: ' + this.getMean())
      );
    }
  }));

  var ChartComponent = React.createFactory(React.createClass({
    mixins: [Cursors],

    componentDidMount: function () {
      this.chart = new Chart(this.getDOMNode().getContext('2d'));
      this.draw();
    },

    componentDidUpdate: function () {
      this.draw();
    },

    draw: function () {
      this.chart.Line({
        labels: this.state.numbers.map(function (__, i) { return i + 1; }),
        datasets: [{label: 'Numbers', data: this.state.numbers}]
      }, {animation: false});
    },

    render: function () {
      return React.createElement('canvas');
    }
  }));

  var App = React.createFactory(React.createClass({
    mixins: [Cursors],

    getInitialState: function () {
      return {
        i: 0,
        history: [[1, 2, 3]],
      };
    },

    componentDidUpdate: function (__, prev) {
      var i = prev.i;
      var before = prev.history[i];
      var after = this.state.history[i];
      if (this.state.i !== i || this.state.previewI !== prev.previewI) return;
      this.update({
        i: {$set: i + 1},
        history: {$splice: [[i, Infinity, before, after]]}
      });
    },

    canUndo: function () {
      return this.state.i > 0;
    },

    canRedo: function () {
      return this.state.i < this.state.history.length - 1;
    },

    handleUndo: function () {
      this.update({i: {$set: this.state.i - 1}});
    },

    handleRedo: function () {
      this.update({i: {$set: this.state.i + 1}});
    },

    renderHistory: function () {
      return this.state.history.map(function (__, i) {
        var delta = i - this.state.i;
        return React.createElement('div', {
          key: i,
          className: 'history-item ' +
            (delta ? delta > 0 ? 'ahead' : 'behind' : 'now'),
          onMouseEnter: this.update.bind(this, {previewI: {$set: i}}),
          onMouseLeave: this.update.bind(this, {previewI: {$set: null}}),
          onClick: this.update.bind(this, {i: {$set: i}})
        }, delta ? delta > 0 ? '+' + delta : delta : 'now');
      }, this);
    },

    render: function () {
      var previewI = this.state.previewI;
      var i = previewI == null ? this.state.i : previewI;
      return (
        React.createElement('div', null,
          React.createElement('div', {className: 'history'},
            React.createElement('h1', null, 'History'),
            React.createElement('button', {
              type: 'button',
              onClick: this.handleUndo,
              disabled: !this.canUndo()
            }, 'Undo'),
            React.createElement('button', {
              type: 'button',
              onClick: this.handleRedo,
              disabled: !this.canRedo()
            }, 'Redo'),
            React.createElement('div', {className: 'history-items'},
              this.renderHistory()
            )
          ),
          React.createElement('div', {className: 'numbers'},
            React.createElement('h1', null, 'Numbers'),
            NumberList({cursors: {numbers: this.getCursor('history', i)}}),
            Stats({cursors: {numbers: this.getCursor('history', i)}}),
            ChartComponent({cursors: {numbers: this.getCursor('history', i)}})
          )
        )
      );
    }
  }));

  document.addEventListener('DOMContentLoaded', function () {
    React.render(App(), document.body);
  });
})(this);
