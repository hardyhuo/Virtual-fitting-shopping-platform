const starterRoute = "http://localhost:8888/"

$(document).ready(function () {

    $('body').on('click', '#testUpload', function () {
        let people = $('#people')[0].files[0];
        let cloth = $('#cloth')[0].files[0];

        console.log(people, cloth);

        const form = new FormData();
        form.append("personImage", people);
        form.append("clothImage", cloth);

        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://virtual-try-on2.p.rapidapi.com/clothes-virtual-tryon",
            "method": "POST",
            "headers": {
                "X-RapidAPI-Key": "416d634864mshb30fe9377021488p1a34dfjsna99d8f3d0f77",
                "X-RapidAPI-Host": "virtual-try-on2.p.rapidapi.com"
            },
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": form
        };

        $.ajax(settings).done(function (response) {

            let data = $.parseJSON(response)

            console.log(data);

            console.log(data.response.ouput_path_img);

            alert(data.message);

            $("#tryOnResult").attr("src", data.response.ouput_path_img);
        });
    });


});