define(['./StaticCollection'], function(StaticCollection){
    return StaticCollection.extend({
        demoData:{
            countInfo : {
                allCount : "25",
                goodCount : "20",
                commonCount : "4",
                badCount : "1"
            },
            comments: [
                {
                    userId: '001',
                    userName: '长者',
                    userHead: 'http://img.xiami.net/images/album/img86/1436245386/21002843221456807184_2.jpg',
                    comment: '你问我资不资瓷？我说资瓷，我就明确告诉你，我感觉你们商家也要学习，你们非常熟悉西方这一套的，你们毕竟是Too Young，明白这意思吗？',
                    grade: '1',
                    date: '1999-05-20'
                },
                {
                    userId: '002',
                    userName: '本宝宝萌吗',
                    userHead: 'http://tp4.sinaimg.cn/3220044655/180/5751865112/0',
                    comment: '这玩意儿好用啊，这玩意简直6到飞起啊，下次一定还来',
                    grade: '5',
                    date: '2016-03-08'
                },
                {
                    userId: '003',
                    userName: '本宝宝收到了惊吓',
                    userHead: 'http://tp4.sinaimg.cn/1837029131/180/5742660757/1',
                    comment: '服务好！礼品还真是漂亮，超值！但，有一颗小珠有些瑕疵，这是难免的。尺寸比想象中的要小。总体还不错！',
                    grade: '4',
                    date: '2016-03-08'
                },
                {
                    userId: '004',
                    userName: '蛤蛤笑',
                    userHead: 'http://tp4.sinaimg.cn/1837029131/180/5742660757/1',
                    comment: '美国那个华来士比你们高不知道哪去了 我和他谈笑风生。你们不就是想弄个大新闻 把我批判一番?',
                    grade: '2',
                    date: '2016-03-08'
                },
                {
                    userId: '005',
                    userName: '怪蜀黍',
                    userHead: 'http://tp1.sinaimg.cn/2397677580/180/5747756327/0',
                    comment: '闪现空大，塔下怒送人头，吃完这家的肉松饼，麻麻再也不用担心我打不赢人机了，yeah~',
                    grade: '5',
                    date: '2016-03-08'
                },
                {
                    userId: '006',
                    userName: '夏天',
                    userHead: 'http://tp4.sinaimg.cn/1837029131/180/5742660757/1',
                    comment: '这玩意儿好用啊，这玩意简直6到飞起啊，下次一定还来',
                    grade: '2',
                    date: '2016-03-08'
                },
                {
                    userId: '007',
                    userName: '夏天',
                    userHead: 'http://tp4.sinaimg.cn/1837029131/180/5742660757/1',
                    comment: '这玩意儿好用啊，这玩意简直6到飞起啊，下次一定还来',
                    grade: '5',
                    date: '2016-03-08'
                },
                {
                    userId: '008',
                    userName: '夏天',
                    userHead: 'http://tp4.sinaimg.cn/1837029131/180/5742660757/1',
                    comment: '这玩意儿好用啊，这玩意简直6到飞起啊，下次一定还来',
                    grade: '4',
                    date: '2016-03-08'
                },
                {
                    userId: '009',
                    userName: '夏天',
                    userHead: 'http://tp4.sinaimg.cn/1837029131/180/5742660757/1',
                    comment: '这玩意儿好用啊，这玩意简直6到飞起啊，下次一定还来',
                    grade: '1',
                    date: '2016-03-08'
                },
                {
                    userId: '010',
                    userName: '夏天',
                    userHead: 'http://tp4.sinaimg.cn/1837029131/180/5742660757/1',
                    comment: '这玩意儿好用啊，这玩意简直6到飞起啊，下次一定还来',
                    grade: '2',
                    date: '2016-03-08'
                }

            ]
        },
        initialize: function(){
            this.reset(this.demoData);
        }

    });
});