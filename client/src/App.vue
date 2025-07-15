<script setup lang="ts">
//optionally set component name for devtools/debugging

import RegisterForm from '../src/components/RegisterForm.vue';
import LoginForm from '../src/components/LoginForm.vue';

defineOptions({ name: 'App'})

import { ref } from 'vue';
import FamilyTree from './components/FamilyTree.vue';

const treeData = ref([
  { id: 1, name: '张三', parent: null },
  { id: 2, name: '李四', parent: 1 },
  { id: 3, name: '王五', parent: 1 }
]);
</script>

<template>
  <div>
      <RegisterForm />
      <LoginForm />
      <router-view />
      <FamilyTree v-if="treeData.length" :data="treeData" />
  </div>
</template>


<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>
