$(document).ready(() => {  
  chrome.storage.sync.get(["logo"], (storageObj) => {
    $("#logo").attr("src", storageObj.logo)
  })

  addConfirm()
  addHotkey()
  addToggle()
})

const addhttp = (url) => {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = "http://" + url;
  }

  return url;
}

const validURL = (str) => {
  let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

const callAlert = (input) => {
  alert("The entered url is : " + input.val());
}

const addConfirm = () => {
  $("#confirmBtn").on("click", () => {
    let urlBox = $("#urlTextBox")
    let newUrl = addhttp(urlBox.val())
    if (validURL(newUrl)) {
      chrome.storage.sync.set({
        "url": newUrl
      })

      $("#description").text("URL set to: " + newUrl);
      // callAlert(urlBox);
    } else {
      $("#description").text("Invalid URL :(");
    }

    let toggleVal = $("#historyToggle").is(":checked");
    if (toggleVal) {
      let timeVal = $("#time").val() * 60000

      chrome.storage.sync.set({
        "clearTime": timeVal
      })
    }
  })
}

const addHotkey = () => {
  $("#hotkeyBtn").on("click", () => {
    chrome.runtime.sendMessage({
      hotkeyUrl: "chrome://extensions/shortcuts"
    })
  });
}

const addToggle = () => {
  $("#historyToggle").on("change", () => {
    let status = $("#historyToggle").is(":checked");
    console.log(status)
    if (status) {
      $("#time").prop("disabled", false);
      chrome.storage.sync.set({
        "historyClear": true
      })
    } else {
      $("#time").prop("disabled", true);
      chrome.storage.sync.set({
        "historyClear": false
      })
    }
  })
}