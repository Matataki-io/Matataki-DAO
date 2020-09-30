const requireSpace = require.context(
  '@499dao/snapshot-spaces/spaces/',
  true,
  // /[\w-]+\.json$/
  /index\.json$/
);
const requireSkin = require.context(
  '@499dao/snapshot-spaces/spaces/',
  true,
  /[\w-]+\.scss$/
);

requireSkin.keys().map(file => requireSkin(file));

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

const spacesByChainId = {};
Object.entries(spaces).forEach((space: any) => {
  if (!spacesByChainId[space[1].chainId])
    spacesByChainId[space[1].chainId] = {};
  spacesByChainId[space[1].chainId][space[0]] = space[1];
});

export default spacesByChainId;
