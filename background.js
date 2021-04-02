// chrome.webRequest.onBeforeSendHeaders.addListener(

//     /* callback */
//     function (details) {
//         // return true;            // that means cancel all image requests, right?

//         var params = new URLSearchParams(details.url.match("^.*\.jpg\?(.*)$")[1]);

//         if (params.has("_nc_cat")) {
//             console.log("looks like a proper picture", details);
//             return {cancel: false};
//         }

//         return {
//             cancel: false
//         };
//     },

//     /* filters */ {
//         types: ["image"],
//         urls: ["*://*.fbcdn.net/*", "*://*.cdninstagram.com/*"]
//     },

//     /* opt_extraInfoSpec */
//     [
//         "blocking", 'requestHeaders', 'extraHeaders'
//     ]
// );


chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    console.log("hist upd", details);
    chrome.tabs.sendMessage(details.tabId, {url: details.url}, function(response) {
    });
});
