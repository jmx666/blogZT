(function ($) {
  const urls = {
    script: {
      icon: '//at.alicdn.com/t/font_1416496_14nsmkubys8.js'
    },
    repositories: window.rep
  }
  const icons = {
    back2top: '#ac-back2top',              //返回顶部
  }
  class gshang {
    constructor() {
      this.defaultOptions = window.userOptions;
      this.v = 'v1.0.0';
    }

    // 初始化
    init() {
      this.loadFiles([{ name: urls.script.icon, type: 'jsCDN' }]);
      this.setThemeColor();
      this.setAvatar();
      this.setHeaderBackground();
      this.setBack2Top();
      this.hideLoading();
    }

    // 返回顶部
    setBack2Top() {
      const option = this.defaultOptions.back2top;
      if (!option.enable) { return }
      const svg = this.iconInSvg(icons.back2top);
      let elements = $(`<div id="back2Top">${svg}</div>`)
        .appendTo('body')
        .click(() => {
          $("html, body").animate({ scrollTop: 0 }, 300);
        });
      $(window).bind("scroll", () => {
        let scrollTop = $(document).scrollTop();
        scrollTop > 0 ? elements.fadeIn(500) : elements.fadeOut(500);
      });
    }

    // 设置头像
    setAvatar() {
      const avatar = this.defaultOptions.theme.avatar;
      if (avatar === '') { return false }
      $('#blogLogo').css({ 'background-image': `url(${avatar})` });
    }

    // 设置头部背景图
    setHeaderBackground() {
      const headerBackground = this.defaultOptions.theme.headerBackground;
      if (headerBackground === '') { return false }
      $('#blogTitle').css({ 'background-image': `url(${headerBackground})` });
    }

    // 设置主题色
    setThemeColor() {
      const option = this.defaultOptions.theme.color;
      let themeColor = '';
      if (option === 'random') {
        themeColor = this.getRandomRgba();
      } else {
        themeColor = option;
      }
      $('head').append(`<style>:root{--ThemeColor: ${themeColor}}<style>`);
    }

    // 获取随机颜色
    getRandomRgba() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      const a = 0.7;
      return `rgba(${r},${g},${b},${a})`;
    }

    // 隐藏loading
    hideLoading() {
      $('#loading').fadeOut();
    }

    // ------- tools ------

    // 指定icon插入svg
    iconInSvg(icon) {
      return `<svg class="icon" aria-hidden="true"><use xlink:href="${icon}"></use></svg>`;
    }

    // 加载文件
    // [{name: '', type: ''}] js | css | jsCDN | cssCDN
    loadFiles(files, callback) {
      const cb = callback || function () { };
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
            $.getScript(jsUrl, () => { cb() });
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

  new gshang().init();
})(jQuery);
