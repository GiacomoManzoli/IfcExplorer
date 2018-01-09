<template>
  <h1>{{project.name}} [{{project.rid}} - {{project.oid}}]</h1>
</template>


<script>
export default {
  name:"project-info",
  props: ["project"]
}
</script>
