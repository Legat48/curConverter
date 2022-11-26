<template>
  <v-card
    elevation="9"
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="text-overline mb-4">
          Ошибка при загрузке данных
        </div>
        <v-list-item-title class="text-h5 mb-1">
          Ошибка: {{ errorMessage }}
        </v-list-item-title>
      </v-list-item-content>
      <NuxtLink to="/">
        <slot>
          <v-btn
            elevation="2"
          >
            Вернуться на страницу
          </v-btn>
        </slot>
      </NuxtLink>
    </v-list-item>
  </v-card>
</template><v-btn
elevation="2"
></v-btn>

<script>

export default {
  middleware: ['error'],
  computed: {
    errorMessage () {
      return this.$store.getters['cur/getErrorMessage'] || 'неизвестная ошибка'
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
