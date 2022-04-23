// https://developer.chrome.com/docs/extensions/reference/action/#:~:text=%23-,Injecting%20a%20content%20script%20on%20click,-A%20common%20pattern
chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["get-youtube-transcript.js"],
    });
});
