

(function($) {
	/**
	 * url:上传地址
	 * extFileFix:指定上传文件类型组
	 * selectFileTypes:指定上传文件类型
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
		var id = new Date().getTime();
		var fileId = "attachFile"+id;
		var imgWdith = params.imgWdith;
		var imgHeight = params.imgHeight;
		params.imgCount = (params.imgCount == null?5:params.imgCount);
		var cbasePath = params.basePath;
		var durl = cbasePath+"/" + "pass/ct/fastdfs/uploadFile.do?activityType="+params.attachmentSystemCode;
		//下载路径
		var downUrl=cbasePath+"/" + "paas/ct/file/downAttachment.do?attachmentId=";
		if(params.url == null || params.url == ""){
			params.url = durl;
		}
		if(imgWdith == null){
			imgWdith = 50;
			imgHeight = 50;
		}
		function addFileInput(){
			$("#" + fileId).remove();
			var html = $('<input type="file" id="' + fileId + '" name="' + fileId + '" style="position:absolute; filter:alpha(opacity=0); cursor: pointer; z-index:9999; width:0px;" />');
			params.uploadAttachment.after(html);
			$("#" + fileId).css("opacity", "0");
            $("#" + fileId).css('top', "0px");
            $("#" + fileId).css('left', "0px");
            $("#" + fileId).css("width", params.uploadAttachment[0].offsetWidth + "px");
            $("#" + fileId).css("height", params.uploadAttachment[0].offsetHeight + "px");
            bindFileInputChangeEvent();
		}
		
		function callBackFunc(data){
			if(params.callBackFunc != null){
				params.callBackFunc(data);
			}
		}

		function bindFileInputChangeEvent(){
			$("#" + fileId).unbind("change");
			$("#" + fileId).bind("change", function(){
				//显示遮罩
				$(".add_file").showLoading();  
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
                            }else{
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
                                if (params.callBackFunc != null){
                                    params.callBackFunc(data);
                                }
                            }
							//错误异常处理
						}finally{
							addFileInput();
							//去除遮罩
		                    $(".add_file").hideLoading();
						}
					},
					error:function(e){
						alert('上传异常请联系管理员!');
						//去除遮罩
	                    $(".add_file").hideLoading();
                        callBackFunc(data);
                        
					}
			  });
			});
		}
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