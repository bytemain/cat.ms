---
title: About
layout: page
permalink: /about
---
<p>
    <span class="author">{{ $siteConfig.author }}</span>
    <ul class="contact-list">
        <li
        v-if="$siteConfig.email"
        v-html="`<a class='u-email' href='mailto:${$siteConfig.email}'>${$siteConfig.email}</a>`"
        ></li>
    </ul>
</p>

<style>
.author {
  @include relative-font-size(1.125);
  margin-bottom: 2px;
}

.contact-list {
  list-style: none;
  margin-left: 0;
}
</style>

在读

喜欢折腾

喜欢 Web 全栈系列

喜欢 Python

