<template>
  <v-container class="convecter">
    <base-menu v-model="lang" :link="link" :text="layoutText.link" />
    <h1>
      {{ layoutText.title }}
    </h1>
    <cur-input-query class="convecter__query" :cur-data="curData" :lang="lang" />
    <cur-select-converter
      class="convecter__select-converter"
      :cur-data="curData"
      :base-cur="baseCur"
      :lang="lang"
    />
  </v-container>
</template>

<script>
import numberFormat from '~/helpers/numberFormat'

export default {
  filters: {
    numberFormat
  },
  middleware: ['cur'],
  data () {
    return {
      lang: 'ru',
      baseCur: 'RUB',
      link: '/exchange-rates/'
    }
  },
  computed: {
    curData () {
      return this.$store.getters['cur/getCurData'] || []
    },
    pages () {
      return this.$route.path
    },
    baseCurData () {
      const baseCurData = {
        cur: this.baseCur,
        curArr: this.curData.curArr.map((cur) => {
          return {
            ...cur,
            curConvertValue: this.curConvertValue(this.baseCur, cur.name)
          }
        }).filter(e => e.name !== this.baseCur && e.curConvertValue.type !== 'error' &&
          this.baseCur && e.curConvertValue > 0.0001
        )
      }
      return baseCurData || {}
    },
    selectCurArr () {
      return this.curData.curArr.map(e => e.name) || []
    },
    layoutText () {
      if (this.lang !== 'en') {
        return {
          link: 'Все курсы',
          title: 'Конвектор валют:',
          curConvertValueError: 'Не найдена пара валют'
        }
      } else {
        return {
          link: 'Exchange rates',
          title: 'Currency Converter:',
          curConvertValueError: 'Currency pair not found'
        }
      }
    }
  },
  methods: {
    curConvertValue (curFirst, curSecond) {
      let curConvert = `${curFirst}${curSecond}`
      if (curFirst === curSecond) {
        return 1
      }
      if (this.curData.curValue[curConvert]) {
        return Number(this.curData.curValue[curConvert])
      }
      curConvert = `${curSecond}${curFirst}`
      if (this.curData.curValue[curConvert]) {
        return 1 / Number(this.curData.curValue[curConvert])
      }
      return {
        type: 'error',
        messege: this.layoutText.curConvertValueError
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.convecter {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: sizeIncr($min: 15, $max: 30);
  padding-top: sizeDecr($min: 15, $max: 50);
  &__query,
  &__select-converter {
    width: 100%;
  }
  &__container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 20px;
  }
  &__row {
    width: 100%;
  }
}

</style>
