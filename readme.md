# Youtube Transcript Extractor
A chrome extension to supercharge your workflow and improve your productivity by extracting YouTube's transcript.

## Update as of 28 March 2022
YouTube has updated their HTML DOM and the current chrome extension will not be working.
I have instead created a seamless to use Python Script to extract YouTube transcript.

### How to use?
1. Install all dependencies for the python script
   ```
   pip install youtube_transcript_api
   ```
2. Input your YouTube video of interest which you want to extract transcript from
   ```
   video_url = 'https://www.youtube.com/watch?v=rkBk2BCFFxc'
   ```
3. Run the script with the following command
   ```
   python youtube_transcript_extractor.py
   ```

The transcript file should be successfully generated in `transcript.txt`. Enjoy!

---
## How to use? (Outdated)

1. Load the chrome extension
   - navigate to chrome://extension
   - enable developer mode
   - click on "Load unpacked"
   - select this folder to load this chrome extension

   (Optional) For ease of use, you can pin this chrome extension
2. Navigate to any YouTube video
3. Click on the chrome extension
   - A popup ("Starting Transcript Extraction...") will show - click 'OK'
   - Wait for a few seconds
   - A popup ("Copy Successful!") will show
   - You now have the YouTube transcript in your clipboard! (Ctrl/Cmd + V to display it on notepad or other text editor)

**Note***: The chrome extension will not work for YouTube videos without caption.
