<script setup lang='ts'>
import UserManagement from './UserManagement.vue'
import UserImageManagement from './UserImageManagement.vue'
</script>

<template>
  <div class='p-6 space-y-6'>
    <h1 class='text-2xl font-bold tracking-tight'>Admin Dashboard</h1>
    
    <!-- User Management Section -->
    <UserManagement />

    <!-- User Image Management Section -->
    <UserImageManagement />
  </div>
</template>
