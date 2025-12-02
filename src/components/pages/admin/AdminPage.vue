<script setup lang='ts'>
import UserManagement from './UserManagement.vue'
import UserImageManagement from './UserImageManagement.vue'
import NotificationCard from './NotificationCard.vue'
</script>

<template>
  <div class='p-6 space-y-6'>
    <h1 class='text-2xl font-bold tracking-tight'>Admin Dashboard</h1>
    
    <br/> 
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <NotificationCard />
    </div>

    <br/> 
    <!-- User Management Section -->
    <UserManagement />
    <br/><br/>
    <!-- User Image Management Section -->
    <UserImageManagement />

    
  </div>
</template>
