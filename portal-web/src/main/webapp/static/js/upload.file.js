

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
	$.PmBindFileUploadEvent = function(params){
		var id = new Date().getTime();
		var fileId = "attachFile"+id;
		var imgWdith = params.imgWdith;
		var imgHeight = params.imgHeight;
		params.imgCount = (params.imgCount == null?5:params.imgCount);
		var cbasePath = params.basePath;
		if(imgWdith == null){
			imgWdith = 50;
			imgHeight = 50;
		}
		function addFileInput(){
			$("#" + fileId).remove();
			var html = $('<input type="file" id="' + fileId + '" name="' + fileId + '" style="position:absolute; filter:alpha(opacity=0); cursor: pointer; z-index:9999; width:0px;" />');
			params.uploadAttachment.after(html);
			$("#" + fileId).css("opacity", "0");
            $("#" + fileId).css('top', "-4px");
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
				$.ajaxFileUpload({
					url: params.basePath,
					secureuri:false,
					fileElementId: fileId,
					dataType: 'json',
					success:function (data, status){
						try{
                            if(data.result == "1"){
                                callBackFunc(data);
                            }else if(data.result == "0"){
                                    pms.warn(data.message);
                             }else{
                            	 pms.warn("格式不正确!");
                             }
							//错误异常处理
						}finally{
							addFileInput();
						}
					},
					error:function(e){
						alert('上传异常请联系管理员!');
                        //callBackFunc(data);
                        
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