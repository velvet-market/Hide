$(document).ready(() => {  
  chrome.storage.sync.get(["logo"], (storageObj) => {
    $("#logo").attr("src", storageObj.logo)
  })

  $("#confirm_btn").on("click", () => {
    let urlBox = $("#url_textbox")
    let newUrl = addhttp(urlBox.val())
    
    chrome.storage.sync.set({
      "url": newUrl
    })

    $("#description").text("URL set to: " + newUrl);
    // callAlert(urlBox);
  })
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