<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Github, ArrowRight, CheckCircle2, Zap, Shield, Globe } from 'lucide-vue-next'

const isVisible = ref(false)

onMounted(() => {
  isVisible.value = true
})

const features = [
  {
    title: 'High Performance',
    description: 'Built with Go and Vue 3 for blazing fast speeds.',
    icon: Zap
  },
  {
    title: 'Secure by Design',
    description: 'Enterprise-grade security with role-based access control.',
    icon: Shield
  },
  {
    title: 'Global Scale',
    description: 'Deploy anywhere with Docker and cloud-native architecture.',
    icon: Globe
  }
]

const slides = [
  { 
    title: 'Useful Sites', 
    description: 'Curated collection of essential websites and resources.',
    image: '/landingpage/useful-site.png'  
  },
  { 
    title: 'Image Spider', 
    description: 'Automated fast image crawling tools.',
    image: '/landingpage/img-spider.png' 
  },
  { 
    title: 'User Account', 
    description: 'Manage your profile, settings, and account preferences.',
    image: '/landingpage/user-account.png'  
  },
  { 
    title: 'Site Documentation', 
    description: 'Comprehensive guides and API documentation.',
    image: '/landingpage/site-docs.png' 
  }
]

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  // Fallback to a placeholder or gradient background
  img.style.display = 'none'
  const parent = img.parentElement
  if (parent) {
    parent.innerHTML = `
      <div class="w-full h-full bg-gradient-to-br from-primary/5 to-primary/10 p-8 flex items-center justify-center">
        <div class="text-center">
          <h3 class="text-2xl font-bold text-primary mb-2">${img.alt}</h3>
          <p class="text-muted-foreground">Image not available</p>
        </div>
      </div>
    `
  }
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground overflow-hidden">
    <!-- Navigation -->
    <header class="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-sm">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2 font-bold text-xl">
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            L
          </div>
          Lythos
        </div>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Features</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li class="row-span-3">
                    <NavigationMenuLink as-child>
                      <a
                        class="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <div class="mb-2 mt-4 text-lg font-medium">
                          Lythos
                        </div>
                        <p class="text-sm leading-tight text-muted-foreground">
                          An integrated platform with powerful tools and resources.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink as-child>
                      <a href="#features" class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div class="text-sm font-medium leading-none">Tools Integration</div>
                        <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Seamlessly integrated tools for maximum productivity.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink as-child>
                      <a href="#security" class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div class="text-sm font-medium leading-none">Resource Hub</div>
                        <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          A vast collection of curated resources at your fingertips.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#docs" :class="navigationMenuTriggerStyle()">
                Documentation
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div class="flex items-center gap-4">
          <RouterLink to="/login">
            <Button>
              Login
              <ArrowRight class="w-4 h-4 ml-2" />
            </Button>
          </RouterLink>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <main class="pt-32 pb-16 px-4">
      <div class="container mx-auto text-center max-w-4xl">
        <div 
          class="space-y-6 transition-all duration-1000 transform"
          :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'"
        >
          <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-4">
            v1.8.0 is now available
          </div>
          
          <h1 class="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            A Platform for <br/>
            Tools & Resources
          </h1>
          
          <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
            Lythos brings together powerful tools and essential resources in one unified platform.
            Open source, community-driven, and built for efficiency.
          </p>

          <div class="flex items-center justify-center gap-4 pt-8">
            <RouterLink to="/login">
              <Button size="lg" class="h-12 px-8 text-lg">
                Get Started
                <ArrowRight class="ml-2 h-5 w-5" />
              </Button>
            </RouterLink>
            <a href="https://github.com/fordeslorn/vue3-system" target="_blank">
              <Button variant="outline" size="lg" class="h-12 px-8 text-lg">
                <Github class="mr-2 h-5 w-5" />
                Star on GitHub
              </Button>
            </a>
          </div>
        </div>

        <!-- Feature Grid -->
        <div 
          class="grid md:grid-cols-3 gap-8 mt-24 transition-all duration-1000 delay-300 transform"
          :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'"
        >
          <Card v-for="(feature, index) in features" :key="index" 
            class="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-muted bg-card/50 backdrop-blur-sm"
          >
            <CardHeader>
              <div class="w-12 h-12 mb-4 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <component :is="feature.icon" class="w-6 h-6 text-primary" />
              </div>
              <CardTitle class="text-xl">{{ feature.title }}</CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground">{{ feature.description }}</p>
            </CardContent>
          </Card>
        </div>

        <!-- Preview Image (Carousel) -->
        <div 
          class="mt-24 transition-all duration-1000 delay-500 transform"
          :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'"
        >
          <Carousel class="w-full max-w-4xl mx-auto" :opts="{ align: 'start', loop: true }">
            <CarouselContent>
              <CarouselItem v-for="(slide, index) in slides" :key="index">
                <div class="p-1">
                  <Card class="overflow-hidden border-muted">
                    <CardContent class="flex aspect-video items-center justify-center p-0 bg-muted/50 relative">
                      <img 
                        :src="slide.image" 
                        :alt="slide.title"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                      />
                      <!-- Overlay with title and description -->
                      <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div class="text-center text-white">
                          <h3 class="text-2xl font-bold mb-2">{{ slide.title }}</h3>
                          <p class="text-lg opacity-90">{{ slide.description }}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t py-6 bg-muted/30">
      <div class="container mx-auto px-4 text-center text-muted-foreground">
        <div class="flex items-center justify-center gap-2 mb-4">
          <div class="w-6 h-6 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs font-bold">
            L
          </div>
          <span class="font-semibold text-foreground">Lythos</span>
        </div>
        <p class="text-sm">
          © 2025 Lythos. Open source under AGPL-3.0 License.
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.bg-grid-pattern {
  background-image: radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 24px 24px;
}
</style>