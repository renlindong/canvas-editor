<template>
  <div class="render-item" :style="canvasItemStyle">
    <!-- 图层canvas -->
    <div>
      <canvas ref="canvas" :style="canvasStyle" class="render-item__canvas"></canvas>
      <div class="render-item__svg"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    layer: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      canvasItemStyle: {
        position: "absolute",
        width: 0,
        height: 0,
        top: 0,
        left: 0
      },
      canvasStyle: {
        position: "absolute",
        top: 0,
        left: 0,
        width: 0,
        height: 0
      },
      ctx: null
    };
  },
  computed: {
    canvas() {
      return this.$refs.canvas;
    }
  },
  watch: {
    "layer.elem.value"(val) {
      this.ctx.clearRect(0, 0, this.layer.elem.width, this.layer.elem.height);
      this.renderCanvas();
    },
    "layer.elem.height"(val) {
      this.setCanvasSize()
      // this.ctx.clearRect(0, 0, this.layer.elem.width, this.layer.elem.height);
      this.renderCanvas();
    }
  },
  methods: {
    setCanvasSize() {
      const { x, y, width, height } = this.layer;
      this.canvasItemStyle = {
        ...this.canvasItemStyle,
        width: `${width}px`,
        height: `${height}px`,
        top: `${y}px`,
        left: `${x}px`
      };
      this.canvas.width = width;
      this.canvas.height = height;
      this.canvasStyle = {
        ...this.canvasStyle,
        width: `${width}px`,
        height: `${height}px`
      };
    },
    renderCanvas() {
      const ctx = this.canvas.getContext("2d");
      this.ctx = ctx;

      // 字体、字号
      ctx.font = `${this.layer.textData.fontSize}px ${this.layer.textData.fontFamily}`;
      ctx.textBaseline = "top";
      // 字体颜色
      ctx.fillStyle = this.layer.textData.color;

      if (this.layer.textData.artTextOption.gradient) {
        // 线性渐变
        const { width, height } = this.canvas;
        const { angle, colors } = this.layer.textData.artTextOption.gradient;
        // 渲染位置计算
        const gradient = ctx.createLinearGradient(
          width / 2,
          height,
          width / 2,
          0
        );
        colors.forEach(item => {
          gradient.addColorStop(item.location, item.color);
        });
        ctx.fillStyle = gradient;
      }

      if (this.layer.textData.artTextOption.shadow) {
        // 应该放在canvas外吗？drop-shadow？
        /* const { rotate, color, blur, offset, opacity } = this.layer.textData.artTextOption.shadow;
        const { r, g, b } = color;
        const x = Math.cos((180 - rotate) / 180 * Math.PI) * offset;
        const y = Math.sin((180 - rotate) / 180 * Math.PI) * offset;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.shadowOffsetX = x;
        ctx.shadowOffsetY = y;
        ctx.shadowBlur = blur; */
      }

      if (this.layer.textData.artTextOption.stroke) {
        const { opacity, size, color } = this.layer.textData.artTextOption.stroke;
        ctx.strokeStyle = color;
      }
      this.wrapText(
        this.layer.textData.value,
        0,
        0,
        this.canvas.width,
        this.layer.textData.lineHeight
      );
    },
    wrapText(text, x, y, maxWidth, lineHeight) {
      // 文字对齐方式
      if (
        typeof text != "string" ||
        typeof x != "number" ||
        typeof y != "number"
      ) {
        return;
      }

      if (typeof maxWidth == "undefined") {
        maxWidth = (this.canvas && this.canvas.width) || 300;
      }
      if (typeof lineHeight == "undefined") {
        lineHeight =
          (this.canvas && parseInt(window.getComputedStyle(this.canvas).lineHeight)) ||
          parseInt(window.getComputedStyle(document.body).lineHeight);
      }

      const { opacity, size, color } = this.layer.textData.artTextOption.stroke;
      this.ctx.lineWidth = 1 + size;
      // 字符分隔为数组
      var arrText = text.split("");
      var line = "";
      for (var n = 0; n < arrText.length; n++) {
        var testLine = line + arrText[n];
        var metrics = this.ctx.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          this.ctx.strokeText(line, x, y);
          this.ctx.fillText(line, x, y);
          line = arrText[n];
          y += lineHeight;
          if (y >= this.canvas.height) {
            y += lineHeight;
            this.layer.elem.height = y;
            return;
          }
        } else {
          line = testLine;
        }
      }
      this.ctx.strokeStyle = color;
      this.ctx.strokeText(line, x, y);

      this.ctx.fillText(line, x, y);
    }
  },
  mounted() {
    this.setCanvasSize();
    this.renderCanvas();
    window._this = this;
  }
};
</script>

<style scoped>
</style>