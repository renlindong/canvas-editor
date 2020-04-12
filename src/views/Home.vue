<template>
  <div class="home">
    <div class="canvas-container" @click="handleContainerClick">
      <canvas-editor v-if="showEditor" :current-canvas="currentCanvas"></canvas-editor>
      <div class="render-container">
        <canvas-render ref="canvas1" @click.native.stop="handleShowEditor" data-canvas-id="canvas1" :layer="layer"></canvas-render>
      </div>
    </div>
    <!-- <div class="edit-container" @click="handleClick">
      <div
        :class="['canvas-container', canvasId === 1 ? 'canvas-container--select' : '']"
        @dblclick="handleDoubleClick(1)"
        @click.stop="handleSelectPosition">
        <div class="cursor">|</div>
        <div v-if="mask" class="mask"></div>
        <canvas id="canvas"></canvas>
      </div>
      <textarea
        id="edit-input"
        type="text"
        @input="handleInput"
        @keydown.up="handleKeyUp"
        @keydown.down="handleKeyDown"
        @keydown.left="handleKeyLeft"
        @keydown.right="handleKeyRight">
    </textarea>-->
  </div>
</template>

<script>
// @ is an alias to /src
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
      layer: {
        type: "text",
        elem: {
          value: "祥祥真棒",
          opacity: 1,
          fontFamily: "serif",
          fontSize: 30,
          align: "center",
          lineHeight: 40,
          width: 300,
          height: 40,
          top: 20,
          left: 20,
          shadow: {
            // 文字阴影
            rotate: 142,
            color: {
              r: 61,
              g: 0,
              b: 11
            },
            blur: 0,
            offset: 3,
            opacity: 0.35
          },
          color: "red",
          isArtText: true,
          artTextOption: {
            gradient: {
              rotate: -47,
              colors: {
                "0": "#B9F1FF",
                "100": "#405FFF"
              }
            }
          }
        }
      },
      showEditor: false,
      currentCanvas: ""
    };
  },
  methods: {
    handleDoubleClick(val) {
      this.canvasId = val;
      this.mask = true;
      const input = document.querySelector("#edit-input");
      input.focus();
    },
    handleClick() {
      this.canvasId = null;
      const input = document.querySelector("#edit-input");
      input.value = "";
    },
    handleSelectPosition(event) {
      if (!this.mask) return;
      // 计算光标
      const { clientX, clientY } = event;
      const canvasRect = this.canvas.getBoundingClientRect();
      const { x, y } = canvasRect;
      const positionLeft = clientX - x - 2;
      const positionTop = clientY - y - 2;
      this.mask = false;
      const input = document.querySelector("#edit-input");
      input.value = this.layer.elem.value;
      input.focus();
    },
    handleShowEditor(event, vm) {
      // 处理编辑器的位置
      const { dataset } = event.currentTarget;
      this.showEditor = true;
      this.currentCanvas = this.$refs[dataset.canvasId];
    },
    handleContainerClick() {
      // this.showEditor = false;
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
