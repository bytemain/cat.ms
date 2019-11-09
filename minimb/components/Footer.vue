<template>
  <footer class="site-footer h-card">
    <div class="wrapper">
      <div class="footer-col-wrapper">
        <div class="footer-col three-quarte">
          <h2 class="footer-heading">{{ $siteConfig.author }}</h2>
          <ul class="contact-list">
            <li
              v-if="$siteConfig.email"
              v-html="`<a class='u-email' href='mailto:${$siteConfig.email}'>${$siteConfig.email}</a>`"
            ></li>
          </ul>
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
