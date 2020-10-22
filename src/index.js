/**
 * 
 * @param {string} a - 加法.
 * @param {*} b 
 */
export function add (a, b){
    return a + b
  }

  /**
   * 
   * @param {string} value -校验值
   * @param {*} type -类型
   * @returns {boolean|*}
   */
export function regex(value,type){
    if(typeof value != 'string'){
        return false;
    }
    var validate = {
        'date'		          :  /^([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))$/,
        'qq'                :  /^[1-9]\d{4,10}$/,
        'number'            :  /^\d+$/,
        'currency'          :  /^\d+(\.\d+)?$/,
    };
    type = type.toLowerCase();
    if(validate[type]){
        var result = value.match(validate[type]);
        if(result){
            return result;
        }
        return false;
    }
    return false;
}

export function numFormat(s, n) {
  n = parseInt(n) || 2;
  s = parseFloat(s) || 0;
  n = n >= 0 ? n : 0;
  s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
  var l = s.split('.')[0].split('').reverse();
  r = s.split('.')[1] || '';
  t = '';
  for(i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1)%3 == 0 && (i + 1) != l.length ? ',' : '');
  }
  return t.split('').reverse().join('') + (r != '' ? ('.' + r) : '');
}

export function toThousandsFilter(num) {
  let cent = 2;
  num = num.toString().replace(/\$|\,/g,'');
  // 检查传入数值为数值类型
  if(isNaN(num))
      num = "0";
  // 获取符号(正/负数)
  let sign = (num == (num = Math.abs(num)));
  num = Math.floor(num*Math.pow(10,cent)+0.50000000001); // 把指定的小数位先转换成整数.多余的小数位四舍五入
  let cents = num%Math.pow(10,cent);       // 求出小数位数值
  num = Math.floor(num/Math.pow(10,cent)).toString();  // 求出整数位数值
  cents = cents.toString();        // 把小数位转换成字符串,以便求小数位长度
  // 补足小数位到指定的位数
  while(cents.length<cent)
      cents = "0" + cents;

  // 对整数部分进行千分位格式化.
  for (let i = 0; i < Math.floor((num.length-(1+i))/3); i++)
      num = num.substring(0,num.length-(4*i+3))+','+ num.substring(num.length-(4*i+3));

  if (cent > 0)
      return (((sign)?'':'-') + num + '.' + cents);
  else
      return (((sign)?'':'-') + num);
}

// import { themeColor, ORIGINAL_THEME } from '@/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('element-ui/package.json');
const themeColor = '#333'
const ORIGINAL_THEME = '#666';
let chalk = '';

export function updateStyle(
  style,
  oldCluster,
  newCluster,
) {
  let newStyle = style;
  oldCluster.forEach((color, index) => {
    newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index]);
  });
  return newStyle;
}

export function getCSSString(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      chalk = xhr.responseText.replace(/@font-face{[^}]+}/, '');
      callback();
    }
  };
  xhr.open('GET', url);
  xhr.send();
}

export function getThemeCluster(theme) {
  const tintColor = (color, tint) => {
    let red = parseInt(color.slice(0, 2), 16);
    let green = parseInt(color.slice(2, 4), 16);
    let blue = parseInt(color.slice(4, 6), 16);

    if (tint === 0) {
      return [red, green, blue].join(',');
    }
    red += Math.round(tint * (255 - red));
    green += Math.round(tint * (255 - green));
    blue += Math.round(tint * (255 - blue));

    red = red.toString(16);
    green = green.toString(16);
    blue = blue.toString(16);

    return `#${red}${green}${blue}`;
  };

  const shadeColor = (color, shade) => {
    let red = parseInt(color.slice(0, 2), 16);
    let green = parseInt(color.slice(2, 4), 16);
    let blue = parseInt(color.slice(4, 6), 16);

    red = Math.round((1 - shade) * red);
    green = Math.round((1 - shade) * green);
    blue = Math.round((1 - shade) * blue);

    red = red.toString(16);
    green = green.toString(16);
    blue = blue.toString(16);

    return `#${red}${green}${blue}`;
  };

  const clusters = [theme];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i <= 9; i++) {
    clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
  }
  clusters.push(shadeColor(theme, 0.1));
  return clusters;
}

export function updateThemeColor(val, oldVal, color) {
  if (typeof val !== 'string') return;
  const themeCluster = getThemeCluster(val.replace('#', ''));
  const originalCluster = getThemeCluster(oldVal.replace('#', ''));
  const getHandler = (variable, id) => () => {
    // eslint-disable-next-line no-shadow
    const originalCluster = getThemeCluster(color.replace('#', ''));
    const newStyle = updateStyle(chalk, originalCluster, themeCluster);

    let styleTag = document.getElementById(id);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.setAttribute('id', id);
      document.head.appendChild(styleTag);
    }
    styleTag.innerText = newStyle;
  };

  const chalkHandler = getHandler('chalk', 'chalk-style');

  if (!chalk) {
    const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`;
    getCSSString(url, chalkHandler);
  } else {
    chalkHandler();
  }

  const styles = [].slice
    .call(document.querySelectorAll('style'))
    .filter((style) => {
      const text = style.innerText;
      return (
        new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
      );
    });
  styles.forEach((style) => {
    const { innerText } = style;
    if (typeof innerText !== 'string') return;
    // eslint-disable-next-line no-param-reassign
    style.innerText = updateStyle(innerText, originalCluster, themeCluster);
  });

  // 响应外部操作
  // this.$emit('onThemeChange', val);
}

/**
 * 初始化主题色
 */
export function initThemeColor() {
  const savedColor = localStorage.getItem('theme_color');
  if (savedColor) {
    updateThemeColor(savedColor, savedColor, ORIGINAL_THEME);
  } else {
    updateThemeColor(themeColor, themeColor, ORIGINAL_THEME);
  }
}


export default{
  add,
  regex,
  numFormat,
  toThousandsFilter,
  updateThemeColor,
}