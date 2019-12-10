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

### `transform: importRegStr`

filter `importRegStr` .
Specify the scope of the `const enum` by `importRegStr`

```ts
// Before:
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';

enum Status {
  pending = 'pending',
  end = 'end',
  start = 'start'
}

console.log(FieldType.string);
console.log(Status.end);


// After:
import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';
var Status;

(function (Status) {
  Status["pending"] = "pending";
  Status["end"] = "end";
  Status["start"] = "start";
})(Status || (Status = {}));

console.log("string");
console.log(Status.end);

```

`.babelrc`
```json
{
  "plugins": [
    ["use-const-enum", { "importRegStr": "choerodon-ui\/.*\/enum" }]
  ]
}
```
