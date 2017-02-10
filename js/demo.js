$(document).ready(function(){
    var data=[{name:"区域",id:"area"},{name:"总价",id:"price"},{name:"房型",id:"type"},{name:"更多",id:"more"}];

    $(".filter-tabs-screening").filterTabs({data:data,clickHandle:function(data){
        alert(data);
    }});

});

$(document).ready(function(){
    $(".area").click(function(){
        if ($('.grade-eject').hasClass('grade-w-roll')) {
            $('.grade-eject').removeClass('grade-w-roll');
        } else {
            $('.grade-eject').addClass('grade-w-roll');
        }

        //关闭其他的
        if ($('.Category-eject').hasClass('grade-w-roll')){
            $('.Category-eject').removeClass('grade-w-roll');
        };
        if ($('.Sort-eject').hasClass('grade-w-roll')){
            $('.Sort-eject').removeClass('grade-w-roll');
        };
    });
});

$(document).ready(function(){
    $(".price").click(function(){
        if ($('.Category-eject').hasClass('grade-w-roll')) {
            $('.Category-eject').removeClass('grade-w-roll');
        } else {
            $('.Category-eject').addClass('grade-w-roll');
        }

        //关闭其他的
        if ($('.Sort-eject').hasClass('grade-w-roll')){
            $('.Sort-eject').removeClass('grade-w-roll');
        };

        if ($('.grade-eject').hasClass('grade-w-roll')){
            $('.grade-eject').removeClass('grade-w-roll');
        };
    });
});

$(document).ready(function(){
    $(".type").click(function(){
        if ($('.Sort-eject').hasClass('grade-w-roll')) {
            $('.Sort-eject').removeClass('grade-w-roll');
        } else {
            $('.Sort-eject').addClass('grade-w-roll');
        }
    });

    //关闭其他的
    if ($('.Category-eject').hasClass('grade-w-roll')){
        $('.Category-eject').removeClass('grade-w-roll');
    };

    if ($('.grade-eject').hasClass('grade-w-roll')){
        $('.grade-eject').removeClass('grade-w-roll');
    };
});


$(document).ready(function(){
    $(".grade-first>li").click(function(){
        $(".grade-second")
            .css("left","33%")
    });
});

$(document).ready(function(){
    $(".grade-second>li").click(function(){
        $(".grade-third")
            .css("left","50%")
    });
});



$(document).ready(function(){
    $(".Category-w>li").click(function(){
        $(".Category-t")
            .css("left","33.48%")
    });
});

$(document).ready(function(){
    $(".Category-t>li").click(function(){
        $(".Category-s")
            .css("left","66.96%")
    });
});


//js点击事件监听开始
function gradeFirst(wbj){
    var arr = document.getElementById("gradew").getElementsByTagName("li");
    for (var i = 0; i < arr.length; i++){
        var a = arr[i];
        a.style.background = "";
    };
    //wbj.style.background = "#eee"
    wbj.style.color="#FF7C08"
}

function gradeSecond(tbj){
    var arr = document.getElementById("gradet").getElementsByTagName("li");
    for (var i = 0; i < arr.length; i++){
        var a = arr[i];
        a.style.background = "";
    };
    //tbj.style.background = "#fff"
    tbj.style.color="#FF7C08"
}


function gradeThird(sbj){
    var arr = document.getElementById("grades").getElementsByTagName("li");
    for (var i = 0; i < arr.length; i++){
        var a = arr[i];
        a.style.borderBottom = "";
    };
    sbj.style.borderBottom = "solid 1px #ff7c08"
}








function Categorytw(wbj){
    var arr = document.getElementById("Categorytw").getElementsByTagName("li");
    for (var i = 0; i < arr.length; i++){
        var a = arr[i];
        a.style.background = "";
    };
    wbj.style.background = "#eee"
}

function Categoryt(tbj){
    var arr = document.getElementById("Categoryt").getElementsByTagName("li");
    for (var i = 0; i < arr.length; i++){
        var a = arr[i];
        a.style.background = "";
    };
    tbj.style.background = "#fff"
}

function Categorys(sbj){
    var arr = document.getElementById("Categorys").getElementsByTagName("li");
    for (var i = 0; i < arr.length; i++){
        var a = arr[i];
        a.style.borderBottom = "";
    };
    sbj.style.borderBottom = "solid 1px #ff7c08"
}

function Sorts(sbj){
    var arr = document.getElementById("Sort-Sort").getElementsByTagName("li");
    for (var i = 0; i < arr.length; i++){
        var a = arr[i];
        a.style.borderBottom = "";
    };
    sbj.style.borderBottom = "solid 1px #ff7c08"
}
