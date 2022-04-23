getAndFormatYoutubeTranscript();

// https://javascript.plainenglish.io/problem-with-returning-values-from-async-await-function-javascript-e99c94a47ca5
async function getAndFormatYoutubeTranscript() {
    alert("Extracting YouTube Transcript...");
    let allTranscriptText = await extractYouTubeTranscript();
    if (allTranscriptText == "No Transcript Available")
        alert("No Transcript Available!");
    else copyTextToClipboard(allTranscriptText);
}

/**
 * Function that extract YouTube transcript through a series of button clicks and looping through youtube transcript HTML DOM's text
 * Reference: https://stackoverflow.com/questions/10596417/is-there-a-way-to-get-element-by-xpath-using-javascript-in-selenium-webdriver
 * @return   {String} All youtube transcript text (unformatted)
 */
async function extractYouTubeTranscript() {
    let allTranscriptText = "";
    let optionsButtonXPath =
        "/html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-flexy/div[5]/div[1]/div/div[6]/div[1]/div[2]/ytd-video-primary-info-renderer/div/div/div[3]/div/ytd-menu-renderer/yt-icon-button";
    let showTranscriptButtonXPath =
        "/html/body/ytd-app/ytd-popup-container/tp-yt-iron-dropdown/div/ytd-menu-popup-renderer/tp-yt-paper-listbox/ytd-menu-service-item-renderer[2]/tp-yt-paper-item";
    // let youtubeTranscriptBody =
    //     "/html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-flexy/div[5]/div[2]/div/div[1]/ytd-engagement-panel-section-list-renderer[4]/div[2]/ytd-transcript-renderer/div[2]/ytd-transcript-search-panel-renderer/div[2]";
    let youtubeTranscriptBody =
        "/html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-flexy/div[5]/div[2]/div/div[1]/ytd-engagement-panel-section-list-renderer[4]/div[2]/ytd-transcript-renderer/div[2]/ytd-transcript-search-panel-renderer/div[2]/ytd-transcript-segment-list-renderer/div[1]";

    optionsButton = getElementByXpath(optionsButtonXPath);
    if (optionsButton == null) return "No Transcript Available";

    // click on options button
    optionsButton.click();
    // sleep for 1 second for options dropdown to show up
    await sleep(1);
    // click on show transcript button
    transcriptButton = getElementByXpath(showTranscriptButtonXPath);
    if (transcriptButton == null) return "No Transcript Available";

    transcriptButton.click();
    // sleep for 1 second for transcript body to show up
    await sleep(1);
    // get youtubeTranscriptBody element
    youtubeTranscriptBodyElement = getElementByXpath(youtubeTranscriptBody);
    let attempt = 0;
    while ((youtubeTranscriptBodyElement == null) & (attempt != 5)) {
        // wait for another 2.5s
        await sleep(1);
        youtubeTranscriptBodyElement = getElementByXpath(youtubeTranscriptBody);
        attempt++;
    }

    // if transcript body is still null, then there is no transcript available
    if (youtubeTranscriptBodyElement == null) return "No Transcript Available";

    let youtubeTranscriptTextDOMList = youtubeTranscriptBodyElement.childNodes;
    youtubeTranscriptTextDOMList.forEach((item) => {
        // console.log(item);
        let childDiv = item.getElementsByTagName("div")[0];
        let youtubeTranscriptFormattedString = childDiv.getElementsByTagName(
            "yt-formatted-string"
        )[0];
        let transcriptText = youtubeTranscriptFormattedString.textContent;
        allTranscriptText += transcriptText + " ";
    });

    return allTranscriptText;
}

/* Helper Functions */

/**
 * Function that gets HTML DOM Node with the element's xPath
 * Reference: https://stackoverflow.com/questions/10596417/is-there-a-way-to-get-element-by-xpath-using-javascript-in-selenium-webdriver
 * @param    {String} path    xPath of element
 * @return   {Object} HTML DOM Node
 */
function getElementByXpath(path) {
    return document.evaluate(
        path,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;
}

// https://www.freecodecamp.org/news/javascript-sleep-wait-delay/
// Sleep function
function sleep(duration) {
    // return a promise object that will only resolve after timeout is over
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, duration * 1000);
    });
}

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

// Copy text to clipboard
function copyTextToClipboard(transcriptText) {
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
