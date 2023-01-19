window.addEventListener("message", (e) => {
	if (e.data.type == 'getStreamId') {
		
		// Starting a capture from inside an IFRAME will always result in "Error starting tab capture"
		chrome.tabCapture.capture({ audio: true, video: false }, function(stream) {
			if (typeof(chrome.runtime.lastError) === 'undefined') {
				console.log('Will never reach this point');
			}
			else {
				console.error('Because will always error out with:', chrome.runtime.lastError);
				console.warn('`tabCapture.capture` failed, proceeding to `tabCapture.getMediaStreamId`');
			}
		});
		
		// But getting a stream ID will work. But it will mute the tab. This is "the" bug.
		chrome.tabCapture.getMediaStreamId({ consumerTabId: e.data.tabId }, function(streamId) {
			if (typeof(chrome.runtime.lastError) === 'undefined') {
				window.parent.postMessage({ type: 'tabStreamId', streamId: streamId }, '*');
			}
			else {
				console.warn(chrome.runtime.lastError);
			}
		});
		
	}
}, false);