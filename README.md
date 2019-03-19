# 基于bootstrap的弹窗

#### 项目介绍
基于bootstrap的modal进行简单的封装，调用时简单方便
1.以加载页面，也可以文字提示
2.易于二次开发，可以根据自己的需求再修改

#### 安装教程
常规引用js文件
<script  src="../dialog.js"></script>

#### 使用说明
<div id="testDialog"></div>
$('#testDialog').dialog({
		url:'../admin/menuConfig_update.action?menuId='+id,//content:'是否删除该菜单编辑'
		title:"菜单编辑",
		callback:function(o,e){
			if(o){
				//点击确定后调用的函数
			}
		}	
});
