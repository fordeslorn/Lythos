<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const code_sites = [
  {
    title: 'GitHub',
    description: 'Where the world builds software.',
    url: 'https://github.com',
    favicon: 'https://github.githubassets.com/favicons/favicon.svg',
    svgIcon: ''
  },
  {
    title: 'shadcn-vue',
    description: 'A component ui library for Vue.js.',
    url: 'https://shadcn-vue.com',
    favicon: 'https://shadcn-vue.com/favicon-16x16.png',
    svgIcon: ''
  },
  {
    title: 'Tailwind CSS',
    description: 'Rapidly build modern websites without ever leaving your HTML.',
    url: 'https://tailwindcss.com',
    favicon: 'https://tailwindcss.com/favicons/favicon-32x32.png?v=4',
    svgIcon: ''
  },
  {
    title: 'Lucide',
    description: 'Beautiful & consistent icons Made by the community,',
    url: 'https://lucide.dev',
    favicon: 'https://lucide.dev/logo.light.svg',
    svgIcon: ''
  },
  {
    title: 'Cloudflare',
    description: 'Internet security, performance, and reliability services.',
    url: 'https://www.cloudflare.com',
    favicon: 'https://qualified-production.s3.amazonaws.com/uploads/3b522ef84c409e4457032e4b4e3b984abbc92522c6f100f4ccc55c0ccfd3062b.png',
    svgIcon: ''
  },
  {
    title: 'DigitalOcean',
    description: 'Cloud computing platform for developers.',
    url: 'https://www.digitalocean.com',
    favicon: 'https://www.digitalocean.com/_next/static/media/favicon.594d6067.ico',
    svgIcon: ''
  },
  {
    title: 'Docker Hub',
    description: 'Platform for developing, shipping, and running applications.',
    url: 'https://hub.docker.com/',
    favicon: '/icons/docker.png',
    svgIcon: ''
  },
  {
    title: 'Resend',
    description: 'Email infrastructure for developers.',
    url: 'https://resend.com/',
    favicon: 'https://resend.com/static/favicons/favicon.ico?v=1',
    svgIcon: ''
  },
  {
    title: 'Gemini',
    description: 'The next-generation AI model from Google.',
    url: 'https://gemini.google.com/',
    favicon: 'https://www.gstatic.com/lamda/images/gemini_sparkle_4g_512_lt_f94943af3be039176192d.png',
    svgIcon: ''
  },
  {
    title: 'ChatGPT',
    description: 'The AI language model by OpenAI.',
    url: 'https://chatgpt.com/',
    favicon: 'https://cdn.oaistatic.com/assets/favicon-l4nq08hd.svg',
    svgIcon: ''
  },
  {
    title: 'Langflow',
    description: 'An open-source visual tool for building and managing AI workflows.',
    url: 'https://www.langflow.org/',
    favicon: 'https://www.langflow.org/favicon.ico',
    svgIcon: ''
  }
]

const tool_sites = [
  {
    title: 'PhotoKit',
    description: 'AI-based online photo editor, convenient and easy to use.',
    url: 'https://photokit.com/',
    favicon: 'https://photokit.com/favicon.ico',
    svgIcon: ''
  },
  {
    title: 'Omnifile',
    description: 'Unlimited conversions. Filesizes up to 2.5GB. For free, forever.',
    url: 'https://omnifile.co/',
    favicon: 'https://omnifile.co/favicon.svg?v=c052aac5083ecdaad0462a530ed4f3c2',
    svgIcon: ''
  },
  {
    title: 'Regexr',
    description: 'Online tool for learning, writing, and testing regular expressions.',
    url: 'https://regexr.com/',
    favicon: '/icons/regexr.png',
    svgIcon: ''
  },
  {
    title: 'CDKM',
    description: 'Next-generation converter built with many open-source projects.',
    url: 'https://cdkm.com/',
    favicon: 'https://cdkm.com/favicon.ico',
    svgIcon: ''
  },
  {
    title: 'ico51',
    description: 'ICO图标在线生成 在线生成透明ICO图标',
    url: 'https://www.ico51.cn/',
    favicon: 'https://www.ico51.cn/favicon.ico',
    svgIcon: ''
  },
  {
    title: '4bit',
    description: 'A simple 4-bit color palette generator.',
    url: 'https://ciembor.github.io/4bit',
    favicon: 'https://ciembor.github.io/4bit/images/favicon.svg',
    svgIcon: ''
  },
  {
    title: 'iLoveIMG',
    description: 'Your online photo editor is here and forever free!',
    url: 'https://www.iloveimg.com/',
    favicon: 'https://www.iloveimg.com/img/favicons-img/favicon-16x16.png',
    svgIcon: ''
  },
  {
    title: 'SoJSON',
    description: 'JSON在线解析验证格式化工具',
    url: 'https://www.sojson.com/',
    favicon: 'https://scdn.sojson.com/sojson/favicon32.png',
    svgIcon: ''
  },
  {
    title: 'NovelAI Tags',
    description: 'Tagging system for NovelAI.',
    url: 'https://tags.novelai.dev/',
    favicon: 'https://tags.novelai.dev/icon.jpg',
    svgIcon: ''
  },{
    title: 'TingDong',
    description: 'Trail various of music intrusments and devices online.',
    url: 'https://tingdong.cn/',
    favicon: 'https://tingdong.cn/favicon.ico',
    svgIcon: ''
  },
  {
    title: 'SMMS',
    description: 'A free image hosting service.',
    url: 'https://smms.app/',
    favicon: 'https://smms.app/favicon.ico',
    svgIcon: ''
  }
]

const media_sites = [
  {
    title: 'YouTube',
    description: 'Watch, share and upload videos.',
    url: 'https://www.youtube.com',
    favicon: 'https://www.youtube.com/favicon.ico',
    svgIcon: ''
  },
  {
    title: 'Pixiv',
    description: 'An online community for artists.',
    url: 'https://www.pixiv.net/',
    favicon: 'https://www.pixiv.net/favicon20250122.ico',
    svgIcon: ''
  },
  {
    title: 'Netease Cloud Music',
    description: 'Music streaming service by NetEase.',
    url: 'https://music.163.com/',
    favicon: 'https://music.163.com/favicon.ico',
    svgIcon: ''
  },
  {
    title: 'Libvio',
    description: 'A free movie and media streaming site.',
    url: 'https://www.libvio.cc/',
    favicon: 'https://www.libvio.cc/statics/img/favicon.ico',
    svgIcon: ''
  },
   
]

const resource_sites = [
  {
    title: 'Unsplash',
    description: 'Beautiful, free images and photos that you can download and use for any project.',
    url: 'https://unsplash.com',
    favicon: 'https://unsplash.com/favicon.ico',
    svgIcon: ''
  },
  {
    title: 'Pexels',
    description: 'Free stock photos and videos shared by talented creators.',
    url: 'https://www.pexels.com',
    favicon: 'https://www.pexels.com/favicon.ico',
    svgIcon: ''
  },
  {
    title: 'Pixabay',
    description: 'Stunning free images & royalty free stock.',
    url: 'https://pixabay.com',
    favicon: 'https://pixabay.com/favicon.ico',
    svgIcon: ''
  },
  {
    title: 'SteamZg',
    description: 'A mixed resource site.',
    url: 'https://steamzg.com/',
    favicon: '/icons/steamzg.png',
    svgIcon: ''
  },
  {
    title: 'Konachan',
    description: 'A popular anime wallpaper and image board site.',
    url: 'https://konachan.net/',
    favicon: 'https://konachan.net/favicon.ico',
    svgIcon: ''
  },
  {
    title: 'Alpha Coders',
    description: 'Search for anything! Video Game Wallpapers, Dragon Art, Cat Gifs',
    url: 'https://alphacoders.com/',
    favicon: 'https://alphacoders.com/favicon-32x32.png',
    svgIcon: ''
  },
  {
    title: 'Wallhaven',
    description: 'A community-driven wallpaper site.',
    url: 'https://wallhaven.cc/',
    favicon: 'https://wallhaven.cc/favicon.ico',
    svgIcon: ''
  },
  {
    title: 'NBFOX',
    description: 'Art is a way of survival.',
    url: 'https://www.nbfox.com/',
    favicon: 'https://file.nbfox.com/wp-content/uploads/2020/03/cropped-mtyywcn-fox-logo-1.png',
    svgIcon: ''
  },
  {
    title: 'Game UI Database',
    description: 'The Ultimate reference tool for game interface designers.',
    url: 'https://www.gameuidatabase.com/',
    favicon: 'https://www.gameuidatabase.com/favicon.svg?v=2.0',
    svgIcon: ''
  },
  {
    title: 'Emoji All',
    description: 'Comprehensive emoji resource and information site.',
    url: 'https://www.emojiall.com/',
    favicon: 'https://www.emojiall.com/favicon.ico',
    svgIcon: ''
  },
  {
    title: '音源多多',
    description: '各种音源资源分享网站，使用夸克网盘传输。',
    url: 'https://www.yyddxzz.cn/',
    favicon: 'https://www.yyddxzz.cn/logo.png',
    svgIcon: ''
  },
  {
    title: 'CoderNav',
    description: '开发者导航，所有资源分类一应俱全。',
    url: 'https://codernav.com/',
    favicon: 'https://codernav.com/favicon.ico',
    svgIcon: ''
  },
   
]

const other_sites = [
  {
    title: '100000 Stars',
    description: '100,000 stars in WebGL. Explore the Milky Way galaxy and beyond.',
    url: 'https://stars.chromeexperiments.com/',
    favicon: 'https://stars.chromeexperiments.com/favicon.ico',
    svgIcon: ''
  },
  {
    title: 'Internet Archive',
    description: 'Internet Archive is a non-profit library of millions of free texts, movies, software, music, websites, and more.',
    url: 'https://archive.org/',
    favicon: 'https://archive.org/offshoot_assets/favicon.ico',
    svgIcon: ''
  },
  {
    title: 'Tikolu',
    description: 'All emoji illustrations by Google.',
    url: 'https://tikolu.net/',
    favicon: 'https://tikolu.net/icon.png',
    svgIcon: ''
  },
  {
    title: 'Watabou',
    description: 'Creator of various web-based games and experiments.',
    url: 'https://watabou.github.io/',
    favicon: 'https://watabou.github.io/images/favicon.png',
    svgIcon: ''
  },
  {
    title: 'Ifixit',
    description: '通过高质量的维修零件和工具以及强大的社区专业知识，获得你所需要的指导。',
    url: 'https://zh.ifixit.com/',
    favicon: '/icons/ifixit.png',
    svgIcon: ''
  },
  {
    title: 'Anitabi',
    description: '动画圣地巡礼地图',
    url: 'https://www.anitabi.cn/',
    favicon: 'https://www.anitabi.cn/favicon.ico',
    svgIcon: ''
  },
  {
    title: 'Geovis Earth',
    description: '星图地球',
    url: 'https://online.geovisearth.com/',
    favicon: 'https://online.geovisearth.com/logo.png',
    svgIcon: ''
  },
  {
    title: 'Slow Roads',
    description: 'Article about slow travel and exploring lesser-known destinations.',
    url: 'https://slowroads.io/',
    favicon: 'https://slowroads.io/favicon.svg',
    svgIcon: ''
  },
  {
    title: 'Resn',
    description: 'An innovative digital agency creating stunning digital experiences.',
    url: 'https://resn.co.nz/',
    favicon: 'https://resn.co.nz/favicon.ico',
    svgIcon: ''
  },
  {
    title: 'A Soft Murmur',
    description: 'Ambient sounds to wash away distraction.',
    url: 'https://asoftmurmur.com/',
    favicon: 'https://asoftmurmur.com/assets/icons/favicon-32x32.png',
    svgIcon: ''
  },

]

// 辅助函数：获取网站的favicon URL
function getFaviconUrl(domain: string): string {
  // 方法1：直接访问标准路径
  return `https://${domain}/favicon.ico`
  
  // 备选方法（如果上面的不工作）：
  // return `https://${domain}/favicon.png`
  // return `https://${domain}/favicon.svg`
  // return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  // return `https://favicon.yandex.net/favicon/${domain}`
}

function openSite(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-8">Useful Sites</h1>
    
    <!-- Code Development Sites -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Code & Development</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          v-for="site in code_sites" 
          :key="site.title" 
          class="card-hover cursor-pointer transition-colors"
          @click="openSite(site.url)"
          tabindex="0"
          @keydown.enter="openSite(site.url)"
          @keydown.space.prevent="openSite(site.url)"
        >
          <CardHeader>
            <div class="flex items-center gap-3">
              <div v-if="site.favicon === 'custom-svg'" v-html="site.svgIcon" class="flex-shrink-0"></div>
              <img v-else :src="site.favicon" :alt="`${site.title} logo`" class="w-6 h-6 rounded-sm flex-shrink-0" />
              <CardTitle>{{ site.title }}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-gray-500 mb-4">{{ site.description }}</p>
          </CardContent>
        </Card>
      </div>
    </section>

    <Separator class="my-8" />

    <!-- Tool Sites -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Tools & Utilities</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          v-for="site in tool_sites" 
          :key="site.title" 
          class="card-hover cursor-pointer transition-colors"
          @click="openSite(site.url)"
          tabindex="0"
          @keydown.enter="openSite(site.url)"
          @keydown.space.prevent="openSite(site.url)"
        >
          <CardHeader>
            <div class="flex items-center gap-3">
              <div v-if="site.favicon === 'custom-svg'" v-html="site.svgIcon" class="flex-shrink-0"></div>
              <img v-else :src="site.favicon" :alt="`${site.title} logo`" class="w-6 h-6 rounded-sm flex-shrink-0" />
              <CardTitle>{{ site.title }}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-gray-500 mb-4">{{ site.description }}</p>
          </CardContent>
        </Card>
      </div>
    </section>

    <Separator class="my-8" />

    <!-- Media Sites -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Media & Entertainment</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          v-for="site in media_sites" 
          :key="site.title" 
          class="card-hover cursor-pointer transition-colors"
          @click="openSite(site.url)"
          tabindex="0"
          @keydown.enter="openSite(site.url)"
          @keydown.space.prevent="openSite(site.url)"
        >
          <CardHeader>
            <div class="flex items-center gap-3">
              <img :src="site.favicon" :alt="`${site.title} logo`" class="w-6 h-6 rounded-sm" />
              <CardTitle>{{ site.title }}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-gray-500 mb-4">{{ site.description }}</p>
          </CardContent>
        </Card>
      </div>
    </section>

    <Separator class="my-8" />

    <!-- Resource Sites -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Resources & Assets</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          v-for="site in resource_sites" 
          :key="site.title" 
          class="card-hover cursor-pointer transition-colors"
          @click="openSite(site.url)"
          tabindex="0"
          @keydown.enter="openSite(site.url)"
          @keydown.space.prevent="openSite(site.url)"
        >
          <CardHeader>
            <div class="flex items-center gap-3">
              <img :src="site.favicon" :alt="`${site.title} logo`" class="w-6 h-6 rounded-sm" />
              <CardTitle>{{ site.title }}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-gray-500 mb-4">{{ site.description }}</p>
          </CardContent>
        </Card>
      </div>
    </section>

    <Separator class="my-8" />

    <!-- Other Sites -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Other & Miscellaneous</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          v-for="site in other_sites" 
          :key="site.title" 
          class="card-hover cursor-pointer transition-colors"
          @click="openSite(site.url)"
          tabindex="0"
          @keydown.enter="openSite(site.url)"
          @keydown.space.prevent="openSite(site.url)"
        >
          <CardHeader>
            <div class="flex items-center gap-3">
              <img :src="site.favicon" :alt="`${site.title} logo`" class="w-6 h-6 rounded-sm" />
              <CardTitle>{{ site.title }}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-gray-500 mb-4">{{ site.description }}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  </div>
</template>

<style scoped>
.card-hover {
  transition-property: transform, box-shadow;
  transition-duration: 230ms;
  transition-timing-function: ease-in-out;
}
.card-hover:hover {
  transform: translateY(-0.2rem); 
  box-shadow: 0 10px 30px rgba(59,130,246,0.18); 
}
/* 可选：键盘可访问时的 focus 样式 */
.card-hover:focus-visible {
  outline: none;
  box-shadow: 0 6px 18px rgba(59,130,246,0.14), 0 0 0 4px rgba(59,130,246,0.08);
}
</style>