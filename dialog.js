(function($) {
	'use strict';

	var dialogPtions = {
		url : undefined,//请求Url
		title : '操作提示',//标题名称
		content : undefined,//内容
		size:'',//窗体大小（small,large）
		buttons : "OKCancel",//OKCancel,Cancel
		backdrop : "static",
		overflow : false,
		callback : function(result,$element) {
			return result;
		},
		loaded:undefined
	}
	
	

	var sprintf = function(str) {
		var args = arguments,
			flag = true,
			i = 1;

		str = str.replace(/%s/g, function() {
			var arg = args[i++];

			if (typeof arg === 'undefined') {
				flag = false;
				return '';
			}
			return arg;
		});
		return flag ? str : '';
	};

	var modal = [
		'<div class="modal-dialog %s">',
		'<div class="modal-content">',
		'<div class="modal-header">',
		'<h3 class="modal-title pull-left">%s</h3>',
		'</div>',
		'<div class="modal-body modal-tip" %s></div>',
		'<div class="modal-footer">',
		'%s',
		'</div>',
		'</div>',
		'</div>',
	].join('');

	var OKCancelBtn=[
		'<button type="button" class="btn btn-save" id="%sEnsure">确&nbsp;&nbsp;定</button>',
		'<button type="button" class="btn btn-secondary btn-close" id="%sClose" >关&nbsp;&nbsp;闭</button>'	,
		'<button class="btn-hide"></button>'
	].join('');
	
	var CancelBtn=[
		'<button type="button" class="btn btn-secondary btn-close" id="%sClose" >关&nbsp;&nbsp;闭</button>',
		'<button class="btn-hide"></button>'
	].join('');
	
	/**
	 * $('#testDialog').dialog({
		url:'../admin/menuConfig_update.action?menuId='+id,
		title:"菜单编辑",
		callback:function(o,e){
			console.log(o)
			e.modal('hide')
		}	
	});
	 */
	$.fn.dialog = function(option) {
		option = $.extend({},dialogPtions,option) ;
		initDialog(this,option);
		return this;
	}
	
	//隐藏弹窗
	$.fn.hidden=function(){
		var that=$(this);
		that.find("button.btn-hide").attr("data-dismiss", "modal").trigger('click');
		that.empty();
	}
	
	var initDialog=function(obj,opts){
		var that=$(obj),style='style="overflow:overlay;"';
		
		that.empty();
		
		that.removeClass('modal fade').addClass("modal fade");
		//窗口大小控制
		if(opts.size=='small'){
			opts.size="modal-sm";
		}else if(opts.size=='large'){
			opts.size="modal-lg";
		}
		
		if(opts.backdrop!=undefined && opts.backdrop=='static' ){
			that.attr('data-backdrop','static')
		}
		
		//按钮控制
		var btnStr='';
		if(opts.buttons=="OKCancel"){
			btnStr=sprintf(OKCancelBtn,that[0].id,that[0].id);
		}else{
			btnStr=sprintf(CancelBtn,that[0].id);
		}
		
		
		if(!opts.overflow){
			style='';
		}

		var str = sprintf(modal, opts.size,opts.title,style,btnStr);
		that.html(str);
		
		
		
		//加载内容
		if(opts.url!=undefined){
			//判断请求服务端还是本地
			if(opts.url.indexOf('.')==-1 || opts.url.indexOf('.action')>-1){
				opts.content=requestHtml(opts.url);
				that.find('.modal-body').html('<p>'+opts.content+'<p>');
			}else{
				that.find('.modal-body').load(opts.url);
			}
		}else{
			that.find('.modal-body').html('<p>'+opts.content+'<p>');
		}
		
		//显示弹窗
		that.modal('show');
		
		if(opts.loaded!=undefined){
			that.on('shown.bs.modal', function (e) {
				opts.loaded();
			})
		}
		

		//按钮绑定点击事件
		//确定按钮
		if($('#'+that[0].id+'Ensure')!=undefined && $('#'+that[0].id+'Ensure').length!=0){
			$('#'+that[0].id+'Ensure').bind('click',function(){
				opts.callback(true,that);
				that.hidden();
			});
		}
		//关闭按钮
		if($('#'+that[0].id+'Close')!=undefined && $('#'+that[0].id+'Close').length!=0){
			$('#'+that[0].id+'Close').bind('click',function(){
				opts.callback(false,that);
				that.hidden();
			});
			
			$('#'+that[0].id).find('.modal-header .close').bind('click',function(){
				opts.callback(false,that);
				that.hidden();
			});
		}
	}
	
	var requestHtml=function(url){
		var requestHtmlStr='';
		$.ajax({
			url:url,
			type:'post',
			async: false,
			success:function(o){
				requestHtmlStr = o;
			}
		})
		return requestHtmlStr;
	}

})(jQuery);