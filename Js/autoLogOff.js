function autoLoggOff()
{   
    var IsClosing = false;
    var url = getBaseURL();
    url = url + "logout.aspx";
    //var url="http://localhost:4582/E-POS_VSS_SRC_NEW/logout.aspx";
    //var url="http://61.5.135.10:82/elink/logout.aspx";

    var pl = new SOAPClientParameters();
    
    // if user closes the browser by clicking X button
    if((window.event.clientX<0) && (window.event.clientY<0)) {
        IsClosing = true;
        //WSAutoLogOff.KillSession();
    }
    
    // if user closes the browser by Alt+F4 key combination
    if(window.event.keyCode == 115 && event.altKey == true){
        IsClosing = true;
        //WSAutoLogOff.KillSession();
    }

    if(IsClosing){
        try
        {
            var r = SOAPClient.invoke(url, "", pl, false);
            alert(r);
        }
        catch(err)
        {
        //alert("Sorry! " + err.description)
        }   
    }


//    if(IsClosing){
//        $.ajax({
//            type: "POST",
//            url: "WS/WSAutoLogOff.asmx/KillSession",
//            //data: "{ " + params + " }",
//            contentType: "application/json; charset=utf-8",
//            dataType: "json"
//        });
//        alert('sdf');
//   }
   
}