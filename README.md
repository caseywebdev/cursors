# Cursors

Maintain your React state with Cursors.

Cursors is a [React] mixin that is inspired by [David Nolen]'s [Om]. This is a
much lighter implementation that is focused on Nolen's idea of a single global
state and using cursors to create smaller local states within a single shared
data structure.

Cursors leverages the [Immutability Helpers] provided by [React Add-ons]. By
avoiding mutation, tasks like undo/redo become trivial, reasoning about problems
becomes easier, and bugs are easier to avoid.

## Install

```bash
bower install cursors
```

## API

### Top-Level

#### Cursors

The Cursors object itself should be mixed-in to all Cursors-using components.

### Component-Level

#### this.getCursor(key, [path])

Returns a new `cursor` with its path set to `key`'s path concatenated with
`path`. `key` and `path` should both be a `string` or `number`. Use an array of
`string`s and/or `number`s for `path` if your path goes more than one level
deep.

#### this.update(deltas)

Update the state with the change definitions in `deltas`. For `delta` syntax
check out React's [Immutability Helpers].

## Examples

Check out [the test file](https://caseywebdev.github.io/cursors/test.html) for a
full example. Here's the basics:

```js
var User = React.createClass({

  // First, mixin Cursors to add the appropriate functions to this component
  // definition.
  mixins: [Cursors],

  // In order for state changes to be recognized globally, you should never need
  // to use `this.setState`. Instead, use `this.update`. `update` takes a key
  // and a delta object. Check the "Immutability Helpers" link for more
  // information. By using `update`, the value will be updated at the root level
  // of the cursor, and changes will be propagated down back to the children.
  // This is a huge win for cursors, because it removes the need to nest
  // callbacks down for changes to objects that live higher up in the hierarchy.
  handleChange: function (ev) {
    this.update({user: {name: {$set: ev.target.value}}});
  },

  // The value of any cursors passed into this component will be reflected in
  // the `this.state` object. This interface allows children to not depend on
  // being passed cursors, but use them transparently if they are passed.
  render: function () {
    return <input value={this.state.user.name} onChange={this.handleChange} />;
  }
});

var Users = React.createClass({

  // First, mixin Cursors to add the appropriate functions to this component
  // definition.
  mixins: [Cursors],

  // The only component that should need to define `getInitialState` is the root
  // component. Child components can define their initial state, but state that
  // is passed into them via parent cursors will override the corresponding
  // initial state.
  getInitialState: function () {
    return {
      users: this.props.users || []
    };
  },

  // When rendering child components, always pass the appropriate `cursor` for
  // the child component via `this.getCursor(key, [path])`.
  renderUser: function (user, i) {
    return <User cursors={{user: this.getCursor('users', i)}} />;
  },

  render: function () {
    return <div>{this.state.users.map(this.renderUser)}</div>;
  }
});

React.renderComponent(
  <MyUsersComponent users={[{name: 'Casey'}, {name: 'Gunner'}]} />,
  document.body
);
```

[React]: https://github.com/facebook/react
[David Nolen]: https://github.com/swannodette
[Om]: https://github.com/swannodette/om
[Immutability Helpers]: http://facebook.github.io/react/docs/update.html
[React Add-ons]: http://facebook.github.io/react/docs/addons.html
