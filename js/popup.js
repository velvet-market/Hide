$(document).ready(() => {  
  chrome.storage.sync.get(["logo"], (storageObj) => {
    $("#logo").attr("src", storageObj.logo)
  })

  addConfirm()
  addHotkey()
})

const addhttp = (url) => {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = "http://" + url;
  }

  return url;
}

const callAlert = (input) => {
  alert("The entered url is : " + input.val());
}

const addConfirm = () => {
  $("#confirmBtn").on("click", () => {
    let urlBox = $("#urlTextBox")
    let newUrl = addhttp(urlBox.val())
    
    chrome.storage.sync.set({
      "url": newUrl
    })

    $("#description").text("URL set to: " + newUrl);
    // callAlert(urlBox);
  })
}

const addHotkey = () => {
  $("#hotkeyBtn").on("click", () => {
    chrome.runtime.sendMessage({
      hotkeyUrl: "chrome://extensions/shortcuts"
    })
  });
}