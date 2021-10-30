/* MIT License

Copyright (c) 2021 Velvet Market

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

const DEFAULT_URL = "https://www.google.com/"
const DEFAULT_OPTION = "closeAll"
const DEFAULT_HIDE = "Alt+P" // need to change manifest as well
const DEFAULT_RESTORE = "Alt+O" // need to change manifest as well
const DEFAULT_HISTORYCLEAR = 1000 * 60 * 60;
const DEFAULT_HISTORYOPTION = false;

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
    "historyClear" : DEFAULT_HISTORYOPTION,
    "clearTime" :  DEFAULT_HISTORYCLEAR
  });
});

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  chrome.tabs.create({ url: req.hotkeyUrl });
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "hide") {
    chrome.storage.sync.get(["option", "historyClear", "clearTime"], (storageObj) => {
      let currentOption = storageObj.option
      let clearHistory = storageObj.historyClear
      let clearTime = storageObj.clearTime
      if (currentOption === "closeAll") {
        chrome.tabs.query({ currentWindow: true }, (tabs) => {
          savedLinks = []
          for (let tab of tabs) {
            if (tab.url) savedLinks.push(tab.url);
            else if (tab.pendingUrl) savedLinks.push(tab.pendingUrl);
          }

          //remove browser history
          console.log(clearHistory)
          if (clearHistory === true) {
            let time = (new Date()).getTime() - clearTime;
            chrome.browsingData.remove({
                "since": time
              }, {
                "history": true,
              }, );
          }

          // closeAllTabs();
        });
      }

      openNewWindow();
    });
  } else if (command === "restore") {
    changeLogo(command, savedLinks.length);
    restoreTabs();
  }
});

const closeAllTabs = () => {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    for (let tab of tabs) chrome.tabs.remove(tab.id);
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

const changeLogo = (mode, length = -1) => {
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





