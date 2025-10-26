<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { Button } from '@/components/ui/button';

const userStore = useUserStore();
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900 text-center p-4">
    <h1 class="text-5xl font-bold mb-4 dark:text-white">Dashboard</h1>
    <p class="text-xl text-gray-600 dark:text-gray-300 mb-4">
      Welcome, {{ userStore.userName }}!
    </p>
    <p class="text-md text-gray-500 dark:text-gray-400 mb-8">
      Email: {{ userStore.userEmail }}
    </p>
    
    <Button @click="userStore.logout()" variant="outline">
      Log out
    </Button>
  </div>
</template>