import { defineStore } from "pinia";
import { v4 as uuidv4 } from 'uuid'

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [],
  }),

  actions: {
    async getAllPosts() {
      let { data } = await useFetch('/api/get-all-posts')
      if (data.value) {
        this.posts = data.value
        return data.value
      }
      return null
    },
    async uploadPostFile(fileData) {
      const client = useSupabaseClient()
      const { data, error } = await client
        .storage
        .from('threads-clone-files')
        .upload(`${uuidv4()}.jpg`, fileData)

      return { data, error }
    },
    async createPost (options) {
      try {
        const { data } = await useFetch(`/api/create-post/`, {
          method: 'POST',
          body: {...options}
        })

        if (data.value) {
          this.posts.unshift(data.value)
          return data.value

        }

        return null
      } catch (error) {
        console.log(error)
        return null
      }
    },
    async deletePost (id, picture) {
      try {
        const client = useSupabaseClient()
        const { data, error } = await client
        .storage
        .from('threads-clone-files')
        .remove([picture])

        const deleted = await useFetch(`/api/delete-post/${id}`, { method: 'DELETE' })
        if (deleted) {
          const index = this.posts.findIndex((post) => post.id === id)
          if (index > -1) {
            this.posts.splice(index, 1)
          }
        }
        return true
      } catch(error) {
        console.log(error)
        return false
      }
    },
    async likePost({ postId, userId }) {
      try {
        const { data } = await useFetch(`/api/like-post`, {
          method: 'POST',
          body: { userId, postId }
        })

        const index = this.posts.findIndex((item) => item.id === postId)
        if (index > -1) {
          this.posts[index].likes.push(data.value)
          return true
        }

        return false
      } catch(error) {
        console.log(error)
        return false
      }  
    },
    async unlikePost({ id, postId, userId }) {
      try {
        await useFetch(`/api/unlike-post/${id}`, { method: 'DELETE' })

        const index = this.posts.findIndex((item) => item.id === postId)
        if (index > -1) {
          this.posts[index].likes = this.posts[index].likes
            .filter((item) => item.userId === userId)
        }

        return false
      } catch(error) {
        console.log(error)
        return false
      }
    },

  }
})