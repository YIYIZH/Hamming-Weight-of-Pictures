// find the most similar picture to one choosen picture
// Owner: Zhang Yiyi
// Date: 2014/11/25

var PNG = require('pngjs').PNG,
    fs = require('fs'),
    EventEmitter = require('events').EventEmitter;// EventEmitter被定义在Node的事件(events)模块中，直接使用EventEmitter类需要先声明require('events')

var PREFIX = './10images/';
var feature_vector = {};

function feature(img_name){

    var img_url = PREFIX + img_name + '.png' ;
    var reds= [];
    var greens = [];
    var blues = [];
    var feature = [];

    fs.createReadStream(img_url)
    .pipe(new PNG({
    filterType: 3
    }))
    .on('parsed', function(){
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                var idx = (this.width * i + j) << 2;
                reds.push(this.data[idx]);
                greens.push(this.data[idx+1]);
                blues.push(this.data[idx+2]);
                
            }
        }
    feature.push(getmean(reds));
    feature.push(getvariance(reds));
    feature.push(getskewness(reds));
    feature.push(getmean(greens));
    feature.push(getvariance(greens));
    feature.push(getskewness(greens));
    feature.push(getmean(blues));
    feature.push(getvariance(blues));
    feature.push(getskewness(blues));
    feature_vector[img_name] = feature;
    name++;
    event.emit('done');
    });

}

function getmean(container){
    var mean = 0;
    for(var i=0; i < container.length; i++){
        mean += container[i];
    }
    return mean/(container.length);

}

function getvariance(container){
    var variance = 0;
    var mean = getmean(container);
    for(var i=0; i < container.length; i++){
        variance += (container[i]-mean)*(container[i]-mean);
    }
    return variance;

}

function getskewness(container){
    var skewness = 0;
    var mean = getmean(container);
    for(var i=0; i < container.length; i++){
        skewness += (container[i]-mean)*(container[i]-mean)*(container[i]-mean);
    }
    return skewness;

}

function distance(img_name1,img_name2){
    var length1=0;
    var length2=0;
    var dotproduct=0;
    var f1 = feature_vector[img_name1];
    var f2 = feature_vector[img_name2];
    for(var i=0; i < f1.length; i++){
    length1 += f1[i]*f1[i]
    }

    for(var i=0; i < f2.length; i++){
    length2 += f2[i]*f2[i]
    }

    for(var i=0; i < f1.length; i++){
    dotproduct += f1[i]*f2[i]
    }
    
    length1 = Math.sqrt(length1);
    length2 = Math.sqrt(length2);
    return dotproduct/length1/length2;

}

function find(img_name){

   
    for(var i=1; i<11; i++){
        if(i != img_name){
            if(sim < distance(img_name,i)){
                 sim = distance(img_name,i);
                 index = i;
             
             }

         }
    }
   console.log("The image most similar to "+img_name+" is "+ index) ;
   console.log("The similarity is "+sim);
   // window.showModalDialog('./10images/1.png', null, "dialogHeight:500px; dialogWidth:600px; resizable:yes");
}

var sim = 0;
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
        feature_vector[i] = feature(i);}

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