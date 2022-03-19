const DEFAULT_URL = "https://www.google.com/"
const DEFAULT_OPTION = "closeAll"
const DEFAULT_HIDE = "Alt+P" // need to change manifest as well
const DEFAULT_RESTORE = "Alt+O" // need to change manifest as well
const DEFAULT_CLEARHISTORY = false;
const DEFAULT_CLEARTIME = 60;

let savedLinks = []
let dummyTabId = -1
let dummyWindowId = -1
let dummyUrl = ""

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    "url": DEFAULT_URL,
    "option": DEFAULT_OPTION,
    "hide": DEFAULT_HIDE,
    "restore": DEFAULT_RESTORE,
    "clearHistory" : DEFAULT_CLEARHISTORY,
    "clearTime" :  DEFAULT_CLEARTIME
  });
});

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "hotkey") chrome.tabs.create({url: req.hotKeyUrl});
  else if(req.type === 'incognito') chrome.tabs.create({url: req.incognitoKeyUrl})
  else if (req.type === "message") {
    controller(req.msg);
  }
});

chrome.commands.onCommand.addListener((command) => {
  controller(command);
});

const controller = (command) => {
  if (command === "hide") {
    changeLogo(command);
    hide();
  } else if (command === "restore") {
    changeLogo(command);
    restoreTabs();
  }
}

const closeAllTabs = () => {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    for (let tab of tabs) chrome.tabs.remove(tab.id);
  });
}

const hide = () =>{
  chrome.storage.sync.get(["option", "clearHistory", "clearTime"], (storageObj) => {
    let clearHistory = storageObj.clearHistory
    let clearTime = storageObj.clearTime
      
    chrome.tabs.query({currentWindow: true}, (tabs) => {  
      savedLinks = []

      for (let tab of tabs) {
        if (tab.url) savedLinks.push(tab.url);
        else if (tab.pendingUrl) savedLinks.push(tab.pendingUrl);
      }

      chrome.action.setBadgeText({
        text: savedLinks.length.toString()
      });

      if (clearHistory === true) {
        let time = (new Date()).getTime() - (clearTime * 60000);
        chrome.browsingData.remove({
            "since": time
          }, {
            "history": true,
          }, );
      }

      closeAllTabs();
    });

    chrome.action.setIcon({
      path : "/images/closed-16.png"
    });

    

    openNewWindow();
  });
}

const restoreTabs = () => {
  chrome.windows.getLastFocused((window) => {
    if (window.id == dummyWindowId) {
      chrome.tabs.get(dummyTabId, (tab) => {
        let url = tab.url ? tab.url : tab.pendingUrl
        if (url == dummyUrl) chrome.tabs.remove(dummyTabId)

        dummyTabId = -1
        dummyWindowId = -1
        dummyUrl = ""
      })
    }
  })

  chrome.action.setIcon({
    path : "/images/open-16.png"
  });

  chrome.action.setBadgeText({
    text: ''
  });


  for (let link of savedLinks) {
    chrome.tabs.create({
      url: link
    })
  }

  savedLinks = [];
}

const openNewWindow = () => {
  chrome.storage.sync.get(["url"], (storageObj) => {
    chrome.windows.create({ 
      url: storageObj.url,
      state: "maximized",
      focused: true
    }, (newWindow) => {
      dummyTabId = newWindow.tabs[0].id
      dummyWindowId = newWindow.id
      dummyUrl = newWindow.tabs[0].url ? newWindow.tabs[0].url : newWindow.tabs[0].pendingUrl
    });
  });
}

const changeLogo = (mode) => {
  let logoLink = "/images/";

  if (mode == "hide") {
    logoLink += "closed-48.png"
  } else if (mode == "restore") {
    logoLink += "open-48.png"
  }

  chrome.storage.sync.set({
    "logo": logoLink
  })
}





