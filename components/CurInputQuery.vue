<template>
  <div class="query">
    <v-expansion-panels accordion>
      <v-expansion-panel>
        <v-expansion-panel-header>{{ layoutText.accordionTitle }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <ul class="query__list">
            <v-card v-for="(item, index) in curData.curArr" :key="index" elevation="2" class="query__item">
              <v-card-text class="query__item-text">
                {{ item.name }}
              </v-card-text>
            </v-card>
          </ul>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          class="query__btn"
          v-on="on"
        >
          {{ layoutText.dialogBtnOpen }}
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ layoutText.dialogTitle }}
        </v-card-title>

        <v-card-text>
          {{ layoutText.dialogInfo }}
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            {{ layoutText.dialogBtnClose }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card class="query__card">
      <v-text-field
        v-model="queryConverter"
        class="query__input"
        outlined
        dense
        :error-messages="query.errorMessage"
        :label="layoutText.inputLabel"
        :append-icon="iconCurSecond ? `mdi-${iconCurSecond}` : ''"
      />
      <v-card-text class="query__output">
        {{ query.message ? query.message : layoutText.firstQueryMessage }}
        <v-icon v-if="query.icon" dense class="tags__icon">
          mdi-{{ query.icon }}
        </v-icon>
      </v-card-text>
    </v-card>
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
    }
  },
  data () {
    return {
      query: {
        value: '',
        message: '',
        status: 'notready',
        key: 1,
        curFirst: '',
        curSecond: ''
      },
      dialog: false
    }
  },
  computed: {
    queryConverter: {
      get () {
        return this.query.value
      },
      // В сеттере описана валидация ввода и вывод значений и вывод ошибок
      set (value) {
        let q = value.split(' ')
        this.query.errorMessage = ''
        q[0] = q[0].replace(/[^.\d]+/g, '')
        this.query.message = this.layoutText.queryMessage1 // 'Вводитe кол-во валюты'
        if (q.join(' ') !== value) {
          this.query.errorMessage = this.layoutText.queryMessage2 // 'Вводить в начале нужно только цифры'
        }
        if (q[1]) {
          this.query.message = this.layoutText.queryMessage3 // 'Вводитe первую валюту'
          q[1] = q[1].replace(/[^a-zA-Z]+/g, '').slice(0, 3).toUpperCase()
          if (q.join(' ') !== value) {
            this.query.errorMessage = this.layoutText.queryMessage4 // 'Вводить во вторую часть только 3 заглавные латинские буквы'
          }
          if (q[1].length === 3) {
            const curFirst = this.curData.curArr.find(e => e.name === q[1])
            if (curFirst) {
              this.query.curFirst = curFirst.name
              if (curFirst.icon) {
                this.query.icon = curFirst.icon
              }
              this.query.message = `${this.layoutText.queryMessage5} ${this.query.curFirst}` // Первая валюта:
            } else {
              this.query.errorMessage = this.layoutText.queryMessage6 // 'Валюта не найдена'
              q = q.slice(0, 2)
            }
          } else {
            this.query.curFirst = ''
          }
        }
        if (q[2]) {
          this.query.curValue = q[0]
          q[2] = q[2].replace(/\d+/g, '')
          if (q.join(' ') !== value) {
            this.query.errorMessage = this.layoutText.queryMessage7 // 'Вводить в третью часть только буквы'
          }
        }
        if (q[3]) {
          this.query.message = this.layoutText.queryMessage8 // 'Вводитe вторую валюту'
          q[3] = q[3].replace(/[^a-zA-Z]+/g, '').slice(0, 3).toUpperCase()
          if (q.join(' ') !== value) {
            this.query.errorMessage = this.layoutText.queryMessage9 // 'Вводить в четвертую часть только 3 заглавные латинские буквы'
          }
          if (q[3].length === 3) {
            const curSecond = this.curData.curArr.find(e => e.name === q[3])
            if (curSecond) {
              this.query.curSecond = curSecond.name
              if (curSecond.icon) {
                this.query.icon = curSecond.icon
              }
            } else {
              this.query.errorMessage = this.layoutText.queryMessage10 // 'Валюта не найдена'
            }
          } else {
            this.query.curSecond = ''
          }
        }
        q = q.slice(0, 4)
        if (this.query.curFirst && this.query.curSecond) {
          const curConvertValue = this.curConvertValue(this.query.curFirst, this.query.curSecond)
          if (curConvertValue.type === 'error') {
            this.query.errorMessage = this.layoutText.queryMessage11 // 'нет данных по соотношению курсов'
            this.query.icon = ''
          } else {
            this.query.message = `${this.layoutText.queryMessage12} ${numberFormat(Math.round(this.query.curValue * curConvertValue * 100000) / 100000)}` // Результат перевода:
          }
        }
        // this.query.key += 1 // этот способ сбивает фокус и вернуть его я не смог
        // this.$refs.queryConverter.focus()
        // для рендера нового значения принудительно обновляем компонент только через время (борьба с реактивностью)
        this.query.value = value
        setTimeout(() => { this.query.value = q.join(' ') }, 1)
      }
    },
    layoutText () {
      if (this.lang !== 'en') {
        return {
          firstQueryMessage: 'Введите кол-во. Например 123 RUB in EUR',
          inputLabel: 'Введите запрос: ',
          accordionTitle: 'Доступные валюты',
          dialogTitle: 'Инструкция',
          dialogBtnOpen: 'Как пользоваться?',
          dialogBtnClose: 'Мне понятно',
          dialogInfo: 'Для использования перевода валют с помощью ввода строки, начните вводить сначала желаемое значение, после введите валюту из исписка доступных валют из которой требуется переводить. Далее введите любой предло и четвертым вводите валюту, в которую нужно перевести. Если вы всё верно сделали, то в поле ниже появится конвектированное значение. Так же вы можете воспользоваться полями выбора валют и ввода валюты ниже.',
          curConvertValueError: 'Не найдена пара валют',
          queryMessage1: 'Вводитe кол-во валюты',
          queryMessage2: 'Вводить в начале нужно только цифры',
          queryMessage3: 'Вводитe первую валюту',
          queryMessage4: 'Вводить во вторую часть только 3 заглавные латинские буквы',
          queryMessage5: 'Первая валюта:',
          queryMessage6: 'Валюта не найдена',
          queryMessage7: 'Вводить в третью часть только буквы',
          queryMessage8: 'Вводитe вторую валюту',
          queryMessage9: 'Вводить в четвертую часть только 3 заглавные латинские буквы',
          queryMessage10: 'Валюта не найдена',
          queryMessage11: 'нет данных по соотношению курсов',
          queryMessage12: 'Результат перевода:'
        }
      } else {
        return {
          firstQueryMessage: 'Enter quantity. For example 123 RUB in EUR',
          inputLabel: 'Enter a request: ',
          accordionTitle: 'Available currencies',
          dialogTitle: 'Instruction',
          dialogBtnOpen: 'How to use?',
          dialogBtnClose: 'I understand',
          dialogInfo: 'To use currency translation using string input, start typing the desired value first, then enter the currency from the list of available currencies from which you want to translate. Next, enter any suggestion and the fourth enter the currency into which you want to transfer. If you did everything right, then the convected value will appear in the field below. You can also use the currency selection and currency input fields below.',
          curConvertValueError: 'Currency pair not found',
          queryMessage1: 'Enter amount of currency',
          queryMessage2: 'Enter only numbers at the beginning',
          queryMessage3: 'Enter first currency',
          queryMessage4: 'Enter in the second part only 3 capital Latin letters',
          queryMessage5: 'First currency:',
          queryMessage6: 'Currency not found',
          queryMessage7: 'Enter only letters in the third part',
          queryMessage8: 'Enter second currency',
          queryMessage9: 'Enter only 3 capital Latin letters in the fourth part',
          queryMessage10: 'Currency not found',
          queryMessage11: 'no data on exchange rates',
          queryMessage12: 'Currency conversion result:'
        }
      }
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
.query {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: sizeIncr($min: 10, $max: 20);
  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: sizeIncr($min: 5, $max: 10);
    padding-left: 0;

  }
  &__item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: sizeIncr($min: 40, $max: 60);
    height: sizeIncr($min: 20, $max: 35);
  }
  &__item-text {
    padding: 0;
    width: auto;
  }
  &__card {
    width: 100%;
  }
  &__input {
    max-width: 800px;
  }
  &__output {
    padding-top: 0;
  }
}
</style>
