 function KioskTimeOut(ValueinMS) {
            idleTimer = null;
            idleState = false;
            idleWait = ValueinMS;
            console.log(ValueinMS);

            $(document).ready(function () {

                $('*').bind('mousemove keydown scroll touchstart', function () {

                    clearTimeout(idleTimer);

                    if (idleState == true) {

                        // Reactivated event
                        //console.log('on');
                    }

                    idleState = false;

                    idleTimer = setTimeout(function () {

                        // Idle Event
                        window.parent.location = 'Newindex.html';

                        idleState = true;
                    }, idleWait);
                });

                $("body").trigger("mousemove");

            });
        }