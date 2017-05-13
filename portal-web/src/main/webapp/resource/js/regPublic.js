/**
 * Created by ThinkPad on 2017/3/23.
 */
/* placeholder 鍏煎 */
var JPlaceHolder = {
    _check : function(){
        return 'placeholder' in document.createElement('input');
    },
    init : function(){
        if(!this._check()){
            this.fix();
        }
    },
    fix : function(){
        jQuery(':input[placeholder]').each(function(index, element) {
            var self = $(this), txt = self.attr('placeholder');
            self.wrap($('<div></div>').css({position:'relative', zoom:'1',display:'inline-block', border:'none', background:'none', padding:'none', margin:'none'}));
            var pos = self.position(), h = self.outerHeight(true), paddingleft = self.css('padding-left');
            var holder = $('<span></span>').text(txt).css({position:'absolute', left:pos.left, top:pos.top, height:h, lineHeight:h+'px', paddingLeft:paddingleft, color:'#aaa'}).appendTo(self.parent());
            self.focusin(function(e) {
                holder.hide();
            }).focusout(function(e) {
                if(!self.val()){
                    holder.show();
                }
            });
            holder.click(function(e) {
                holder.hide();
                self.focus();
            });
        });
    }
};
jQuery(function(){
    JPlaceHolder.init();
});

function isRegisterUserName(s){
    var patrn=/^[a-zA-Z0-9]{1}([a-zA-Z0-9]|[._]){5,23}$/;
    if (!patrn.exec(s)) return false
    return true
}

function isEmail(email){
    var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if(!myreg.test(email)) return false;
    return true;
}

function isPhone(phone) {
    var reg =/^1[3|5|8|4|7]{1}[0-9]{1}[0-9]{8}$/;
    if(!reg.test(phone)) return false;
    return true;
}
