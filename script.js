const injectUrl = chrome.runtime.getURL("inject.js");
const axiosUrl = chrome.runtime.getURL("axios.min.js");
const uuidUrl = chrome.runtime.getURL("uuidv4.min.js");

dynamicallyLoadScript(axiosUrl);
dynamicallyLoadScript(uuidUrl);
dynamicallyLoadScript(injectUrl);

function dynamicallyLoadScript(url) {
    const script = document.createElement("script");
    script.src = url; 
    document.head.appendChild(script); 
}
