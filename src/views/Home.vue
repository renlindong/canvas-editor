<template>
  <div class="home">
    <div class="canvas-container">
      <div class="render-container">
        <canvas-render v-for="(layer, index) in layers" :key="index" :layer="layer"></canvas-render>
      </div>
    </div>
    <input type="file" @change="upload"/>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState, mapActions } from "vuex";

import CanvasEditor from "@/components/CanvasEditor";
import CanvasRender from "@/components/CanvasRender";

export default {
  name: "Home",
  components: {
    CanvasEditor,
    CanvasRender
  },
  data() {
    return {
      psd: null
    };
  },
  computed: {
    ...mapState("psd", ["layers"])
  },
  methods: {
    ...mapActions("psd", ["readDataFromPsd"]),
    async upload(event) {
      const file = event.target.files[0];
      const url = window.URL.createObjectURL(file);
      const psd = await PSD.fromURL(url);
      this.readDataFromPsd(psd);
      window.psd = psd;
      this.psd = psd;
    }
  }
};
</script>
<style scoped>
.canvas-container {
  background: #fff;
  width: 600px;
  height: 1040px;
  margin: 20px auto;
  position: relative;
}
</style>
