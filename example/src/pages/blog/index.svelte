<script>
  import { page } from "roxi/routify";
  console.log($page.parent.children);
</script>

<h3>Posts</h3>
{#each $page.parent.children.find((node) => node.title === 'posts').children as child}
  <a href={child.path}>{child.title}</a>
{/each}
<slot />
