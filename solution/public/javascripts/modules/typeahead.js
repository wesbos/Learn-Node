const axios = require("axios");

const apiEndpoint = "/api/search";

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

  let currPos = -1;
  let activeElement;
  searchInput.on("keyup", (e) => {
    const key = e.keyCode;
    // if key is not enter, up or down
    if (![13, 40, 38].includes(key) || numResults === 0) {
      return; // do nothing
    }
    switch (key) {
      case 13:
        if (currPos > -1 && activeElement) {
          // there is selected link, click it
          activeElement.click();
        }
        break;
      case 40: // down?
        console.log("go down");
        if (currPos + 1 === numResults) {
          // already all the way down
          currPos = 0;
        } else {
          currPos += 1;
        }
        break;
      case 38: // down?
        console.log("go up");
        if (currPos === 0) {
          // already all the way up
          currPos = numResults - 1;
        } else {
          currPos -= 1;
        }
        break;
      default:
        console.error(`which key is ${key}`);
        break;
    }
    console.log(key, currPos);
    const elements = searchResults.querySelectorAll(".search__result");
    activeElement = elements[currPos];
    elements.forEach((el) => el.classList.remove("search__result--active"));
    activeElement.classList.add("search__result--active");
  });
}
