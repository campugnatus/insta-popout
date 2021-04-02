// var residentUrl = chrome.extension.getURL('/resident.js');
// var body = document.getElementsByTagName('body')[0];
// var script = document.createElement('script');
// script.setAttribute('type', 'text/javascript');
// script.setAttribute('src', residentUrl);
// body.appendChild(script);


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

var lastUrl;
var timer;

// background script DOES send a history event on initial load, but at that time
// this script isn't injected yet. So... calling explicitly.
handlePage(location.href);

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    handlePage(request.url);
});

function handlePage(url) {
    console.log("handlePage", url, lastUrl);
    if (url === lastUrl) // protection from repeated events
        return;

    lastUrl = url;
    if (url.match("instagram.com/p/.*$")) {
        handlePost();
    }
    else if (url.match("instagram.com/?$")) {
        handleHome();
    }
}

var homeObserver = new MutationObserver((mutations, observer) => {
    console.log("home mutated!", mutations);
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            // if (node.tagName === "ARTICLE" && node.attributes.role === "presentation")
            handle2Article(node);
        });
    });
});

function handle2Article (article) {
    article.style.border = "5px solid red";
    article.setAttribute("blown-up-ok", true);
}

function handleHome() {
    console.log("HOME!");

    clearTimeout(timer);
    timer = setInterval(function () {
        let articles = document.querySelectorAll("article[role='presentation']");
        console.log("home waiting for article...");
        if (articles.length) {
            clearInterval(timer);
            console.log("found articles", articles.length, articles);
            articles.forEach(article => handle2Article(article));
            homeObserver.observe(articles[0].parentNode, {childList: true});
        }
    }, 200);
}

function handlePost () {
    console.log("POST!");

    clearTimeout(timer);
    timer = setInterval(function () {
        let article = document.querySelector("article[role='presentation']");
        console.log("post waiting for article...");

        if (article && article.getAttribute("blown-up-ok")) {
            return;             // waaait...
        }

        if (article) {
            clearTimeout(timer);
            // setTimeout(() => handleArticle(article), 100);
            // observeArticle(article);
            handle2Article(article);
        }
    },

    // it takes some tome for <article> to appear. Instead of using mutation
    // observer or something, let's try a simpler way, first
    200);
}

function observeArticle (article) {
    let observer = new MutationObserver((mutations, observer) => {
        handleArticle(article);
    });

    observer.observe(article, {childList: true, subtree: true});
}

function handleArticle (article) {
    let imgs = article.getElementsByTagName("img");

    for (let i = 0; i < imgs.length; i++) {
        let img = imgs[i];
        if (img.srcset)
            addButton(img);
    }
}

function addButton (img) {
    let grandparent = img.parentNode.parentNode;

    if (grandparent.querySelector("button.blow-up-button"))
        // don't add a second one
        return;

    console.log("add btn", img);
    let btn = document.createElement("button");
    btn.className = 'blow-up-button';
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
</svg>`
    btn.onclick = function () {
        window.open(img.src, "_blank");
    }

    img.parentNode.parentNode.appendChild(btn);
}
