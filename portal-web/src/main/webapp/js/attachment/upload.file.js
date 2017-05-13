

(function($) {
	/**
	 * url:上传地址
	 * extFileFix:指定上传文件类型组
	 * selectFileTypes:指定上传文件类型
	 * attachmentArea:已上传文件存放区域
	 * uploadAttachment:伪装上传文件控件
	 * callBackFunc:上传完文件后回调函数
	 * msg4:消息类型4内容
	 * dataId:文件对应的数据Id
	 * imgWdith:文件缩图显示宽度
	 * imgHeight:文件缩图显示高度
	 * imgCount:最大上传文件数，默认5个
	 */
	$.bindFileUploadEvent = function(params){
		var proxy =params.proxy;
		var fileId = "attachFile";
		var imgWdith = params.imgWdith;
		var imgHeight = params.imgHeight;
		params.imgCount = (params.imgCount == null?5:params.imgCount);
		var cbasePath = params.basePath;
		if(cbasePath == null || cbasePath == ""){
			cbasePath = basePath;
		}
		var durl = cbasePath+"/ct/" + "paas/ct/attachment/uploadAttachment.do?attachmentSystemCode="+params.attachmentSystemCode+"&attachmentSystemtype="+params.attachmentSystemtype;
		//下载路径
		var downUrl=cbasePath+"/ct/" + "paas/ct/attachment/downAttachment.do?attachmentId=";
		if(params.url == null || params.url == ""){
			params.url = durl;
		}
		if(imgWdith == null){
			imgWdith = 50;
			imgHeight = 50;
		}
		
		function addFileInput(){
			
			$("#" + fileId).remove();
			var html = $('<input type="file" id="' + fileId + '" name="' + fileId + '" style="position:absolute; filter:alpha(opacity=0); cursor: pointer; z-index:9999; width:0px; height:0px;" />');
			$(params.uploadAttachment).after(html);
			$("#" + fileId).css("opacity", "0"); 
		}
		
		function callBackFunc(data){
			
			if(params.attachmentArea != null){
				//接收返回值
				var imgUrl = data.url;//预留参数包含文件对应图片类型
				var hrefUrl = data.url;//预留方预览对应URL
				var attachmentName=data.attachmentName;//附件真实名称
				var attachmentId=data.attachmentId;//附件ID
				var attachmentSize=data.attachmentSize;//附件大小
				var attachmentType = data.attachmentType;     //附件类型    
				//if(data.attachType < 61 || data.attachType > 69){
					//imgUrl = getAttachMarkImage(data.attachType);
					var file=attachmentId;
				//}
				//此处编写文档上传后的显示的样式
					var htmlObj=$('<p><a href='+downUrl+attachmentId+'><i class="fa fa-file-text"></i>'+attachmentName+'.'+attachmentType+'</a> <a href="#" class="delImgFlag"><i class="fa fa-times red"></i></a><input type="hidden" name="fileArray" value="'+file+'"></p>');
                    
				//var htmlObj = $('<div style="float:left;" id='+data.attachmentId+'><table border="0"><tr><td><img src="' + imgUrl + '" border="0" width="' + imgWdith + '" height="' + imgHeight + '" attachmentId="' + data.attachmentId + '" isNew="1" isDel="0"></a></td></tr><tr><td align="center"><img class="delImgFlag" style="cursor: pointer;" src="' + cbasePath + 'images/del.png" /><input type="hidden" name="fileArray" value="'+file+'"></td></tr></table></div>');

				var attachObj = params.attachmentArea;
				if(attachObj.find("p").size() == 0){
					attachObj.html(htmlObj);
				}else{
					attachObj.find("p:last").after(htmlObj);
				}
				htmlObj.find(".delImgFlag").bind("click", function(){
					//$(this).parent().parent().parent().parent().parent().remove();
					$(this).parent().remove();
				});
				//attachObj.find("p").css("margin-left", "0px");
				//attachObj.find("p:gt(0)").css("margin-left", "5px");
			}
			if(params.callBackFunc != null){
				params.callBackFunc(data);
			}
		}
		
	
		
		function getCurFileCount(){
			var count = 0;
			
			$(params.attachmentArea).find("div").find("a").find("img").each(function(){
				var isDel = $(this).attr("isDel");
				if(isDel == 0){
					count ++;
				}
			});
			return count;
		}
		
		function bindFileInputChangeEvent(){
			
			$("#" + fileId).unbind("change");
			$("#" + fileId).bind("change", function(){
				var cimgCount = getCurFileCount();
				if(cimgCount >= params.imgCount){
					$.ushowMessage('最多只能上传 ' + params.imgCount + '个文件!');
					return;
				}
			
				
				//var loading = $.showLoading();
				//上传文件
				//alert("上传开始");
				jQuery('#activity_pane').showLoading(
						{
							
						    'addClass': 'loading-indicator-bars'
										
						 }
		
				);
				
				$.ajaxFileUpload({
					url: params.url,
					secureuri:false,
					fileElementId: fileId,
					dataType: 'json',
					proxy:proxy,
					success:function (data, status){
						try{
							  
                                                 
                                       			if(data.error == "0"){
                    								callBackFunc(data);
                    							}
                    							if(data.error == "1"){
                    								alert('上传失败，服务器磁盘空间不足请联系管理员');
                    							}
                    							if(data.error == "2"){
                    								alert('上传失败，文件大小超出指定文件大小!');
                    							}
                    							if(data.error == "3"){
                    								alert('上传失败，系统不支持此类文件的上传请联系管理员!');
                    							}
                    							if(data.error == "4"){
                    								alert('上传失败，附件系统编码不能为空！');
                    							}
                    							if(data.error == "5"){
                    								alert('上传失败，系统附件类型不能为空！!');
                    							}

                               
							//错误异常处理
				
							
						}finally{
							//alert("上传结束");
							jQuery('#activity_pane').hideLoading();
							addFileInput();
						}
					},
					error:function(e){
						alert('上传异常请联系管理员!');
					}
			
			  });
			});
		}
		$(params.uploadAttachment).bind("mouseover", function(){
			var top = $(this).position().top;
			var left = $(this).position().left;
			var mleft = $(this).css("margin-left");
			if(mleft != null && mleft != ""){
				mleft = mleft.substring(0, mleft.length - 2);
				left = left + parseInt(mleft);
			}
			$("#" + fileId).css('top', (top - 2) + "px");
			$("#" + fileId).css('left', left + "px");
			$("#" + fileId).css("width", $(this).css("width"));
			$("#" + fileId).css("height", $(this).css("height"));
			bindFileInputChangeEvent();
		});
		addFileInput();
	};
})(jQuery);

/***
 * 此方法用于表单提交前，用来封装URL，使得URL
 * @param url
 */
function setFileUrl(url){
	var array = [];
	$("input[name='fileArray']").each(function(){
		alert($(this).val());
		array.push($(this).val());
		
	});
	var index=url.indexOf("?");
	if(index==-1){
		url=url+"?fileArray="+array;
	}else{
		url=url+"&fileArray="+array;
	}
	return url;
	
}