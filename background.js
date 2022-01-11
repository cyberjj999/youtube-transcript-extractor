chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(
        null,
        {
            file: "get-youtube-transcript.js",
        },
        function () {
            // If you try and inject into an extensions page or the webstore/NTP you'll get an error
            if (chrome.runtime.lastError) {
                alert("There was an error injecting script : \n" + chrome.runtime.lastError.message);
                // message.innerText =
                //     "There was an error injecting script : \n" +
                //     chrome.runtime.lastError.message;
            }
        }
    );
});

/* UNUSED CODES */

// "default_popup": "popup.html" // included in manifest.json

// chrome.runtime.onMessage.addListener(function (request, sender) {
//     if (request.action == "getTranscript") {
//         message.innerText = request.source;
//     }
// });

// function onWindowLoad() {
//     // var message = document.querySelector("#message");

//     chrome.tabs.executeScript(
//         null,
//         {
//             file: "get-youtube-transcript.js",
//         },
//         function () {
//             // If you try and inject into an extensions page or the webstore/NTP you'll get an error
//             if (chrome.runtime.lastError) {                
//                 message.innerText =
//                     "There was an error injecting script : \n" +
//                     chrome.runtime.lastError.message;
//             }
//         }
//     );
// }

// window.onload = onWindowLoad;
