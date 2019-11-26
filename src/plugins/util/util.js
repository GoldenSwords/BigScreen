import Vue from "vue";
/**
 * 判断是否为空
 */
export function validatenull(val) {
  if (val instanceof Array) {
    if (val.length === 0) return true;
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === "{}") return true;
  } else {
    if (
      val === "null" ||
      val === null ||
      val === "undefined" ||
      val === undefined ||
      val === ""
    )
      return true;
    return false;
  }
  return false;
}

export const formatRoutes = data => {
  let aRouter = [];
  data.forEach(item => {
    const { path, component, menuName, redirect, href, icon, children } = item;
    if (!validatenull(href)) {
      const oRouter = {
        path: path || "",
        component(resolve) {
          require([`@/components/iframes.vue`], resolve, function() {
            require([`@/views/404.vue`], resolve);
          });
        },
        name: menuName,
        icon: icon,
        redirect: redirect,
        meta: {
          keepAlive: true,
          src: href
        },
        children: validatenull(children) ? [] : formatRoutes(children)
      };
      aRouter.push(oRouter);
    } else if (!validatenull(component)) {
      const oRouter = {
        path: path || "",
        component(resolve) {
          require([
            component === "Root"
              ? "@/components/iframes"
              : component === "Layout"
              ? "@/components/ContenerFullScreen"
              : `@/${component}.vue`
          ], resolve, function() {
            require([`@/views/404.vue`], resolve);
          });
        },
        name: menuName,
        icon: icon,
        redirect: redirect,
        meta: {
          keepAlive: true
        },
        children: validatenull(children) ? [] : formatRoutes(children)
      };
      aRouter.push(oRouter);
    }
  });
  return aRouter;
};

export function makeTree(data, id, pid, childColumn) {
  function mergeTree(item, data, id, pid, childColumn) {
    item = JSON.parse(JSON.stringify(item));
    item[childColumn] = item.hasOwnProperty(childColumn)
      ? item[childColumn]
      : [];
    const child = [];
    for (let i = 0; i < data.length; i++) {
      if (item.id === data[i].pid) {
        let temp = JSON.parse(JSON.stringify(data[i]));
        data.splice(i, 1);
        i--;
        temp = mergeTree(temp, data, id, pid, childColumn);
        child.push(temp);
      }
    }
    item[childColumn] = item[childColumn].concat(child);
    if (item[childColumn].length === 0) {
      delete item[childColumn];
    }
    return item;
  }
  const treeData = [];
  for (let i = 0; i < data.length; i++) {
    let temp = JSON.parse(JSON.stringify(data[i]));
    data.splice(i, 1);
    i--;
    treeData.push(mergeTree(temp, data, id, pid, childColumn));
  }
  return treeData;
}

export function registComponent(name, source) {
  // return require(`@/${source}.vue`).then((component) => {
  //   return Vue.component(name, component)
  // })
  // return Vue.component(name, `@/${source}.vue`)
  return Vue.component(name, import("@/" + source));
}

export function registerComp(path) {
  return import("@/" + path);
}

export function generateUUID() {
  let d = new Date().getTime();
  const uuid = "axxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function(c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}
export const getMax = (data, key) => {
  let temp = 0;
  data.forEach(item => {
    temp = temp <= item[key] ? item[key] + 1 : temp;
  });
  return temp;
};
// Date
/**
 * @name 时间格式化
 * @param fmt 如 yyyyMMdd hh:mm:ss
 * @param date
 * @param secondsDelay 推迟时间
 * @returns {*}
 */
export const dateFormat = (fmt, date, secondsDelay) => {
  date = secondsDelay
    ? new Date(date.getTime() - secondsDelay)
    : new Date(date);
  const o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (const k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};
/**
 * @name 日期字符转日期对象
 * @param datestr ('20180522101000')
 * @returns {Date}
 */
export const stringToDate = datestr => {
  const str = datestr.toString();
  return new Date(
    str.replace(
      /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})+/gm,
      "$1-$2-$3 $4:$5:$6"
    )
  );
};
/**
 * 激活字符串形式的 function
 * **/
export const activeFunction = e => {
  const F = Function;
  return new F("a", "return " + e)();
};
