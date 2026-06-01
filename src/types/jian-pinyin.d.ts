declare module "jian-pinyin" {
  /**
   * 获取拼音
   * @param str 需要转换的字符串
   * @param callback 回调函数，用于处理每个字符的拼音格式
   * @param separator 分隔符
   */
  export function getSpell(
    str: string,
    callback?: (charactor: string, spell: string) => string,
    separator?: string,
  ): string;

  /**
   * 获取首字母
   * @param str 需要转换的字符串
   */
  export function getInitials(str: string): string;
}
