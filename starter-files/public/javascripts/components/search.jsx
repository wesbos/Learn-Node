import React, {Fragment} from 'react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import SearchItem from './SearchItem.jsx';

class Search extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      keyword: '',
      stores: []
    }

    this.getStore = debounce(this.getStore, 300);
  }

  getStore = async () => {
    const { keyword } = this.state;

    try {
      const {data: stores} = await axios.get(`/search?q=${keyword}`);

      this.setState(() => ({
        stores
      }));
    } catch(err) {
      console.error(err);
    }
  }

  onChange = (e) => {
    this.setState({
      keyword: e.target.value
    });

    this.getStore();
  }

  render() {
    const { keyword, stores } = this.state;
    return (
      <Fragment>
        <input
          onChange={this.onChange}
          value={keyword} 
          className="search__input" 
          placeholder="Coffee, beer..." 
          name="search"
        />
        <div className="search__results">
        {
          stores.map((store) => (
            <SearchItem item={store} />
          ))
        }
        </div>
      </Fragment>
    )
  }
}

export default Search;
