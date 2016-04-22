
function HomeController()
{
// bind event listeners to button clicks //
	var that = this;
  function attemptLogout()
  {
    window.alert("vao ham attem1");
    var that = this;
    $.ajax({
      url: "/viewmessage",
      type: "POST",
      data: {name : "message"},

      success: function(data){
        console.log("Thanh COng");
        window.alert("vao ham attem");
      },
      error: function(jqXHR){
        console.log("Ok");
      }
    });
  }
// handle user logout //
	$('#btn-logout').click(attemptLogout);
   });

// handle account deletion //



}
