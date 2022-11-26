<template>
  <div class="select-convector">
    <v-combobox
      v-model="curFirst"
      clearable
      outlined
      :items="selectCurArr"
      :label="layoutText.comboboxLabel1"
    />
    <v-combobox
      v-model="curSecond"
      clearable
      outlined
      :items="selectCurSecondArr"
      :label="layoutText.comboboxLabel2"
    />
    <v-text-field
      v-model="inputValue"
      type="number"
      clearable
      outlined
      :label="layoutText.comboboxLabel3"
      :append-icon="iconCurFirst ? `mdi-${iconCurFirst}` : ''"
    />
    <v-text-field
      class="select-convector__result"
      :value="outputValue"
      outlined
      readonly
      :label="layoutText.comboboxLabel4"
      :append-icon="iconCurSecond ? `mdi-${iconCurSecond}` : ''"
    />
  </div>
</template>

<script>
import numberFormat from '~/helpers/numberFormat'

export default {
  filters: {
    numberFormat
  },
  props: {
    lang: {
      type: String,
      default: 'ru'
    },
    curData: {
      type: Object,
      required: true
    },
    baseCur: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      curFirst: this.baseCur,
      curSecond: 'EUR',
      inputValue: 1
    }
  },
  computed: {
    layoutText () {
      if (this.lang !== 'en') {
        return {
          comboboxLabel1: 'Выберите конвектируемую валюту',
          comboboxLabel2: 'Выберите итоговую валюту',
          comboboxLabel3: 'Введите кол-во',
          comboboxLabel4: 'Результат перевода:',
          outputValue: 'нет данных по соотношению курса',
          curConvertValueError: 'Не найдена пара валют'
        }
      } else {
        return {
          comboboxLabel1: 'Choose the convective currency',
          comboboxLabel2: 'Select final currency',
          comboboxLabel3: 'Enter quantity',
          comboboxLabel4: 'Currency conversion result:',
          outputValue: 'no exchange rate data',
          curConvertValueError: 'Currency pair not found'
        }
      }
    },
    selectCurArr () {
      return this.curData.curArr.map(e => e.name) || []
    },
    selectCurSecondArr () {
      const arr = this.curData.curPairArr.filter(e => e.includes(this.curFirst)).map(cur => cur.replace(this.curFirst, ''))
      return arr || []
    },
    outputValue () {
      const convert = this.curConvertValue(this.curFirst, this.curSecond)
      if (convert.type === 'error') { return this.layoutText.outputValue }
      return numberFormat(Math.round(this.inputValue * convert * 100000) / 100000) || 0
    },
    iconCurFirst () {
      return this.curData.curArr.find(cur => cur.name === this.curFirst)?.icon || ''
    },
    iconCurSecond () {
      return this.curData.curArr.find(cur => cur.name === this.curSecond)?.icon || ''
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
.select-convector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: sizeIncr($min: 15, $max: 30);
  @media (max-width: $tablet) {
    grid-template-columns: 1fr;
  }
}
</style>
