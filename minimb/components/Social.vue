<template>
  <ul class="social-media-list">
    <li v-if="social.github">
      <a :href="`https://github.com/${social.github}`" :title="social.github">
        <svg class="svg-icon github">
          <use :xlink:href="getSvg('github')" />
        </svg>
      </a>
    </li>
    <li v-if="social.twitter">
      <a :href="`https://twitter.com/${social.twitter}`" :title="social.twitter">
        <svg class="svg-icon twitter">
          <use :xlink:href="getSvg('twitter')" />
        </svg>
      </a>
    </li>
    <li v-if="social.telegram">
      <a :href="`https://t.me/${social.telegram }`" :title="social.telegram">
        <svg class="svg-icon grey">
          <use :xlink:href="getSvg('telegram')" />
        </svg>
      </a>
    </li>
    <li v-if="social.rss && feed">
      <a :href="feed.permalink" title="rss">
        <svg class="svg-icon orange">
          <use :xlink:href="getSvg('rss')" />
        </svg>
      </a>
    </li>
  </ul>
</template>

<script>
import getSvg from '../utils/getSvg';

export default {
  computed: {
    social() {
      return this.$themeConfig.social || {};
    },

    feed() {
      return this.$feed;
    },
  },

  methods: {
    getSvg,
  },
};
</script>

