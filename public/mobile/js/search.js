$(function() {
  /*1. 根据存储的历史记录 去渲染列表*/
  /*2. 点击搜索按钮  追加历史 跳转页面*/
  /*3. 点击删除按钮  删除对应的一条历史  渲染列表*/
  /*4. 点击清空按钮  删除所有历史       渲染列表*/
  new App()
})
var App = function() {
  this.$history = $('.lt_history')
  this.$search = $('.lt_search')
  //自己去约定 localStorage 的 key 对应的数据格式  json ["","",""]
  this.KEY = 'letaoHistoryHeima47'
  this.list = JSON.parse(localStorage.getItem(this.KEY) || '[]')

  this.init()
}
App.prototype.init = function() {
  this.render()
  this.bindEvent()
  this.$search.find('input').val('')
}
App.prototype.bindEvent = function() {
  var that = this
  that.$search.on('tap', 'a', function() {
    var value = $.trim(that.$search.find('input').val())
    if (!value) {
      /*提示 请输入搜索关键字*/
      mui.toast('输入搜索关键字')
      return
    }
    /*追加历史*/
    that.pushHistory(value)
    /*跳转*/
    /*html静态页面的数据传递 可以地址栏传参 key*/
    location.href = 'searchList.html?key=' + encodeURIComponent(value)
  })
  that.$history
    .on('tap', 'li span', function() {
      that.delHistory($(this).data('index'))
    })
    .on('tap', '.tit a', function() {
      that.clearHistory()
    })
}
App.prototype.render = function() {
  //在模板内 可以直接使用你传入的数据 默认的变量名称 $data
  this.$history.html(template('list', { list: this.list, euc: encodeURIComponent }))
}
App.prototype.pushHistory = function(value) {
  /*追加历史*/
  /*1. 没有超过10条 没有重复的搜索*/
  /*2. 超过10条*/
  /*3. 重复的搜索*/

  var isSame = false
  var index = null
  this.list.forEach(function(item, i) {
    if (item === value) {
      isSame = true
      index = i
    }
  })
  /*判断是否有相同的*/
  if (isSame) {
    /*删除*/
    this.list.splice(index, 1)
  } else {
    /*判断是否超过10条*/
    if (this.list.length >= 10) {
      /*去掉第一个*/
      this.list.splice(0, 1)
    }
  }
  /*追加*/
  this.list.push(value)
  //存起来
  localStorage.setItem(this.KEY, JSON.stringify(this.list))
}
App.prototype.delHistory = function(index) {
  this.list.splice(index, 1)
  //存起来
  localStorage.setItem(this.KEY, JSON.stringify(this.list))
  /*渲染*/
  this.render()
}
App.prototype.clearHistory = function() {
  this.list = []
  //存起来
  localStorage.setItem(this.KEY, JSON.stringify(this.list))
  /*渲染*/
  this.render()
}
