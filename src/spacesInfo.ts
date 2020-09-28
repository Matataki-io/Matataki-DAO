const requireSpace = require.context(
  '@499dao/snapshot-spaces/spaces/',
  true,
  // /[\w-]+\.json$/
  /info\.json$/
);
const spaces = Object.fromEntries(
  requireSpace
    .keys()
    .filter(
      file =>
        !['./domains.json', './homepage.json', './example/index.json'].includes(
          file
        )
    )
    .map(file => {
      const space = requireSpace(file);
      return [String(space.key).toLocaleLowerCase(), space];
    })
);

const spacesInfo = {};
Object.entries(spaces).forEach((space: any) => {
  if (!spacesInfo[1]) {
    spacesInfo[1] = {};
  }
  spacesInfo[1][space[0]] = space[1];
});

export default spacesInfo;
