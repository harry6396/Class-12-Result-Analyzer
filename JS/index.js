angular.module('myApp', []).controller('myCtrl', function() {
var oUIElements={
    "0":
    {
        "UIName":""
    }
}
document.getElementById('file').onchange = function(){

    var file = this.files[0];
    var lines=" ";
    var reader = new FileReader();
    reader.onload = function(progressEvent){
      // Entire file
      console.log(this.result);
  
      // By lines
      lines = this.result.split('\n');
      var sTable="<table class=\"table-body\"><tr>"
      $("#output-container").empty();
      var sHeaderList="";
      sHeaderList=lines[0].split(' ');
      for(var line = 0; line < sHeaderList.length; line++){
        sTable=sTable+"<th class=\"table-cell\">"+sHeaderList[line]+"</th>";
      }
      sTable=sTable+"</tr>";

      var sData="";
      sData=lines[1].split(' ');
      var sTableBody="<tr>";

      for(var line=0;line<sData.length;line++){
        sTableBody=sTableBody+"<th>"+sData[line]+"</th>";
      }
      sTableBody=sTableBody+"</tr>";
      sTable=sTable+sTableBody;
      $("#output-container").append(sTable);
    };
    reader.readAsText(file);
  };

});