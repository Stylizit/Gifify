/*
/////////////
##VARS
/////////////
*/

var rotation = 0;
var loadingAnimation = new LoadingAnimation();

/*
/////////////
##LOADING-ANIMATION
/////////////
*/

/* Loading Animation displayed while we wait */
function LoadingAnimation(){
    this._timerId = 0;
    /* Number of states in animation */
    this._totalStates = 8;
    /* Current State */
    this._currentState = 0; 
}





function injectMethod(tab, method, callback){
    chrome.tabs.executeScript(tab.id, 
        {file: "content_script.js"},
        function(){
            chrome.tabs.sendMessage(tab.id, {method:method}, callback);
        }
    );
}

// Retrieve all <video> tags from the current tab.
function getVideos (tab) {
    injectMethod(tab, "getVideos", function(response){
        var videos = response.data;
        if(videos && videos.length){
            console.log("Videos found: "+videos.length);
        }
        else{
            console.log("No videos found in this page! :(");
        }
        console.log(videos);
        
        return true;
    });
    console.log("Browser action clicked!");
}

// When browser action is clicked
chrome.browserAction.onClicked.addListener(getVideos);