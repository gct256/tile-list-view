import React from 'react';
import PropTypes from 'prop-types';
import styleProptype from 'react-style-proptype';

import { getCols, getScroll, makeRange, mergeClassNames } from './utils';
import Item from './Item';

const componentStyle = {
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
  alignContent: 'flex-start',
};

const keyMap = {
  arrowup: { dx: 0, dy: -1 },
  arrowdown: { dx: 0, dy: 1 },
  arrowleft: { dx: -1, dy: 0 },
  arrowright: { dx: 1, dy: 0 },
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

/**
 * Tile list view
 */
export default class TileListView extends React.Component {
  static propTypes = {
    /** tile items. */
    items: PropTypes.arrayOf(PropTypes.node).isRequired,

    /** element width of item. */
    itemWidth: PropTypes.number.isRequired,

    /** element height of item. */
    itemHeight: PropTypes.number.isRequired,

    /** array of selected index number. */
    selection: PropTypes.arrayOf(PropTypes.number).isRequired,

    /** style for view element. */
    style: styleProptype,

    /** className for view element. */
    className: PropTypes.string,

    /** style for view element at focused. */
    focusedStyle: styleProptype,

    /** className for view element at focused. */
    focusedClassName: PropTypes.string,

    /** callback for update selection. */
    onUpdateSelection: PropTypes.func,

    /** callback for update cursor index. */
    onUpdateCursor: PropTypes.func,

    /** callback for update pivot index. */
    onUpdatePivot: PropTypes.func,
  };

  static defaultProps = {
    style: {},
    className: '',
    focusedStyle: {},
    focusedClassName: '',

    onUpdateSelection() {},
    onUpdateCursor() {},
    onUpdatePivot() {},
  };

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  state = {
    /** index of cursor. */
    cursor: -1,

    /** index of pivot. */
    pivot: -1,

    /** flag for element focus. */
    focused: false,
  };

  handleClick(event) {
    const { itemWidth, itemHeight, selection } = this.props;
    const { pivot } = this.state;

    const div = event.currentTarget;
    const cols = getCols(div, itemWidth);

    const { left, top } = div.getBoundingClientRect();
    const x = event.pageX - left;
    const y = event.pageY - top;

    const offsetX = -getScroll('scrollLeft', div.parentNode);
    const offsetY = div.scrollTop - getScroll('scrollTop', div.parentNode);

    if (x + offsetX >= cols * itemWidth) {
      this._select([], -1, -1);
      return;
    }

    const col = Math.floor((x + offsetX) / itemWidth);
    const row = Math.floor((y + offsetY) / itemHeight);
    const index = col + row * cols;

    if (event.ctrlKey || event.metaKey) {
      if (selection.indexOf(index) < 0) {
        this._select([...selection, index], index, index);
      } else {
        this._select(selection.filter(i => i !== index), index, index);
      }
    } else if (event.shiftKey) {
      this._select(makeRange(pivot, index), index, pivot);
    } else {
      this._select([index], index, index);
    }
    event.preventDefault();
    event.stopPropagation();
  }

  handleKeyDown(event) {
    const key = `${event.key}`.toLowerCase();

    if (!(key in keyMap) && key !== ' ') return;

    event.preventDefault();
    event.stopPropagation();

    const {
      items, itemWidth, itemHeight, selection,
    } = this.props;
    const { cursor, pivot } = this.state;
    if (!items) return;

    if (key === ' ') {
      if (event.ctrlKey || event.metaKey) {
        if (selection.indexOf(cursor) < 0) {
          this._select([].concat(selection, cursor), cursor, cursor);
        } else {
          this._select(selection.filter(x => x !== cursor), cursor, cursor);
        }
      } else if (event.shiftKey) {
        this._select(makeRange(pivot, cursor), cursor, pivot);
      } else if (selection.indexOf(cursor) < 0) {
        this._select([cursor], cursor, cursor);
      }
      return;
    }

    const { dx, dy } = keyMap[key];
    const div = event.currentTarget;
    const cols = getCols(div, itemWidth);
    const rows = Math.ceil(items.length / cols);
    const preIndex = cursor + dx + dy * cols;
    if (preIndex < 0 || cols * rows <= preIndex) return;
    const index = items.length <= preIndex ? items.length - 1 : preIndex;

    const y0 = div.scrollTop;
    const y1 = y0 + div.getBoundingClientRect().height;
    const y2 = Math.floor(index / cols) * itemHeight;
    const y3 = y2 + itemHeight;
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

  handleFocus() {
    this.setState({ focused: true });
  }

  handleBlur() {
    this.setState({ focused: false });
  }

  _select(newSelection, cursor, pivot) {
    const selectionUpdated =
      newSelection.length !== this.props.selection.length ||
      !newSelection.every(x => this.props.selection.indexOf(x) >= 0);
    if (this.state.cursor === cursor && this.state.pivot === pivot && !selectionUpdated) return;

    if (selectionUpdated) this.props.onUpdateSelection(newSelection);
    if (this.state.cursor !== cursor) this.props.onUpdateCursor(cursor);
    if (this.state.pivot !== pivot) this.props.onUpdatePivot(pivot);

    this.setState({
      cursor,
      pivot,
    });
  }

  render() {
    const {
      items,
      itemWidth,
      itemHeight,
      style,
      className,
      focusedStyle,
      focusedClassName,
    } = this.props;

    const children = items.map((item, index) => (
      <Item key={index} width={itemWidth} height={itemHeight}>
        {item}
      </Item>
    ));

    return (
      <div
        role="menu"
        style={{
          ...style,
          ...(this.state.focused ? focusedStyle : {}),
          ...componentStyle,
        }}
        className={mergeClassNames(className, this.state.focused ? focusedClassName : '')}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        tabIndex={0}
      >
        {children}
      </div>
    );
  }
}
