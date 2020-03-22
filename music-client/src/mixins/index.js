export const mixin = {
  methods: {
    // 提示信息
    notify (title, type) {
      this.$notify({
        title: title,
        type: type
      })
    },
    // 获取图片信息
    attachImageUrl (srcUrl) {
      return srcUrl ? this.$store.state.configure.HOST + srcUrl || '../assets/img/user.jpg' : ''
    },
    attachBirth (val) {
      let birth = String(val).match(/[0-9-]+(?=\s)/)
      return Array.isArray(birth) ? birth[0] : birth
    },
    // 得到名字后部分
    replaceFName (str) {
      let arr = str.split('-')
      return arr[1]
    },
    // 得到名字前部分
    replaceLName (str) {
      let arr = str.split('-')
      return arr[0]
    },
    // 播放
    toplay: function (id, url, pic, index, name, lyric) {
      this.$store.commit('setId', id)
      this.$store.commit('setListIndex', index)
      this.$store.commit('setUrl', this.$store.state.configure.HOST + url)
      this.$store.commit('setpicUrl', this.$store.state.configure.HOST + pic)
      this.$store.commit('setTitle', this.replaceFName(name))
      this.$store.commit('setArtist', this.replaceLName(name))
      this.$store.commit('setLyric', this.parseLyric(lyric))
    },
    // 解析歌词
    parseLyric (text) {
      let lines = text.split('\n')
      let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g
      let result = []

      while (!pattern.test(lines[0])) {
        lines = lines.slice(1)
      }

      lines[lines.length - 1].length === 0 && lines.pop()
      for (let item of lines) {
        let time = item.match(pattern) // 存前面的时间段
        let value = item.replace(pattern, '') // 存歌词
        // console.log(time) // 时间
        // console.log(value) // 歌词数据
        for (let item1 of time) {
          var t = item1.slice(1, -1).split(':')
          if (value !== '') {
            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value])
          }
        }
      }
      result.sort(function (a, b) {
        return a[0] - b[0]
      })
      return result
    },
    // 搜索音乐
    getSong () {
      if (!this.$route.query.keywords) {
        this.$store.commit('setListOfSongs', [])
        this.notify('您输入内容为空', 'warning')
      } else {
        this.$api.songAPI.getSongOfSingerName(this.$route.query.keywords)
          .then(res => {
            if (!res.data.length) {
              this.$store.commit('setListOfSongs', [])
              this.notify('系统暂无该歌曲', 'warning')
            } else {
              this.$store.commit('setListOfSongs', res.data)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }
}
