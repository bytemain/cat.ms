<template>
  <footer class="site-footer h-card">
    <div class="wrapper">
      <div class="footer-col-wrapper">
        <div class="footer-col three-quarte">
          <p>{{ $siteConfig.description }}</p>
        </div>
        <div class="social-links">
          <Social />
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import Social from './Social.vue';
export default {
  components: {
    Social,
  },

  props: {
    siteTitle: {
      type: String,
      required: true,
    },
  },
};
</script>
