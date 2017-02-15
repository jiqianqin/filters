/**
 * Created by qinwen on 17/2/10.
 */
;(function($,window,document,undefined){
    var pluginName = "filterGrade";
    var defaults = {
        data:{},
        level:2, //默认2层数据
        clickHandle:null, //点击事件
        percent:[33,33,33] //整行为100
    }
    var nowLevel = 1;
    var subGradeData;
    var secondGradeData = {};
    var thirdGradeData = {};
    var firstKey;
    var secondKey;
    var thridKey;

    function Plugin(element,options){
        this.element = element;
        this.options = $.extend({},defaults,options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype.init = function(){
        var self = this;
        self.subGradeData = self.options.data;
        nowLevel = 1;
        self.initContent(self.options.data,nowLevel);
    }

    /**
     * 动态添加tabs
     */
    Plugin.prototype.initContent = function(data,level){
        var self = this;
        var className ;
        switch (level){
            case 1 :
                $(self.element).empty();
                className = "grade-first";
                self.secondGradeData = {};
                self.thirdGradeData = {};
                self.thirdKey = "";
                self.secondKey = "";
                self.firstKey = "";
                self.subGradeData = self.secondGradeData;
                break;
            case 2:
                //$(".grade-second,.grade-third").remove(self.element);
                className = "grade-second";
                self.thirdGradeData = {};
                self.subGradeData = self.thirdGradeData;
                break;
            case 3:
                $(self.element).children(".grade-third").remove();
                className = "grade-third";
        }

        var ul= document.createElement('ul'); //创建评论内容容器
        $(ul).addClass(className);

        var i,len;  //优化变量声明
        // 动态添加数据
        for(i=0, len = data.length; i<len; i++){
            var li = document.createElement('li');
            $(li).addClass(className+"-li");
            li.setAttribute("data-li-level",level || 0);
            li.setAttribute("data-tab-id",data[i].key || ("tab"+i));
            li.innerHTML=data[i].desc;

            if(data[i].nodeList && data[i].nodeList.length >0){
                self.subGradeData[data[i].key] = data[i].nodeList;
            }
            //绑定点击事件
            self.initBind(li);
            ul.appendChild(li);
        }
        this.element.appendChild(ul);
        setTimeout(function(){
            self.leftMove(level);
        },100);

        return this;
    }

    Plugin.prototype.leftMove = function(level){
        var self = this;
        switch(level){
            case 1 :
                $(".grade-second").css("left","100%");
                $(".grade-third").css("left","100%");
                break;
            case 2 :
                $(".grade-second").css("left",self.options.percent[0]+"%");
                $(".grade-third").css("left","100%");
                break;
            case 3 :
                $(".grade-second").css("left","33%");
                $(".grade-third").css("left",self.options.percent[1]+self.options.percent[0]+"%");
                break;
        }

    }

    /**
     * 初始化绑定
     */
    Plugin.prototype.initBind = function(content){
        var self = this;
        $(content).on("click", function () {
            $(content).parent().find("li").removeClass('active');
            $(content).addClass('active');
            var key = content.getAttribute("data-tab-id");
            var liLevel=content.getAttribute("data-li-level");
            switch (liLevel){
                case "1" :
                    self.firstKey = key;
                    if(self.options.level > 1 && self.secondGradeData && self.secondGradeData[key] && self.secondGradeData[key].length > 0){
                        self.nowLevel = 2 ;
                        self.initContent(self.secondGradeData[key],self.nowLevel);

                    }
                    self.options.clickHandle && self.options.clickHandle([self.firstKey]);
                    break;
                case "2":
                    self.secondKey = key ;
                    if( self.options.level > 2 && self.thirdGradeData && self.thirdGradeData[key] && self.thirdGradeData[key].length > 0){
                        self.nowLevel = 3 ;
                        self.initContent(self.thirdGradeData[key],self.nowLevel)
                    }
                    self.options.clickHandle && self.options.clickHandle([self.secondKey,self.firstKey]);
                    break;
                case "3":
                    self.thirdKey = key ;
                    self.options.clickHandle && self.options.clickHandle([self.thirdKey,self.secondKey,self.firstKey]);
                    break;
            }
        })
    }




    $.fn[pluginName] = function(options) {
        if (typeof arguments[0] === 'string') {
            var methodName = arguments[0];
            var args = Array.prototype.slice.call(arguments, 1);
            var returnVal;
            this.each(function() {
                if ($.data(this, 'plugin_' + pluginName) && typeof $.data(this, 'plugin_' + pluginName)[methodName] === 'function') {
                    returnVal = $.data(this, 'plugin_' + pluginName)[methodName].apply(this, args);
                } else {
                    throw new Error('Method ' + methodName + ' does not exist on jQuery.' + pluginName);
                }
            });
            if (returnVal !== undefined) {
                return returnVal;
            } else {
                return this;
            }
        } else if (typeof options === "object" || !options) {
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        }
    };

})(jQuery,window,document);

