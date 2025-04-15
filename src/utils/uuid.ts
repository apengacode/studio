function uuid() {
  // 使用 crypto.getRandomValues 生成一个 16 字节的数组
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);

  // 修改版本字段：设置第 7 位为 4，表示 UUID 的版本号
  array[6] = (array[6] & 0x0f) | 0x40;

  // 修改变体字段：设置第 9 位的高 2 位为 10xx
  array[8] = (array[8] & 0x3f) | 0x80;

  // 将字节数组转换为 UUID 格式字符串
  const hexArray = Array.from(array).map(byte => byte.toString(16).padStart(2, '0'));

  // 构建最终的 UUID 字符串
  return `${hexArray[0]}${hexArray[1]}${hexArray[2]}${hexArray[3]}-${hexArray[4]}${hexArray[5]}-${hexArray[6]}${hexArray[7]}-${hexArray[8]}${hexArray[9]}-${hexArray[10]}${hexArray[11]}${hexArray[12]}${hexArray[13]}${hexArray[14]}${hexArray[15]}`;
}

export default uuid