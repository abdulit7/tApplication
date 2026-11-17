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
var TranID, ReviewType, _isProbation, _empid, _empname, _isAcceptance, _refno;
var RemarksMandatoryCondition;
var isRequesterLogin = 'show';
jQuery(function ($) { //just like $(document).ready()
    $('[data-toggle="popover"]').popover();
    TranID = getParameterByName('TranID');
    ReviewType = getParameterByName('ReviewType');
    _isProbation = getParameterByName('IsProbation');
    _empid = getParameterByName('empid');
    _empname = getParameterByName('empname');
    _isAcceptance = getParameterByName('isacceptance');
    _refno = getParameterByName('refno');
    // console.log(ReviewType);
    init(TranID, _empid, _empname);
    isRequesterLogin = ecode == _empid ? 'hide' : 'show';
});

function init(TranID, empid, empname) {
    //$('#listTitle').html(_isProbation === 0 || isNull(_isProbation) ? 'Review Entry' : 'Review Entry');
    $('#listTitle').html('Review Entry');
    $('#backLink').attr('href', _isProbation === 0 || isNull(_isProbation) ? 'PerformanceReviewList.html' : 'PerformanceReviewList.html?IsProbation=1');

    $('#txtEmployeeID').html(empid);
    $('#txtEmployeeName').html(empname);
    getPerformanceDetails(TranID);
}


function getPerformanceDetails(TranID) {
    $('#template').html(progress('Loading '));
    postRequest('GetPerformanceDetail', { pTranID: TranID, pIsAcceptance: _isAcceptance }, getPerformanceDetails_Callback);
}

var validationitems = [];
var validationitemtextbox = [];
var allcontrols = [];
var QuestionGroupID;
var reviewDetails = {};

function getPerformanceDetails_Callback(res) {

    // postRequest('GetFlagValueGeneric', { pFlagName: 'IsCopyLastReview' }, function (res) {
    //     console.log(res.d);
    //     if (res.d === 'True') {
    //         // postRequest('GetReviewDetailByTranID', { pTranID: TranID }, function (response) {
    //         //     var data = JSON.parse(response.d);
    //         //     console.log(data);
    //         //     reviewDetails = data;
    //         //     console.log('Last Review' , reviewDetails);
    //         // });
    //     }
    // });

    var template = '';
    var data = JSON.parse(res.d);
    //console.log({data});    
    if (!data.hasOwnProperty('result')) {
        var questionGroup = data['QuestionGroup'];
        var questionTemplate = data['QuestionTemplate'];
        var answersTemplate = data['Answers'];
        var Objectiveanswers = $.extend({}, data['Answers']);
        var ObjectiveTemplate = data['ObjectiveTemplate'];
        var objRemarks = data['Remarks'][0];
    } else {
        toastr.error(data.msg);
        $('#template').html(center(data.msg));
        return;
    }
    var isDisableControlIfAcceptance = '';
    if (_isAcceptance == 'true') {
        isDisableControlIfAcceptance = 'disabled=true';
    }

    $.each(questionGroup, function (i) {

        var filteredQuestions = {};
        QuestionGroupID = questionGroup[i].QuestionGroupID;
        var filteredQuestions = $(questionTemplate).filter(function (j) {
            return questionTemplate[j].QuestionGroupID === questionGroup[i].QuestionGroupID
        });

        template +=
            '<div id="g' + questionGroup[i].QuestionGroupID + '" class="panel panelshadow">' +
            '<div class="panel-body">' +
            '<span id="surveyTitle" class="surveytitle performancetitle"> <small> </small> ' + questionGroup[i].QuestionGroupTitle + ' </span>' +
            '<div class="row">'
            ;


        $.each(filteredQuestions, function (k) {

            // var filteredDetail = $(reviewDetails).filter(function (x){
            //     return reviewDetails[x].QuesionID === filteredQuestions[k].QuesionID
            // });
            // console.log(reviewDetails);

            var answer = filteredQuestions[k].AnswerID;
            var answerRemarks = filteredQuestions[k].Remarks;
            var tranDtlID = filteredQuestions[k].TranDtlID;
            var QuestionID = filteredQuestions[k].QuestionID;


            template +=
                '<div class="surveyquestion">' +
                '<div class="questionTemplate">' +
                '<small><span class="fa fa-hand-o-right"> </span></small>' +
                '<span class="questionTitle">&nbsp;' + filteredQuestions[k].QuestionTitle + '</span>' +
                '<p class="questionDesc">Description : ' + filteredQuestions[k].QuestionDescription + '</p>' +
                '</div>'
                ;

            var filteredAnwers = {};
            var filteredAnwers = $(answersTemplate).filter(function (m) {
                return answersTemplate[m].QuestionID === filteredQuestions[k].QuestionID && answersTemplate[m].ObjectiveID === 0
            });
            //console.log('filteredAnwers', filteredAnwers);

            var options = '';
            var ddlid;
            var txtid;
            var answerID;


            $.each(filteredAnwers, function (n) {
                var selected = filteredAnwers[n].AnswerID === answer ? 'selected' : '';
                options += '<option ' + selected + ' value="' + filteredAnwers[n].AnswerID + '">' + filteredAnwers[n].AnswerTitle + '</option>';

                //answerID = `${filteredAnwers[n].AnswerID}`;
                //hidTranDtlID = `filteredAnwers[n].TranDtlID`;

                // console.log('DTLID' , tranDtlID);
            });


            var dataobj;
            var TranDtlID;
            var QuesionID = filteredQuestions[k].QuestionID;
            var Weightage = filteredQuestions[k].Weightage;
            ddlid = 'ddl' + QuesionID + '';
            txtid = 'txt' + QuesionID + '';
            TranDtlID = filteredQuestions[k].TranDtlID;

            var answertType = filteredQuestions[k].AnswerType;
            var IsMandatory = filteredQuestions[k].IsMandatory;
            //console.log('IsMandatory', IsMandatory);
            RemarksMandatoryCondition = filteredQuestions[k].RemarksMandatoryCondition;
            var QAImage = filteredQuestions[k].QAImage;
            var answerMode = '';

            if (QAImage !== "") {
                QAImage = '<div><span data-toggle="collapse" data-target="#' + QuestionID + '" style="display:block;text-align:right;padding:5px;color:#999;" class="fa fa-picture-o">' +
                    '</span><img id="' + QuestionID + '" width="100%" class="img img-responsive img-thumbnail collapse out" src="' + getBaseUrl() + QAImage + '"></div>';
            }

            var obj = {};

            if (IsMandatory) {
                //console.log('in', ddlid);
                validationitems.push(ddlid);
            }

            if (RemarksMandatoryCondition !== '') {
                obj = { ddlid: ddlid, txtid: txtid, RemarksMandatoryCondition: RemarksMandatoryCondition };
                validationitemtextbox.push(obj);
            }



            switch (answertType) {
                case 'Both':
                    var _placeholder = RemarksMandatoryCondition === "" ? "remarks" : "remarks are mandatory if you have selected " + RemarksMandatoryCondition
                    answerMode =
                        '<select id="' + ddlid + '" name="" class="form-control" id="" ' + isDisableControlIfAcceptance + '>' +
                        '<option value="0">-select-</option>' + options + '</select>' +
                        '<textarea id="' + txtid + '" class="form-control" rows="3" placeholder="' + _placeholder + '" ' + isDisableControlIfAcceptance + '>' + answerRemarks + '</textarea>'

                        ;
                    dataobj = {
                        QuestionID: QuesionID,
                        Controls: [ddlid, txtid]
                    }

                    // console.log('remarks' + answerRemarks);



                    //console.log('this is');
                    //$('#'+ddlid).val(answer === '' ? '' : answer);
                    //$('#'+txtid).val(answerRemarks === '' ? '' : answerRemarks);
                    //$('#'+txtid).val('Test');

                    break;
                case 'Numeric':
                    answerMode =
                        '<select id="' + ddlid + '" name="" class="form-control" id="" ' + isDisableControlIfAcceptance + '>' +
                        '<option value="0">-select-</option>' + options + '</select>' +
                        '<input id="' + txtid + '" type="number" class="form-control" placeholder="your value" value="' + answerRemarks + '">'
                        ;
                    dataobj = {
                        QuestionID: QuesionID,
                        Controls: [ddlid, txtid]
                    }

                    break;

                case 'Options':
                    answerMode =
                        '<select id="' + ddlid + '" name="" class="form-control" id="" ' + isDisableControlIfAcceptance + '>' +
                        '<option value="0">-select-</option>' + options + '</select>'
                        ;
                    dataobj = {
                        QuestionID: QuesionID,
                        Controls: [ddlid]
                    }

                    break;
                case 'Text':
                    answerMode =
                        '<textarea id="' + txtid + '" class="form-control" placeholder="remarks" rows="3" ' + isDisableControlIfAcceptance + '>' + answerRemarks + '</textarea>'
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

            dataobj = Object.assign({}, dataobj,
                {
                    AnswerID: answerID,
                    Weightage: Weightage,
                    QuestionGroupID: QuestionGroupID,
                    ObjectiveID: 0,
                    TranDtlID: TranDtlID
                });
            allcontrols.push(dataobj);

            template +=
                '<div class="answerTemplate">' +
                '<span class="lblanswer">Rating :</span>' + answerMode + QAImage + '</div></div>';

            //template += '</div>';
        });

        template += '</div></div></div>';




    });

    if (!isEmptyObj(ObjectiveTemplate)) {

        template +=
            '<div id="objective" class="panel panelshadow">' +
            '<div class="panel-body">' +
            '<span id="surveyTitle" class="surveytitle performancetitle"> <small> </small> Goals/Objectives </span>' +
            '<div class="row">'
            ;

        var filteredObjectiveAnwers = {};
        $.each(ObjectiveTemplate, function (z) {

            var filterObjAnsers = {};
            var options = '';

            filterObjAnsers = $(answersTemplate).filter(function (t) {
                return answersTemplate[t].ObjectiveID === ObjectiveTemplate[z].ObjectiveID
            });
            var answer = ObjectiveTemplate[z].AnswerID;
            $.each(filterObjAnsers, function (e) {
                var selected = filterObjAnsers[e].AnswerID === answer ? 'selected' : '';
                options += '<option ' + selected + ' value="' + filterObjAnsers[e].AnswerID + '">' + filterObjAnsers[e].AnswerTitle + '</option>';
            });

            var ddlid = 'ddl' + ObjectiveTemplate[z].ObjectiveID + 'O';
            var txtid = 'txt' + ObjectiveTemplate[z].ObjectiveID + 'O';
            var answerID = ObjectiveTemplate[z].ObjectiveID + 'O';

            template +=
                '<div class="surveyquestion">' +
                '<div class="questionTemplate">' +
                '<small><span class="fa fa-hand-o-right"></span></small>' +
                '<span class="questionTitle">' + ObjectiveTemplate[z].QuestionTitle + '</span>' +
                '<p class="questionDesc">' +
                'Start Date : ' + getFormattedDateNew(ObjectiveTemplate[z].StartDate) + ' -' +
                '- Target Date : ' + getFormattedDateNew(ObjectiveTemplate[z].TargetDate) + '<br>' +
                '- Entry : ' + ObjectiveTemplate[z].QuestionDescription + '%<br>' +
                '- Target : ' + ObjectiveTemplate[z].ActionPlan + '%<br>' +
                '- Maximum : ' + ObjectiveTemplate[z].PerformanceIndicators + '%' +
                '</p>' +
                '</div>'
                ;

            template +=
                '<div class="answerTemplate">' +
                '<span class="lblanswer">Answer :</span>' +
                '<select id="' + ddlid + '" name="" class="form-control" id="" ' + isDisableControlIfAcceptance + '>' +
                '<option value="0">-select-</option>' + options + '</select>' +
                '<textarea id="' + txtid + '" class="form-control"  rows="3" ' + isDisableControlIfAcceptance + '>' + ObjectiveTemplate[z].Remarks + '</textarea></div></div>';

            var dataobj = {
                QuestionID: 0,
                Controls: [ddlid, txtid]
            }

            dataobj = Object.assign({}, dataobj, {
                AnswerID: ObjectiveTemplate[z].ObjectiveID
                , Weightage: parseInt(ObjectiveTemplate[z].Weightage)
                , QuestionGroupID: 'objective',
                ObjectiveID: ObjectiveTemplate[z].ObjectiveID,
                TranDtlID: ObjectiveTemplate[z].TranDtlID
            });

            //console.log('OBJARR', dataobj);

            allcontrols.push(dataobj);
            // console.log(allcontrols);
        });

    }
    var RecommendForOptions = '';
    var template2 = '';

    if (_isProbation) {
        RecommendForOptions = '<option value="0">- Select -</option>' +
            '<option value="confirmation">Confirmation</option>' +
            '<option value="extension">Extension of Probation</option>' +
            '<option value="termination">Termination</option>';
    } else {
        RecommendForOptions = '<option value="0">- Select -</option>' +
            '<option value="promotion">Promotion</option>' +
            '<option value="salaryadjustment">Salary Adjustment</option>' +
            '<option value="salaryadjustmentpromotion">Salary Adjustment & Promotion</option>' +
            '<option value="none">None</option>';
    }

    template2 +=
        '<div class="form-group ' + isRequesterLogin + '">' +
        '<label for="Remarks" class="col-sm-2 control-label">' +
        'Recommended For' +
        '</label>' +
        '<div class="col-sm-10">' +
        '<select id="ddlRecommendFor" class="form-control" ' + isDisableControlIfAcceptance + '>' +
        RecommendForOptions +
        '</select>' +
        '</div>' +
        '</div>' +

        '<div class="form-group" id="divExtendTill" style="display:none;">' +
        '<label for="" class="col-sm-2 control-label">' +
        'Extend Till' +
        '</label>' +
        '<div class="col-sm-10">' +

        '<div class="input-group date" id="datetimepicker">' +
        '<input type="text" id="txtExtendTill" class="form-control" readonly />' +
        '<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span>' +
        '</span>' +
        '</div>' +

        '</div>' +
        '</div>' +

        '<div class="form-group" id="divNewDesignation">' +
        '<label for="" class="col-sm-2 control-label">' +
        'New Designation' +
        '</label>' +
        '<div class="col-sm-10">' +
        '<select id="ddlNewDesignation" class="form-control">' +
        '<option value="0">- Select -</option>' +
        '</select>' +
        '</div>' +
        '</div>' +
        '<div class="form-group" id="divNewEmployeeGrade">' +
        '<label for="" class="col-sm-2 control-label">' +
        'New Grade' +
        '</label>' +
        '<div class="col-sm-10">' +
        '<select id="ddlNewEmployeeGrade" class="form-control">' +
        '<option value="0">- Select -</option>' +
        '</select>' +
        '</div>' +
        '</div>' +
        '<div class="form-group" id="divRecommendationType">' +
        '<label for="Remarks" class="col-sm-2 control-label">' +
        'Recommendation Type' +
        '</label>' +
        '<div class="col-sm-10">' +
        '<select id="ddlRecommendationType" class="form-control">' +
        '<option value="0">- Select -</option>' +
        '</select>' +
        '</div>' +
        '</div>' +
        '<div class="form-group" id="divRecommendationValue">' +
        '<label for="Remarks" class="col-sm-2 control-label">' +
        'Recommendation Value' +
        '</label>' +
        '<div class="col-sm-10">' +
        '<input type="text" id="txtRecommendationValue" value="0" class="form-control"/>' +
        '</div>' +
        '</div>' +
        '<div class="form-group">' +
        '<label for="Remarks" class="col-sm-2 control-label">' +
        'Remarks' +
        '</label>' +
        '<div class="col-sm-10">' +
        '<textarea id="txtRemarks" class="form-control" rows="4" ' + isDisableControlIfAcceptance + '></textarea>';
    if (_isAcceptance == 'true') {
        template2 += '<button id="btnAccept" type="button"  class="btn btn-success btn-block suverybtn" onClick="Save(true,true);">Accept ' + getIcon('check') + '</button>' +
            '<button id="btnDecline" type="button" class="btn btn-danger btn-block suverybtn" onClick="Save(false,true);">Decline ' + getIcon('times') + '</button>';
    } else {
        template2 += '<button id="btnDraft" type="button"  class="btn btn-primary btn-block suverybtn" onClick="Save(true);">Save As Draft</button>' +
            '<button id="btnSave" type="button" class="btn btn-success btn-block suverybtn" onClick="Save(false);">Submit ' + getIcon('arrow-right') + '</button>';
    }

    template2 += '</div>' +
        '' +
        '</div>';
    //<button id="btnSave" type="submit" class="btn btn-primary btn-block suverybtn">Save As Draft</button>
    //console.log(validationitems);


    $('#template').html(template);
    $('#template2').html(template2);

    // remarks Aand RecommendFor
    $('#ddlRecommendFor').val(objRemarks.RecommendedFor);
    $('#txtRemarks').val(objRemarks.Remarks);

    $("textarea").focus(function (e) {
        while ($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
            $(this).height($(this).height() + 1);
        };
    });
    if (_isProbation === 0 || isNull(_isProbation)) {
        initDropDowns(objRemarks.RecommendationType);
    }
    handleRecommendedFor();

    $(".select2").css({ "width": "100%" });
    var dataDesig = { id: objRemarks.NewDesignationID, text: objRemarks.NewDesignationTitle };
    var newOptionDesig = new Option(dataDesig.text, dataDesig.id, false, false);
    $('#ddlNewDesignation').append(newOptionDesig).trigger('change');
    $('#ddlNewDesignation').val(objRemarks.NewDesignationID);

    var dataEmpGrade = { id: objRemarks.NewEmployeeGradeID, text: objRemarks.NewEmployeeGradeTitle };
    var newOptionEmpGrade = new Option(dataEmpGrade.text, dataEmpGrade.id, false, false);
    $('#ddlNewEmployeeGrade').append(newOptionEmpGrade).trigger('change');
    $('#ddlNewEmployeeGrade').val(objRemarks.NewEmployeeGradeID);

    //console.log($('#ddlRecommendationType'));
    //$('#ddlRecommendationType').val(objRemarks.RecommendationType);
    $('#txtRecommendationValue').val(objRemarks.RecommendedValue);
    $('#txtExtendTill').val(getFormattedDateNew(objRemarks.ConfiramtionDueDate));

    $("#ddlRecommendFor").change(function (e) {
        handleRecommendedFor();
    });

    if (_isAcceptance == 'true') {
        $('#txtRemarks').summernote('disable');
    } else {
        $('#txtRemarks').summernote();
    }
}



function initDropDowns(RecommendationType) {
    $('#divNewDesignation').hide();
    $('#divNewEmployeeGrade').hide();
    $('#divRecommendationType').hide();
    $('#divRecommendationValue').hide();

    funcFillDropDownListSelec2(10, "GetDataFromSelect2", $('#ddlNewDesignation'), function (params) {
        var valueToPush = {};
        valueToPush["q"] = params.term;
        valueToPush["pagesize"] = 10;
        //var PControl1 = document.getElementById(ddlEmployee);
        valueToPush["pSecKey"] = secKey;
        valueToPush["pEmployeeID"] = eid;
        valueToPush["pEmployeeRefNo"] = ecode;
        valueToPush["pUserID"] = uid;
        valueToPush["pLangID"] = lid;
        valueToPush["pCompanyID"] = cid;

        valueToPush["PID1"] = uid;
        valueToPush["PID2"] = cid;
        valueToPush["PID3"] = "True";
        valueToPush["PID4"] = "False";

        valueToPush["_PID1"] = "tblDesignation";
        valueToPush["_PID2"] = "DesignationTitle as 'Title'";
        valueToPush["_PID3"] = "DesignationID as 'ID'";
        valueToPush["_PID4"] = " and DesignationTitle like '%" + params.term + "%'";

        valueToPush["page"] = params.page;
        return valueToPush;
    });

    funcFillDropDownListSelec2(10, "GetDataFromSelect2", $('#ddlNewEmployeeGrade'), function (params) {
        var valueToPush = {};
        valueToPush["q"] = params.term;
        valueToPush["pagesize"] = 10;
        //var PControl1 = document.getElementById(ddlEmployee);
        valueToPush["pSecKey"] = secKey;
        valueToPush["pEmployeeID"] = eid;
        valueToPush["pEmployeeRefNo"] = ecode;
        valueToPush["pUserID"] = uid;
        valueToPush["pLangID"] = lid;
        valueToPush["pCompanyID"] = cid;

        valueToPush["PID1"] = uid;
        valueToPush["PID2"] = cid;
        valueToPush["PID3"] = "True";
        valueToPush["PID4"] = "False";

        valueToPush["_PID1"] = "tblEmployeeGrade";
        valueToPush["_PID2"] = "EmployeeGradeTitle as 'Title'";
        valueToPush["_PID3"] = "EmployeeGradeID as 'ID'";
        valueToPush["_PID4"] = " and EmployeeGradeTitle like '%" + params.term + "%'";

        valueToPush["page"] = params.page;

        return valueToPush;
    });

    var params = {
        pSecKey: secKey,
        pEmployeeID: eid,
        pEmployeeRefNo: ecode,
        pUserID: uid,
        PID1: 'GetRecommendationTypes',
        PID2: 'RecommendationTypeTitle',
        PID3: 'RecommendationTypeValue',
        pCompanyID: cid,
        PID4: ''
    }
    var ddlRecommendationType = document.getElementById("ddlRecommendationType");
    fillDropDownGeneric(params, ddlRecommendationType, true, RecommendationType);



}

function handleRecommendedFor() {
    //console.log(allcontrols);
    var RecommendFor = $('#ddlRecommendFor');

    if (_isProbation) {
        $('#divNewDesignation').hide();
        $('#divNewEmployeeGrade').hide();
        $('#divRecommendationType').hide();
        $('#divRecommendationValue').hide();
        $('#ddlNewDesignation').val(0);
        $('#ddlNewEmployeeGrade').val(0);
        $('#ddlRecommendationType').val('');
        $('#txtRecommendationValue').val(0);
        //console.log(RecommendFor.val());
        if (RecommendFor.val() === 'extension') {

            $('#divExtendTill').show();
            var dateformat = getLocalStorageItem_String('dateformat');
            $('#datetimepicker,#datetimepicker1').datetimepicker({
                format: dateformat.toUpperCase(),
                ignoreReadonly: true
            });
            $('#txtExtendTill').val(sysdate);


        } else {
            $('#divExtendTill').hide();
            $('#txtExtendTill').val(sysdate);
        }

    } else {
        if (RecommendFor.val() === 'promotion') {
            $('#divNewDesignation').show();
            $('#divNewEmployeeGrade').show();
            $('#divRecommendationType').hide();
            $('#divRecommendationValue').hide();
            $('#ddlRecommendationType').val('');
            $('#txtRecommendationValue').val(0);
        } else if (RecommendFor.val() === 'salaryadjustment') {
            $('#divRecommendationType').show();
            $('#divRecommendationValue').show();
            $('#divNewDesignation').hide();
            $('#divNewEmployeeGrade').hide();
            $('#ddlNewDesignation').val(0);
            $('#ddlNewEmployeeGrade').val(0);
        } else if (RecommendFor.val() === 'salaryadjustmentpromotion') {
            $('#divNewDesignation').show();
            $('#divNewEmployeeGrade').show();
            $('#divRecommendationType').show();
            $('#divRecommendationValue').show();
        } else {
            $('#divNewDesignation').hide();
            $('#divNewEmployeeGrade').hide();
            $('#divRecommendationType').hide();
            $('#divRecommendationValue').hide();
            $('#ddlNewDesignation').val(0);
            $('#ddlNewEmployeeGrade').val(0);
            $('#ddlRecommendationType').val('');
            $('#txtRecommendationValue').val(0);
        }
    }


}

function Save(pFlag, pIsAcceptance) {
    if (validate(pIsAcceptance)) {
        var confirmmsg = "Are you sure to submit this review ";
        confirmmsg += pFlag ? "as Draft ?" : "?";


        if (pIsAcceptance) {
            confirmmsg = pFlag == true ? 'Confirm accept ?' : 'Confirm decline ?';
        }

        if (confirm(confirmmsg)) {

            var _IsDraft = false;
            // console.log(btnID);
            if (pIsAcceptance) {

                if (pFlag) {
                    DisableButton($('#btnAccept'), progress('Accepting'));
                    DisableButton($('#btnDecline'), 'Decline ' + getIcon('times'));
                } else {
                    DisableButton($('#btnDecline'), progress('Declining'));
                    DisableButton($('#btnAccept'), 'Accept ' + getIcon('check'));
                }

            } else {

                if (pFlag) {
                    _IsDraft = true;
                    DisableButton($('#btnDraft'), 'Submiting as Draft ..');
                    DisableButton($('#btnSave'), 'Submit');
                } else {
                    DisableButton($('#btnDraft'), 'Submit');
                    DisableButton($('#btnSave'), 'Submiting ..');
                }

            }




            //console.log(validationitems);
            var objArray = []
            //console.log(allcontrols);

            allcontrols.forEach(function (value) {

                if (value.Controls.length === 2) {
                    var ddlval = $('#' + value.Controls[0]).val();
                    var txtval = $('#' + value.Controls[1]);
                }
                else {
                    //var ddlval = $('#' + value.Controls[0]);
                    //var txtval = 'notboth';
                    var ddlval = 0;//$('#' + value.Controls[1]);
                    var txtval = $('#' + value.Controls[0]);
                }

                var objData = {
                    TranID: TranID,
                    TranDtlID: value.TranDtlID,
                    QuestionGroupID: QuestionGroupID,
                    QuestionID: value.QuestionID,
                    AnswerID: ddlval,
                    AnswerRemarks: txtval !== 'notboth' ? txtval.val() : '',
                    Weightage: value.Weightage == null ? 0 : value.Weightage,
                    ObjectiveID: value.ObjectiveID
                }
                objArray.push(objData);


            });

            //console.log(objArray);
            var isprob = _isProbation === 0 || isNull(_isProbation) ? false : true
            var data_ = {
                pReviewRequestTranID: TranID,
                pAnswersList: objArray,
                pRecommendedFor: $('#ddlRecommendFor').val(),
                pNewDesignationID: parseInt($('#ddlNewDesignation').val()),
                pNewEmployeeGradeID: parseInt($('#ddlNewEmployeeGrade').val()),
                pRecommendationType: $('#ddlRecommendationType').val() === "0" || $('#ddlRecommendationType').val() === null ? '' : $('#ddlRecommendationType').val(),
                pRecommendationValue: parseFloat($('#txtRecommendationValue').val()),
                pRemarks: $('#txtRemarks').val(),
                pIsDraft: pFlag,
                IsProbationReview: isprob,
                pExtendTill: $('#txtExtendTill').val(),
                pIsAcceptance: _isAcceptance,
                pTranRefNo: _refno
            }
            //console.log(data_);
            postRequest('SavePerformance', data_, saveSurvey_Callback, saveSurvey_Error)

        }

    }
}

function saveSurvey_Error(err) {
    EnableButton($('#btnDraft'), 'Save As Draft');
    EnableButton($('#btnSave'), 'Submit');
    toastr.error(err.responseJSON.Message);
}

function saveSurvey_Callback(res) {

    var d = JSON.parse(res.d);
    // console.log(d);
    var res = d.result;
    var msg = d.msg;

    if (res === 'success') {
        if (_isAcceptance == 'true') {

            if (msg.toLowerCase().indexOf('accepted') > -1) {
                _isAcceptance = '&isacceptance=Accepted';
            } else {
                _isAcceptance = '&isacceptance=Declined';
            }
        } else {
            _isAcceptance = '';
        }
        if (_isProbation === 0 || isNull(_isProbation)) {
            window.location.replace('PerformanceReviewList.html?showMsg=true' + _isAcceptance);
        } else {
            window.location.replace('PerformanceReviewList.html?showMsg=true&IsProbation=1' + _isAcceptance);
        }

    }
    if (res === 'Run_TaskalreadyApproved') {
        EnableButton($('#btnDraft'), 'Save As Draft');
        EnableButton($('#btnSave'), 'Submit');
        toastr.error(msg);
    }
    if (res === 'fail') {
        if (_isAcceptance == 'true') {
            EnableButton($('#btnAccept'), 'Accept ' + getIcon('check'));
            EnableButton($('#btnDecline'), 'Decline ' + getIcon('times'));
        } else {
            EnableButton($('#btnDraft'), 'Save As Draft');
            EnableButton($('#btnSave'), 'Submit');
        }

        toastr.error(msg);
    }


}


function validate(pIsAcceptance) {

    if (pIsAcceptance == true) {
        return pIsAcceptance;
    }

    var res = true;
    var arr = validationitems;
    // console.log(validationitems);
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

    if (isRequesterLogin == 'show') {

        if ($('#ddlRecommendFor').val() === "0" || $('#ddlRecommendFor').val() === undefined || $('#ddlRecommendFor').val() === null) {
            toastr.error('Please select recommended for !');
            $('#ddlRecommendFor').addClass("hasrequired");
            $('#ddlRecommendFor').focus();
            res = false;
        } else {
            $('#ddlRecommendFor').removeClass("hasrequired");
        }

        if ($('#ddlRecommendFor').val() === 'salaryadjustment') {
            if (quickValidate('ddlRecommendationType') === false) {
                res = false;
            }
        } else if ($('#ddlRecommendFor').val() === 'promotion') {
            if (quickValidate('ddlNewEmployeeGrade') === false || quickValidate('ddlNewDesignation') === false) {
                res = false;
            }
        } else if ($('#ddlRecommendFor').val() === 'salaryadjustmentpromotion') {
            if (quickValidate('ddlRecommendationType') === false || quickValidate('ddlNewEmployeeGrade') === false || quickValidate('ddlNewDesignation') === false) {
                res = false;
            }
        }
    }

    $('#ddlNewDesignation').append('<option value=someID>optionText</option>');
    //$('#ddlNewDesignation').select2('val', someID, true);

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

function quickValidate(controlID) {
    if ($('#' + controlID).val() === "0" || isNull($('#' + controlID).val())) {
        $('#' + controlID).addClass("hasrequired");
        //$('#'+controlID).focus();
        return false;
    } else {
        $('#' + controlID).removeClass("hasrequired");
        return true;
    }
}