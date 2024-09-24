import { types } from '@babel/core';
import { declare } from '@babel/helper-plugin-utils';
import syntaxTypeScript from '@babel/plugin-syntax-typescript';

function removePlugin(plugins, name) {
  const indices = [];
  plugins.forEach((plugin, i) => {
    const n = Array.isArray(plugin) ? plugin[0] : plugin;

    if (n === name) {
      indices.unshift(i);
    }
  });

  for (const i of indices) {
    plugins.splice(i, 1);
  }
}

export default declare((api, { importRegStr, isTSX = true } ) => {
  api.assertVersion(7);

  const importReg = importRegStr && new RegExp(importRegStr, 'i');

  const CONST_ENUM_OBJECT = {};

  return {
    name: 'use-const-enum',
    inherits: syntaxTypeScript,
    manipulateOptions(opts, parserOpts) {
      const { plugins } = parserOpts;
      // If the Flow syntax plugin already ran, remove it since Typescript
      // takes priority.
      removePlugin(plugins, "flow");

      if (isTSX) {
        parserOpts.plugins.push("jsx");
      }
    },
    visitor: {
      MemberExpression(path) {
        if(!path.hub) {
          return;
        }
        const currentFilePath = path.hub.file.opts.filename;
        const constEnumName = path.node.object.name;
        if(CONST_ENUM_OBJECT[`${currentFilePath}_${constEnumName}`]) {
          path.replaceWith(
            types.stringLiteral(path.node.property.name || path.node.property.value),
          );
          // if(path.node.property.name) {
          //   path.replaceWith(
          //     types.stringLiteral(path.node.property.name),
          //   );
          // }
          // if(path.node.property.value) {
          //   path.replaceWith(
          //     types.stringLiteral(path.node.property.value),
          //   );
          // }
          path.skip();
        }
      },
      ImportSpecifier(path) {
        if(!importReg) {
          return;
        }
        if(path.parentPath.node.source && importReg.test(path.parentPath.node.source.value)) {
          const currentFilePath = path.hub.file.opts.filename;
          const constEnumName = path.node.imported.name;
          CONST_ENUM_OBJECT[`${currentFilePath}_${constEnumName}`] = 1;
        }
      },
    },
  };
});
