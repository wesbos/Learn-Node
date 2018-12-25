import React, { Component } from 'react'
import propTypes from 'prop-types';

export default class SearchItem extends Component {
  static propTypes = {
    item: propTypes.object.isRequired
  }

  static defaultProps = {
    item: undefined
  }
  
  render() {
    const { item } = this.props;

    return (
      <a href={`/stores/${item.slug}`} class="search__result">
        <strong>{item.name}</strong>
      </a>
    )
  }
}
