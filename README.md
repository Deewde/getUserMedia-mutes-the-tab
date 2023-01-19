# getUserMedia-mutes-the-tab
Reproduces the bug where starting a tabCapture via getUserMedia mutes the tab sound. Also note how the iframe can only get a stream ID and not actually start a capture.

- Start a recording from any tab playing sounds, something like music.youtube.com, observe how the tab's sound is being muted.
- End the recording and observe how the sound returns in the tab. Play the downloaded file and observe how the sound has been recorded properly.
- iframe.js also attempts to start a tabCapture, but that always fails with a cryptic "Error starting tab capture"

This code is meant to support and reproduce the following bug reports:
- https://stackoverflow.com/questions/74924897/getusermedia-mutes-the-sound-while-recording-current-tab
- https://groups.google.com/a/chromium.org/g/chromium-extensions/c/ffI0iNd79oo/m/Dnoj6ZIoBQAJ?utm_medium=email&utm_source=footer
- https://bugs.chromium.org/p/chromium/issues/detail?id=1403733
