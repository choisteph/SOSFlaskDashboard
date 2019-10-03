function navPlace(){
    event.preventDefault();

    var placeName = document.querySelector("#searchthing").value;
    var form = document.querySelector(".formthing");

    if (cities.includes(placeName)) {
      window.location.href = "/dashboard?city=" + placeName;
    } else {
      window.location.href  = "/dashboard?county=" + placeName;
    };
};
