/**
 * get elements scroll position.
 *
 * @param {string} name scroll parameter name (scrollTop or scrollLeft)
 * @param {HTMLElement} element target.
 * @returns {number} scroll position.
 */
export function getScroll(name, element) {
  if (element === null) {
    return 0;
  }
  const value = element instanceof HTMLElement ? element[name] : 0;
  if (!element.parentNode) {
    return value;
  }

  return value + getScroll(name, element.parentNode);
}

/**
 * calculate the count of columns of a tile.
 *
 * @param {HTMLDivElement} div container element.
 * @param {number} cellWidth cell width.
 * @returns {number} col count.
 */
export function getCols(div, cellWidth) {
  return Math.max(1, Math.floor(div.clientWidth / cellWidth));
}

/**
 * generate an array of consecutive numerical values.
 *
 * @param {number} pivot pivot index.
 * @param {number} index traget index.
 * @returns {number[]} result.
 */
export function makeRange(pivot, index) {
  if (pivot === -1) {
    return makeRange(0, index);
  }
  if (pivot > index) {
    return makeRange(index, pivot);
  }
  const result = [];
  for (let i = pivot; i <= index; i += 1) {
    result.push(i);
  }

  return result;
}

/**
 * merge class name.
 *
 * @param {string[]} classNames class names.
 * @returns {string} merged class name.
 */
export function mergeClassNames(...classNames) {
  return classNames.filter(x => typeof x === 'string' && x.length > 0).join(' ');
}
