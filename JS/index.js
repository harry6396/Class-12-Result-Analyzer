var oSubject1=[];
var sHeaderList;
var oSubjectAverage=[];

angular.module('myApp', []).controller('myCtrl', function() {
var oUIElements={
    "0":
    {
        "UIName":""
    }
}
$(".upload-button").on("click",function(){
  ReadResult();
  $("#output-table-container").removeClass("no-display");
  $("#calculation-container").removeClass("no-display");
});
});

function ReadResult(){

  var sData;
  sData=$("#file").val().split('\n');
  var sTable="<table class=\"table-body\"><tr>";

  $("#output-container").empty();

        sHeaderList=sData[0].split(' ');
        for(var line = 0; line < sHeaderList.length; line++){
          sTable=sTable+"<th class=\"table-cell\">"+sHeaderList[line]+"</th>";
        }
        sTable=sTable+"</tr>";

var iCounter=0;
var iCounter1=0;
var sStudentRecords;
var sTableBody="";
var iTotalNumber=0;

        for(iCounter=1;iCounter<sData.length;iCounter++){
          sStudentRecords=sData[iCounter].split(' ');
          sTableBody=sTableBody+"<tr>";
          iTotalNumber=0;
          oSubject1[iCounter-1]={};
          for(iCounter1=0;iCounter1<sStudentRecords.length;iCounter1++){
            sTableBody=sTableBody+"<td>"+sStudentRecords[iCounter1]+"</td>";
            if(iCounter1>1){
            oSubject1[iCounter-1][sHeaderList[iCounter1]]=sStudentRecords[iCounter1];
            iTotalNumber=iTotalNumber+parseInt(sStudentRecords[iCounter1]);
            }
            else{
              oSubject1[iCounter-1][sHeaderList[iCounter1]]=sStudentRecords[iCounter1];
            }
            if(iCounter1 === sStudentRecords.length-1){
            oSubject1[iCounter-1]["Percentage"]=iTotalNumber/5;
            }
          }
          sTableBody=sTableBody+"</tr>";
        }
        sTable=sTable+sTableBody+"</table>";
  $("#output-container").append(sTable);
  CalculatePercentage();
  ChartRendering();
}

function CalculatePercentage(){

    var iCounter=0;
    var sTable="<table class=\"table-body\"><tr>";
    var sTableBody="<tr>";

    oSubject1.sort(function(a,b){
      return b.Percentage-a.Percentage;
      });
      
      for(var line = 0; line < sHeaderList.length; line++){
        sTable=sTable+"<th class=\"table-cell\">"+sHeaderList[line]+"</th>";
      }
      sTable=sTable+"</tr>";
  
    for(iCounter=0;iCounter<3;iCounter++){
      sTableBody=sTableBody+"<tr>";
      for(var line=0;line<sHeaderList.length;line++){
      sTableBody=sTableBody+"<td>"+oSubject1[iCounter][sHeaderList[line]]+"</td>";
      }
      sTableBody=sTableBody+"</tr>";
    }
    sTable=sTable+sTableBody+"</table>";

    $("#output-container-top-students").append(sTable);
}

function ChartRendering(){

  var iCounter=0;
  var iCounter1=0;
  var iSum=0;
  var Counter=0;
  var sStudentCounter=0;

  for(iCounter=0;iCounter<sHeaderList.length-2;iCounter++){
    iSum=0;
    sStudentCounter=0;
    for(iCounter1=0;iCounter1<oSubject1.length;iCounter1++){
      if(oSubject1[iCounter1][sHeaderList[iCounter+2]] !== "0" ){
        sStudentCounter++;
      iSum=iSum+parseInt(oSubject1[iCounter1][sHeaderList[iCounter+2]]);
      }
    }
        sStudentCounter++;
        oSubjectAverage[Counter++]=iSum/sStudentCounter;
  }

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
        { y: oSubjectAverage[0], label: "Physics" },
        { y: oSubjectAverage[1],  label: "Mathematics" },
        { y: oSubjectAverage[2],  label: "Chemistry" },
        { y: oSubjectAverage[3],  label: "English" },
        { y: oSubjectAverage[4],  label: "IP" },
        { y: oSubjectAverage[5], label: "Biology" }
      ]
    }]
  });
  chart.render();
  }

     