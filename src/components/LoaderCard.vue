<script setup lang="ts">
const array = Array.from({ length: 20 }, () => "");
</script>

<template>
  <content-loader
    viewBox="0 0 400 400"
    :speed="4"
    primaryColor="rgba(224, 224, 224, 0.122)"
    secondaryColor="rgba(224, 224, 224, 0.28)"
  >
    <template v-for="(_, index) in array" :key="index">
      <circle cx="10" :cy="20 * index + 8" r="8" />
      <rect
        x="25"
        :y="20 * index + 3"
        rx="5"
        ry="5"
        :width="Math.floor(Math.random() * (360 - 220 + 1)) + 220"
        height="10"
      />
    </template>
  </content-loader>
</template>
