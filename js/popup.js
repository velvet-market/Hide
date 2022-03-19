$(document).ready(() => {  
  chrome.storage.sync.get(["logo"], (storageObj) => {
    $("#logo").attr("src", storageObj.logo);

    if(storageObj.logo==="/images/closed-48.png") {
      $("#panicBtn").addClass("btn-success").removeClass("btn-danger")
    } else if (storageObj.logo==="/images/open-48.png"){
      $("#panicBtn").addClass("btn-danger").removeClass("btn-success")
    }
  })

  addConfirm();
  addHotkey();
  addToggle();
  addPanic();
  addEnter();
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
    changeUrl();

    let toggleVal = $("#historyToggle").is(":checked");
    if (toggleVal) {
      let timeVal = $("#time").val() * 60000

      chrome.storage.sync.set({
        "clearTime": timeVal,
        "clearHistory": true
      })
    } else {
      chrome.storage.sync.set({
        "clearHistory": false
      })
    }
  })
}

const addEnter = () => {
  $("#urlTextBox").keypress((e) => {
    let key = e.which;
    if (key == 13 && $("#urlTextBox").hover())  { // 13 = enter key code 
      changeUrl();
    }
  });   
}

const changeUrl = () => {
  let urlVal = $("#urlTextBox").val();
  let newUrl = addhttp(urlVal);

  if (urlVal !== "") {
    if (validURL(newUrl)) {
      chrome.storage.sync.set({
        "url": newUrl
      })

      $("#description").text("Changed URL :)");
      $("#description").css("color", "green");
    } else {
      $("#description").text("Invalid URL :(");
      $("#description").css("color", "red");
    }
  } else {
    $("#description").text("Enter redirect URL: ");
    $("#description").css("color", "black");
  }
}

const addHotkey = () => {
  $("#hotkeyBtn").on("click", () => {
    chrome.runtime.sendMessage({
      type: "hotkey",
      hotKeyUrl: "chrome://extensions/shortcuts"
    })
  });
}
const addIncognito = () => {
  $("#incognitoBtn").on("click", () => {
    chrome.runtime.sendMessage({
      type: "incognito",
      incognitoKeyUrl: "chrome://extensions/?id=" + chrome.runtime.id
    })
  });
}

const addMessage = (message) => {
  chrome.runtime.sendMessage({  
    type: "message",
    msg: message,
  });
}

const addToggle = () => {
  let toggle = $("#historyToggle");
  chrome.storage.sync.get(["clearHistory"], (storageObj) => {
    toggle.prop('checked', storageObj.clearHistory);
  })
  
  toggle.on("change", () => {
    let status = $("#historyToggle").is(":checked");

    if (status) $("#time").prop("disabled", false);
    else $("#time").prop("disabled", true);
  })
}

const addPanic = () =>{
  $("#panicBtn").on("click", () => {
    if($("#panicBtn").hasClass("btn-success")){
      addMessage("restore");
    } else if ($("#panicBtn").hasClass("btn-danger")){
      addMessage("hide");
    }
  });
}