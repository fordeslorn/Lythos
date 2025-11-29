<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<template>
  <div class="p-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p class="text-muted-foreground mt-2 mb-6">
        Welcome back, {{ userStore.userName }}!
      </p>
    </div>
    
    <div class="rounded-lg border bg-card p-6">
      <h2 class="text-xl font-semibold mb-2">Your Account</h2>
      <p class="text-sm text-muted-foreground mb-4">
        Email: {{ userStore.userEmail }}
      </p>
    </div>
    
  </div>
</template>