getAndFormatYoutubeTranscript();

// https://javascript.plainenglish.io/problem-with-returning-values-from-async-await-function-javascript-e99c94a47ca5
async function getAndFormatYoutubeTranscript() {
    alert("Extracting YouTube Transcript... (Press OK to Continue)");
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
    // await sleep(1);

    // let youtubeTranscriptStringDomCollection = document.getElementsByClassName(
    //     "segment-text style-scope ytd-transcript-segment-renderer"
    // );
    let youtubeTranscriptStringDomCollection = document.querySelectorAll(
        "#segments-container > ytd-transcript-segment-renderer > div > yt-formatted-string"
    );

    // Wait for transcript to render in DOM
    let attempt = 0;
    while (
        (youtubeTranscriptStringDomCollection.length == 0) &
        (attempt != 10)
    ) {
        // wait for another 0.5s before querying again
        await sleep(0.5);
        youtubeTranscriptStringDomCollection = document.querySelectorAll(
            "#segments-container > ytd-transcript-segment-renderer > div > yt-formatted-string"
        );
        console.log(youtubeTranscriptStringDomCollection);
        attempt++;
    }

    // if transcript body is still null, then there is no transcript available
    if (youtubeTranscriptStringDomCollection.length == 0)
        return "No Transcript Available";

    youtubeTranscriptStringDomCollection.forEach((transcriptDOM) => {
        allTranscriptText += transcriptDOM.textContent + " ";
    });

    // https://stackoverflow.com/questions/9849754/how-can-i-replace-newlines-line-breaks-with-spaces-in-javascript
    // Please take note of the caveat that your first argument SHOULD NOT BE A STRING!!! Else it won't work
    // allTranscriptText = allTranscriptText.replace(/\n/g, " ");

    // https://stackoverflow.com/questions/1981349/regex-to-replace-multiple-spaces-with-a-single-space
    // Handy way to replace all tabs/spaces/newline with a space. (This works for consecutive spaces too)
    allTranscriptText = allTranscriptText.replace(/\s\s+/g, " ");
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
                alert("Copy To Clipboard Successful!");
            },
            () => {
                //clipboard write failed, use fallback
                alert("Copy To Clipboard Failed!");
            }
        )
        .catch((err) => {
            console.error("Failed to read clipboard contents: ", err);
        });
}
