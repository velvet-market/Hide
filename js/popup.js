$(document).ready(() => {  
  chrome.storage.sync.get(["logo"], (storageObj) => {
    $("#logo").attr("src", storageObj.logo);
    console.log(storageObj.logo)

    if(storageObj.logo==="/images/closed-48.png") {
      $("#panicBtn").addClass("btn-success").removeClass("btn-danger")
    } else if (storageObj.logo==="/images/open-48.png"){
      $("#panicBtn").addClass("btn-danger").removeClass("btn-success")
    }
  })

  addConfirm()
  addHotkey()
  addToggle()
  addPanic()
  addEnter()
  addMessage(msg)
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

      $("#description").text("Changed URL :) ");
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
const addPanic = () =>{
  $("#panicBtn").on("click", () => {
    if($("#panicBtn").hasClass("btn-success")){
      alert("1")
      addMessage("hide")
    }  else if ($("#panicBtn").hasClass("btn-danger")){
      alert("2")
      addMessage("restore")
    }
  });
}
const addEnter =() =>{
  $("#urlTextBox").keypress(function (e) {
    var key = e.which;
    if(key == 13 && $("#urlTextBox").hover())  // the enter key code
     {
      let urlBox = $("#urlTextBox")
      let newUrl = addhttp(urlBox.val())
      if (validURL(newUrl)) {
        chrome.storage.sync.set({
          "url": newUrl
        })
  
        $("#description").text("Changed URL :)");
        // callAlert(urlBox);
      } else {
        $("#description").text("Invalid URL :(");
      }
     }
   });   
}

const addMessage = (msg)=>{
alert(3)
alert(msg) 
chrome.runtime.sendMessage({  
  msg: msg,

});

}