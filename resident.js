(function(history){
    var pushState = history.pushState;
    history.pushState = function(state) {
        setTimeout(pushStateHandler, 0);
        return pushState.apply(history, arguments);
    };
})(window.history);

pushStateHandler();

function pushStateHandler () {
    if (!location.pathname.match("^/p/.*")) {
        return;
    }

    let dialog = document.querySelector("body > div[role=dialog]");
    dialog.style.border = "5px solid red";

    let article = dialog.querySelector("article");

    if (article) {
        handleArticle(article);
        return;
    }
    else {
        // wait for the article to appear, then handle

        let observer = new MutationObserver((mutationis, observer) => {
            let article = dialog.querySelector("article");
            if (article) {
                if (handleArticle(article)) {
                    observer.disconnect();
                }
            }
        });

        observer.observe(dialog, {
            childList: true,
            subtree: true
        });
    }
}

function handleArticle (article) {
    article.style.border = "5px solid orange";
    let img = article.querySelector("img.FFVAD");
    if (!img) return false;
    console.log("img", img, img.src);

    let btn = document.createElement("button");
    btn.style.position = "absolute";
    btn.style.top = '1em';
    btn.style.left = '1em';
    btn.innerText = "БДЫЩ!"
    // btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
// </svg>';
    btn.onclick = function () {
        window.open(img.src, "_blank");
    }
    article.appendChild(btn);
    return true;
}

window.addEventListener('popstate', (event) => {
  console.log("popstate event! location: " + document.location + ", state: " + JSON.stringify(event.state));
});
