<template>
  <div
    class="text-editor"
    :style="textEditorStyle"
    @dblclick.stop="handleDoubleClick"
    @click="handleConfirmCursorPosition">
    <!-- 文字编辑器 -->
    <div v-if="mask" class="text-editor__mask"></div>
    <div v-if="isEditing" class="text-editor__cursor"></div>
    <div class="text-editor__textarea">
      <textarea ref="textarea" @input="handleInput" @blur="handleTextBlur"></textarea>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentCanvas: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      textEditorStyle: {
        top: 0,
        left: 0,
        width: 0,
        height: 0
      },
      mask: false,
      isEditing: false,
      baseValue: ""
    }
  },
  watch: {
    "currentCanvas.layer.elem.height"(val) {
      this.textEditorStyle.height = `${val}px`;
    }
  },
  mounted() {
    this.initEditStyle();
  },
  methods: {
    initEditStyle() {
      this.$refs.textarea.value = "";
      const { canvasItemStyle } = this.currentCanvas;
      this.textEditorStyle = {
        ...this.textEditorStyle,
        ...canvasItemStyle
      },
      this.mask = false;
      this.isEditing = false;
    },
    handleInput(event) {
      if (this.mask) {
        this.baseValue = "";
        this.currentCanvas.layer.elem.value = "";
      } else if (this.baseValue) {
        event.target.value = this.baseValue + event.target.value;
        this.baseValue = "";
      }
      this.mask = false;
      this.isEditing = true;
      this.currentCanvas.layer.elem.value = event.target.value;
    },
    handleDoubleClick() {
      this.mask = true;
      this.$refs.textarea.focus();
      this.baseValue = this.currentCanvas.layer.elem.value;
    },
    handleTextBlur(event) {
      event.target.value = "";
    },
    handleConfirmCursorPosition(event) {
      if (!this.mask && !this.isEditing) return;
      const { offsetX, offsetY } = event;
      const lineNumer = Math.floor(offsetY / this.currentCanvas.layer.elem.lineHeight);
      
    }
  }
}
</script>

<style scoped>
.text-editor {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 100px;
  border: 1px solid #ccc;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0);
}

.text-editor__textarea {
  position: absolute;
  top: 100%;
  left: 100%;
  /* opacity: 0; */
  background-color: rgba(255, 255, 255, 0);
}

.text-editor__mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: #4d4db51a;
}

.text-editor__cursor {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 36px;
  background-color: #ccc;
}
</style>