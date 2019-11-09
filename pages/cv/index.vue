<template>
  <div>
    <div>My CV Page</div>
    <ul>
      <li>
        <a href="/cv/swustoj">嘻嘻，第一个就是 Oj</a>
      </li>
    </ul>
  </div>
</template>
<script>
export const data = {
  layout: 'page',
  title: '简历'
}
export default {
  props: ['page']
}
</script>