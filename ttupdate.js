// set variables

var arr;
x = 0;
y = 0;
var obList = [];
var pop1 = 0;
var pop2 = 0;
var ob;
var startTime;
var finTime;
var totalTime;

var timeArray = {
error: 0,
times: []

};

var control = [1,2,3,4,5,6,7,8,9,10,11,12];
var control2 = [2,4,6,8,10,12,1,3,5,7,9,11];
var yearThree = [1,2,3,5,10];
var yearFour = [1,2,3,4,5,6,7,8,9,10,11,12];
var ttList;

Array.prototype.shuffle = function() {
    var input = this;     
    for (var i = input.length-1; i >=0; i--) {     
        var randomIndex = Math.floor(Math.random()*(i+1)); 
        var itemAtIndex = input[randomIndex]; 
        input[randomIndex] = input[i]; 
        input[i] = itemAtIndex;
    }
    return input;
}

Array.prototype.setPairs = function(yGen){
    var yGen = yGen;
    var returnArray = [];
    var pair = [];
    var input = this;
    for(i=0;i<input.length;i++){
        for(j=0;j<12;j++){  
          returnArray.push([input[i]]);
        }
    }
    for(i=0;i<input.length;i++){
        pair=pair.concat(yGen);
    }
    for(i=0;i<returnArray.length;i++){
        returnArray[i].push(pair[i]);
    }
    return returnArray;
}

Array.prototype.keepLine = function(array){
    var input = this;
    var array = array;
    var returnArray = []
    for(i=0;i<array.length;i++){
        for(j=0;j<input.length;j++){
            if(this[j][0]==array[i]){
              returnArray.push(this[j]);
            }
        }
    }    
    return returnArray;
}

function logArray(array){
  var array = array;
  for(i=0;i<array.length; i++){
    console.log(array[i]);
  }
}


function setList(ttLevel) {
    var ttLevel = ttLevel; 
    switch(ttLevel){
        case "1":
            ttList=yearThree.setPairs(control);
            break;
        case "2":
            ttList=yearThree.setPairs(control2);
            break;
        case "3":
            ttList=yearThree.setPairs(control).shuffle().keepLine(yearThree);
            break;
        case "4":
            ttList=yearThree.setPairs(control).shuffle();
            break;
        case "5":
            ttList=yearFour.setPairs(control);
            break;
        case "6":
            ttList=yearFour.setPairs(control2);
            break;
        case "7":
            ttList=yearFour.setPairs(control).shuffle().keepLine(yearFour);
            break;
        default:
            ttList=yearFour.setPairs(control).shuffle();
            break;
        }
//            logArray(ttList);
}


function ttData(num1, num2, time, err){
    this.questionID = 0;
    this.num1 = num1;
    this.num2 = num2;
    this.ans = num1*num2;
    this.time = time;
    this.err = err;
}


arr = $('#tbl > tbody > tr').map(function ()
{
    return $(this).children().map(function ()
    {
        return $(this);
    });
}).get();

var te = 0;
for(i = 0; i < arr.length; i++){
    for(j = 0; j < arr[i].length; j++){
        arr[i][j].attr("data-row", te);
        te++;
    }    
}

function locate(){
    $(  "#links" ).hide();
    $( "#btn_select" ).hide();
    $( "#guessInput" ).focus();
    var locator = ttList.shift();
    pop1 = locator[0];
    pop2 = locator[1];
    arr[pop1][pop2].attr('id','selected');
    var inputElement = document.getElementById('selected');
    ob = new ttData(pop1, pop2, 0, 0);
    document.getElementById("here").innerHTML = ob.num1 + " X " + ob.num2 + " = ";
    var d = new Date();
    startTime = d.getTime();
//    cheat function:
//    document.getElementById("guessInput").value = ob.ans;
}

function checkAns() {
    var Uans = document.getElementById("guessInput").value;
    if (Uans == ob.ans){
        var d = new Date();
        finTime = d.getTime();
        var numBat = (finTime - startTime);
        totalTime = Math.round((numBat + 0.00001) * 100)/ 100000;
        ob.time = totalTime;
        ob.questionID = (arr[pop1][pop2].attr("data-row"));
        obList.push(ob);
        arr[pop1][pop2].text(ob.ans);
        arr[pop1][pop2].removeAttr('id','selected').attr('class','correct');
        if(ttList.length > 0){
        document.getElementById("guessInput").value = "";
            locate();
        } else {
            finish();
        }        
    } else {
        timeArray.error++;
        ob.err++;
        document.getElementById("guessInput").value = "";
        arr[pop1][pop2].removeAttr('id','selected').attr('class','error');
        $( '#tbl' ).effect( 'shake' );        
    }
}

function finish(){

    $( '#links' ).show();
    $( 'form' ).remove();
    obList.sort(function(a, b) {
        return parseFloat(a.questionID) - parseFloat(b.questionID);
    });
    for(i = 0; i<obList.length; i++){
        timeArray.times.push(obList[i].time);
    }
//    console.log(JSON.stringify(obList));
//    console.log(JSON.stringify(timeArray));
    var jlist = (JSON.stringify(timeArray));
//      console.log(jlist);
    $.post("ttprocess.php",
    jlist,
    function(response,status){
    var totalTime = response;
    $( "#totalTime" ).text("Total time: " + totalTime);
    alert("*----Received Data----*\n\nResponse : " + totalTime +"\n\nStatus : " + status);    
    });
    for(i = 0; i < obList.length; i++) {
        var bb = obList[i].time;
        var num1 = obList[i].num1;
        var num2 = obList[i].num2;
        arr[num1][num2].text(bb);
        if (obList[i].err > 0) {
            arr[num1][num2].removeAttr('class','correct').attr('class','error');
        } else if(bb > 4){
            arr[num1][num2].removeAttr('class','correct').attr('class','long');
        } 
    }
}

