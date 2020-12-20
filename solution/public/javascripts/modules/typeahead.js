const axios = require("axios");

const apiEndpoint = "/api/search";
const activeClass = "search__result--active";

const searchResultsHtml = (stores) => {
  return stores
    .map((store) => {
      return `
    <a href="/stores/${store.slug}" class="search__result" ><strong>${store.name}</strong></a>
  `;
    })
    .join("");
};

export default function typeAhead(searchEl) {
  if (!searchEl) {
    return;
  }
  const searchInput = searchEl.querySelector("input[name='search']");
  const searchResults = searchEl.querySelector(".search__results");

  let timeout;
  let numResults = 0;
  searchInput.on("input", function (e) {
    if (timeout) {
      clearTimeout(timeout);
    }
    if (this.value === "") {
      searchResults.style.display = "none";
      return;
    }
    searchResults.style.display = "block";
    timeout = setTimeout(async () => {
      searchResults.innerHTML = "";
      numResults = 0;
      try {
        const results = await axios.get(apiEndpoint, {
          params: { q: e.target.value },
        });
        const { data } = results;
        if (data.length === 0) {
          return;
        }
        searchResults.innerHTML = searchResultsHtml(data);
        numResults = data.length;
      } catch (error) {
        console.error(error);
      }
    }, 250);
  });

  searchInput.on("keyup", (e) => {
    const key = e.keyCode;
    // if key is not enter, up or down
    if (![13, 40, 38].includes(key) || numResults === 0) {
      return; // do nothing
    }
    const elements = searchResults.querySelectorAll(".search__result");
    const current = searchResults.querySelector(`.${activeClass}`);
    let next;
    switch (key) {
      case 13:
        if (current) {
          // there is selected link, click it
          window.location = current.href;
        }
        break;
      case 40:
        // console.log("go down");
        if (current) {
          next = current.nextElementSibling || elements[0];
        } else {
          next = elements[0];
        }
        break;
      case 38:
        // console.log("go up");
        if (current) {
          next =
            current.previousElementSibling || elements[elements.length - 1];
        } else {
          next = elements[elements.length - 1];
        }
        break;
      default:
        console.error(`which key is ${key}`);
        break;
    }

    current && current.classList.remove(activeClass);
    next.classList.add(activeClass);
  });
}
