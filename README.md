# Cursors

Maintain your React state with Cursors.

Cursors is a [React] mixin that is inspired by [David Nolan]'s [Om]. This is a
much lighter implementation that is focused on Nolan's idea of a single global
state and using cursors to to create smaller local states within a single shared
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

The Cursors object itself should be mixed-in to all Cursors-using components with React's `mixin` method.

### Component-Level

#### this.getCursor(key, [path])

Returns a new `cursor` with its path set to `key`'s path concatenated with
`path`.

#### this.update(deltas)

Update the state with the change definitions in `deltas`. For `delta` syntax
check out React's [Immutability Helpers].

## Examples

Check out [the test file](https://caseywebdev.github.io/cursors/test.html) for a
full example. Here's the basics:

```jsx
var MyComponent = React.createClass({

  // First, mixin Cursors to add the appropriate functions to this component
  // definition.
  mixins: [Cursors],

  // The only component that should need to define `getInitialState` is the root
  // component.
  getInitialState: function () {
    return {
      users: [{name: 'Casey'}]
    };
  },

  // In order for state changes to be recognized globally, you should never need
  // to use `this.setState`. Instead, use `this.update`. `update` takes a key
  // and a delta object. Check the "Immutability Helpers" link for more
  // information.
  handleChange: function (ev) {
    this.update({user: {name: {$set: ev.target.value}}});
  },

  // When rendering child components, always pass the appropriate `cursor` for
  // the child component via `this.getCursor(key, [path])`.
  render: function () {
    return (
      <MyUsersComponent cursors={{users: this.getCursor('users')}} />
    );
  }
});
```

[React]: https://github.com/facebook/react
[David Nolan]: https://github.com/swannodette
[Om]: https://github.com/swannodette/om
[Immutability Helpers]: http://facebook.github.io/react/docs/update.html
[React Add-ons]: http://facebook.github.io/react/docs/addons.html
