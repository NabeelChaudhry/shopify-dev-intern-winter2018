import React, { Component } from 'react';
import './search.css';

class Search extends Component {

  handleSearch = () => {
    const userInput = document.getElementById("search-txt").value;
    this.props.onSearch(userInput);
  }

  onKeyPress = (event) => {
    // Search if user hits enter
    if (event.which === 13) {
      this.handleSearch();
    }
  }

  onChange = () => {
    // If user clears search text
    const userInput = document.getElementById("search-txt").value;
    if (userInput === "") {
      this.handleSearch();
    }
  }

  render() {
    return (
      <div className="search-container">
        <input type="text" className="search-txt" id="search-txt" onKeyPress={this.onKeyPress} onChange={this.onChange}/>
          <button className="search-btn" onClick={this.handleSearch}>Search</button>
      </div> 
    );
  }
}

export default Search;
