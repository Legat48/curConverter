<template>
  <ul
    class="tags"
    :class="{'tags_aligment--justify' : alignment === 'justify'}"
  >
    <template
      v-for="tag in tagArrComp"
    >
      <li :key="tag.id" class="tags__item">
        <v-icon v-if="tag.icon" dense class="tags__icon">
          mdi-{{ tag.icon }}
        </v-icon>
        <p class="tags__text">
          {{ tag.text }}
        </p>
      </li>
      <v-icon
        v-if="tag.id != tagArrComp.length"
        :key="tag.id + 'icon'"
        class="tags__icon-separator"
      >
        mdi-circle-small
      </v-icon>
    </template>
  </ul>
</template>

<script>

import checkСapacity from '@/plugins/checkСapacity'

export default {
  name: 'BaseTags',
  props: {
    tagArr: {
      type: Array,
      required: true
    },
    alignment: {
      type: String,
      default: 'left'
    }
  },
  data: () => ({
  }),
  computed: {
    tagArrComp () {
      const arr = this.tagArr.map((e, index) => (
        e = {
          ...e,
          id: index + 1
        }
      )) || []
      // console.log(`%c${JSON.stringify(arr)}`, '🐦;background: lightblue; color: red; padding: 3px; border-radius: 5px;')
      return arr
    }
  },
  mounted () {
    checkСapacity()
    window.addEventListener('resize', () => {
      checkСapacity()
    })
  }
}
</script>
<style lang="scss" scoped>
.tags {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: left;
  gap: sizeIncr($min: 12, $max: 24);
  padding: sizeIncr($min: 4, $max: 8);
  width: 100%;
  font-size: sizeIncr($min: 12, $max: 16);
  border:  2px solid #1976d2;
  overflow: hidden;
  &_aligment{
    &--justify {
      justify-content: space-between;
    }
  }
  &__item {
    display: flex;
    align-items: center;
    gap: sizeIncr($min: 12, $max: 24);
    &_deactive {
      display: none;
    }
  }
  &__text {
    margin-bottom: 0;
    white-space: nowrap;
  }
  &__icon-separator {
    &_deactive {
      display: none !important;
    }
  }
}
</style>
