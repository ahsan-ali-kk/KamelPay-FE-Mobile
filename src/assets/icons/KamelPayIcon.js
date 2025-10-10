import { createIconSet } from '@react-native-vector-icons/common';
import IcoMoonConfig from './selection.json';

// Build the glyph map
const glyphMap = {};
IcoMoonConfig.icons.forEach(icon => {
  glyphMap[icon.properties.name] = icon.properties.code;
});

// MUST match the font name inside selection.json
const fontFamily = 'icomoon';

const Icon = createIconSet(glyphMap, {
  postScriptName: fontFamily,
  fontFileName: 'icomoon.ttf',
  fontSource: require('./icomoon.ttf'),
});

export default Icon;
