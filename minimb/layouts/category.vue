<template>
  <Wrap :page="page">
    <div class="home">
      <h1 class="page-heading" v-if="page.title">{{ page.title }}</h1>
      <slot name="default"></slot>
      <h2 class="post-list-heading">Categories</h2>
    </div>
  </Wrap>
</template>

<script>
import Wrap from '../components/Wrap.vue';
export default {
  components: { Wrap },

  props: ['page'],

  methods: {},
};
</script>
