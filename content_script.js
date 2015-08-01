var videoProviders = [
    {
        "name": "youtube",
        "urlPattern": "youtube",
        "objectsToCheck": [
            {
                "objName": "video",
                "tag": "div",
                "attribute": "class",
                "selector": "html5-video-player"
            },
            {
                "objName": "iframe",
                "tag": "iframe",
                "attribute": "src",
                "selector": "youtube.com/embed"
            },
        ],
        "playerControls": [
            {
                "objName": "cursor",
                "tag": "div",
                "attribute": "class",
                "selector": "html5-scrubber-button"
            },
            {
                "objName": "playerBar",
                "tag": "div",
                "attribute": "class",
                "selector": "html5-player-chrome"
            },
            {
                "objName": "progressBar",
                "tag": "div",
                "attribute": "class",
                "selector": "html5-progress-bar"
            }
        ]
    }
];


/**
 * Author: Jason Farrell
 * Author URI: http://useallfive.com/
 *
 * Description: Checks if a DOM element is truly visible.
 * Package URL: https://github.com/UseAllFive/true-visibility
 */
Element.prototype.isVisible = function() {
 
    'use strict';
 
    /**
     * Checks if a DOM element is visible. Takes into
     * consideration its parents and overflow.
     *
     * @param (el)      the DOM element to check if is visible
     *
     * These params are optional that are sent in recursively,
     * you typically won't use these:
     *
     * @param (t)       Top corner position number
     * @param (r)       Right corner position number
     * @param (b)       Bottom corner position number
     * @param (l)       Left corner position number
     * @param (w)       Element width number
     * @param (h)       Element height number
     */
    function _isVisible(el, t, r, b, l, w, h) {
        var p = el.parentNode,
                VISIBLE_PADDING = 2;
 
        if ( !_elementInDocument(el) ) {
            return false;
        }
 
        //-- Return true for document node
        if ( 9 === p.nodeType ) {
            return true;
        }
 
        //-- Return false if our element is invisible
        if (
             '0' === _getStyle(el, 'opacity') ||
             'none' === _getStyle(el, 'display') ||
             'hidden' === _getStyle(el, 'visibility')
        ) {
            return false;
        }
 
        if (
            'undefined' === typeof(t) ||
            'undefined' === typeof(r) ||
            'undefined' === typeof(b) ||
            'undefined' === typeof(l) ||
            'undefined' === typeof(w) ||
            'undefined' === typeof(h)
        ) {
            t = el.offsetTop;
            l = el.offsetLeft;
            b = t + el.offsetHeight;
            r = l + el.offsetWidth;
            w = el.offsetWidth;
            h = el.offsetHeight;
        }
        //-- If we have a parent, let's continue:
        if ( p ) {
            //-- Check if the parent can hide its children.
            if ( ('hidden' === _getStyle(p, 'overflow') || 'scroll' === _getStyle(p, 'overflow')) ) {
                //-- Only check if the offset is different for the parent
                if (
                    //-- If the target element is to the right of the parent elm
                    l + VISIBLE_PADDING > p.offsetWidth + p.scrollLeft ||
                    //-- If the target element is to the left of the parent elm
                    l + w - VISIBLE_PADDING < p.scrollLeft ||
                    //-- If the target element is under the parent elm
                    t + VISIBLE_PADDING > p.offsetHeight + p.scrollTop ||
                    //-- If the target element is above the parent elm
                    t + h - VISIBLE_PADDING < p.scrollTop
                ) {
                    //-- Our target element is out of bounds:
                    return false;
                }
            }
            //-- Add the offset parent's left/top coords to our element's offset:
            if ( el.offsetParent === p ) {
                l += p.offsetLeft;
                t += p.offsetTop;
            }
            //-- Let's recursively check upwards:
            return _isVisible(p, t, r, b, l, w, h);
        }
        return true;
    }
 
    //-- Cross browser method to get style properties:
    function _getStyle(el, property) {
        if ( window.getComputedStyle ) {
            return document.defaultView.getComputedStyle(el,null)[property];
        }
        if ( el.currentStyle ) {
            return el.currentStyle[property];
        }
    }
 
    function _elementInDocument(element) {
        while (element = element.parentNode) {
            if (element == document) {
                    return true;
            }
        }
        return false;
    }
 
    return _isVisible(this);
 
};


/*
function VideoProvider(name, url, objects){
    this.name = name;
    this.urlPattern = url || "";
    this.objectsToCheck = objects;
}
*/


/* Find elements */
function findElements(){
    var length = videoProviders.length;
    var results = [];
    var cursor, playerBar, progressBar;
    
    if(length > 0){
        console.log("Fetching "+length+" Video Providers...");
        //console.log(videoProviders);
        for(var i = 0; i < length; i++){
            var pattern = videoProviders[i].urlPattern;
            for(var j = 0; j < videoProviders[i].objectsToCheck.length; j++){
                var finalSelector;
                var selector = videoProviders[i].objectsToCheck[j].selector;
                var attribute = videoProviders[i].objectsToCheck[j].attribute;
                var tag = videoProviders[i].objectsToCheck[j].tag;
                var objName = videoProviders[i].objectsToCheck[j].objName;
                
                if(!selector || selector.length === 0){
                    finalSelector = pattern;
                }
                else{
                   finalSelector = selector;
                }
                
                
                
                query = tag+'['+attribute+'*="'+finalSelector+'"]';
                console.log("Selector Query: "+query);
                var result = document.querySelectorAll(query);
                
                /* Check if the video is actually visible in the viewport */
                console.log("RESULT: ", result);
                
                if(result.length > 0){
                    for(var k = 0; k < result.length; k++){
                        console.log(result[k]);
                        console.log("Is element visible? ", result[k].isVisible(result[k]));
                        if(result[k].isVisible(result[k])){
                            /* Store if it has iframe in the object */              
                            result[k].isInsideIframe = objName === "iframe" ? true : false;
                            /* If visible element is an iframe add cursor element to the object */
                            for(var l = 0; l < videoProviders[i].playerControls.length; l++){
                                var control = videoProviders[i].playerControls[l];
                                var queryControl = control.tag+'['+control.attribute+'*="'+control.selector+'"]';
                                
                                console.log("control:", control);
                                console.log("Query control:", queryControl);
                                
                                if(control.objName === "cursor"){
                                    console.log("OHOHO");
                                    
                                    /* If Iframe use iframe reference */
                                    if(result[k].isInsideIframe){
                                        cursor = iframeRef(result[k]).querySelectorAll(queryControl);
                                        result[k].iframeRef = iframeRef(result[k]);
                                    }
                                    else{
                                        cursor = result[k].querySelectorAll(queryControl); 
                                    }
                                    
                                    console.log(queryControl);
                                    console.log(cursor);
                                    result[k].cursor = cursor;
                                    
                                }
                                if(control.objName === "playerBar"){
                                    if(result[k].isInsideIframe){
                                        playerBar = iframeRef(result[k]).querySelectorAll(queryControl);
                                    }
                                    else{
                                        playerBar = result[k].querySelectorAll(queryControl); 
                                    }
                                    result[k].playerBar = playerBar;
                                }
                                if(control.objName === "progressBar"){
                                    if(result[k].isInsideIframe){
                                        progressBar = iframeRef(result[k]).querySelectorAll(queryControl);
                                    }
                                    else{
                                        progressBar = result[k].querySelectorAll(queryControl); 
                                    }
                                    result[k].progressBar = progressBar;
                                }
                            }
                            /* Put objects in array */
                            results.push(result[k]);
                        }
                    }    
                }  
            }
        }
    }
    
    console.log(results);
    return results;
}

/* Inject Interface to the elements */
function injectInnerUI(els, dom){
    /* Clone the DOM element so we can append it to multiple elements */
    
    
    var nbEls = els.length;
    console.log(els);
    for(var i = 0; i < nbEls; i++){
        var clone = dom.cloneNode(true);
        var el = els[i];
        if(el.nextSibling){
            el.parentNode.insertBefore(clone, el.nextSibling);
        }
        else{
            console.log("Element has no next Sibling");

            el.parentNode.appendChild(clone);
        }
    }
}
function injectUI(els, string){
    /* Clone the DOM element so we can append it to multiple elements */
    var offset = {};
    
    
    var nbEls = els.length;
    console.log(els);
    
    for(var i = 0; i < nbEls; i++){
        var el = els[i];
        var rect = el.getBoundingClientRect();
        var bodyRect = document.body.getBoundingClientRect();
    
        offset.top = rect.top - bodyRect.top;
        offset.left = rect.left - bodyRect.left;
console.log(offset.top, offset.right, offset.bottom, offset.left);
        
        var wrapper = document.createElement('div');
        wrapper.innerHTML = '<div class="video-canvas-container" style="top: '+offset.top+'px; left:'+offset.left+'px;">'+string+'</div>';
        var dom = wrapper.firstChild;
        
        var clone = dom.cloneNode(true);
        
        
        
        document.body.appendChild(clone);
    }
}

function injectCursor(els, string){
    var offset = {};
    var nbEls = els.length;
    
    
    for(var i = 0; i < nbEls; i++){
        var el = els[i];
        var cursor;
        var rect, bodyRect;
        
        
        
        
        if(el !== undefined){
            console.log("CURSOR: ", el.cursor);
            
            cursor = el.cursor;
            
            
            if(el.iframeRef !== undefined){
                rect = el.getBoundingClientRect();
                var playerHeight = el.playerBar[0].clientHeight + el.progressBar[0].clientHeight;
                console.log("Player bar: ",el.playerBar);
                console.log("Progress bar: ", el.progressBar);
                //bodyRect = el.iframeRef.body.getBoundingClientRect();
                bodyRect = document.body.getBoundingClientRect();
                offset.top = rect.top - bodyRect.top + el.clientHeight - playerHeight;
                offset.left = rect.left - bodyRect.left;
            }
            else{
                rect = cursor[0].getBoundingClientRect();
                bodyRect = document.body.getBoundingClientRect();
                offset.top = rect.top - bodyRect.top;
                offset.left = rect.left - bodyRect.left;
            }
            console.log("BODYRECT:", bodyRect);
            
           
            
            
            
            
            var wrapper = document.createElement('div');
            wrapper.innerHTML = '<div id="tooltipContainer" class="tooltip-container" style="top: '+offset.top+'px; left:'+offset.left+'px;">'+string+'</div>';
            var dom = wrapper.firstChild;
            
            var clone = dom.cloneNode(true);
            
            if(el.iframeRef !== undefined){
                /*
                console.log("IFRAMEREF: ", el.iframeRef.body);
                el.iframeRef.body.appendChild(clone);
                */
                document.body.appendChild(clone);
            }
            else{
                document.body.appendChild(clone);
            }
        } 
    }
}



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
    var string = video.getAttribute("src");
    return string.substring(string.indexOf("http"), string.length);
}

/* Check if a node is a valid iframe, a video or somehting else */
function isNodeValid(node){
    var res = {};
    res.valid = false;
    
    if(node.nodeName == "IFRAME"){
        if(isIframeValid(node)){
            res.valid = true;
            res.type = "iframe";
        }
    }
    else if(node.nodeName == "VIDEO"){
        res.valid = true;
        res.type = "video";
    }
    
    return res;
}

/* Return a reference to the iframe */
function iframeRef(frameRef){
    return frameRef.contentWindow
        ? frameRef.contentWindow.document
        : frameRef.contentDocument
}


function followCursor(videos){
    var nbVideos = videos.length;
    var isPlaying;
    
    for(var i = 0; i < nbVideos; i++){
        var video = videos[i];    
        updateTooltip(video, status);
    }
}

function updateTooltip(video, status){
    var tooltip = document.getElementById("tooltipContainer");
    var cursor = video.cursor;
    var oldRect = cursor[0].getBoundingClientRect();
    var offset = {};
    var videoTag = video.getElementsByTagName("video")[0];
    var status = ! (videoTag.paused || videoTag.ended);
    var timer;
    
    console.log("VIDEO PLAY STATUS:", status);
    console.log("OLD RECT", oldRect);
    console.log("Video in follow cursor:", videoTag);
    
    videoTag.addEventListener('play', function(){
        status = true;
        calcRect();
        timer = setInterval(calcRect, 1000);
    });
    videoTag.addEventListener('pause', function(){
        status = false;
        console.log("PAUSE !!! ");
        clearInterval(timer);
    });
    
    
    if(status === true){
        calcRect();
        timer = setInterval(calcRect, 1000);
        console.log("playing");
    }
    
    
    function calcRect(){
        var currentRect = cursor[0].getBoundingClientRect();
        console.log("CURRENT RECT", oldRect);
        offset.left = currentRect.left - oldRect.left;

        console.log("play");
        console.log("Offset Left:", offset.left);

        oldRect = currentRect;
        
        tooltip.style.left = currentRect.left+"px";
        
    }
   
}



/*
///////////
// HELPERS
///////////
*/
function outerHTML(node){
    // if IE, Chrome take the internal method otherwise build one
    return node.outerHTML || (
        function(n){
            var div = document.createElement('div'), h;
            div.appendChild( n.cloneNode(true) );
            h = div.innerHTML;
            div = null;
            return h;
        }
    )(node);
}




/* In case of multiple injections on the page without reload */
var injected = injected || (function(){
    /* Defines an object containing all the methods we can call from the background script */
    var methods = {};
    
    /* Get video tags in tab */
    methods.getVideos = function(){
        /*
        var nodes = document.querySelectorAll("video, iframe");
        var nbVideos = nodes.length;
        var videos = [];
        var video, node, videoInfo;
        
        for(var i = 0; i < nbVideos; i++){
            node = nodes[i];
            
            videoInfo = isNodeValid();
            if(videoInfo.valid){
                video = new Video(outerHTML(node), node.clientWidth, node.clientHeight, videoInfo.type, getPlayerType(node), getSource(node));
                                  
                videos.push(video);
            }  
        }
        */
        
        /* Returns an array of valid and visible videos */
        var videos = findElements();
        
        /* Fake Interface */
        /*
        var domInterface = document.createElement('div');
        domInterface.style.width = "100%";
        domInterface.style.height = "100%";
        domInterface.style.position = "absolute";
        domInterface.style.top = "0";
        domInterface.style.left = "0";
        domInterface.style.zIndex = "999999";
        domInterface.style.backgroundColor = "red";
        */
        
        /* Real Interface */
        var videoCanvas = '<a href="#," class="gif-video-canvas fade-animation"><div class="gif-bubble"><div class="gif-logo"></div></div></a>';
        var tooltip = '<div class="tooltip"></div><div class="tooltip-content yellow"><p>Drag me anywhere and select your favorite sequence!</p></div>';
        
        /* Append UI Interface to the elements */
        injectUI(videos, videoCanvas);
        
        /* Find cursor */

        
        /* Append Tooltip to cursor */
        injectCursor(videos, tooltip);
        
        /* Attach event listener */
        followCursor(videos);
        
        return videos;
    };
    
    /* Listen for messages */
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        var data = {}; 
        
        /* If the method requested exists call it */
        if(methods.hasOwnProperty(request.method)){
            data = methods[request.method]();
        }
        /* Send response to background script */
        sendResponse({
            data: data
        });
        
        return true;
    });
    
    
    return true;
})();