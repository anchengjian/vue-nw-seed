<template>
  <section class="body-container">
    <section class="update-container" v-if="!info && !jsonIsLoading">
      <h2>The programmer peter is crazy overtime</h2>
      <p>No update</p>
    </section>
    <section class="update-container" v-if="info">
      <h2>New update <small>version: {{info.version}}</small></h2>
      <button type="button" class="update-btn" v-if="downloadPercentage < 100" :disabled="downloadPercentage !== -1" @click="showFileDialog">update</button>
      <input type="file" class="hidden" ref="fileInput" :nwsaveas="saveAsName" @change="startDownload">
    </section>
    <p v-if="downloadPercentage >=0 && downloadPercentage < 100"> {{downloadPercentage}} %</p>
    <div v-if="downloadPercentage >= 100">
      <h3>Download complete</h3>
      <p>Please open the executable file and cover the installation!</p>
    </div>
  </section>
</template>

<script>
  import { getUpdateJson, parseName, downloadHandle } from '@/utils/update'
  import { Shell } from 'nw.gui'

  export default {
    name: 'update',
    data () {
      return {
        info: null,
        jsonIsLoading: true,
        downloadPercentage: -1
      }
    },
    computed: {
      saveAsName () {
        return parseName(this.info)
      }
    },
    methods: {
      showFileDialog (ev) {
        this.$refs.fileInput.click()
      },
      startDownload (ev) {
        const targetPath = ev.target.value

        // reset
        ev.target.value = ''
        if (!targetPath.trim()) return

        this.downloadPercentage = 0
        const file = downloadHandle(targetPath, this.info)

        file.on('end', filePath => {
          if (timer) clearInterval(timer)
          this.downloadPercentage = 100

          setTimeout(() => Shell.showItemInFolder(filePath), 100)
        })

        file.on('error', err => {
          if (timer) clearInterval(timer)
          this.downloadPercentage = -1
          console.error('update is error!', err)
        })

        // for progress bar, 5 minutes
        const timer = setInterval(() => {
          if (timer && this.downloadPercentage > 98) clearInterval(timer)
          this.downloadPercentage += 1
        }, 3000)
      }
    },
    created () {
      getUpdateJson().catch(err => { console.log(err) }).then(json => {
        this.jsonIsLoading = false
        this.info = json
      })
    }
  }
</script>
<style scoped>
  .hidden {
    display: none;
  }
  
  .update-btn {
    margin-bottom: 3em;
    padding: 8px 15px;
    outline: none;
    border: 1px solid #2196F3;
    background: transparent;
    cursor: pointer;
    opacity: .5;
    transition: opacity .5s;
  }
  
  .update-btn:hover {
    opacity: 1;
  }
  
  .download-progress {
    margin-bottom: 3em;
  }
</style>
