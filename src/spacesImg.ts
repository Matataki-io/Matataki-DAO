
const path = require('path');
const requireSpaceImg = require.context(
  '@499dao/snapshot-spaces/spaces/',
  true,
  /space\.png$/
);
const requireLogoImg = require.context(
  '@499dao/snapshot-spaces/spaces/',
  true,
  /logo\.png$/
);


const spaceImgsObj = {};
requireSpaceImg.keys().map(file => {
  const img = requireSpaceImg(file);
  const name = file.split(path.sep)[1];
  spaceImgsObj[name] = img;
  return {
    name,
    file: img
  };
});
const logoImgsObj = {};
requireLogoImg.keys().map(file => {
  const img = requireLogoImg(file);
  const name = file.split(path.sep)[1];
  logoImgsObj[name] = img;
  return {
    name,
    file: img
  };
});
console.log('requireSpaceImg', spaceImgsObj);
console.log('requireLogoImg', logoImgsObj);


export default {
  space: spaceImgsObj,
  logo: logoImgsObj
};
