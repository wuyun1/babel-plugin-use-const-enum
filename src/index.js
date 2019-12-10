import { types } from '@babel/core';
import { declare } from '@babel/helper-plugin-utils';
import syntaxTypeScript from '@babel/plugin-syntax-typescript';

export default declare((api, { importRegStr } ) => {
  api.assertVersion(7);

  const importReg = importRegStr && new RegExp(importRegStr, 'i');

  const CONST_ENUM_OBJECT = {};

  return {
    name: 'use-const-enum',
    inherits: syntaxTypeScript,
    visitor: {
      MemberExpression(path) {
        const currentFilePath = path.hub.file.opts.filename;
        const constEnumName = path.node.object.name;
        if(CONST_ENUM_OBJECT[`${currentFilePath}_${constEnumName}`]) {
          path.replaceWith(
            types.stringLiteral(path.node.property.name),
          );
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
