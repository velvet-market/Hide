document.addEventListener("DOMContentLoaded", documentEvents, false);

const callAlert = (input) => {
  alert("The entered url is : " + input.value);
}

function documentEvents() {
  let button = document.getElementById("confirm_btn")
  button.addEventListener("click", () => {
    let urlBox = document.getElementById("url_textbox");
    callAlert(urlBox);

    chrome.storage.sync.set({
      "url": urlBox.value
    })
  })
}