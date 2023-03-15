/**
 * @file 快速生成对象
 * @author svon.me@gmail.com
 */

function getLayer(path: string): string[] {
  const layer = String(path).split(/\.|\[/g);
  const array: string[] = [];
  for(let i = 0, len = layer.length; i < len; i++) {
    const value = layer[i];
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

function getArrayLayer(path: string | string[]): string[] {
  const list: string[] = [];
  if (Array.isArray(path)) {
    for (let i = 0, len = path.length; i < len; i++) {
      const value = getArrayLayer(path[i]);
      list.push(...value);
    }
  } else {
    list.push(...getLayer(path));
  }
  return list;
}

function isArray(value: string): boolean {
  if (/[\w]+]$/.test(value)) {
    return true;
  }
  return false;
}

function getArrayIndex(value: string): string {
  let start = value.indexOf('[');
  let end = value.lastIndexOf(']');
  if (start < 0) {
    start = 0;
  } else {
    start = start + 1;
  }
  if (end < 0) {
    end = value.length;
  }
  return value.slice(start, end);
}

const get = function(data: any, key: string | number) {
  return data ? data[key] : void 0;
};

const set = function<T>(instance: any, path: string[], index: number, value?: any) {
  var key = path[index];
  // 判断是否有子级数据
  if (path[index + 1]) {
    // 如果子级 key 是数组, 则按数组方式处理
    if (isArray(path[index + 1])) {
      const k = getArrayIndex(key);
      if(!get(instance, k)) {
        // 生成一个数组
        instance[k] = [];
      }
      set<T>(instance[k], path, index + 1, value);
      return;
    }

    // 如果当前 key 是数组
    if(isArray(key)) {
      const k = getArrayIndex(key);
      if(!get(instance, k)) {
        // 生成一个对象
        instance[k] = {};
      }
      set(instance[k], path, index + 1, value);
      return;
    }
    
    if (!get(instance, key)) {
      // 生成一个对象
      instance[key] = {};
    }
    set(instance[key], path, index + 1, value);
    return;
  } else {
    // 数组元素赋值
    if(isArray(key)) {
      const k = getArrayIndex(key);
      instance[k] = value;
    } else {
      instance[key] = value;
    }
    return;
  }
};

function safeSet<T>(instance?: T, path?: string | string[], value?: any): T | undefined {
  if (path) {
    const layer = getArrayLayer(path);
    if (!instance) {
      instance = {} as T;
    }
    set(instance, layer, 0, value);
  }
  return instance;
}

export default safeSet;
