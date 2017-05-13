/**
 * Created by mei on 2015/5/15.
 */
$(document).ready(function() {
    $(".ser_bolck").hide();
    $(".drop a").click(function(){
        $(".ser_bolck").slideToggle();
        if ($(this).hasClass("activi")) {
            $(this).removeClass("activi").html("展开");
        } else {
            $(this).addClass("activi").html("收起");
        }
    });
});

//新增联系人
$(document).ready(function() {
   $(".add_lxr").hide();
   $(".add-lxr").click(function(){
       $(".add_lxr").slideToggle();
   })
});
