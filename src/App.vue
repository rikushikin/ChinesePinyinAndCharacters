<template>
  <div id="app">
    <div class="no-print" style="margin: 15px;">
      <InputNumber :max="10" :min="6" v-model="col"></InputNumber> 列
      <Button @click="print" type="primary" icon="printer">打印</Button>
      <Button @click="restore" type="success" icon="ios-undo">初始化</Button>
      <Button shape="circle" icon="social-github" @click="github">Github</Button>
      <Button shape="circle" type="text">by zhijun.lu</Button>
    </div>
    <div class="container" :style="style">
      <div class="row" v-for="(row, index) of rows">
        <Button type="error" shape="circle" class="no-print remove-button" :disabled="rows.length < 2" @click="rows.splice(index, 1)" icon="close">
        </Button>
        <div class="title" v-if="row.title" v-text="row.title"></div>
        <div class="content">
          <div class="item" v-for="i of cols" :key="i">
            <div class="pinyin" v-if="row.pinyin" v-text="row.pinyin.split(' ')[i - 1]"></div>
            <div class="character" v-text="row.character.split('')[i - 1]"></div>
          </div>
          <div class="clear"></div>
        </div>
        <div class="no-print row-operator">
          <Input placeholder="" v-model="row.title">
            <span slot="prepend">标题</span>
          </Input>
          <Input placeholder="" v-model="row.pinyin">
            <span slot="prepend">拼音</span>
          </Input>
          <Input placeholder="" v-model="row.character">
            <span slot="prepend">汉字</span>
          </Input>
          
        </div>
      </div>
      <div class="no-print" style="text-align: center;">
        <Button type="dashed" icon="plus" @click="rows.push({title: '', pinyin: '', character: ''})">再添加一行</Button>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  data () {
    return {
      col: 7,
      rows: []
    }
  },
  computed: {
    cols () {
      return (this.col > 0 && this.col) || 7
    },
    style () {
      return {
        width: `${59 * this.col + 1}px`
      }
    }
  },
  methods: {
    github () {
      window.open('https://github.com/rikushikin/ChinesePinyinAndCharacters')
    },
    print () {
      window.print()
    },
    restore () {
      this.$Modal.confirm({
        title: '恢复初始设置',
        content: '当前设置会丢失，确定恢复？',
        onOk: () => {
          this.$store.dispatch('restore').then(() => {
            this.init()
            this.$Message.success('恢复成功！')
          })
        }
      })
    },
    init () {
      this.rows = this.$store.getters.rows
    }
  },
  watch: {
    rows: {
      deep: true,
      handler (v) {
        this.$store.dispatch('saveRows', v)
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less">
@media print {
  .no-print {
    display: none !important;
  }
}
.clear {
  clear: both;
}
.row-operator {
  padding: 10px 0;
  .ivu-input-wrapper {
    margin-bottom: 5px;
  }
}
.container {
  margin: 0 auto;
}

.row {
  position: relative;
  margin-bottom: 1px;
  .remove-button {
    position: absolute;
    top: -16px;
    right: -16px;
    display: none;
    z-index: 9;
  }
  &:hover {
    .remove-button {
      display: block;
    }
  }
  .title {
    line-height: 24px;
    font-size: 14px;
    padding: 5px;
  }
  .content {
    font-size: 0;
    .item {
      width: 60px;
      border: 1px solid #000;
      text-align: center;
      float: left;
      margin-right: -1px;
      &:last-child {
        margin-right: 0;
      }
      .pinyin {
        height: 30px;
        line-height: 28px;
        position: relative;
        white-space: nowrap;
        font-size: 16px;
        border-bottom: 1px solid #000;
        &::before {
          position: absolute;
          width: 100%;
          content: '';
          display: block;
          top: 10px;
          height: 10px;
          border-top: 1px dotted #666;
          border-bottom: 1px dotted #666;
          z-index: -1;
        }
      }
      .character {
        height: 58px;
        line-height: 58px;
        position: relative;
        font-family: "KaiTi", "KaiTi_GB2312", 'STKaiti' !important;
        font-size: 40px;
        &::before {
          content: '';
          position: absolute;
          width: 100%;
          top: 50%;
          left: 0;
          height: 0;
          border-top: 1px dotted #CCC;
          z-index: -1;
        }
        &::after {
          content: '';
          position: absolute;
          width: 0;
          top: 0;
          left: 50%;
          height: 100%;
          border-left: 1px dotted #CCC;
          z-index: -1;
        }
      }
    }
  }
}
</style>
