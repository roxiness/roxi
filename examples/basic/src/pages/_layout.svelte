<script>
  import { layout } from "roxi/routify";
</script>

<h3>Example app</h3>
{#each $layout.children as child}
  <a href={child.path}>{child.title}</a>
{/each}
<slot />
