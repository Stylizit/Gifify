/*
/////////////
##VIDEO
/////////////
*/

/* Object storing video attributes */
function Video(){
    this.domElement = null;
    this.width = 0;
    this.height = 0;
    this.isIframe = false;
    this.type = 0;
    this.src = "";
}
function Video(domElement, width, height, hasIframe, type, src){
    /* DOM Element */
    this.domElement = domElement;
    this.width = width;
    this.height = height;
    /* If the video is embedded within an iframe */
    this.isIframe = hasIframe;
    /* Type of Video Player (youtube, vimeo, etc...) */
    /* 
        YT = 0
    */
    this.type = type;
    /* Url of the video */
    this.src = src;
}

/* Check the player type from a video */
function getPlayerType(video){
    return 0;
}

/* Check the source url of the video tag */
function getSource(video){
    return video.getAttribute("src").substring(0, indexOf("http"));
}

/* Check if the video is embedded into a iframe */
function inIframe(element){
    return element.ownerDocument !== document;
}