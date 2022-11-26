<template>
  <v-container class="exchange-rates">
    <base-menu v-model="lang" :link="link" :text="layoutText.link" />
    <v-menu transition="scroll-x-transition" content-class="exchange-rates__menu">
      <template #activator="{ on, attrs }">
        <v-btn
          color="primary"
          class="ma-2"
          v-bind="attrs"
          v-on="on"
        >
          {{ layoutText.btn }} {{ baseCur }}
        </v-btn>
      </template>
      <v-list dense max-height="50vh" class="exchange-rates__dropdown">
        <v-list-item
          v-for="(cur, index) in curData.curArr"
          :key="index"
          color="white"
          button
          @click="baseCur = cur.name"
        >
          <v-list-item-title>
            {{ cur.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <h1>
      {{ layoutText.title }}
    </h1>
    <v-container class="exchange-rates__list">
      <v-card v-for="(item, index) in baseCurData.curArr" :key="index" elevation="2">
        <v-card-text>
          {{ item.name }}
          <v-icon v-if="item.icon" dense>
            mdi-{{ item.icon }}
          </v-icon>
        </v-card-text>
        <v-card-text>
          {{ 1 / (Math.round(item.curConvertValue * 10000) / 10000) | numberFormat }} {{ baseCur }}
        </v-card-text>
      </v-card>
    </v-container>
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
      link: '/'
    }
  },
  computed: {
    curData () {
      return this.$store.getters['cur/getCurData'] || []
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
    layoutText () {
      if (this.lang !== 'en') {
        return {
          link: 'Конвектор валют',
          title: 'Курсы валют относительно базовой:',
          btn: 'Базовая валюта: ',
          curConvertValueError: 'Не найдена пара валют'
        }
      } else {
        return {
          link: 'Currency Converter',
          title: 'Exchange rates relative to the base:',
          btn: 'Base currency: ',
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
.exchange-rates {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: sizeIncr($min: 15, $max: 30);
  padding-top: sizeDecr($min: 15, $max: 50);
  &__list {
    display: grid;
    grid-auto-flow: dense;
    grid-template-columns: repeat( auto-fit, minmax(120px, 1fr) );
    gap: sizeDecr($min: 10, $max: 20);
  }
  &__row {
    width: 100%;
  }
  &__menu {
    background-color: #fff;
  }
}
</style>
