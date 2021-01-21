const axios = require('axios');
import dompurify from 'dompurify';

function searchResultsHTML(stores) {
  return stores.map(store => {
    return `
      <a href="/store/${store.slug}" class="search__result">
        <strong>${store.name}</strong>
      </a>
    `
  }).join('')
}
function typeAhead(search) {
  if(!search) return;
  // console.log(search)

  const searchInput = search.querySelector('input[name="search"]')
  const searchResults = search.querySelector('.search__results')
  

  searchInput.on('input', function() {
    // if there is no value, quit
    if(!this.value) {
      searchResults.style.display = 'none';
      return;
    }
    // show search results
    searchResults.style.display = 'block';

    axios.get(`/api/search?q=${this.value}`)
    .then(resp => {
      if(resp.data.length) {
        searchResults.innerHTML =  dompurify.sanitize(searchResultsHTML(resp.data));
        return;
        // console.log(html)
        //  searchResults.innerHTML = html.name;
      }
      searchResults.innerHTML = dompurify.sanitize(`<div class="search__result">No results found for '${this.value}'</div>`);
    }).catch(err => {
      console.err(err)
    })
  })
  // key events
  searchInput.on('keyup', (e) => {
    // if they aren't presssing up down or enter, it dont matter 
    if(![38, 40, 13].includes(e.keyCode)) return;

    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.search__result');
    let next;

    if(e.keyCode === 40 && current) {
      next = current.nextElementSibling || items[0]
    } else if(e.keyCode === 40) {
      next = items[0]
    } else if(e.keyCode === 38 && current) {
      next = current.previousElementSibling || items[items.length - 1]
    } else if(e.keyCode === 38) {
      next = items[items.length - 1]
    } else if(e.keyCode === 13 && current.href) {
      window.location = current.href;
      return;
    }
    if(current) {
      current.classList.remove(activeClass)
    }
    next.classList.add(activeClass)
  }) 
}

export default typeAhead;