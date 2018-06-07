import React from 'react';
import PropTypes from 'prop-types';
import styleProptype from 'react-style-proptype';

function getScroll(name, element) {
  if (element === null) {
    return 0;
  }
  var value = element instanceof HTMLElement ? element[name] : 0;
  if (!element.parentNode) {
    return value;
  }

  return value + getScroll(name, element.parentNode);
}

function getCols(div, cellWidth) {
  return Math.max(1, Math.floor(div.offsetWidth / cellWidth));
}

function makeRange(pivot, index) {
  if (pivot === -1) {
    return makeRange(0, index);
  }
  if (pivot > index) {
    return makeRange(index, pivot);
  }
  var result = [];
  for (var i = pivot; i <= index; i += 1) {
    result.push(i);
  }

  return result;
}

function mergeClassNames() {
  for (var _len = arguments.length, classNames = Array(_len), _key = 0; _key < _len; _key++) {
    classNames[_key] = arguments[_key];
  }

  return classNames.filter(function (x) {
    return typeof x === 'string' && x.length > 0;
  }).join(' ');
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/**
 * Item
 */

var Item = function (_React$PureComponent) {
  inherits(Item, _React$PureComponent);

  function Item() {
    classCallCheck(this, Item);
    return possibleConstructorReturn(this, (Item.__proto__ || Object.getPrototypeOf(Item)).apply(this, arguments));
  }

  createClass(Item, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          width = _props.width,
          height = _props.height;


      return React.createElement(
        'div',
        {
          style: {
            width: width,
            height: height
          }
        },
        this.props.children
      );
    }
  }]);
  return Item;
}(React.PureComponent);


Item.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  children: PropTypes.node
};

Item.defaultProps = {
  children: null
};

/**
 * Tile list view
 */

var componentStyle = {
  padding: 0,
  overflowX: 'hidden',
  overflowY: 'scroll',
  boxSizing: 'border-box',
  userSelect: 'none',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  alignContent: 'flex-start'
};

var keyMap = {
  arrowup: { dx: 0, dy: -1 },
  arrowdown: { dx: 0, dy: 1 },
  arrowleft: { dx: -1, dy: 0 },
  arrowright: { dx: 1, dy: 0 },
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 }
};

var TileListView = function (_React$Component) {
  inherits(TileListView, _React$Component);

  function TileListView(props) {
    classCallCheck(this, TileListView);

    var _this = possibleConstructorReturn(this, (TileListView.__proto__ || Object.getPrototypeOf(TileListView)).call(this, props));

    _this.state = {
      cursor: -1,
      pivot: -1,
      focused: false
    };

    _this.handleClick = _this.handleClick.bind(_this);
    _this.handleKeyDown = _this.handleKeyDown.bind(_this);
    _this.handleFocus = _this.handleFocus.bind(_this);
    _this.handleBlur = _this.handleBlur.bind(_this);
    return _this;
  }

  createClass(TileListView, [{
    key: 'handleClick',
    value: function handleClick(event) {
      var _props = this.props,
          itemWidth = _props.itemWidth,
          itemHeight = _props.itemHeight,
          selection = _props.selection;
      var pivot = this.state.pivot;


      var div = event.currentTarget;
      var cols = getCols(div, itemWidth);

      var _div$getBoundingClien = div.getBoundingClientRect(),
          left = _div$getBoundingClien.left,
          top = _div$getBoundingClien.top;

      var x = event.pageX - left;
      var y = event.pageY - top;

      var offsetX = -getScroll('scrollLeft', div.parentNode);
      var offsetY = div.scrollTop - getScroll('scrollTop', div.parentNode);

      if (x + offsetX >= cols * itemWidth) {
        this._select([], -1, -1);
        return;
      }

      var col = Math.floor((x + offsetX) / itemWidth);
      var row = Math.floor((y + offsetY) / itemHeight);
      var index = col + row * cols;

      if (event.ctrlKey || event.metaKey) {
        if (selection.indexOf(index) < 0) {
          this._select([].concat(toConsumableArray(selection), [index]), index, index);
        } else {
          this._select(selection.filter(function (i) {
            return i !== index;
          }), index, index);
        }
      } else if (event.shiftKey) {
        this._select(makeRange(pivot, index), index, pivot);
      } else {
        this._select([index], index, index);
      }
      event.preventDefault();
      event.stopPropagation();
    }
  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(event) {
      var key = ('' + event.key).toLowerCase();

      if (!(key in keyMap) && key !== ' ') return;

      event.preventDefault();
      event.stopPropagation();

      var _props2 = this.props,
          items = _props2.items,
          itemWidth = _props2.itemWidth,
          itemHeight = _props2.itemHeight,
          selection = _props2.selection;
      var _state = this.state,
          cursor = _state.cursor,
          pivot = _state.pivot;

      if (!items) return;

      if (key === ' ') {
        if (event.ctrlKey || event.metaKey) {
          if (selection.indexOf(cursor) < 0) {
            this._select([].concat(selection, cursor), cursor, cursor);
          } else {
            this._select(selection.filter(function (x) {
              return x !== cursor;
            }), cursor, cursor);
          }
        } else if (event.shiftKey) {
          this._select(makeRange(pivot, cursor), cursor, pivot);
        } else if (selection.indexOf(cursor) < 0) {
          this._select([cursor], cursor, cursor);
        }
        return;
      }

      var _keyMap$key = keyMap[key],
          dx = _keyMap$key.dx,
          dy = _keyMap$key.dy;

      var div = event.currentTarget;
      var cols = getCols(div, itemWidth);
      var rows = Math.ceil(items.length / cols);
      var preIndex = cursor + dx + dy * cols;
      if (preIndex < 0 || cols * rows <= preIndex) return;
      var index = items.length <= preIndex ? items.length - 1 : preIndex;

      var y0 = div.scrollTop;
      var y1 = y0 + div.getBoundingClientRect().height;
      var y2 = Math.floor(index / cols) * itemHeight;
      var y3 = y2 + itemHeight;
      if (y1 < y3) {
        div.scrollTop += y3 - y1;
      } else if (y0 > y2) {
        div.scrollTop += y2 - y0;
      }

      if (event.ctrlKey || event.metaKey) {
        this._select(selection, index, pivot);
      } else if (event.shiftKey) {
        this._select(makeRange(pivot, index), index, pivot);
      } else {
        this._select([index], index, index);
      }
    }
  }, {
    key: 'handleFocus',
    value: function handleFocus() {
      this.setState({ focused: true });
    }
  }, {
    key: 'handleBlur',
    value: function handleBlur() {
      this.setState({ focused: false });
    }
  }, {
    key: '_select',
    value: function _select(newSelection, cursor, pivot) {
      var _this2 = this;

      var selectionUpdated = newSelection.length !== this.props.selection.length || !newSelection.every(function (x) {
        return _this2.props.selection.indexOf(x) >= 0;
      });
      if (this.state.cursor === cursor && this.state.pivot === pivot && !selectionUpdated) return;

      if (selectionUpdated) this.props.onUpdateSelection(newSelection);
      if (this.state.cursor !== cursor) this.props.onUpdateCursor(cursor);
      if (this.state.pivot !== pivot) this.props.onUpdatePivot(pivot);

      this.setState({
        cursor: cursor,
        pivot: pivot
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          items = _props3.items,
          itemWidth = _props3.itemWidth,
          itemHeight = _props3.itemHeight,
          style = _props3.style,
          className = _props3.className,
          focusedStyle = _props3.focusedStyle,
          focusedClassName = _props3.focusedClassName;


      var children = items.map(function (item, index) {
        return React.createElement(
          Item,
          { key: index, width: itemWidth, height: itemHeight },
          item
        );
      });

      return React.createElement(
        'div',
        {
          role: 'menu',
          style: _extends({}, style, this.state.focused ? focusedStyle : {}, componentStyle),
          className: mergeClassNames(className, this.state.focused ? focusedClassName : ''),
          onClick: this.handleClick,
          onKeyDown: this.handleKeyDown,
          onFocus: this.handleFocus,
          onBlur: this.handleBlur,
          tabIndex: 0
        },
        children
      );
    }
  }]);
  return TileListView;
}(React.Component);


TileListView.propTypes = {
  items: PropTypes.arrayOf(PropTypes.node).isRequired,
  itemWidth: PropTypes.number.isRequired,
  itemHeight: PropTypes.number.isRequired,
  selection: PropTypes.arrayOf(PropTypes.number).isRequired,

  style: styleProptype,
  className: PropTypes.string,
  focusedStyle: styleProptype,
  focusedClassName: PropTypes.string,

  onUpdateSelection: PropTypes.func,
  onUpdateCursor: PropTypes.func,
  onUpdatePivot: PropTypes.func
};

TileListView.defaultProps = {
  style: {},
  className: '',
  focusedStyle: {},
  focusedClassName: '',

  onUpdateSelection: function onUpdateSelection() {},
  onUpdateCursor: function onUpdateCursor() {},
  onUpdatePivot: function onUpdatePivot() {}
};

export default TileListView;
