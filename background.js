var currentStreamId = null;

chrome.action.setBadgeBackgroundColor({color: '#78E100'});
chrome.action.setBadgeText({text: ' '});

chrome.action.onClicked.addListener(function(tab) {
	if (currentStreamId != null) {
		currentStreamId = null;
		chrome.tabs.sendMessage(tab.id, {type: 'stopChain' });
		chrome.action.setBadgeBackgroundColor({color: '#78E100'});
	}
	else {
		chrome.tabs.sendMessage(tab.id, {type: 'startChain', tabId: tab.id});
	}
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (message.type == 'started') {
		chrome.action.setBadgeBackgroundColor({color: '#E11200'});
		currentStreamId = message.tabStreamId;
	}
});