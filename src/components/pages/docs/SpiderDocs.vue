<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Spider Documentation</h1>
    
    <div class="space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Pixiv Spider Guide</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <section>
            <h3 class="text-lg font-semibold mb-2">1. Getting your Cookie</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-2">
              To use the Pixiv spider, you need to provide your session cookie. Here's how to get it:
            </p>
            <ol class="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300 ml-4">
              <li>Log in to <a href="https://www.pixiv.net" target="_blank" class="text-blue-500 hover:underline">pixiv.net</a> in your browser.</li>
              <li>Open Developer Tools (F12 or Right Click -> Inspect).</li>
              <li>Go to the <strong>Application</strong> tab (or Storage tab in Firefox).</li>
              <li>Expand <strong>Cookies</strong> in the left sidebar and select <code>https://www.pixiv.net</code>.</li>
              <li>Find the cookie named <code>PHPSESSID</code>.</li>
              <li>Copy the value of <code>PHPSESSID</code> (it should look like <code>12345678_abcdef123456...</code>).</li>
              <li>Paste the full string <code>PHPSESSID=your_value_here</code> into the Cookie input field.</li>
            </ol>
          </section>

          <section>
            <h3 class="text-lg font-semibold mb-2">2. Finding User ID</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-2">
              The User ID is the unique identifier for a Pixiv artist.
            </p>
            <ul class="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300 ml-4">
              <li>Go to the artist's profile page on Pixiv.</li>
              <li>Look at the URL: <code>https://www.pixiv.net/en/users/12345678</code>.</li>
              <li>The number at the end (<code>12345678</code>) is the User ID.</li>
            </ul>
          </section>

          <section>
            <h3 class="text-lg font-semibold mb-2">3. Troubleshooting</h3>
            <div class="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-md text-sm">
              <p class="font-medium mb-1">Images not loading?</p>
              <p class="text-gray-500">Ensure the backend crawler service is running and has access to the internet. Check the logs for any network errors.</p>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
