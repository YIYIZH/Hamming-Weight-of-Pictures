// find the most similar picture to one choosen picture
// Owner: Zhang Yiyi
// Date: 2014/11/25
// Phash

var PNG = require('pngjs').PNG,
    fs = require('fs'),
    EventEmitter = require('events').EventEmitter,// EventEmitter被定义在Node的事件(events)模块中，直接使用EventEmitter类需要先声明require('events')
    gm = require('gm');


var PREFIX = './10images/';
var thehash = {};

function gethash(img_name){
    img_url = PREFIX + img_name + '.png' ;

    var hash;
    var mat = new Array(8);
    for(var i = 0; i < 8; ++i){
        mat[i] = new Array(8);
    }
    gm(img_url)
    .resize(8, 8, "!") 
    .stream()
    .pipe(new PNG({
        filterType: 3 
    }))
    .on('parsed', function() {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                var idx = (8 * i + j) << 2;
                var r = this.data[idx];
                var g = this.data[idx+1];
                var b = this.data[idx+2];
                mat[i][j] = r*0.3+g*0.59+b*0.11;
            }
        }
        var dct_mat = DCT(mat);
        var mean = 0;
        var m = 0;
        var dct_values = new Array(64);
        for (var i = 0; i < 8; i++) {
            for(var j = 0; j < 8; j++){
                dct_values[m++] = dct_mat[i][j];
                mean += dct_mat[i][j]/64.0;
            }
        }
        for (var i = 0; i < 64; i++) {
            if(dct_values[i] >= mean){
                hash = 1;
            }
            else{
                hash = 0;
            }
        }
        
        event.emit('done');
    });
}

function DCT(img_name){
    var arrary = new Array(8);
    for(var i = 0; i < 8; ++i){
        arrary[i] = new Array(8);
    }
    for(var i = 0; i < 8; ++i){
        for(var j = 0; j < 8; ++j){
            var h = 0;
            for(var k = 0; k < 8; ++k){
                for(var l = 0; l < 8; ++l){
                    h += matrix[k][l]*Math.cos(i*Math.PI*((2*k)+1)/16)*Math.cos(j*Math.PI*((2*l)+1)/16);
                }
            }

            if ((i==0)&&(j!=0)){
                h=h*1/Math.SQRT2;
            }
            if ((j==0)&&(i!=0)){
                h=h*1/Math.SQRT2;
            }
            if ((j==0)&&(i==0)){
                h=0.5*h;
            }
            arrary[i][j]=0.25*h;
        }
    }

    return arrary;

}


function distance(img_name1, img_name2){
    var hamming=0;
    hash1 = thehash(img_name1);
    hash2 = thehash(img_name2);
    for(var i=0; i <64; i++){
        if(hash1[i] != hash2[i])
            hamming++;
    }
    return hamming;
}

function find(img_name){

   
    for(var i=1; i<11; i++){
        if(i != img_name){
            if(dis > distance(img_name,i)){
                 dis = distance(img_name,i);
                 index = i;
             
             }

         }
    }
   console.log("The image most similar to "+img_name+" is "+ index) ;
   console.log("The distance is "+dis);
   // window.showModalDialog('./10images/1.png', null, "dialogHeight:500px; dialogWidth:600px; resizable:yes");
}

var dis = 1000000;
var index = 0;
var name = 0;
var event = new EventEmitter();

function match(){

    var args = process.argv.splice(2);//获取命令行后面的参数
    if (args.length != 1) 
        {console.log("按如下方式输入： node app.js 1-10 ");
         process.exit();
         }
    img_name = args [0];
    for(var i=1; i<11; i++){
        thehash[i] = gethash(i);}

    event = new EventEmitter();

    event.on('done', function(){
        if( name == 10){
        event.emit('begin');}
    });

    event.on('begin',function(){
        find(img_name);
    });
    
}

match();