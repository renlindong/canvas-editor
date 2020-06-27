const state = {
  layers: []
};

const actions = {
  readDataFromPsd({ commit }, psd) {
    psd.tree().descendants().filter(layer => layer._children.length === 0).map(layer => {
      const { top, left, width, height } = layer;
      const layerData = {
        x: left,
        y: top,
        width,
        height,
        textData: createTextData(layer)
      }
      commit("updateLayer", layerData);
    });
  }
};

const mutations = {
  updateLayer(state, data) {
    state.layers.push(data);
  }
}

const createTextData = (layer) => {
  return {
    ...getBaseTextData(layer),
    artTextOption: getArtTextData(layer)
  }  
}

const getBaseTextData = (layer) => {
  const jsonText = layer.export().text;
  const { font } = jsonText;
  return {
    value: jsonText.value,
    align: font.alignment[0],
    color: convertArrToRGBA(font.colors[0]),
    fontSize: font.sizes[0],
    fontFamily: font.name
  }
};

const getArtTextData = (layer) => {
  const art = {}
  const effectData = layer.get("objectEffects") ? layer.get("objectEffects").data : null;
  if (effectData) {
    // GrFl 线性渐变
    if (effectData.GrFl.enab) {
      art.gradient = getTextGradientData(effectData.GrFl);
    }
    // FrFX 描边
    if (effectData.FrFX.enab) {
      art.stroke = getTextStrokeData(effectData.FrFX);
    }
    // DrSh 投影
    if (effectData.DrSh.enab) {
      art.shadow = getTextShadowData(effectData.DrSh);
    }
  }
  return art;
}

const getTextGradientData = grfl => {
  return {
    enabled: true,
    opacity: grfl.Opct.value / 100,
    angle: grfl.Angl.value, // 90度向上、0度向右
    reverse: grfl.Rvrs,
    scale: grfl["Scl "].value / 100, // 缩放，不知道有什么用
    colors: grfl.Grad.Clrs.map(color => {
      return {
        location: color.Lctn / 4096,
        midpoint: color.Mdpn,
        color: `rgb(${Math.floor(color["Clr "]["Rd  "])}, ${Math.floor(color["Clr "]["Grn "])}, ${Math.floor(color["Clr "]["Bl  "])})`
      }
    })
  }
}

const getTextStrokeData = frfx => {
  return {
    enabled: true,
    opacity: frfx.Opct.value / 100,
    size: frfx["Sz  "].value,
    color: `rgba(${Math.floor(frfx["Clr "]["Rd  "])}, ${Math.floor(frfx["Clr "]["Grn "])}, ${Math.floor(frfx["Clr "]["Bl  "])}, ${frfx.Opct.value / 100})`
  }
}

const getTextShadowData = drsh => {
  return {
    enabled: true,
    opacity: drsh.Opct.value / 100,
    color: {
      r: drsh["Clr "]["Rd  "],
      g: drsh["Clr "]["Grn "],
      b: drsh["Clr "]["Bl  "]
    },
    blur: drsh.blur.value, // 模糊大小
    choke: drsh.Ckmt.value, // psd：扩展，psd.js：哑光。不知道有什么用
    offset: drsh.Dstn.value, // 距离
    rotate: drsh.lagl.value, // 光源角度
    uglg: drsh.uglg // 是否使用全局光，不知道有什么用
  }
}

const convertArrToRGBA = arr => `rgba(${arr[0]}, ${arr[1]}, ${arr[2]}, ${arr[3] / 255})`;

export default {
  namespaced: true,
  state,
  actions,
  mutations
}