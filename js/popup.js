document.addEventListener('DOMContentLoaded', documentEvents  , false);

function myAction(input) { 
  alert("The entered url is : " + input.value);

}
function documentEvents() {    
  document.getElementById('confirm_btn').addEventListener('click', 
    function() { myAction(document.getElementById('url_textbox'));
    chrome.storage.sync.set({
      "url": input.value
    });
  });

}