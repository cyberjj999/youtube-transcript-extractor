// Demo: var serialized_html = DOMtoString(document);
// As of 28 Mar 2022, YouTube has changed their HTML DOM and the script is not functioning. I have created another python script which uses the api mentioned below to extract YouTube transcript.
// https://stackoverflow.com/questions/14061195/how-to-get-transcript-in-youtube-api-v3

// Format transcript text by breaking it into chunks of 60 words
function formatTranscriptText(text) {
    var wordArrays = text.split(" ");
    var paragraphText = "";
    var counter = 0;
    for (let i = 0; i < wordArrays.length; i++) {
        paragraphText += wordArrays[i] + " ";
        counter++;
        if (counter == 60) {
            paragraphText += "\n\n";
            counter = 0;
        }
    }
    return paragraphText;
}

// Function to check if transcript is available
function isTranscriptAvailable() {
    transcriptAvailable = true;
    
    // const wait=ms=>new Promise(resolve => setTimeout(resolve, ms));
    
    // // Click more actions (open dropdown to populate option for opening transcript)
    // let menu = document.getElementById("menu-container").getElementsByTagName("yt-icon-button");
    // for (var i = 0; i < menu.length; i++) {
    //     if (menu[i].className == "dropdown-trigger style-scope ytd-menu-renderer") {
    //         menu[i].click();
    //     }
    // }

    // // Open Transcript
    // setTimeout(function () {
    //     // Use timeout to prevent null error
    //     // var x = document.querySelector('#items > ytd-menu-service-item-renderer > tp-yt-paper-item');
    //     var x = document.querySelector("#items > ytd-menu-service-item-renderer:nth-child(2) > tp-yt-paper-item");
    //     x.click();
    // }, 500);
    
    
    /* This code does not work when there is advertisement with subtitles - please refer to the updated code above */
    let captionButton = document.querySelector(
        "#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-subtitles-button.ytp-button"
    );
    if (captionButton === null) {
        alert("Invalid Website (Please use this on YouTube only)");
        transcriptAvailable = false;
    }
    // https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
    else if (captionButton.offsetParent === null) {
        alert("No Caption In Video! Unable to Extract Transcript!");
        transcriptAvailable = false;
    }
    return transcriptAvailable;
}

function copyTextToClipboard(transcriptText){    
    // Quick Formatting (feel free to remove)
    paragraphText = formatTranscriptText(transcriptText);        
    navigator.clipboard
        .writeText(paragraphText)
        .then(
            () => {
                //clipboard successfully set
                alert("Copy Successful!");
            },
            () => {
                //clipboard write failed, use fallback
                alert("Copy Failed!");
            }
        )
        .catch((err) => {
            console.error("Failed to read clipboard contents: ", err);
        });        
}

function extractTranscriptText() {
    transcriptAvailable = isTranscriptAvailable();
    if (transcriptAvailable == false ) return

    alert("Starting Transcript Extraction...");    
    var transcriptText = "";

    let transcriptBody = document.querySelector("#body > ytd-transcript-body-renderer");
    if (transcriptBody != null) {        
        let transcriptBodyList = document.querySelector("#body > ytd-transcript-body-renderer").childNodes;
        // Loop through all transcriptBodyList and extract transcript text
        for (var i = 0; i < transcriptBodyList.length; i++) {
            var transcriptChild = transcriptBodyList[i]; // extract i-th child
            if (transcriptChild != undefined) { // check if child is defined
                var transcriptChildText = document.querySelectorAll("div.cues.style-scope.ytd-transcript-body-renderer > div")[i];
                if (transcriptChildText != undefined) {
                    transcriptChildText = transcriptChildText.innerText;
                    transcriptText += transcriptChildText + " ";
                }
                // alert(transcriptChildText);
            }
        }
        copyTextToClipboard(transcriptText);
        return
    }
    
    // Click more actions (open dropdown to populate option for opening transcript)
    let menu = document.getElementById("menu-container").getElementsByTagName("yt-icon-button");
    for (var i = 0; i < menu.length; i++) {
        if (menu[i].className == "dropdown-trigger style-scope ytd-menu-renderer") {
            menu[i].click();
        }
    }

    // Open Transcript
    setTimeout(function () {
        // Use timeout to prevent null error
        var x = document.querySelector("#items > ytd-menu-service-item-renderer:nth-child(2) > tp-yt-paper-item");
        x.click();
    }, 500);

    // Extract Transcript Content
    setTimeout(function () {
        // Use timeout to prevent null error
        // Select Transcript Body's ChildNodes List (i.e. all child tags that contain transcript text + timestamp)
        let transcriptBody = document.querySelector("#body > ytd-transcript-body-renderer");
        if (transcriptBody == null) {
            alert("Error! Transcript Body Cannot Be Found!");
        }
        let transcriptBodyList = document.querySelector("#body > ytd-transcript-body-renderer").childNodes;
        // Loop through all transcriptBodyList and extract transcript text
        for (var i = 0; i < transcriptBodyList.length; i++) {
            var transcriptChild = transcriptBodyList[i]; // extract i-th child
            if (transcriptChild != undefined) { // check if child is defined
                var transcriptChildText = document.querySelectorAll("div.cues.style-scope.ytd-transcript-body-renderer > div")[i];
                if (transcriptChildText != undefined) {
                    transcriptChildText = transcriptChildText.innerText;
                    transcriptText += transcriptChildText + " ";
                }
                // alert(transcriptChildText);
            }
        }
        copyTextToClipboard(transcriptText);
        // // alert(transcriptText);
        // return transcriptText;'
    }, 3000);
}

extractTranscriptText();

// chrome.runtime.sendMessage({
//     action: "getTranscript",
//     source: extractTranscriptText(),
// });
