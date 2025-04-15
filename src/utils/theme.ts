function getDarkerColor(color: string, factor = 0.7) {
  // 去除颜色字符串开头的 # 符号
  color = color.replace('#', '');

  // 将十六进制颜色值转换为 RGB 值
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);

  // 降低每个通道的亮度
  r = Math.round(r * factor);
  g = Math.round(g * factor);
  b = Math.round(b * factor);

  // 确保每个通道的值在 0 到 255 之间
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  // 将修改后的 RGB 值转换回十六进制颜色字符串
  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return '#' + toHex(r) + toHex(g) + toHex(b);
}
function getLighterColor(color: string, factor = 1.3) {
  // 去除颜色字符串开头的 # 符号
  color = color.replace('#', '');

  // 将十六进制颜色值转换为 RGB 值
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);

  // 增加每个通道的亮度
  r = Math.round(r * factor);
  g = Math.round(g * factor);
  b = Math.round(b * factor);

  // 确保每个通道的值在 0 到 255 之间
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  // 将修改后的 RGB 值转换回十六进制颜色字符串
  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return '#' + toHex(r) + toHex(g) + toHex(b);
}

function genThemeStyleScript(theme: { [key: string]: string }) {
  const currentStyle = document.getElementById(theme.key);
  if (currentStyle) {
    currentStyle.remove();
  }
  const style = document.createElement('style');
  style.type = 'text/css';
  style.id = theme.key;
  style.innerHTML = `:root { 
      --primary-color: ${theme.primaryColor}; 
      --primary-text-color: ${theme.textColor};
      --primary-darker-color: ${getDarkerColor(theme.primaryColor, 0.9)};
      --primary-lighter-color: ${getDarkerColor(theme.primaryColor, 1.3)};
      --primary-bg-color: ${theme.bgColor};
    }`;
  document.head.appendChild(style);
}

export default {
  getDarkerColor,
  getLighterColor,
  genThemeStyleScript,
};
