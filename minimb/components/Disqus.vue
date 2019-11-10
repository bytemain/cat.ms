<template>
  <div id="disqus_thread"></div>
</template>

<script>
import 'disqusjs/dist/disqusjs.css';
import DisqusJS from 'disqusjs';

export default {
  props: {
    apikey: {
      type: String,
      required: true,
    },
    shortname: {
      type: String,
      required: true,
    },
  },

  mounted() {
    const { shortname, siteName, apikey, admin, adminLabel } = this;
    const { identifier, url, title, api } = this;

    var dsqjs = new DisqusJS({
      shortname: shortname,
      siteName: siteName,
      identifier: identifier || '',
      url: url || '',
      title: title || '',
      api: api || '',
      apikey: apikey,
      admin: admin,
      adminLabel: adminLabel,
    });
  },
};
</script>
