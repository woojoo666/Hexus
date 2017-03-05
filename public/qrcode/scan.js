(function($) {
  jQuery.fn.extend({
    html5_qrcode: function(qrcodeSuccess, qrcodeError, videoError, fallback) {
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
        var canvasElem = $('<canvas/>', { id: 'qr-canvas', WIDTH: width - 2, HEIGHT: height - 2 }).css('display', 'none').appendTo(currentElem);

        var canvas = canvasElem[0];
        var context = canvas.getContext('2d');
        var localMediaStream;
        var video;

        qrcode.callback = qrcodeSuccess;

        var upload_fallback = function() {
          console.log('Native web camera streaming (getUserMedia) not supported in this browser.');
        };

        // Call the getUserMedia method with our callback functions
        if (navigator.getUserMedia) {
          //Browser supports camera stream
          var vidElem = $('<video/>', { WIDTH: width, HEIGHT: height }).appendTo(currentElem);
          video = vidElem[0];
          navigator.getUserMedia({ video: true }, streamSuccessCallback, videoError || fallback || upload_fallback);
        } else {
          //browser doesn't support camera stream
          (fallback || upload_fallback).call();
        }

        var scan = function() {
          if (localMediaStream) {
            context.drawImage(video, 0, 0, 307, 250);

            try {
              qrcode.decode();
            } catch (e) {
              qrcodeError(e);
            }

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

document.body.onload = function() {
  $('#reader').html5_qrcode(
    function(data) {
      console.log("decoded qr code! Data: " + data);
      // window.location.href = '/u/' + data;
    },
    function(err) {
      console.log(err);
    }
  );
};
