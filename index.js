/**
 * @file 快速生成对象
 * @author svon.me@gmail.com
 */

function getLayer(path) {
  var layer = path.split(/\.|\[/g);
  var array = [];
  for(var i = 0, len = layer.length; i < len; i++) {
    var value = layer[i];
    if (value) {
      if (value.lastIndexOf(']') >= 0) {
        array.push(`[` + value);
      } else {
        array.push(value);
      }
    }
  }
  return array;
}

function getArrayLayer(path) {
  return getLayer(path);
}

function isArray(value) {
  if (/[\w]+]$/.test(value)) {
    return true;
  }
  return false;
}

function getArrayIndex(value) {
  var start = value.indexOf('[');
  var end = value.lastIndexOf(']');
  if (start < 0) {
    start = 0;
  } else {
    start = start + 1;
  }
  if (end < 0) {
    end = value.length;
  }
  var index = value.slice(start, end);
  return index;
}

function safeSet(instance, path, value) {
  if (instance && path) {
    var layer = getArrayLayer(path);
    var app = function(data, index) {
      var key = layer[index];
      // 如果有下一层
      if (layer[index + 1]) {
        if (isArray(layer[index + 1])) { // 如果下层key是数组, 则按数组方式处理
          const k = getArrayIndex(key);
          if(!data[k]) {
            // 生成一个数组
            data[k] = [];
          }
          return app(data[k], index + 1);
        } else if(isArray(key)) { // 如果当前key是数组
          const k = getArrayIndex(key);
          if(!data[k]) {
            // 生成一个对象
            data[k] = {};
          }
          return app(data[k], index + 1);
        } else if (!data[key]) {
          // 生成一个对象
          data[key] = {};
        }
        return app(data[key], index + 1);
      } else {
        // 数组元素赋值
        if(isArray(key)) {
          const k = getArrayIndex(key);
          if (value === 0) {
            data[k] = 0;
          } else {
            data[k] = value || null;
          }
        } else {
          if (value === 0) {
            data[key] = 0;
          } else {
            data[key] = value || null;
          }
        }
        return;
      }
    };
    app(instance, 0);
    return instance;
  }
  return null;
}

module.exports = safeSet;
exports.default = safeSet;
