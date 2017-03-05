(function($) {
  jQuery.fn.extend({
    base64_scanner: function(callback, videoError, fallback) {
      console.log(this.length);
      return this.each(function() {
        var currentElem = $(this);

        var height = currentElem.height() || 250;
        var width = currentElem.width() || 300;

        window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

        /*
         * note: jquery tries to match property names to functions, and the $.width() function sets the style width property
         *       so to prevent this, we use uppercase so that jquery sets the canvas.width property and not the canvas.style.width property
         */
        var canvasElem = $('<canvas/>', { id: 'video-canvas', WIDTH: width - 2, HEIGHT: height - 2 }).css('display', 'none').appendTo($(document.body));

        var canvas = canvasElem[0];
        console.log(canvasElem);
        var context = canvas.getContext('2d');
        var localMediaStream;
        var video;

        // Call the getUserMedia method with our callback functions
        if (navigator.getUserMedia) {
          //Browser supports camera stream
          var vidElem = $('<video/>', { WIDTH: width, HEIGHT: height }).appendTo(currentElem);
          video = vidElem[0];
          navigator.getUserMedia({ video: true }, streamSuccessCallback, videoError || fallback);
        } else {
          //browser doesn't support camera stream
          fallback();
        }

        var scan = function() {
          if (localMediaStream) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            callback(canvas.toDataURL('image/jpeg', 0.7));

            setTimeout(scan, 500);

          } else {
            setTimeout(scan, 500);
          }
        }; //end snapshot function

        function streamSuccessCallback(stream) {
          video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
          localMediaStream = stream;

          video.play();
          setTimeout(scan, 1000);
        }

      }); // end of html5_qrcode
    }
  });
})(jQuery);
