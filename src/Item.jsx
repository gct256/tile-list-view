import React from 'react';
import PropTypes from 'prop-types';

/**
 * Tile view list item component
 */
export default class Item extends React.PureComponent {
  static propTypes = {
    /** element width of item. */
    width: PropTypes.number.isRequired,

    /** element height of item. */
    height: PropTypes.number.isRequired,

    /** child nodes. */
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  };

  render() {
    const { width, height } = this.props;

    return (
      <div
        style={{
          width,
          height,
        }}
      >
        {this.props.children}
      </div>
    );
  }
}
