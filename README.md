# babel-plugin-use-const-enum

> Use TypeScript `const` enums, Fix babel not support const enum

## Install

Using npm:

```sh
npm install --save-dev babel-plugin-use-const-enum
```

or using yarn:

```sh
yarn add babel-plugin-use-const-enum --dev
```

## Usage

You are most likely using
[`@babel/preset-typescript`](https://babeljs.io/docs/en/babel-preset-typescript)
or
[`@babel/plugin-transform-typescript`](https://babeljs.io/docs/en/babel-plugin-transform-typescript)
as along with this plugin.

If you are using `@babel/preset-typescript`, then nothing special needs to be
done since
[plugins run before presets](https://babeljs.io/docs/en/plugins/#plugin-ordering).

If you are using `@babel/plugin-transform-typescript`, then make sure that
`babel-plugin-use-const-enum` comes before
`@babel/plugin-transform-typescript` in the plugin array so that
`babel-plugin-use-const-enum` [runs first](https://babeljs.io/docs/en/plugins/#plugin-ordering).
This plugin needs to run first to transform the `const enum`s into code that
`@babel/plugin-transform-typescript` allows.

`.babelrc`

```json
{
  "plugins": ["use-const-enum", "@babel/transform-typescript"]
}
```

### `transform: removeConst` (default)

Removes the `const` keyword to use regular `enum`.
Can be used in a slower dev build to allow `const`, while prod still uses `tsc`.
See [babel#6476](https://github.com/babel/babel/issues/6476).

```ts
// enum.ts
// defined const enum
export declare const enum Status {
    create = "create",
    pending = "pending",
    end = "end"
}
```

```ts
// use const enum

// Before:
import { Status } from './enum.ts';
const s = Status.create; // after babel =>|     const s = Status.create;

// After:
import { Status } from './enum.ts';
const s = Status.create; // after babel =>|     const s = 'create';
```

`.babelrc`
```json
{
  "plugins": [
    "use-const-enum"
  ]
}
```
