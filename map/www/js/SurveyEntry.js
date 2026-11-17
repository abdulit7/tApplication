'use strict';

var eid, uid, ecode, secKey, cid, lid, ename, dateformat;
eid = getLocalStorageItem_Int('eid');
ename = getLocalStorageItem_Int('ename');
uid = getLocalStorageItem_Int('uid');
cid = getLocalStorageItem_Int('cid');
lid = getLocalStorageItem_Int('lid');
ecode = getLocalStorageItem_String('ecode');
secKey = getLocalStorageItem_String('secKey');
dateformat = getLocalStorageItem_String('dateformat');
var SurveyID;
var RemarksMandatoryCondition;
jQuery(function ($) { //just like $(document).ready()
    $('[data-toggle="popover"]').popover();
    SurveyID = getParameterByName('SurveyID');
    init(SurveyID);
});

function init(SurveyID) {
    getSurveyDetails(SurveyID);
}


function getSurveyDetails(SurveyID) {
    $('#template').html(progress('Loading '));
    postRequest('GetSurveyDetail', { pTranID: SurveyID }, getSurveyDetails_Callback);
}

var validationitems = [];
var validationitemtextbox = [];
var allcontrols = [];
var QuestionGroupID;
function getSurveyDetails_Callback(res) {
    var template = '';
    var data = JSON.parse(res.d);
    //console.log(data);

    var questionGroup = data['QuestionGroup'];
    var questionTemplate = data['QuestionTemplate'];
    var answersTemplate = data['Answers'];

    $.each(questionGroup, function (i) {

        var filteredQuestions = {};
        QuestionGroupID = questionGroup[i].QuestionGroupID;
        var filteredQuestions = $(questionTemplate).filter(function (j) {
            return questionTemplate[j].QuestionGroupID === questionGroup[i].QuestionGroupID
        });

        template +=
            '<div id="g' + questionGroup[i].QuestionGroupID + '" class="panel panelshadow">' +
            '<div class="panel-body">' +
            '<span id="surveyTitle" class="surveytitle surveytitle2"> <small> </small> ' + questionGroup[i].QuestionGroupTitle + ' </span>                                ' +
            '<div class="row">'
            ;


        $.each(filteredQuestions, function (k) {

            template +=
                '<div class="surveyquestion">' +
                '<div class="questionTemplate">' +
                '<small><span class="fa fa-hand-o-right"></span></small>' +
                '<span class="questionTitle">' + filteredQuestions[k].QuestionTitle + '</span>' +
                '<p class="questionDesc">Description : ' + filteredQuestions[k].QuestionDescription + '</p>' +
                '</div>'
                ;

            var filteredAnwers = {};
            var filteredAnwers = $(answersTemplate).filter(function (m) {
                return answersTemplate[m].QuestionID === filteredQuestions[k].QuestionID
            });

            var options = '';
            var ddlid;
            var txtid;
            var answerID;
            $.each(filteredAnwers, function (n) {
                options += '<option value="' + filteredAnwers[n].AnswerID + '">' + filteredAnwers[n].AnswerTitle + '</option>';

                answerID = filteredAnwers[n].AnswerID;
            });

            var answertType = filteredQuestions[k].AnswerType;
            var QuesionID = filteredQuestions[k].QuestionID1;
            var IsMandatory = filteredQuestions[k].IsMandatory;
            RemarksMandatoryCondition = filteredQuestions[k].RemarksMandatoryCondition;
            ddlid = 'ddl' + filteredQuestions[k].QuestionID;
            txtid = 'txt' + filteredQuestions[k].QuestionID;
            var QAImage = filteredQuestions[k].QAImage;
            var answerMode = '';

            if (QAImage !== "") {
                QAImage = '<div><span data-toggle="collapse" data-target="#' + QuesionID + '" style="display:block;text-align:right;padding:5px;color:#999;" class="fa fa-picture-o">' +
                    '</span><img id="' + QuesionID + '" width="100%" class="img img-responsive img-thumbnail collapse out" src="' + getBaseUrl() + QAImage + '"></div>';
            }

            var obj = {};

            if (IsMandatory) {
                validationitems.push(ddlid);
            }

            if (RemarksMandatoryCondition !== '') {
                obj = { ddlid: ddlid, txtid: txtid, RemarksMandatoryCondition: RemarksMandatoryCondition };
                validationitemtextbox.push(obj);
            }

            var dataobj;
            var QuesionID = filteredQuestions[k].QuestionID;
            var Weightage = filteredQuestions[k].Weightage;
            switch (answertType) {
                case 'Both':
                    var _placeholder = RemarksMandatoryCondition === "" ? "remarks" : "remarks are mandatory if you have selected " + RemarksMandatoryCondition
                    answerMode =
                        '<select id="' + ddlid + '"  class="form-control">' +
                        '<option value="0">-select-</option>' + options + '</select>' +
                        '<textarea id="' + txtid + '" class="form-control" rows="3" placeholder="' + _placeholder + '"></textarea>'

                        ;
                    dataobj = {
                        QuestionID: QuesionID,
                        Controls: [ddlid, txtid]
                    }

                    break;
                case 'Numeric':
                    answerMode =
                        '<select id="' + ddlid + '" class="form-control">' +
                        '<option value="0">-select-</option>' +
                        '' + options + '' +
                        '</select>' +
                        '<input id="' + txtid + '" type="number" class="form-control" placeholder="your value">'
                        ;
                    dataobj = {
                        QuestionID: QuesionID,
                        Controls: [ddlid, txtid]
                    }

                    break;

                case 'Options':
                    answerMode =
                        '<select id="' + ddlid + '"  class="form-control">' +
                        '<option value="0">-select-</option>' + options + '</select>'
                        ;
                    dataobj = {
                        QuestionID: QuesionID,
                        Controls: [ddlid]
                    }

                    break;
                case 'Text':
                    answerMode =
                        '<textarea id="' + txtid + '" class="form-control" placeholder="remarks" rows="3"></textarea>'
                        ;
                    dataobj = {
                        QuestionID: QuesionID,
                        Controls: [txtid]
                    }
                    validationitems.push(txtid);
                    break;
                default:
                    answerMode = '';
                    break;
            }

            dataobj = Object.assign({}, dataobj, { AnswerID: answerID, Weightage: Weightage, QuestionGroupID: QuestionGroupID });
            allcontrols.push(dataobj);

            template +=
                '<div class="answerTemplate">' +
                '<span class="lblanswer">Answer :</span>' + answerMode + QAImage + '</div>'
                ;

            template += '</div>';
        });

        template += '</div></div></div>';

    });

    //console.log(validationitems);

    $('#template').html(template);
    $('[data-toggle="popover"]').popover();

}

$('#formEntry').submit(function (e) {
    e.preventDefault();
    if (validate()) {


        if (confirm('Are you sure to submit this survey ?')) {
            //DisableButton($('#btnSave'),'Submiting ..');
            EnableDisableButtonSpin($("#btnSave"), 'D');
            //console.log(validationitems);
            var objArray = []
            //  console.log(allcontrols);
            allcontrols.forEach(function (value) {

                if (value.Controls.length === 2) {
                    var ddlval = $('#' + value.Controls[0]);
                    var txtval = $('#' + value.Controls[1]);
                }
                else {
                    var ddlval = $('#' + value.Controls[0]);
                    var txtval = 'notboth';
                }

                var objData = {
                    SurveyID: SurveyID,
                    QuestionGroupID: QuestionGroupID,
                    QuestionID: value.QuestionID,
                    AnswerID: value.AnswerID,
                    Answer0: ddlval.val(),
                    Answer1: txtval !== 'notboth' ? txtval.val() : ddlval.val(),
                    Weightage: value.Weightage
                }
                objArray.push(objData);

            });

            //console.log(objArray);
            var data_ = {
                pSurveyID: SurveyID,
                pAnswersList: objArray,
                pRemarks: $('#txtRemarks').val()
            }
            postRequest('SaveSurvey', data_, saveSurvey_Callback)

        }

    }

});

function saveSurvey_Callback(res) {
    var d = JSON.parse(res.d);
    //console.log(d);
    var res = d.result;
    var msg = d.msg;

    if (res === 'success') {
        window.location.replace('SurveyList.html?showMsg=true');
    }
    if (res === 'fail') {
        EnableDisableButtonSpin($("#btnSave"), 'E');
        //EnableButton($('#btnSave'), 'Submit');
        toastr.error(msg);
    }

}


function validate() {

    var res = true;
    var arr = validationitems;

    if (arr.length <= 0) {
        res = true;
    }

    arr.forEach(function (value) {

        var item = $('#' + value);
        if (item.val() === "0" || item.val() === '') {
            item.addClass("hasrequired");
            res = false;

        }
        else {
            if (item === RemarksMandatoryCondition) {
                item.addClass("hasrequired");
            } else {
                item.removeClass("hasrequired");
            }
        }
    });



    validationitemtextbox.forEach(function (value) {
        var ddlid = value.ddlid;
        var txtid = value.txtid;
        var RemarksMandatoryCondition = value.RemarksMandatoryCondition;
        var ddlobj = $('#' + ddlid);
        var txtobj = $('#' + txtid);
        if ($("#" + ddlid + " option:selected").text() === RemarksMandatoryCondition) {
            if (txtobj.val() === '') {
                txtobj.addClass("hasrequired");
                res = false;
            }
        }
        else {
            txtobj.removeClass("hasrequired");
        }
    });

    if (res === false) {
        toastr.error('Fill in all Required Fields');
    }
    return res;
}