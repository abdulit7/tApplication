(function () {

    getDateTimeFromServer(function (serverDateTime) {

        function isValidDate(d) { return d instanceof Date && !isNaN(d); }
        if (isValidDate(serverDateTime)) {
            serverDateTime = serverDateTime;
        } else {
            serverDateTime = new Date();
        }
        var hideRightMenu, resize, rightMenu, scaleMode, time;

        scaleMode = 1;

        resize = function () {
            //return jQuery('.time').css('font-size', Math.min(jQuery('.time').width() / (scaleMode * 10), parseFloat(jQuery(window).height() * 0.75)));
            return jQuery('.time').css('font-size', '36.5px');
        };

        time = function () {
            var ampm, hour, marker, min, newTime;
            ampm = jQuery('.time').hasClass('ampm');
            newTime = new Date(ServerTime);


            if (ampm) {
                hour = newTime.getHours() % 24;
                if (hour === 0) {
                    hour = 12;
                }

            } else {
                hour = newTime.getHours();
            }
            min = newTime.getMinutes() < 10 ? ['0', newTime.getMinutes()].join('') : newTime.getMinutes();
            jQuery('.time').find('.hour').text(hour).end().find('.minutes').text(min).end().find('.divider').toggleClass('blink');
            jQuery('.time').find('.curdate').text(newTime.toDateString());

        };
        time();
        time.interval = setInterval(time, 1000);
        resize();
        jQuery(window).on('resize orientationchange', resize).on('contextmenu', rightMenu).on('click', hideRightMenu);
        setTimeout((function () {
            return jQuery('.note').slideUp();
        }), 15000);
    });
}).call(this);

function getDateTimeFromServer(callback) {
    try {
        $("#btnSave").attr('disabled', true);
        $("#btnSave").html(progress('Validating Datetime '));

        var params = {

            pSecKey: localStorage.getItem('UzegQQ2qG3gsystem') ,
            pEmployeeID:localStorage.getItem('9ygzefro1ppU70system'),
            pEmployeeRefNo:localStorage.getItem('SuevSwzqwJosystem'),
            pUserID: localStorage.getItem('ZCI6efrovMLFOQsystem'),
            PID1: 'tblFilterCriteria', PID2: 'getDate()', PID3: 'top 1 getDate()', PID4: '', pCompanyID: 'wpluscpdiT6wL4system'
        }
        postRequest('wsttmapp.asmx/FillDropDownGenericWeb', JSON.stringify(params), function (r) {
            var serverDateTime = "";
            r = JSON.parse(r.d);
            serverDateTime = getFormattedDateNew(r[0].Column1)
            serverDateTime = new Date(getFormattedTimeNew(r[0].Column1));
            callback(serverDateTime);
        });

    } catch (error) {
        callback(new Date());
        //toastr.error(error.message);
    }
}