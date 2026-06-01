/*
    节流函数
    @param fn {function}
    @param wait {number} 节流等待时间
    @param maxTimeLong {number} 多长时间执行一次
    @return {function}
*/
export function throttling(fn, wait = 500, maxTimelong = 1000) {
  // 参数校验
  if (typeof fn !== 'function') {
    throw new TypeError('第一个参数必须是一个函数');
  }
  if (typeof wait !== 'number' || wait < 0) {
    throw new TypeError('第二个参数必须是一个大于等于0的数字');
  }
  if (typeof maxTimelong !== 'number' || maxTimelong < 0) {
    throw new TypeError('第三个参数必须是一个大于等于0的数字');
  }

  var timeout = null;
  var startTime = Date.now(); // 使用Date.now()提高可读性

  return function (...args) {
    if (timeout !== null) clearTimeout(timeout);

    var curTime = Date.now();
    // 检查是否超过了最大时间间隔maxTimelong
    if (curTime - startTime >= maxTimelong) {
      fn(args);
      startTime = curTime; // 重置开始时间
    } else {
      timeout = setTimeout(function () {
        // 确保在setTimeout内部调用fn，以正确处理异常
        try {
          fn(args);
        } catch (error) {
          console.error('执行节流函数出错:', error);
        }
      }, wait);
    }
  }
}

/*
    防抖函数
    @param fn {function}
    @param wait {number} 防抖等待时间
    @return {function}
*/
export function debounce(fn, wait = 500) {
  // 参数校验
  if (typeof fn !== 'function') {
    throw new TypeError('第一个参数必须是一个函数');
  }
  if (typeof wait !== 'number' || wait < 0) {
    throw new TypeError('第二个参数必须是一个大于等于0的数字');
  }

  var timeout = null;

  return function (...args){
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(function () {
      // 确保在setTimeout内部调用fn，以正确处理异常
      try {
        fn(args);
      } catch (error) {
        console.error('执行防抖函数出错:', error);
      }
    }, wait);
  }
}

/**
 * 对象转字符串，用于问号传参格式修改
 * @param {Object} obj
 * @returns {string}
 */
export function objToString(obj) {
  let str = '';
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      str += `${key}=${obj[key]}&`;
    }
  }
  return str.slice(0, -1);
}