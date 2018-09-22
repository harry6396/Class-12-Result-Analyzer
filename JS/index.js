var oSubject1=[];
var sHeaderList=[];
var oSubjectAverage=[];
var oSubjectList = [{"SubjectCode":"301","Subject":"ENGLISH"},
{"SubjectCode":"041","Subject": "MATHEMATICS" },
{"SubjectCode":"042","Subject": "PHYSICS"},
{"SubjectCode":"043","Subject":"CHEMISTRY"},
{"SubjectCode":"044","Subject":"BIOLOGY"},
{"SubjectCode":"065","Subject":"IP"}];

angular.module('myApp', []).controller('myCtrl', function() {

$(".upload-button").on("click",function(){
  ReadResult();
  $(".file-container").addClass("no-display");
  $("#output-table-container").removeClass("no-display");
  $("#calculation-container").removeClass("no-display");
});
});

function ReadResult(){

  var sData;
  var sLineData;
  var iCounter = 0;
  var iHeaderCounter = 0;
  var iCounterInner = 0;
  var sLineDataSubject;
  var sHeadingOutput = "";

  sData = $("#file").val().split('\n');
  sData = sData.filter(n=>n);

  //to find the first row having Headings
  for(iCounter = 0; iCounter < sData.length; iCounter++){
    sLineData = sData[iCounter].split(' ').filter(n=>n);
    if(sLineData.length > 0 && (sLineData[0].toLowerCase() === "roll" || sLineData[0].toLowerCase() === "rollno")){
      break;
    }
  }
//to store the Roll Number and Candidate Name
  sHeaderList[iHeaderCounter++] = sLineData[0] + " " +sLineData[1]; 
  sHeaderList[iHeaderCounter++] = sLineData[2] + " " +sLineData[3]; 

  // split the heading and ignore the spaces
  sLineData = sData[iCounter+2].split(' ').filter(n=>n);

  // find the first subject
  for(iCounterInner = 1; iCounterInner < sLineData.length; iCounterInner++){
    sLineDataSubject = sLineData[iCounterInner].split('');
    if(sLineDataSubject.length > 0 && sLineDataSubject[0].charCodeAt(0) >=48 && sLineDataSubject[0].charCodeAt(0) <=57){
      break;
    }
  }

 // maintain a list of subjects
for(; iCounterInner < sLineData.length; iCounterInner=iCounterInner+3){
  sHeadingOutput = getSubject(sLineData[iCounterInner]);
  if(sHeadingOutput){
     sHeaderList[iHeaderCounter++] = sHeadingOutput;
  }
}

oSubject1=[];
// get the list of students with marks
for(iCounter = iCounter+1 ;iCounter < sData.length; iCounter++){
  sLineDataSubject = sData[iCounter].split(' ').filter(n=>n);
  //get the student details
  if(sLineDataSubject[0] !== "Disclaimer"){
  GetStudentDetails(sLineDataSubject,iCounter);
  }
  else{
    break;
  }
}

for(iCounter=0;iCounter<sHeaderList.length;iCounter++){
  if(sHeaderList[iCounter] === "Percentage"){
    break;
  }
}
if(iCounter === sHeaderList.length){
  sHeaderList[iCounter]="Percentage";
}


 // get the table headings
  var sTable = RenderTableHeading();

  oSubject1 = oSubject1.filter(function(e){return e}); 

  var sTableBody = RenderTableBody();

  $("#output-container").append(sTable + sTableBody + "</table>");

  // to get the average of each subject
  getSubjectAverage();

  // to render the top students
  sTableBody = getTopStudents();

  $("#output-container-top-students").append(sTable + sTableBody + "</table>");

  // to render the subject wise average
  ChartRendering();
}

function RenderTableBody(){

    var iCounter = 0;
    var iCounterInner = 0;
    var sTableBody="";
    var sResult="";

    oSubject1.sort(function(a,b){
      return b.Percentage-a.Percentage;
      });
      
      for(iCounter = 0; iCounter < oSubject1.length; iCounter++){
        if(oSubject1){
        sTableBody = sTableBody + "<tr>";
        for(iCounterInner = 0; iCounterInner < sHeaderList.length; iCounterInner++){
          if(sHeaderList[iCounterInner] !== ""){
            var sSubject = oSubject1[iCounter][sHeaderList[iCounterInner].replace(" ","")];
            if(sSubject){
              sResult = sSubject; 
            }
            else{
              sResult = "NA";
            }
          sTableBody = sTableBody + "<td>" + sResult + "</td>";
        }
        }
        sTableBody = sTableBody + "</tr>";
      }
    }

    return sTableBody;
}

function ChartRendering(){

  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "light2",
    title:{
      text: "Average Subject-Wise"
    },
    axisY: {
      title: "Average"
    },
    data: [{        
      type: "column",  
      showInLegend: true, 
      legendMarkerColor: "grey",
      legendText: "Subject",
      dataPoints: [      
        { y: oSubjectAverage[2]["PHYSICS"], label: "Physics" },
        { y: oSubjectAverage[1]["MATHEMATICS"],  label: "Mathematics" },
        { y: oSubjectAverage[3]["CHEMISTRY"],  label: "Chemistry" },
        { y: oSubjectAverage[0]["ENGLISH"],  label: "English" },
        { y: oSubjectAverage[5]["IP"],  label: "IP" },
        { y: oSubjectAverage[4]["BIOLOGY"], label: "Biology" }
      ]
    }]
  });
  chart.render();
  }

function getSubject(sSubject){
 var iCounter = 0;
 
 for(iCounter = 0; iCounter < oSubjectList.length; iCounter++){
  if(oSubjectList[iCounter]["SubjectCode"] === sSubject){
    return oSubjectList[iCounter]["Subject"];
    }
  }
}

function RenderTableHeading(){

  var iCounter;
  var sTable="<table class=\"table-body\"><tr>";

  for(iCounter = 0 ; iCounter < sHeaderList.length; iCounter++){
    if(sHeaderList[iCounter].replace(" ","").toLowerCase() === "candidatename"){
    sTable=sTable+"<th class=\"table-cell-1\">"+sHeaderList[iCounter]+"</th>";
    }
    else if(sHeaderList[iCounter].replace(" ","").toLowerCase() === "rollno"){
      sTable=sTable+"<th class=\"table-cell-2\">"+sHeaderList[iCounter]+"</th>";
    }
    else if(sHeaderList[iCounter] !== ""){
      sTable=sTable+"<th class=\"table-cell\">"+sHeaderList[iCounter]+"</th>";
    }
  }
return sTable;
}

function GetStudentDetails(sLineDataSubject,iCounter1){

  var iCounter=0;
  var oSubject={};
  var sOutput="";
  var iTotalMarks=0;

  for(iCounter=0; iCounter < sLineDataSubject.length; iCounter++){
   switch(iCounter){
     case 0:
      oSubject["ROLLNO"]=sLineDataSubject[iCounter];
      break;
      case 1:
      var sCandidateName;
      oSubject["CANDIDATENAME"]="";
      for(;iCounter < sLineDataSubject.length; iCounter++){
        sCandidateName = sLineDataSubject[iCounter].split('');
        if(sCandidateName[0].charCodeAt(0) >= 48 && sCandidateName[0].charCodeAt(0) <= 57 ){
          break;
        }
        else {
          oSubject["CANDIDATENAME"] = oSubject["CANDIDATENAME"] + " " + sLineDataSubject[iCounter];
        }
      }
      break;
      default:
      for(iCounter = iCounter-1 ;iCounter < sLineDataSubject.length;iCounter=iCounter+3){
        sOutput = checkSubject(sLineDataSubject[iCounter]);
         if(sOutput){
           oSubject[sOutput]=sLineDataSubject[iCounter+1];
           iTotalMarks = iTotalMarks + parseInt(sLineDataSubject[iCounter+1]);
         }
      }
      break;
   }
  }
  if(oSubject && parseInt(iTotalMarks) > 0){
    oSubject["TotalMarks"] = iTotalMarks;
    oSubject["Percentage"] = iTotalMarks/5;
    oSubject1[iCounter1]=oSubject;
  }

}

// check whether subject exists or not
function checkSubject(sSubject){

  var iCounter=0;
  var sSubjectName = "";

  for(iCounter = 0; iCounter < oSubjectList.length; iCounter++){
    if(oSubjectList[iCounter]["SubjectCode"] === sSubject){
      sSubjectName = oSubjectList[iCounter]["Subject"];
      break;
    }
  }

  for(iCounter = 0; iCounter < sHeaderList.length; iCounter++){
    if(sHeaderList[iCounter] === sSubjectName){
      return sHeaderList[iCounter];
    }
  }

  if(iCounter === sHeaderList.length){
    sHeaderList[iCounter]=sSubjectName;
    return sSubjectName;
  }
  return null;
}

// to get the subject average
function getSubjectAverage(){
var iCounter = 0;
var iSize=0;
var iInnerCounter=0;
var oSubjectAverage1;
var iSum=0;
var sValue="";
var iSubjectCounter=0;
oSubjectAverage={};

for(iInnerCounter=2;iInnerCounter<sHeaderList.length;iInnerCounter++){
  iSum=0;
  if(sHeaderList[iInnerCounter] !== "" && sHeaderList[iInnerCounter] !== "Percentage"){
    oSubjectAverage1={};
    iSubjectCounter=0;
  for(iCounter=0;iCounter<oSubject1.length;iCounter++){
    sValue = oSubject1[iCounter][sHeaderList[iInnerCounter]];
    if(sValue !== NaN && sValue !== "" && sValue !== undefined){
    iSum = iSum + parseInt(sValue);
    iSubjectCounter++;
    }
}
oSubjectAverage1[sHeaderList[iInnerCounter]] = iSum/iSubjectCounter;
oSubjectAverage[iSize] = oSubjectAverage1;
iSize++;
  }
}
 }

 // to get the top students
 function getTopStudents(){

  var iCounter = 0;
  var iCounterInner = 0;
  var sTableBody="";
  var sResult="";

  for(iCounter = 0; iCounter < 5; iCounter++){
    if(oSubject1){
    sTableBody = sTableBody + "<tr>";
    for(iCounterInner = 0; iCounterInner < sHeaderList.length; iCounterInner++){
      if(sHeaderList[iCounterInner] !== ""){
        var sSubject = oSubject1[iCounter][sHeaderList[iCounterInner].replace(" ","")];
        if(sSubject){
          sResult = sSubject; 
        }
        else{
          sResult = "NA";
        }
      sTableBody = sTableBody + "<td>" + sResult + "</td>";
    }
    }
    sTableBody = sTableBody + "</tr>";
  }
}
return sTableBody;
 }