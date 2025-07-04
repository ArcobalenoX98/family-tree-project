<script setup lang="ts">
//optionally set component name for devtools/debugging

import RegisterForm from '../src/components/RegisterForm.vue';
import LoginForm from '../src/components/LoginForm.vue';

defineOptions({ name: 'App'})

</script>

<template>
  <div>
      <RegisterForm />
      <LoginForm />
  </div>
</template>


<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>
