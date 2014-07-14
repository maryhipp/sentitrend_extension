var title;
var url;
var sentimentArray;
var currentTab;
console.log("background is running");

// Icon is clicked and triggers content script which returns url & title for popup
chrome.browserAction.onClicked.addListener(function(tab) {
  getCurrentTab();
  chrome.tabs.executeScript(null, { file: 'inject.js' });

  chrome.runtime.onMessage.addListener(function(request) {
    console.log("request is " + request.title)
    title = request.title;
    url = request.url;
    getAlchemyInfo(url);
    chrome.browserAction.setPopup({tabId: currentTab, popup: 'popup/popup.html'});
  });
});

// query for current tab so content changes between tab switch
function getCurrentTab() {
  chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT},
  function(tabs){
    currentTab = tabs[0].id;
   }
  );
}

// AJAX call to Alchemy API to extract entities & sentiment analysis from URL content
function getAlchemyInfo(url) {
  url = encodeURIComponent(url);
  $.ajax({
    type: 'get',
    url: "https://enigmatic-dawn-5549.herokuapp.com/analyze?url=" + url,
    dataType: 'json'
  }).then(function(response) {
    console.log(response);
    sentimentArray = [];
    for(var i =0; i < response.results.entities.entity.length; i++) {
      sentimentArray.push({
        entity: response.results.entities.entity[i].text,
        score: parseFloat(response.results.entities.entity[i].sentiment.score) || 0
      });
    }
    return sentimentArray;
  });
}



