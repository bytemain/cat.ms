<template>
  <Wrap :page="page">
    <article class="post h-entry" itemscope itemtype="http://schema.org/BlogPosting">
      <header class="post-header">
        <h1 class="post-title p-name" itemprop="name headline">{{ page.title }}</h1>
        <div class="post-meta">
          <time
            class="dt-published"
            :datetime="page.createdAt"
            itemprop="datePublished"
          >{{ formatDate(page.createdAt) }}</time>
          <span
            v-if="page.categoriesInfo && page.categoriesInfo.length > 0"
            class="page-categories"
          >
            <a
              :href="page.categoriesInfo[0].permalink"
              class="category"
            >{{ page.categoriesInfo[0].name }}</a>
          </span>
        </div>
      </header>

      <div class="post-content e-content" itemprop="articleBody">
        <slot name="default" />
        <div style="text-align:center;color: #ccc;font-size:14px;">
          - 正文到此结束啦
          <i class="fa fa-paw"></i> -
        </div>
        <ul>
          <li v-if="page.prevPost">
            <router-link :to="page.prevPost.permalink">Previous: {{ page.prevPost.title }}</router-link>
          </li>
          <li v-if="page.nextPost">
            <router-link :to="page.nextPost.permalink">Next: {{ page.nextPost.title }}</router-link>
          </li>
        </ul>
      </div>

      <Disqus
        v-if="page.comments !== false && $themeConfig.disqus"
        :shortname="$themeConfig.disqus.shortname"
        :siteName="$themeConfig.disqus.siteName"
        :apikey="$themeConfig.disqus.apikey"
        :admin="$themeConfig.disqus.admin"
        :adminLabel="$themeConfig.disqus.adminLabel"
      />

      <a class="u-url" :href="page.permalink" hidden></a>
    </article>
  </Wrap>
</template>

<script>
import formatDate from '../utils/formatDate';
import Wrap from '../components/Wrap.vue';
import Disqus from '../components/Disqus.vue';

export default {
  components: {
    Wrap,
    Disqus,
  },

  props: ['page'],

  methods: {
    formatDate,
  },
};
</script>
