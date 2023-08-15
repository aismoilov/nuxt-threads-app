<template>
  <MainLayout>
    <div id="IndexPage" class="w-full overflow-auto">
      <div class="mx-auto max-w-[500px] overflow-hidden">
        <div v-if="posts.length && !isLoading" id="Posts" class="px-5 max-w-[600px] mx-auto">
          <div
            v-for="post in posts"
            :key="post"
          >
            <Post :post="post" />
          </div>
        </div>
        <div v-else>
          <client-only>
            <div v-if="isLoading" class="mt-20 w-full flex items-center justify-center mx-auto">
              <div class="text-white mx-auto flex flex-col items-center hustify-center">
                <Icon name="eos-icons:bubble-loading" size="50" color="#fff" />
                <div class="w-full mt-1">Loading...</div>
              </div>
            </div>
            <div v-if="!isLoading" class="mt-20 w-full flex items-center justify-center mx-auto">
              <div class="text-white mx-auto flex flex-col items-center hustify-center">
                <Icon name="tabler:mood-empty" size="50" color="#fff" />
                <div class="w-full mt-1">Make the first post!</div>
              </div>
            </div>
          </client-only>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue'
import Post from '../components/Post.vue'

import { usePostStore } from '~/stores/post'
const postStore = usePostStore()
const user = useSupabaseUser()

const posts = computed(() => postStore.posts)
let isLoading = ref(false)

watchEffect(() => {
  if(!user.value) {
    return navigateTo('/auth')
  }
})

onBeforeMount(async () => {
  try {
    isLoading.value = true
    await postStore.getAllPosts()
    isLoading.value = false
  } catch (error) {
    console.log(error)
  }
})

</script>