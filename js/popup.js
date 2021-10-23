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

    let toggleVal = $("#historyToggle").val()
    if(toggleVal){
      let timeVal = $("time").val*6000
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
    } else {
      $("#time").prop("disabled", true);
    }
  })
}