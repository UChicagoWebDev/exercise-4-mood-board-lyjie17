const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

function runSearch() {

  // TODO: Clear the results pane before you run a new search
  document.getElementById("resultsImageContainer").innerHTML = "";

  openResultsPane();

  // TODO: Build your query by combining the bing_api_endpoint and a query attribute
  //  named 'q' that takes the value from the search bar input field.
  const query = document.querySelector(".search input").value;
  const url = `${bing_api_endpoint}?q=${encodeURIComponent(query)}`;

  let request = new XMLHttpRequest();
  request.open("GET", url);
  // TODO: Construct the request object and add appropriate event listeners to
  // handle responses. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest
  //
  //   - You'll want to specify that you want json as your response type
  //   - Look for your data in event.target.response
  //   - When adding headers, also include the commented out line below. See the API docs at:
  // https://docs.microsoft.com/en-us/bing/search-apis/bing-image-search/reference/headers
  //   - When you get your responses, add elements to the DOM in #resultsImageContainer to
  //     display them to the user
  //   - HINT: You'll need to add event listeners to them after you add them to the DOM
  //
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  request.responseType = 'json';
  request.onload = function() {
    console.log(request.response);
    displayImages(request.response.value);
    displayRelatedRes(request.response.relatedSearches);
  };
  // TODO: Send the request
  request.send();

  return false;  // Keep this; it keeps the browser from sending the event
                  // further up the DOM chain. Here, we don't want to trigger
                  // the default form submission behavior.
}

function addImage(url) {
  // This will add image to board
  const board = document.getElementById("board");
  const image = document.createElement("img");
  image.src = url;
  board.appendChild(image);
}

function displayImages(images) {
  // This will display images in image container and add image if clicked
  const container = document.getElementById("resultsImageContainer");
  images.forEach(image => {
    const imgElement = document.createElement("img");
    imgElement.src = image.thumbnailUrl;
    //imgElement.alt = image.name;
    //imgElement.title = image.name;
    imgElement.addEventListener("click", function() {
      addImage(image.contentUrl);
    });
    container.appendChild(imgElement);
  });
}

function displayRelatedRes(suggestions) {
  const container = document.getElementById("suggestions_list");
  container.innerHTML = "";
  suggestions.forEach(suggestion => {
      const li = document.createElement("li");
      // const button = document.createElement("button");
      li.textContent = suggestion.text;
      li.addEventListener("click", function() {
          document.querySelector(".search input").value = suggestion.text;
          runSearch();
      });

      //li.appendChild(button);
      container.appendChild(li);
  });
}

function openResultsPane() {
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

// This will 
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {runSearch()}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") {closeResultsPane()}
});
