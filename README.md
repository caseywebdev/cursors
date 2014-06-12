# Curator

Maintaining your React state.

Curator is a [React] mixin that is inspired by [David Nolan]'s [Om]. This is a
much lighter implementation that is focused on Nolan's idea of a single global
state and using cursors to to create smaller local states within a single shared
data structure.

Curator leverages the [Immutability Helpers] provided by [React Add-ons]. By
avoiding mutation, tasks like undo/redo become trivial, reasoning about problems
becomes easier, and bugs are easier to avoid.

## Install

```bash
bower install curator
```

## API

### Top-Level

#### Curator

The Curator object itself should be mixed-in to all Curator-using components with React's `mixin` method.

### Component-Level

#### this.getCursor(name, [path])

Returns a new `cursor` with its path set to `name`'s path concatenated with
`path`

#### this.update(name, delta)

Update the specified state key `name` with the change definitions in `delta`.
For `delta` syntax check out React's [Immutibility Helpers].

## Examples

Check out [the test file](https://caseywebdev.github.io/curator/test.html) for a
full example. Here's the basics:

```jsx
var MyComponent = React.createClass({

  // First, mixin Curator to add the appropriate functions to this component
  // definition.
  mixins: [Curator],

  // The only component that should define `getInitialState` is the root
  // component. It should define its state in the `local` namespace. This allows
  // `remotes` to use other namespaces in `state`
  getInitialState: function () {
    return {
      users: [...]
    };
  },

  // In order for state changes to be recognized globally, you should never need
  // to use `this.setState`. Instead, use `this.update`. `update` takes a delta
  // object. Check the "Immutability Helpers" link for more information.
  handleChange: function (ev) {
    this.update('user', {name: {$set: ev.target.value}});
  },

  // When rendering child components, always pass the appropriate `cursor` for
  // the child component via `this.getCursor(indexOrIndicies)`.
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
