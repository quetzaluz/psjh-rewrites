(function() {
  'use strict';

  chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
    // Default to current URL if not a JIRA url
    var newUrl = null;

    if (/^https:\/\/provinnovate.atlassian.net\/wiki\/spaces/.test(details.url)) {
      // perform confluence page redirect
      var matchingRegex = /^(https:\/\/)(provinnovate.atlassian.net\/wiki\/spaces\/([A-Z]+)\/pages\/\d+\/)(.+)$/;
      var matches = details.url.match(matchingRegex);
      if (matches && matches.length === 5) {
        newUrl = 'https://confluence.dig.engineering/display/' + matches[3] + '/' + matches[4];
      }
    }

    if (/^https:\/\/provinnovate.atlassian.net\/browse\/[A-Z]+/.test(details.url)) {
      // perform jira redirect
      newUrl = details.url.replace(/provinnovate.atlassian.net/, 'jira.dig.engineering');
    }

    if (newUrl) {
      console.log('rewriting', details.url, 'to', newUrl);
      chrome.tabs.update(details.tabId, { url: newUrl });
    }
  });
})();
