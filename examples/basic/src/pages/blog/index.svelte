<script>
  import { layout } from "roxi/routify";
</script>

<h3>Posts</h3>
{#each $layout.parent.children.find((node) => node.title === 'posts').children as child}
  <a href={child.path}>{child.title}</a>
{/each}
<slot />
