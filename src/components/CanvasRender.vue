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
      default() {
        return {
          type: "text",
          elem: {
            value: "祥祥真棒",
            opacity: 1,
            fontFamily: "serif",
            fontSize: 30,
            align: "center",
            lineHeight: 30,
            width: 300,
            height: 200,
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
        };
      }
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
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.renderCanvas();
    }
  },
  methods: {
    setCanvasSize() {
      const { top, left, width, height } = this.layer.elem;
      this.canvasItemStyle = {
        ...this.canvasItemStyle,
        width: `${width}px`,
        height: `${height}px`,
        top: `${top}px`,
        left: `${left}px`
      };
      this.canvasStyle = {
        ...this.canvasStyle,
        width: `${width}px`,
        height: `${height}px`
      };
    },
    renderCanvas() {
      const ctx = this.canvas.getContext("2d");
      ctx.font = `${this.layer.elem.fontSize}px ${this.layer.elem.fontFamily}`;
      ctx.textBaseline = "top";
      ctx.fillStyle = this.layer.elem.color;

      if (this.layer.elem.artTextOption.gradient) {
        // TODO：角度换坐标
        const gradient = ctx.createLinearGradient(
          0,
          0,
          this.canvas.width,
          this.canvas.height
        );
        const gradientConfig = this.layer.elem.artTextOption.gradient;
        Object.keys(gradientConfig.colors)
          .sort((o1, o2) => {
            o1 - o2;
          })
          .forEach(key => {
            gradient.addColorStop(key / 100, gradientConfig.colors[key]);
          });
        ctx.fillStyle = gradient;
      }
      if (this.layer.elem.shadow) {
        const { rotate, color, blur, offset, opacity } = this.layer.elem.shadow;
        const { r, g, b } = color;
        const x = Math.cos((180 - rotate) / 180 * Math.PI) * offset;
        const y = Math.sin((180 - rotate) / 180 * Math.PI) * offset;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.shadowOffsetX = x;
        ctx.shadowOffsetY = y;
        ctx.shadowBlur = blur;
      }
      ctx.wrapText(
        this.layer.elem.value,
        0,
        0,
        this.canvas.width,
        this.layer.elem.lineHeight,
        this
      );
      this.ctx = ctx;
    },
    wrapText(x, y, maxWidth, lineHeight) {
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
          (canvas && parseInt(window.getComputedStyle(canvas).lineHeight)) ||
          parseInt(window.getComputedStyle(document.body).lineHeight);
      }
      // 字符分隔为数组
      var arrText = text.split("");
      var line = "";
      for (var n = 0; n < arrText.length; n++) {
        var testLine = line + arrText[n];
        var metrics = this.ctx.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          this.ctx.fillText(line, x, y);
          line = arrText[n];
          y += lineHeight;
          if (y > canvas.height) {
            this.canvas.height = y;
            this.canvas.style.height = `${y}px`;
            this.ctx.renderCanvas();
            return;
          }
        } else {
          line = testLine;
        }
      }
      this.ctx.fillText(line, x, y);
    }
  },
  mounted() {
    this.setCanvasSize();
    this.renderCanvas();
  }
};
</script>

<style scoped>
</style>