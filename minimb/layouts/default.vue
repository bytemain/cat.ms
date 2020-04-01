<template>
  <Wrap :page="page">
    <div class="home">
      <h1 class="page-heading" v-if="page.title">{{ page.title }}</h1>
      <slot name="default"></slot>
      <h2
        class="post-list-heading"
        v-if="page.posts && page.posts.length > 0"
      >{{ page.listTitle || page.category || page.tag || 'Posts' }}</h2>

      <ul class="post-list" v-if="page.posts && page.posts.length > 0">
        <li v-for="post in page.posts" :key="post.permalink">
          <span class="post-meta">{{ formatDate(post.createdAt) }}</span>
          <h3>
            <saber-link class="post-link" :to="post.permalink">{{ post.title }}</saber-link>
          </h3>
          <div class="post-excerpt" v-html="post.excerpt"></div>
          <saber-link class="post-footer" :to="post.permalink">
            阅读全文
            <div class="post-eof"></div>
          </saber-link>
        </li>
      </ul>

      <div
        class="pagination"
        v-if="page.pagination && (page.pagination.hasNext || page.pagination.hasPrev)"
      >
        <router-link
          class="prev-link"
          :to="page.pagination.nextLink"
          v-if="page.pagination.hasNext"
        >← Previous</router-link>
        <router-link
          class="next-link"
          :to="page.pagination.prevLink"
          v-if="page.pagination.hasPrev"
        >Next →</router-link>
      </div>
    </div>
  </Wrap>
</template>

<script>
import formatDate from '../utils/formatDate';
import Wrap from '../components/Wrap.vue';
import getSvg from '../utils/getSvg';
import Fuse from 'fuse.js';

export default {
  components: {
    Wrap,
  },

  props: ['page'],
  computed: {
    feedLink() {
      return this.$feed && this.$feed.permalink;
    },
    async search() {
      const database = await this.$fetchSearchDatabase();
      console.log('TCL: database', database);
      // Typically you need to get the keyword from an `input` element
      // We hardcoded it for convenience
      const keyword = 'hello';

      const options = {
        keys: [
          {
            name: 'title',
            weight: 0.6,
          },
          {
            name: 'excerpt',
            weight: 0.4,
          },
        ],
        shouldSort: true, // sorts the results by score
      };

      const fuse = new Fuse(database, options);
      const matchedResults = fuse.search(keyword);
      console.log('TCL: search -> matchedResults', matchedResults);
    },
  },
  methods: {
    formatDate,
    getSvg,
  },
};
</script>
