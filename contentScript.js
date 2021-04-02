// HTMLCollection updates itself, hoho!
var articles = document.getElementsByTagName("article");

var globalObserver = new MutationObserver(function globalMutationCallback (mutations, observer) {
    for (let i = 0; i < articles.length; i++) {
        let article = articles[i];
        if (article.getAttribute("role") === 'presentation') {
            // don't be synchronous in this callback
            setTimeout(() => handleArticle(article), 128);
        }
    }
});

globalObserver.observe(document.getElementsByTagName("body")[0], {childList: true, subtree: true});


function handleArticle (article) {
    // article.style.border = "5px solid red";
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

    let btn = document.createElement("button");
    btn.setAttribute("title", "Open image in new tab");
    btn.className = 'blow-up-button';
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
</svg>`
    btn.onclick = function () {
        window.open(img.src, "_blank");
    }

    grandparent.appendChild(btn);
}
