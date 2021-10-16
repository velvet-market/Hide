$(document).ready(() => {  
  $("#confirm_btn").on("click", () => {
    $("#description").text("URL set to: " + $("#url_textbox").val());
    chrome.storage.sync.set({
      "url": urlBox.val()
    })
  })

})
