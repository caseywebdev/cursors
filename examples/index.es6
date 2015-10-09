import React from 'react';
import ReactDOM from 'react-dom';
import Cursors from 'cursors';
import Chart from 'chart';

const NumberListItem = React.createClass({
  mixins: [Cursors],

  handleChange(ev) {
    const val = parseInt(ev.target.value) || 0;
    if (this.state.number !== val) this.update({number: {$set: val}});
  },

  handleRemove() {
    this.update({numbers: {$splice: [[this.props.index, 1]]}});
  },

  render() {
    return (
      <div>
        <input value={this.state.number} onChange={this.handleChange} />
        <input type='button' value='Remove' onClick={this.handleRemove} />
      </div>
    );
  }
});

const NumberList = React.createClass({
  mixins: [Cursors],

  handleAdd() {
    this.update({numbers: {$push: [0]}});
  },

  renderNumber(n, i) {
    return (
      <NumberListItem
        key={i}
        index={i}
        cursors={{
          numbers: this.getCursor('numbers'),
          number: this.getCursor('numbers', i)
        }}
      />
    );
  },

  render() {
    return (
      <div>
        {this.state.numbers.map(this.renderNumber)}
        <input type='button' value='Add Number' onClick={this.handleAdd} />
      </div>
    );
  }
});

const Stats = React.createClass({
  mixins: [Cursors],

  getCardinality() {
    return this.state.numbers.length;
  },

  getSum() {
    return this.state.numbers.reduce((sum, n) => sum + n, 0);
  },

  getMean() {
    return this.getSum() / this.getCardinality();
  },

  render() {
    return (
      <div>
        <div>{`Cardinality: ${this.getCardinality()}`}</div>
        <div>{`Sum: ${this.getSum()}`}</div>
        <div>{`Mean: ${this.getMean()}`}</div>
      </div>
    );
  }
});

// Here's an example using Cursors.Mixin and React.createClass.
const ChartComponent = React.createClass({
  mixins: [Cursors],

  componentDidMount() {
    this.draw();
  },

  componentDidUpdate() {
    this.draw();
  },

  draw() {
    this.chart = new Chart(ReactDOM.findDOMNode(this).getContext('2d'));
    this.chart.Line({
      labels: this.state.numbers.map((__, i) => i + 1),
      datasets: [{label: 'Numbers', data: this.state.numbers}]
    }, {animation: false});
  },

  render() {
    return <canvas key={Math.random()} />;
  }
});

export default React.createClass({
  mixins: [Cursors],

  getInitialState() {
    return {
      i: 0,
      history: [[1, 2, 3]]
    };
  },

  componentDidUpdate(__, prev) {
    const i = prev.i;
    const before = prev.history[i];
    const after = this.state.history[i];
    if (this.state.i !== i || this.state.previewI !== prev.previewI) return;
    this.update({
      i: {$set: i + 1},
      history: {$splice: [[i, Infinity, before, after]]}
    });
  },

  canUndo() {
    return this.state.i > 0;
  },

  canRedo() {
    return this.state.i < this.state.history.length - 1;
  },

  handleUndo() {
    this.update({i: {$set: this.state.i - 1}});
  },

  handleRedo() {
    this.update({i: {$set: this.state.i + 1}});
  },

  renderHistory() {
    return this.state.history.map((__, i) => {
      const delta = i - this.state.i;
      return (
        <div
          key={i}
          className={
            `history-item ${delta ? delta > 0 ? 'ahead' : 'behind' : 'now'}`
          }
          onMouseEnter={this.update.bind(this, {previewI: {$set: i}})}
          onMouseLeave={this.update.bind(this, {previewI: {$set: null}})}
          onClick={this.update.bind(this, {i: {$set: i}})}
        >
          {delta ? delta > 0 ? '+' + delta : delta : 'now'}
        </div>
      );
    });
  },

  render() {
    const previewI = this.state.previewI;
    const i = previewI == null ? this.state.i : previewI;
    return (
      <div>
        <div className='history'>
          <h1>History</h1>
          <button
            type='button'
            onClick={this.handleUndo}
            disabled={!this.canUndo()}
          >
            Undo
          </button>
          <button
            type='button'
            onClick={this.handleRedo}
            disabled={!this.canRedo()}
          >
            Redo
          </button>
          <div className='history-items'>{this.renderHistory()}</div>
        </div>
        <div className='numbers'>
          <h1>Numbers</h1>
          <NumberList cursors={{numbers: this.getCursor('history', i)}} />
          <Stats cursors={{numbers: this.getCursor('history', i)}} />
          <ChartComponent cursors={{numbers: this.getCursor('history', i)}} />
        </div>
      </div>
    );
  }
});
