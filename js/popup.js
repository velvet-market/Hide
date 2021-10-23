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

    let toggleVal = $("#historyToggle").val()
    if(toggleVal){
      let timeVal = $("time").val
      // if(timeVal==="15"){
        
    
      // }
    }
  })

  $("#historyToggle").on("change", () => {
    let status = $("#historyToggle").is(":checked");
    console.log(status)
    if (status) {
      $("#time").prop("disabled", false);
    } else {
      $("#time").prop("disabled", true);
    }
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