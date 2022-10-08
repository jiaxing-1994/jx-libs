import { isObject } from './type';
// 通过class找dom

export function getDomByClass(container = document, className: string) {
  return container.getElementsByClassName(className);
}
// 获取dom属性或样式
export function getStyleByDom(dom: HTMLElement, attr: string, isStyle = true) {
  if (isStyle && dom && dom.style && dom.style[attr as keyof typeof dom.style] !== undefined) {
    try {
      const computed = document.defaultView?.getComputedStyle(dom, '');
      return dom.style[attr as keyof typeof dom.style] || (computed ? computed[attr as keyof typeof dom.style] : null);
    } catch (e) {
      return dom.style[attr as keyof typeof dom.style];
    }
  } else if (dom && dom[attr as keyof typeof dom]) {
    return dom[attr as keyof typeof dom];
  }
  return null;
}
// 设置dom属性或样式
export function setStyleByDom(dom: HTMLElement, attr:string, value:unknown, isStyle = true) {
  if (isStyle && dom && dom.style && dom.style[attr as keyof typeof dom.style] !== undefined && dom.style[attr as keyof typeof dom.style] !== value) {
    // @ts-ignore
    dom.style[attr as keyof typeof dom.style] = value;
  } else if (dom && dom[attr as keyof typeof dom] && dom[attr as keyof typeof dom] !== value) {
    // @ts-ignore
    dom[attr as keyof typeof dom] = value;
  }
}
// 创建svg
export function createSvg(type: string, attributes: unknown) {
  const svgElement = document.createElementNS('http://www.w3.org/2000/svg', type);
  if (isObject(attributes)) {
    for (const i in attributes) {
      svgElement.setAttribute(i, attributes[i]);
    }
  }
  return svgElement;
}
