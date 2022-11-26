<template>
  <div class="menu">
    <v-tabs>
      <v-tab @click="changeLang('ru')">
        ru
      </v-tab>
      <v-tab @click="changeLang('en')">
        en
      </v-tab>
    </v-tabs>
    <!-- на хосте приходится использовать обычную прямую ссылку, так как в API неправильно настроены CORS и на это я не могу повлиять -->
    <!-- <v-btn
      class="btn-go-to"
      elevation="2"
      link
      :href="`https://andrey-dudorov.ru/cur-converter${link}`"
    >
      {{ text }}
    </v-btn> -->
    <NuxtLink :to="link">
      <slot>
        <v-btn
          elevation="2"
        >
          {{ text }}
        </v-btn>
      </slot>
    </NuxtLink>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'lang',
    event: 'lang'
  },
  props: {
    lang: {
      type: String,
      default: 'ru'
    },
    link: {
      type: String,
      default: '/'
    },
    text: {
      type: String,
      default: 'Другая страница'
    }
  },
  data () {
    return { selectedLang: this.lang }
  },
  methods: {
    changeLang (value) {
      this.selectedLang = value
      this.$emit('lang', this.selectedLang)
    }
  }
}
</script>

<style lang="scss">
.menu {
  position: absolute;
  display: flex;
  gap: sizeIncr($min: 10, $max: 20);
  inset: sizeIncr($min: 15, $max: 30) sizeIncr($min: 15, $max: 30) auto auto;
  div div .v-tab {
    min-width: auto;
  }
}
</style>
