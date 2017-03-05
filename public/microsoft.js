
// Post call to Microsoft Computer Vision API

window.onload = function() {

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
                    MicrosoftPost(img)
                    fileDisplayArea.appendChild(img);
                }

                reader.readAsDataURL(file); 
            } else {
                fileDisplayArea.innerHTML = "File not supported!";
            }
        });

}

function MicrosoftPost(img) {
	console.log(img)
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
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", SUBSCRIPTION_KEY);
        },
        //cache: true,
        type: "POST",
        // Request body - Curr just static image
        data: img,
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