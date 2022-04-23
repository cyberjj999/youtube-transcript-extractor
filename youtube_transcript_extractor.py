# https://pypi.org/project/youtube-transcript-api/
# pip install youtube_transcript_api
from youtube_transcript_api import YouTubeTranscriptApi

# input video link
video_url = 'https://www.youtube.com/watch?v=DHvZLI7Db8E'

video_id = video_url.split('?v=')[1]                            # extract video id from link
print('Video URL:', video_url, '| Video ID Extracted:', video_id)
print('Extracting Transcript From', video_url)
transcript_list = YouTubeTranscriptApi.get_transcript(video_id) # get youtube transcript

print('Extracting Transcript Text...')
all_transcript_text = ''
for each_transcript_segment in transcript_list:                 # traverse through each transcript segment
    transcript_text = each_transcript_segment['text']           # extract transcript text for each segment
    transcript_text = transcript_text.replace(u'\xa0', u'')     # remove \xa0 (which is a non-breaking space in Latin1 (ISO 8859-1))
    all_transcript_text += transcript_text + ' '

print('Formatting Transcript Text...')
# optional - format the transcript in chunks so it is more readable
all_transcript_text_in_words_list = all_transcript_text.split()
word_counter = 0
transcript_paragraph = ''
for each_word in all_transcript_text_in_words_list:
    if word_counter == 60: 
        transcript_paragraph+= '\n\n'
        word_counter = 0
    transcript_paragraph += each_word + ' '
    word_counter += 1

print('Writing Transcript Text to File...')
with open('transcript.txt', 'w', encoding = 'utf-8') as f:
    f.write(transcript_paragraph)

print('Transcript Extraction Successful! Transcript Extracted to transcript.txt')