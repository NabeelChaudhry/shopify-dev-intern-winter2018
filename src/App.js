import React, { Component } from 'react';
import Search from './components/search/search';
import RepoTable from './components/repoTable/repoTable'
import axios from 'axios';
import './App.css';

const access_token = '8cd5b1310c5e0f6aa65149d9dbf7e56798da4516';
const base_url = "https://api.github.com";
const search_repo = "/search/repositories";

const FavsLocalStorageKey = 'shopifyFavs'

class App extends Component {

  constructor(props) {
    super(props);
    
    let savedFavs = localStorage.getItem(FavsLocalStorageKey);
    if (savedFavs) {
      savedFavs = JSON.parse(savedFavs);
    }

    this.state = {
      searchResults: [],
      favorites: savedFavs ? savedFavs : []
    };
  }

  copyObject(object) {
    return JSON.parse(JSON.stringify(object));
  }

  searchRepos = (userInput) => {
    // Clear search results of user cleared input field 
    if (userInput === "") {
      this.setState({
        searchResults: []
      });
      return; 
    }

    axios.get(base_url + search_repo, {
      params: {
        q: userInput,
        sort: "stars",
        order: "desc"
      },
      headers: {
        Authorization: "bearer" + access_token
      }
    })
    .then(response => {
      const searchData = response.data.items.slice(0,10);
      let tagsPromises = [];
      const favoriteRepoNames = this.state.favorites.map(repo => repo.name);

      searchData.forEach(repo => {
        // Get tags
        tagsPromises.push(axios.get(repo.tags_url, 
          { headers: 
            {
              Authorization: "bearer" + access_token
            }
          }).then(response => {
            const tags = response.data;
            repo.tag = tags.length > 0 ? tags[0].name : ''
            // See if sarch result is already in favorites
            repo.actionFlag = !favoriteRepoNames.includes(repo.name);
          }));
      });

      // Set state after all API calls to get tags are complete
      axios.all(tagsPromises).then(response => {
        this.setState({
          searchResults: searchData
        })
      })
      
    })
    .catch(error => {
      console.log(error);
    })
  }

  updateActionFlags(searchResults, repoToUpdate) {
    // Update add flags for search results
    return searchResults.map(repo => {
      if (repo.name === repoToUpdate) {
        repo.actionFlag = !repo.actionFlag;
      }
      return repo;
    });
  }

  addFavorites = (repo) => {
    // We need copies of the objects before we update them
    var repoCopy = this.copyObject(repo);
    repoCopy.actionFlag = true;
    var searchResultsCopy = this.copyObject(this.state.searchResults);
    searchResultsCopy = this.updateActionFlags(searchResultsCopy, repo.name)
    this.setState({
      favorites: [...this.state.favorites, repoCopy],
      searchResults: searchResultsCopy
    }, () => {
      localStorage.setItem(FavsLocalStorageKey, JSON.stringify(this.state.favorites));
    });
  }

  removeFavorites = (repo) => {
    let savedFavs = localStorage.getItem(FavsLocalStorageKey);
    if (savedFavs) {
      savedFavs = JSON.parse(savedFavs);
      const updatedFavs = savedFavs.filter( currRepo => currRepo.name !== repo.name);

      var searchResultsCopy = this.copyObject(this.state.searchResults);
      searchResultsCopy = this.updateActionFlags(searchResultsCopy, repo.name)

      this.setState({
        favorites: updatedFavs,
        searchResults: searchResultsCopy
      });
    
      // update locale storage
      localStorage.setItem(FavsLocalStorageKey, JSON.stringify(updatedFavs));
    }
  }
  
  render() {
    return (
      <div className="app-container">
        <div className="header">My Github Favorites</div>
        <div className="float-left">
          <Search onSearch={this.searchRepos} />
          {this.state.searchResults && <RepoTable data={this.state.searchResults} actionFunction={this.addFavorites} action="Add"/>}
        </div>
        <div className="float-right">
           {/* Shopify specs say to only render the favorites when there is more than one...(> 1) */}
          {this.state.favorites.length > 1 && <RepoTable data={this.state.favorites} actionFunction={this.removeFavorites} action="Remove"/>}
        </div>
      </div>
    );
  }
}

export default App;
