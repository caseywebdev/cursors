import React from 'react';
import update from 'react-addons-update';

const size = obj => Object.keys(obj).length;

const isEqualArray = (a, b) => {
  if (a.length !== b.length) return false;
  for (let i = 0, l = a.length; i < l; ++i) if (a[i] !== b[i]) return false;
  return true;
};

const isEqualObject = (a, b) => {
  if (size(a) !== size(b)) return false;
  for (const key in a) if (a[key] !== b[key]) return false;
  return true;
};

const isEqualCursor = function (a, b) {
  if (a == b) return true;
  if (a == null || b == null) return false;
  if (a.root !== b.root || !isEqualArray(a.path, b.path)) return false;
  return true;
};

const areEqualCursors = function (a, b) {
  if (a == b) return true;
  if (a == null || b == null || size(a) !== size(b)) return false;
  for (const key in a) if (!isEqualCursor(a[key], b[key])) return false;
  return true;
};

const wrapWithPath = function (delta, path) {
  for (let i = path.length - 1; i >= 0; --i) {
    const tmp = {};
    tmp[path[i]] = delta;
    delta = tmp;
  }
  return delta;
};

const getCursorState = function (cursor) {
  let state = cursor.root.state;
  for (let i = 0, l = cursor.path.length; state && i < l; ++i) {
    state = state[cursor.path[i]];
  }
  return state;
};

const getCursorStates = function (cursors) {
  const states = {};
  for (const key in cursors) states[key] = getCursorState(cursors[key]);
  return states;
};

export const Mixin = {
  propTypes: {
    cursors: React.PropTypes.object
  },

  componentWillMount() {
    const states = getCursorStates(this.props.cursors);
    if (!this.state) this.state = {};
    for (const key in states) this.state[key] = states[key];
  },

  componentWillReceiveProps(nextProps) {
    this.setState(getCursorStates(nextProps.cursors));
  },

  shouldComponentUpdate(props, state) {
    const delta = {cursors: {$set: null}};
    return !areEqualCursors(this.props.cursors, props.cursors) ||
      !isEqualObject(update(this.props, delta), update(props, delta)) ||
      !isEqualObject(this.state, state);
  },

  getCursor(key, path) {
    const cursors = this.props.cursors;
    const cursor = (cursors && cursors[key]) || {root: this, path: [key]};
    if (path == null) return cursor;
    return {root: cursor.root, path: cursor.path.concat(path)};
  },

  update(deltas) {
    const changes = [];
    for (const key in deltas) {
      const cursor = this.getCursor(key);
      const root = cursor.root;
      const path = cursor.path;
      let change;
      for (let i = 0, l = changes.length; !change && i < l; ++i) {
        if (root === changes[i].root) change = changes[i];
      }
      if (!change) changes.push(change = {root: root, state: {}});
      const delta = wrapWithPath(deltas[key], path.slice(1));
      const state = change.state[path[0]] || root.state[path[0]];
      change.state[path[0]] = update(state, delta);
    }
    for (let i = 0, l = changes.length; i < l; ++i) {
      const change = changes[i];
      change.root.setState(change.state);
    }
  }
};

export class Component extends React.Component {
  static propTypes = Mixin.propTypes

  constructor(...args) {
    super(...args);
    return this::Mixin.componentWillMount(...args);
  }

  componentWillReceiveProps(...args) {
    if (super.componentWillReceiveProps) {
      super.componentWillReceiveProps(...args);
    }
    return this::Mixin.componentWillReceiveProps(...args);
  }

  shouldComponentUpdate(...args) {
    if (super.shouldComponentUpdate) {
      super.shouldComponentUpdate(...args);
    }
    return this::Mixin.shouldComponentUpdate(...args);
  }

  getCursor(...args) {
    return this::Mixin.getCursor(...args);
  }

  update(...args) {
    return this::Mixin.update(...args);
  }
}
