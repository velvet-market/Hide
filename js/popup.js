$(document).ready(() => {  
  $("#confirm_btn").on("click", () => {
    let urlBox = $("#url_textbox")
    // callAlert(urlBox);
    
    chrome.storage.sync.set({
      "url": urlBox.val()
    })
  })
})

const callAlert = (input) => {
  alert("The entered url is : " + input.val());
}