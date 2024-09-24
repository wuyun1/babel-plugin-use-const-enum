import { transformAsync } from '@babel/core';
import plugin from '../src';



it('Transforms no initializers', async () => {
  const input = `import { FieldType } from 'choerodon-ui/pro/lib/data-set/enum';

  enum Status {
    pending = 'pending',
    end = 'end',
    start = 'start'
  }

  console.log(FieldType.string);
  console.log(FieldType["string-aaa"]);
  console.log(Status.end);
`;

  const options = {
    plugins: [[plugin, { "importRegStr": "choerodon-ui\/.*\/enum" }]],
  };

  const { code: output } = await transformAsync(input, options);
  expect(output).toMatchSnapshot();
});
