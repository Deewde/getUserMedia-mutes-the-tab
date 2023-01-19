var activeStream;
var mediaRecorder;

window.addEventListener("load", () => {
	runOnStart();
});

function runOnStart() {
	window.addEventListener("message", (e) => {
		switch (e.data.type) {
			case 'tabStreamId':
				startRecording(e.data.streamId);
				break;
		}
	}, false);
	
	document.getElementsByTagName('BODY')[0].innerHTML += '<iframe id="the_frame" src="' + chrome.runtime.getURL('/iframe.html') + '" style="position: fixed; top: 20px; right: 20px; width: 400px; z-index: 2147483647; border-radius: 16px; box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3); border: none; background-color: #FAFAFA;"></iframe>';
	
	chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
		switch (message.type) {
			case 'startChain':
				document.getElementById('the_frame').contentWindow.postMessage({type: 'getStreamId', tabId: message.tabId}, '*');
				break;
			case 'stopChain':
				mediaRecorder.stop();
				activeStream.getTracks().forEach((track) => track.stop());
				break;
		}
	});
}

function startRecording(tabStreamId) {
	const umOptions = {
		audio: {
			mandatory: {
				chromeMediaSource: 'tab',
				chromeMediaSourceId: tabStreamId
			}
		}
	}
	
	navigator.mediaDevices.getUserMedia(umOptions).then((tabStream) => {
		activeStream = tabStream;
		
		chrome.runtime.sendMessage({type: 'started', tabStreamId: tabStreamId});
		
		// const context = new AudioContext();
		// const source = context.createMediaStreamSource(tabStream);
		// source.connect(context.destination);
		
		
		const options = { mimeType: "audio/webm" };
		mediaRecorder = new MediaRecorder(tabStream, options);
		
		mediaRecorder.ondataavailable = function(e) {
			download(new Blob([e.data]));
		};
		
		mediaRecorder.start();
		
	}).catch((err) => {
		console.error('tabStreamError', err);
	});
}

function download(blob) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	
	a.style = "display: none";
	a.href = url;
	a.download = "test.webm";
	
	document.body.appendChild(a);
	a.click();
	window.URL.revokeObjectURL(url);
}