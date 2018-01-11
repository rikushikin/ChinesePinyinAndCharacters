<template>
  <div id="app">
    <div class="no-print" style="margin: 15px;">
      <InputNumber :max="12" :min="6" v-model="col"></InputNumber> 列
      <Button @click="print" type="primary" icon="printer">打印</Button>
      <Button @click="restore" type="success" icon="ios-undo">初始化</Button>
      <Button shape="circle" icon="social-github" @click="github">Github</Button>
      <Button shape="circle" type="text">by zhijun.lu</Button>
    </div>
    <div class="container" :style="style" v-if="rows.length" :class="{drag}">
      <Draggable v-model="rows" :options="{handle: '.move-button'}" @start="drag = true" @end="drag = false">
        <div class="row" v-for="(row, index) of rows">
          
          <div class="title" v-if="row.title" v-text="row.title"></div>
          <div class="content">
            <Button
              size="small"
              shape="circle"
              class="no-print move-button"
              icon="arrow-move"></Button>
            <Button
              type="error"
              size="small"
              shape="circle"
              class="no-print remove-button"
              :disabled="rows.length < 2"
              @click="rows.splice(index, 1)"
              icon="close">
          </Button>
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
      </Draggable>
      <div class="no-print" style="text-align: center;">
        <Button type="dashed" icon="plus" @click="rows.push({title: '', pinyin: '', character: ''})">再添加一行</Button>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import Draggable from 'vuedraggable'
export default {
  data () {
    return {
      drag: false,
      col: 4,
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
      this.col = this.$store.getters.col
    }
  },
  watch: {
    rows: {
      deep: true,
      handler (rows) {
        this.$store.commit('rows', rows)
      }
    },
    col (col) {
      this.$store.commit('col', col)
    }
  },
  components: {Draggable},
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
  .title {
    line-height: 24px;
    font-size: 14px;
    padding: 5px;
  }
  .content {
    position: relative;
    background: #FFF;
    font-size: 0;
    .move-button {
      position: absolute;
      left: -12px;
      top: -12px;
      z-index: 9;
      display: none;
      cursor: move;
    }
    .remove-button {
      position: absolute;
      top: -12px;
      right: -12px;
      display: none;
      z-index: 9;
    }
    &:hover {
      .move-button {
        display: block;
      }
      .remove-button {
        display: block;
      }
    }
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
          border-top: 1px dotted #CCC;
          border-bottom: 1px dotted #CCC;
          z-index: 0;
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
          z-index: 0;
        }
        &::after {
          content: '';
          position: absolute;
          width: 0;
          top: 0;
          left: 50%;
          height: 100%;
          border-left: 1px dotted #CCC;
          z-index: 0;
        }
      }
    }
  }
}

.drag {
  .title {
    display: none;
  }
  .row {
    margin-bottom: 15px;
  }
  .row-operator {
    display: none;
  }
  .ivu-btn {
    display: none !important;
  }
}

.sortable-drag {
  .remove-button {
    display: none !important;
  }
  .title {
    display: none;
  }
  .row-operator {
    display: none;
  }
}
</style>
