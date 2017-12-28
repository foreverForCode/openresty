/**
 * Created loadLink by chen guojun.
 */
var msex = {
    domain:"m.msyc.cc|www.2beauti.com|m.2beauti.com"
};

!(function ( window, factory ) {
    if ( typeof define === "function" && define.amd ) {
        define(factory);
    } else if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = factory();
    } else {
        window.jeSea = factory();
    }
})( this, function () {
    var loadrun = function (srcurl,success) {
        this.init(srcurl,success);
    };
    var head = document.head || document.getElementsByTagName('head')[0];
    var jefn = loadrun.prototype;
    jefn.init = function (srcurl,success) {
        var that = this, urlarr = srcurl||[];
        if (new RegExp(msex.domain).test(window.location.host)){
            if (urlarr.length > 0) {
                that.loader([urlarr.join(",")],success); 
            }
        }else {
            if (urlarr.length > 0) {
                that.loader(urlarr,success);
            }
        }
    };
    jefn.loader = function (urlarr, callback) {
        var load_cursor = 0, load_queue,
            loadFinished = function() {
                load_cursor++;
                if (load_cursor < load_queue.length) {
                    loadScript();
                }
            };
        var loadScript = function(sucfun) {
            var url = load_queue[load_cursor], ext  = url.split(/\./).pop(),
                isCSS = (ext.replace(/[\?#].*/, '').toLowerCase()=="css"),
                node = document.createElement(isCSS ? "link" : "script");
            
            if (node.readyState) {
                //IE
                node.onreadystatechange = function() {
                    if (node.readyState == "loaded" || node.readyState == "complete") {
                        node.onreadystatechange = null;
                        loadFinished();
                        sucfun && sucfun();
                    }
                };
            } else {
                //Others
                node.onload = function() {
                    loadFinished();
                    sucfun && sucfun();
                };
            }
            node.onerror = function (oError) {
                console.error("The script " + oError.target.src + " is not accessible.");
            };
            if(isCSS){
                node.type="text/css";
                node.rel = "stylesheet";
            }else{
                node.type="text/javascript";
            }
            node.src = url;
            head.appendChild(node);
        };
        load_queue = urlarr;
        loadScript(callback);
    };
    var jeSea = {
        load : function (srcurl,success) {
            new loadrun(srcurl,success);
        },
        ready: function ( callback ) {
            if ( document.readyState === "complete" ) {
                callback && callback();
            } else {
                var docReady = (function () {
                    document.addEventListener("DOMContentLoaded", function () {
                        document.removeEventListener("DOMContentLoaded", docReady);
                        callback && callback();
                    });
                })();
            }
        }
    };
    return jeSea;
});