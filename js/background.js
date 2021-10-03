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

const DEFAULT_URL = "https://google.com/"
const DEFAULT_OPTION = "closeAll"
const DEFAULT_TRIGGER = "Alt+P" // need to change manifest as well
const DEFAULT_RESTORE = "Alt+O" // need to change manifest as well

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    "url": DEFAULT_URL,
    "hotkey": DEFAULT_TRIGGER,
    "option": DEFAULT_OPTION
  });

  console.log(`url: ${DEFAULT_URL}`);
  console.log(`hotkey: ${DEFAULT_TRIGGER}`);
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "trigger") {
    chrome.storage.sync.get(["option"], (optionVal) => {
      let currentOption = optionVal.option
  
      if (currentOption === "closeAll") closeAllTabs();
      openNewWindow();
    });
  }
});

const closeAllTabs = () => {
  chrome.tabs.query({}, (tabs) => {
    for (let tab of tabs) {
      if (tab.pinned === false) chrome.tabs.remove(tab.id);
    }
  });
}

const openNewTab = () => {
  chrome.storage.sync.get(["url"], (urlVal) => {
    chrome.tabs.create({ 
      url: urlVal.url
    });
  });
}

const openNewWindow = () => {
  chrome.storage.sync.get(["url"], (urlVal) => {
    chrome.windows.create({ 
      url: urlVal.url,
      state: "maximized"
    });
  });
}

