<template>
  <v-container class="test__container">
    <v-card v-for="(item, index) in baseCurArr" :key="index" elevation="2">
      <v-card-text>
        {{ item.name }}
        <v-icon v-if="item.icon" dense class="item__icon">
          mdi-{{ item.icon }}
        </v-icon>
      </v-card-text>
      <v-card-text>
        {{ Math.round(item.curConvertValue * 10000) / 10000 | numberFormat }}
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import numberFormat from '~/helpers/numberFormat'

export default {
  name: 'CurArr',
  filters: {
    numberFormat
  },
  props: {
    curArr: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    baseCurArr () {
      return this.curArr || []
    }
  }
}
</script>
