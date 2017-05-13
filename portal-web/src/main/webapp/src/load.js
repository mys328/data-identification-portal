/**
 * Created by IntelliJ IDEA.
 * @author: liubo
 * @time: 17-4-19
 * @des: sea模块化引入初始化页面js脚本配置
 */

/*基础路径配置*/
seajs.config({
    base: G.path.root,
    'map': [[/^(.*\.(?:css|js))(?!\?)(.*)$/i, '$1?' + G.load_version]],
    paths: {
        'app': 'src/ng-app',
        'mod': 'src/module',
        'lib': 'static/js/lib',
        'common': 'static/js/lib/common',
        'static': 'static/js/lib/components'
    }
});

/*基础库加载*/
(function (document) {
    seajs.use([
        'app/app',
        'app/route.min',
        'app/ngsea.min',
        'app/function',
        'app/service',
        'app/directive',
        'app/bill.table.min',
        'app/modelConstants',
        'common/ng-grid',
        'static/comm',
        'app/commonAction',
        'static/swiper.min',
        'static/map'
        /*'common/pgwcookie.min'*/
    ], function () {
        angular.bootstrap(document, ["app"]);
    });
})(document);
