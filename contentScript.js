var residentUrl = chrome.extension.getURL('/resident.js');
var body = document.getElementsByTagName('body')[0];
var script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', residentUrl);
body.appendChild(script);

// (function(history){
//     var pushState = history.pushState;
//     history.pushState = function(state) {
//       // YOUR CUSTOM HOOK / FUNCTION
//       console.log('I am called from pushStateHook');
//       return pushState.apply(history, arguments);
//     };
// })(window.history);

// (function(history){
//     var replaceState = history.replaceState;
//     history.replaceState = function(state) {
//       // YOUR CUSTOM HOOK / FUNCTION
//       console.log('I am called from replaceStateHook');
//       return replaceState.apply(history, arguments);
//     };
// })(window.history);
