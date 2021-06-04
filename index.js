(function ($) {
    $.extend({ awesCnb: (options) => { new AwesCnb().init(options); } });

    const urls = {
        CDN: {
            live2d: {
                url: 'https://cdn.jsdelivr.net/gh/github923665892/awesCnb-live2dModels',
                version: '1.7'
            }
        },
        script: {
            scrollgress: 'scrollgress',
            anime: 'anime',
            handleAnime: 'handleAnime',
            live2d: 'live2d'
        },
        repositories: {
            package: 'https://kris-kk.gitee.io/awescnb/package',
            gitee: 'https://gitee.com/kris-kk/awescnb',
            github: 'https://github.com/louis6575',
        }
    }

    const live2dModels = {
        'chitose': 'live2d-widget-model-epsilon2_1/assets/Epsilon2.1.model.json',
        'epsilon2_1': 'live2d-widget-model-chitose/assets/chitose.model.json',
        'tororo': 'live2d-widget-model-tororo/assets/tororo.model.json',
        'haru-01': 'live2d-widget-model-haru/01/assets/haru01.model.json',
        'haru-02': 'live2d-widget-model-haru/02/assets/haru02.model.json',
        'hijiki': 'live2d-widget-model-hijiki/assets/hijiki.model.json',
        'shizuku': 'live2d-widget-model-shizuku/assets/shizuku.model.json',
        '小埋': '小埋/13.json',
        '伊芙加登': '伊芙加登/14.json',
        'vert_classic': 'vert_classic/vert_classic.model.json',
        'vert_normal': 'vert_normal/vert_normal.model.json',
        'vert_swimwear': 'vert_swimwear/vert_swimwear.model.json',
        '玉藻前': '玉藻前/16.json',
        'ryoufuku': 'misaki/ryoufuku.model.json',
        'seifuku': 'misaki/seifuku.model.json',
        'shifuku': 'misaki/shifuku.model.json',
    }

    class AwesCnb {
        constructor() {
            this.defaultOptions = {
                theme: {
                    name: 'reacg',
                    color: '#FFB3CC',
                    headerBackground: 'https://kris-kk.gitee.io/awescnb/assets/images/acg/21.jpg',
                    avatar: '//q1.qlogo.cn/g?b=qq&nk=2644334188&s=100',
                    qrcode: '',
                },
                imagebox: {
                    enable: true
                },
                barrage: {
                    enable: true,
                    opacity: 0.5,
                    colors: ['#FE0302', '#FF7204', '#FFAA02', '#FFD302', '#FFFF00', '#A0EE00', '#00CD00', '#019899', '#4266BE', '#89D5FF', '#CC0273', '#CC0273'],
                    barrages: ['欢迎访问我的blog 💗'],
                    postPageBarrages: ['如果对你有帮助文末点个赞支持一下吧 🙌']
                },
                back2top: {
                    enable: true
                },
                live2d: {
                    enable: true,
                    page: 'all',
                    agent: 'pc',
                    model: 'random',
                    width: 150,
                    height: 200,
                    position: 'right',
                },
                github: {
                    enable: true,
                    color: '#ffb3cc',
                    url: 'https://gitee.com/kris-kk/awescnb'
                },
                click: {
                    enable: true,
                    page: 'all',
                    agent: 'pc',
                    auto: false,
                    colors: ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C']
                },
                lineNumbers: {
                    enable: true
                },
                catalog: {
                    enable: true,
                    position: 'left',
                },
                musicPlayer: {
                    enable: false,
                    page: 'all',
                    agent: 'pc',
                    autoplay: false,
                    audio: [
                        {
                            name: '红色高跟鞋',
                            artist: '李瑨瑶',
                            url: `https://kris-kk.gitee.io/awescnb/assets/music/红色高跟鞋.mp3`,
                            cover: '//p2.music.126.net/ww7gcJ_erzPa8jgZesmTOA==/109951163271403502.jpg?param=90y90',
                        }
                    ]
                },
                topProgress: {
                    enable: false,
                    page: 'all',
                    agent: 'pc',
                    background: '#FFB3CC',
                    height: '5px'
                },
                postSignature: {
                    enable: false,
                    content: ['转载请附上原文链接，谢谢！']
                },
                highLight: {
                    type: 'atomOneDark'
                },
                links: [
                    {
                        name: 'awesCnb',
                        link: 'https://gitee.com/kris-kk/awescnb'
                    }
                ]
            };
        }

        // 返回页面名称 'post' | 'index' | 'tag' | 'list'
        get pageName() {
            if ($('#post_detail').length > 0) {
                return 'post'
            }
            if ($('.day').length > 0) {
                return 'index'
            }
            if ($('#taglist_main').length > 0) {
                return 'tag'
            }
            if ($('.entrylistPosttitle').length > 0) {
                return 'list'
            }
        }

        // 判断客户端 'phone' | 'pc'
        get userAgent() {
            const width = $(window).width();
            if (width <= 768) {
                return 'phone'
            }
            if (width > 768) {
                return 'pc'
            }
        }

        // 初始化
        // |options -> 全局配置|
        init(options) {
            if (options) {
                $.extend(true, this.defaultOptions, options);
            }
            const themeName = this.defaultOptions.theme.name;
            this.loadIndex([
                { name: themeName, type: 'css' },
                { name: themeName, type: 'js' }
            ]);
            window.userOptions = this.defaultOptions;
            window.rep = urls.repositories;
            console.log(window.userOptions);
            // plugins
            this.setTopProgress();
            this.setLive2d();
            this.setMusicPlayer();
            this.setClickEvent();
        }

        // ------common plugins--------

        // 顶部进度条
        setTopProgress() {
            const options = this.defaultOptions.topProgress;
            if (!options.enable) { return }
            if (options.page !== this.pageName && options.page !== 'all') { return }
            if (options.agent !== this.userAgent && options.agent !== 'all') { return }
            this.loadFiles([{ name: urls.script.scrollgress, type: 'js' }], () => {
                const options = this.defaultOptions.topProgress;
                $('html').scrollgress({
                    height: options.height,
                    color: options.background
                });
            })
        }

        // 看板娘
        setLive2d() {
            const options = this.defaultOptions.live2d;
            if (!options.enable) { return }
            if (options.page !== this.pageName && options.page !== 'all') { return }
            if (options.agent !== this.userAgent && options.agent !== 'all') { return }
            const live2dCDN = urls.CDN.live2d;
            let model = options.model === 'random' ? live2dModels[this.getRandomProperty(live2dModels)] : live2dModels[options.model];
            console.log('live2d model：', model);
            const url = `${live2dCDN.url}@${live2dCDN.version}/${model}`;
            $('body').append(`<canvas style="position:fixed;${options.position}:0;bottom:0;z-index:3" width="${options.width}" height="${options.height}" id="model"></canvas>`);
            this.loadFiles([{ name: urls.script.live2d, type: 'js' }], () => { loadlive2d("model", url); });
        }

        // 音乐播放器
        setMusicPlayer() {
            const options = this.defaultOptions.musicPlayer;
            if (!options.enable) { return }
            if (options.page !== this.pageName && options.page !== 'all') { return }
            if (options.agent !== this.userAgent && options.agent !== 'all') { return }
            $('body').append('<section id="player" class="aplayer music-APlayer"></section>');
            this.loadFiles([
                { name: 'APlayer', type: 'css' },
                { name: 'APlayer', type: 'js' }
            ], () => {
                const ap = new APlayer({
                    container: document.getElementById('player'),
                    fixed: true,
                    preload: 'auto',
                    autoplay: options.autoplay,
                    audio: options.audio
                });
                window.onbeforeunload = () => {
                    const audioTime = ap.audio.currentTime;
                    localStorage.audioTime = audioTime;
                }
                window.onload = () => {
                    ap.seek(localStorage.audioTime ? Number(localStorage.audioTime) : 0);
                }
            });
        }

        // 鼠标点击特效
        setClickEvent() {
            const options = this.defaultOptions.click;
            if (!options.enable) { return }
            if (options.page !== this.pageName && options.page !== 'all') { return }
            if (options.agent !== this.userAgent && options.agent !== 'all') { return }
            $('body').append('<canvas class="fireworks" style="pointer-events: none;"></canvas>');
            this.loadFiles([{ name: urls.script.anime, type: 'js' }], () => {
                this.loadFiles([{ name: urls.script.handleAnime, type: 'js' }]);
            });
        }

        // -----tools------

        /**
         * @description 随机对象属性
         * @param {Object} obj javascript对象
         * @returns 对象的随机属性
         */
        getRandomProperty(obj) {
            let result;
            let count = 0;
            for (let prop in obj)
                if (Math.random() < 1 / ++count)
                    result = prop;
            return result;
        }

        // 加载入口文件
        loadIndex(files, callback = function () { }) {
            const repositoriesUrl = urls.repositories.package;
            for (let i = 0; i < files.length; i++) {
                const name = files[i].name;
                const type = files[i].type;
                const cssUrl = `${repositoriesUrl}/theme/${name}/${name}.css`;
                const jsUrl = `${repositoriesUrl}/theme/${name}/${name}.js`;
                const actions = {
                    'js': () => {
                        $.getScript(jsUrl, () => {
                            callback();
                        });
                    },
                    'css': () => { $("head").append(`<link rel="stylesheet" href="${cssUrl}">`); },
                }
                actions[type]();
            }
        }

        // 加载插件
        loadFiles(files, callback = function () { }) {
            const repositoriesUrl = urls.repositories.package + '/assets';
            for (let i = 0; i < files.length; i++) {
                const name = files[i].name;
                const type = files[i].type;
                const cssUrl = repositoriesUrl + '/css/' + name + '.css';
                const jsUrl = repositoriesUrl + '/js/' + name + '.min.js';
                const actions = {
                    'css': () => {
                        $("head").append(`<link rel="stylesheet" href="${cssUrl}">`);
                    },
                    'js': () => {
                        $.getScript(jsUrl, () => { callback() });
                    },
                    'cssCDN': () => {
                        $("head").append(`<link rel="stylesheet" href="${name}">`);
                    },
                    'jsCDN': () => {
                        $.getScript(name);
                    },
                    'default': () => {
                        console.error('Type error!');
                    }
                }
                actions[type]();
            }
        }
    }
})(jQuery);
