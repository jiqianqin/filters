/**
 * Created by qinwen on 17/2/10.
 */
;(function($,window,document,undefined){
    var pluginName = "filterGrade";
    var defaults = {
        data:{},
        level:2, //默认2层数据
        clickHandle:null, //点击事件
        percent:[30,30,30] //整行为100
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
                $(".grade-second").css("left","30%");
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


/**
 * Created by qinwen on 17/2/10.
 */
;(function($,window,document,undefined){
    var pluginName = "filterMultiple";
    var defaults = {
        data:{},
        sureBtn:"确定",
        comfirm:null,
        selectAllEnable:true,
        selectAllTip:"全部",
        selectAllHandle:null,
        clickHandle:null, //点击事件
        selected:null//选择的
    }

    function Plugin(element,options){
        this.element = element;
        this.options = $.extend({},defaults,options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype.init = function(){
        var self = this;
        self.initContent(self.options.data).initStyle();

    }

    /**
     * 动态添加tabs
     */
    Plugin.prototype.initContent = function(data){
        var self = this;

        var ul= document.createElement('ul');
        $(ul).addClass("filter-multiple-content")

        if(self.options.selectAllEnable){
            var li = document.createElement('li');
            $(li).addClass('clickAll');
            $(li).attr('id','clickAll');
            li.innerHTML=self.options.selectAllTip;
            $(li).on("click", function () {
                self.selectAllHandle();
                self.options.selectAllHandle && self.options.selectAllHandle();
            })
            ul.appendChild(li);
        }

        var i,len;  //优化变量声明
        // 动态添加数据
        for(i=0, len = data.length; i<len; i++){
            var li = document.createElement('li');
            li.innerHTML=data[i].desc;
            li.setAttribute("data-tab-id",data[i].key || ("tab"+i));

            var checkbox = document.createElement('span');
            $(checkbox).addClass("multiple-checkbox");
            li.appendChild(checkbox);

            if(self.options.selected && self.options.selected.indexOf(data[i].key,0) != -1){
                $(li).addClass('active');
            }

            //绑定点击事件
            self.initBind(li);
            ul.appendChild(li);
        }

        this.element.appendChild(ul);

        var div = document.createElement('div');
        $(div).addClass("filter-multiple-setting");

        var sureBtn =  document.createElement('button');
        sureBtn.innerHTML = self.options.sureBtn;
        $(sureBtn).addClass("multipleSure");

        $(sureBtn).on("click", function () {
            self.options.comfirm && self.options.comfirm(self.getSelected());
        })

        div.appendChild(sureBtn);


        this.element.appendChild(div);

        return this;
    }

    Plugin.prototype.selectAllHandle = function(){
        var self = this ;
        var checkbox =  $(".filter-multiple-content li");
        if($('.clickAll').hasClass("active")){
            checkbox.removeClass("active");
        }else {
            checkbox.addClass("active");
        }
    }

    Plugin.prototype.getSelected = function(){
        var selected = [],selectFlag = 2;
        var i,len;  //优化变量声明
        var divs = $(".filter-multiple-content li.active[id!='clickAll']");
        for(i=0, len = divs.length; i<len; i++){
            if($(divs[i]).hasClass("active")){
                selected.push(divs[i].getAttribute("data-tab-id"));
            }
        }
        if($('.clickAll').hasClass("active")){
            selectFlag = 1;
        }else if(selected.length == 0 ){
            selectFlag = 0;
        }

        return {selectList:selected,selectFlag:selectFlag};
        //};
    }

    Plugin.prototype.initStyle = function(){
        var self = this;
        var settingContent = self.element.querySelector(".filter-multiple-setting");
        var height= self.element.querySelector(".filter-multiple-content").offsetHeight;
        $(settingContent).css("top",height+"px")

    }


    /**
     * 初始化绑定
     */
    Plugin.prototype.initBind = function(content){
        var self = this;
        $(content).on("click", function () {
            $(content).hasClass('active') ? $(content).removeClass('active'):$(content).addClass('active');
            if( $(".filter-multiple-content li[id!='clickAll']").length == $(".filter-multiple-content li.active[id!='clickAll']").length){
                $(".clickAll").addClass('active');
            }else {
                $(".clickAll").removeClass('active');
            }
            var key = content.getAttribute("data-tab-id");
            self.options.clickHandle && self.options.clickHandle(key);
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


/**
 * Created by qinwen on 17/2/10.
 */
;(function($,window,document,undefined){
    var pluginName = "filterSigle";
    var defaults = {
        data:{},
        settingEnable:true, //是否支持自定义
        settingType:"interval", //自定义的样式   interval :选择区间
        settingTip:"区间",
        placeholderLow:"最低区间",
        placeholderHigh:"最高区间",
        sureBtn:"确定",
        clickHandle:null, //点击事件
        comfirm:null,
        selected:null //若传回字符串,则为单选,若传回数组,则为自定义
    }

    function Plugin(element,options){
        this.element = element;
        this.options = $.extend({},defaults,options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype.init = function(){
        var self = this;
        self.initContent(self.options.data);
        self.initStyle();
    }

    /**
     * 动态添加tabs
     */
    Plugin.prototype.initContent = function(data){
        var self = this;

        var ul= document.createElement('ul');
        $(ul).addClass("filter-sigle-content");

        var i,len;  //优化变量声明
        // 动态添加数据
        for(i=0, len = data.length; i<len; i++){
            var li = document.createElement('li');

            self.options.selected && self.options.selected == data[i].key &&  $(li).addClass("active");

            li.setAttribute("data-tab-id",data[i].key || ("tab"+i));
            li.innerHTML=data[i].desc;

            //绑定点击事件
            self.initBind(li);
            ul.appendChild(li);
        }
        this.element.appendChild(ul);

        return this;
    }

    Plugin.prototype.initStyle = function(){
        var self = this;
        if(!self.options.settingEnable){
            return;
        }
        switch (self.options.settingType){
            case "interval":
                self.intervalStyleInit();
                break;
        }

        var settingContent = self.element.querySelector(".filter-sigle-setting");
        if(self.options.settingEnable && settingContent){
            var height= self.element.querySelector(".filter-sigle-content").offsetHeight;
            $(settingContent).css("top",height+"px")
        }
    }

    /**
     * 选择区间
     */
    Plugin.prototype.intervalStyleInit = function(){
        var self = this;
        var div = document.createElement('div');
        $(div).addClass("filter-sigle-setting");

        var tip = document.createElement('tip');
        tip.innerHTML = self.options.settingTip;
        $(tip).addClass("intervalTip");
        div.appendChild(tip);

        var inputLow =  document.createElement('input');
        inputLow.setAttribute("placeholder",self.options.placeholderLow);
        inputLow.setAttribute("type","number");
        $(inputLow).addClass("intervalInput");
        $(inputLow).addClass("intervalLow");
        $(inputLow).on("keyup", function () {
            setSureBtn();
        })
        div.appendChild(inputLow);

        var intervalHr =  document.createElement('span');
        $(intervalHr).addClass("intervalHr");
        div.appendChild(intervalHr);

        var inputHigh =  document.createElement('input');
        inputHigh.setAttribute("placeholder",self.options.placeholderHigh);
        inputHigh.setAttribute("type","number");
        $(inputHigh).addClass("intervalInput");
        $(inputHigh).addClass("intervalHigh");
        $(inputHigh).on("keyup", function () {
            setSureBtn();
        })
        div.appendChild(inputHigh);

        var sureBtn =  document.createElement('button');
        sureBtn.innerHTML = self.options.sureBtn;
        sureBtn.setAttribute("disabled","disabled");
        $(sureBtn).addClass("intervalSure");
        div.appendChild(sureBtn);

        this.element.appendChild(div);

        if(self.options.selected instanceof Array){
            $(inputLow).val(self.options.selected[0]);
            $(inputHigh).val(self.options.selected[1]);
            sureBtn.removeAttribute("disabled");
        }

        $(sureBtn).on("click", function () {
            if(!check()){
                alert("区间设置有误!");
                return;
            }
            self.options.comfirm && self.options.comfirm({
                intervalLow:$(inputLow).val(),
                intervalHigh:$(inputHigh).val()
            });
            $('.filter-sigle-content >li').removeClass('active');
        })

        function setSureBtn(){
            if($(inputHigh).val()>0 && $(inputLow).val()>0){
                $(sureBtn).removeAttr("disabled");
            }else {
                sureBtn.setAttribute("disabled","disabled");
            }
        }

        function check(){
            if(Number($(inputHigh).val()) < Number($(inputLow).val())){
                  return false;
            }else {
                return true;
            }
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
            self.options.clickHandle && self.options.clickHandle(key);
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


/**
 * Created by qinwen on 17/2/10.
 */
;(function($,window,document,undefined){
    var pluginName = "filterTags";
    var defaults = {
        data:{},
        sureBtn:"确定",
        resetBtn:"清空选项",
        multiselectEnable:false,//是否支持多选
        selected:null,
        clickHandle:null, //点击事件
        comfirm:null //点击确认后触发
    }

    function Plugin(element,options){
        this.element = element;
        this.options = $.extend({},defaults,options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype.init = function(){
        var self = this;
        self.initContent(self.options.data).tagsSetting().initStyle();
    }

    /**
     * 动态添加tabs
     */
    Plugin.prototype.initContent = function(data){
        var self = this;

        var ul= document.createElement('ul');
        $(ul).addClass("filter-tags-content");

        var i,len;  //优化变量声明
        // 动态添加数据
        for(i=0, len = data.length; i<len; i++){
            var li = document.createElement('li');

            li.setAttribute("data-tab-id",data[i].key || ("tab"+i));
            li.innerHTML="<span class='tagsDesc'>"+data[i].desc+"<span>";

            li.appendChild(self.tagsShow(data[i].nodeList,data[i].key));

            //绑定点击事件
            ul.appendChild(li);
        }
        this.element.appendChild(ul);

        return this;
    }

    Plugin.prototype.tagsShow = function(tags,type){
        var self = this;
        var ul= document.createElement('ul');
        $(ul).addClass("tags clearfix");
        if(!self.options.selected || !(self.options.selected[type] instanceof Array)){
            self.options.selected = {};
            self.options.selected[type]=new Array();
        };

        var i,len;  //优化变量声明
        // 动态添加数据
        for(i=0, len = tags.length; i<len; i++){
            var li = document.createElement('li');
            li.setAttribute("data-tags-type",type || "");
            li.setAttribute("data-tags-id",tags[i].key || ("tab"+i));
            li.innerHTML=tags[i].desc;

            if( self.options.selected[type].indexOf(tags[i].key,0) != -1){
                $(li).addClass('active');
            }

            //绑定点击事件
            self.initBind(li,type);
            ul.appendChild(li);
        }

        return ul;
    }

    Plugin.prototype.initStyle = function(){
        var self = this;

        var settingContent = self.element.querySelector(".filter-tags-setting");
        var height= self.element.querySelector(".filter-tags-content").offsetHeight;
        $(settingContent).css("top",height+"px")
    }

    /**
     * 添加 处理按钮
     * @returns {Plugin}
     */
    Plugin.prototype.tagsSetting = function(){
        var self = this;
        var div = document.createElement('div');
        $(div).addClass("filter-tags-setting");

        var resetBtn =  document.createElement('button');
        resetBtn.innerHTML = self.options.resetBtn;
        $(resetBtn).addClass("tagsReset");
        div.appendChild(resetBtn);


        var sureBtn =  document.createElement('button');
        sureBtn.innerHTML = self.options.sureBtn;
        $(sureBtn).addClass("tagsSure");
        div.appendChild(sureBtn);

        $(sureBtn).on("click", function () {
            var select = self.getSelected();
            self.options.comfirm && self.options.comfirm(select);
        })

        $(resetBtn).on("click", function () {
            $(self.element).find(".tags .active").removeClass('active');
        })

        this.element.appendChild(div);
        return this;
    }

    /**
     * 获取所有选择的
     */
    Plugin.prototype.getSelected = function(){
        var i,len;  //优化变量声明
        var tags = document.querySelectorAll(".tags li.active");
        var selected = {};
        // 动态添加数据
        for(i=0, len = tags.length; i<len; i++){
            var type = tags[i].getAttribute("data-tags-type");
            var id = tags[i].getAttribute("data-tags-id");
            if(!selected[type]){
                selected[type]= [];
            }
            selected[type].push(id);
        }
        return selected;
    }

    /**
     * 初始化绑定
     */
    Plugin.prototype.initBind = function(content,type){
        var self = this;
        $(content).on("click", function () {

            if( $(content).hasClass('active')){
                $(content).removeClass('active');
            }else {
                (!self.options.multiselectEnable ) &&  $(content).parent().find("li").removeClass('active');
                $(content).addClass('active');
            }

            var key = content.getAttribute("data-tab-id");
            self.options.clickHandle && self.options.clickHandle({key:key,type:type});
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


/**
 * Created by qinwen on 17/2/10.
 */
;(function($,window,document,undefined){
    var pluginName = "filterTabs";
    var defaults = {
        data:[],
        clickHandle:null, //点击事件
    }

    function Plugin(element,options){
        this.element = element;
        this.options = $.extend({},defaults,options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype.init = function(){
        var self = this;
        self.initTabs(self.options.data).initStyle();
    }

    /**
     * 动态添加tabs
     */
    Plugin.prototype.initTabs = function(data){
        var self = this;
        var ul= document.createElement('ul'); //创建评论内容容器
        var i,len;  //优化变量声明
        for(i=0, len = data.length; i<len; i++){
            var li = document.createElement('li'); //删除按钮
            $(li).addClass("filter-tab-id-" + data[i].id);
            li.setAttribute("data-tab-id",data[i].id || ("tab"+i));
            li.innerHTML=data[i].name;
            self.initBind(li);

            ul.appendChild(li);
        }
        this.element.appendChild(ul);
        return this;
    }

    /**
     * 是否显示自定义
     */
    Plugin.prototype.settingShow = function(data){
        var div= document.createElement('div'); //创建评论内容容器
        div.css("position","fixed")
            .css("bottom","0");

        div
        this.element.appendChild(div);
    }

    /**
     * tab名称换值
     */
    Plugin.prototype.setTabName= function(key,name){
        var content =  $(".filter-tab-id-"+key);
        content && content.length > 0 && ($(".filter-tab-id-"+key)[0].innerHTML = name);
    }

    /**
     * 初始化样式
     */
    Plugin.prototype.initStyle = function(){
        var self = this;
        var width = 100 / $(self.element).find("ul li").length +"%";
        $(self.element).find("ul li")
            .css("width",width);
        return this;
    }

    /**
     * 初始化绑定
     */
    Plugin.prototype.initBind = function(content){
        var self = this;
        $(content).on("click", function () {
            $(self.element).find("ul li").removeClass('active');
            $(content).addClass('active');
            self.options.clickHandle && self.options.clickHandle(content.getAttribute("data-tab-id"));
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

