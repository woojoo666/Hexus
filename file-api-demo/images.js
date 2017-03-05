$(document).ready(function() {
		var fileInput = document.getElementById('fileInput');
		var fileDisplayArea = document.getElementById('fileDisplayArea');

		fileInput.addEventListener('change', function(e) {
			var file = fileInput.files[0];
			var imageType = /image.*/;

			if (file.type.match(imageType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					fileDisplayArea.innerHTML = "";

					var img = new Image();
					img.src = reader.result;
					// 	console.log(img.src)

					//var blob = b64toBlob(img.src, "image/jpeg");
					// console.log(img.src)
					MicrosoftPost(img.src);
					fileDisplayArea.appendChild(img);
				}

				reader.readAsBinaryString(file);	
			} else {
				fileDisplayArea.innerHTML = "File not supported!";
			}
		});
		function MicrosoftPost(input) {
			console.log(input)
		    var SUBSCRIPTION_KEY = '3923fb2c84184cbd9a73dbe45fc9d7b7';
		    var params = {
		        // Request parameters
		        "visualFeatures": "Categories, Tags, Description",
		        "language": "en",
		    };
		    $.ajax({
		        url: "https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?" + $.param(params),
		        beforeSend: function(xhrObj){
		            // Request headers
		            xhrObj.setRequestHeader("Content-Type","application/octet-stream");
		            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", SUBSCRIPTION_KEY);
		        },
		        //cache: true,
		        type: "POST",
		        // Request body - Curr just static image
		        data: "{input}",
		        dataType: "json"
		    })
		    .done(function(data) {
		        alert("success");
		        console.log(data);
		    })
		    .fail(function() {
		        alert("error in posting to MS");
		    });
		};
		function b64toBlob(b64Data, contentType, sliceSize) {	

		  contentType = contentType || '';
		  sliceSize = sliceSize || 512;

		  var byteCharacters = atob(b64Data);
		  var byteArrays = [];

		  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		    var slice = byteCharacters.slice(offset, offset + sliceSize);

		    var byteNumbers = new Array(slice.length);
		    for (var i = 0; i < slice.length; i++) {
		      byteNumbers[i] = slice.charCodeAt(i);
		    }

		    var byteArray = new Uint8Array(byteNumbers);

		    byteArrays.push(byteArray);
		  }
		    
		  var blob = new Blob(byteArrays, {type: contentType});
		  return blob;
		}
});

// function MicrosoftPost(img) {
// 	console.log(img)
//     var SUBSCRIPTION_KEY = '3923fb2c84184cbd9a73dbe45fc9d7b7';
//     var params = {
//         // Request parameters
//         "visualFeatures": "Categories, Tags, Description",
//         "language": "en",
//     };
//     $.ajax({
//         url: "https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?" + $.param(params),
//         beforeSend: function(xhrObj){
//             // Request headers
//             xhrObj.setRequestHeader("Content-Type","application/json");
//             xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", SUBSCRIPTION_KEY);
//         },
//         //cache: true,
//         type: "POST",
//         // Request body - Curr just static image
//         data: img,
//         dataType: "json"
//     })
//     .done(function(data) {
//         alert("success");
//         console.log(data);
//     })
//     .fail(function() {
//         alert("error in posting to MS");
//     });
// };
