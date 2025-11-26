<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Introduction</h1>
    
    <div class="space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Vue Management System</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <p class="text-gray-600 dark:text-gray-300">
            This is a modern management system built with Vue 3, TypeScript, and Tailwind CSS. It provides a comprehensive suite of tools for managing resources, running spider tasks, and more.
          </p>

          <section>
            <h3 class="text-lg font-semibold mb-2">Key Features</h3>
            <ul class="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300 ml-4">
              <li>
                <strong>Dashboard:</strong> Overview of system status and key metrics.
              </li>
              <li>
                <strong>Resource Management:</strong> Upload, organize, and manage your digital assets.
              </li>
              <li>
                <strong>Spider Tools:</strong> Integrated crawlers for platforms like Pixiv and NetEase Cloud Music.
              </li>
              <li>
                <strong>User System:</strong> Secure authentication, profile management, and settings.
              </li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-semibold mb-2">Getting Started</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              Navigate through the sidebar menu to access different modules. Check the specific documentation pages for detailed guides on each feature.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
