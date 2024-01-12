// COLORS
export const colors = {
  white: "#FFF",
  white_disabled: "#FBFCFF",
  yellow: "#FFD43E",
  yellow_disabled: "#FBDE78",
  brown: "#2A2900",
  brown_disabled: "#66664D",
  gray_disabled: "#C9C9C9",
  dark_gray_disabled: "#858484",
  //
  gem_blue: "#008C88",
  gem_pink: "#FC4FA2",
  gem_purple: "#9C46A5",
  bg_light: "#F1F5FF",
  green: "#018552",
};

// TEXT PROPERTIES (only did for texts that made sense doing for)
export const texts = {
  logoStyle: {
    fontSize: 9,
    fontFamily: "RetroGaming",
    lineWidth: 2,
    fillColor: colors.white,
    strokeColor: colors.green,
    shadowColor: colors.green,
    shadowOffsetY: 0.4,
    applyStyle: function (ctx, scaleFactor) {
      ctx.font = `${this.fontSize * scaleFactor}px ${this.fontFamily}`;
      ctx.lineWidth = this.lineWidth * scaleFactor;
      ctx.fillStyle = this.fillColor;
      ctx.strokeStyle = this.strokeColor;
      ctx.shadowColor = this.shadowColor;
      ctx.shadowOffsetY = this.shadowOffsetY * scaleFactor;
    },
  },
  logoSplashStyle: {
    fontSize: 16,
    fontFamily: "RetroGaming",
    lineWidth: 3.2,
    fillColor: colors.white,
    strokeColor: colors.green,
    shadowColor: colors.green,
    shadowOffsetY: 1,
    applyStyle: function (ctx, scaleFactor) {
      ctx.font = `${this.fontSize * scaleFactor}px ${this.fontFamily}`;
      ctx.lineWidth = this.lineWidth * scaleFactor;
      ctx.fillStyle = this.fillColor;
      ctx.strokeStyle = this.strokeColor;
      ctx.shadowColor = this.shadowColor;
      ctx.shadowOffsetY = this.shadowOffsetY * scaleFactor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
    },
  },
  menuOptionStyle: {
    defaultColor: colors.gray_disabled,
    selectedColor: colors.yellow,
    defaultStrokeColor: colors.dark_gray_disabled,
    selectedStrokeColor: colors.brown,
    shadowOffsetY: 4,
    lineWidth: 2,
    fontSize: 10,
    fontFamily: "RetroGaming",
    applyStyle: function (ctx, scaleFactor, isSelected) {
      ctx.font = `${this.fontSize * scaleFactor}px ${this.fontFamily}`;
      ctx.lineWidth = this.lineWidth * scaleFactor;
      ctx.fillStyle = isSelected ? this.selectedColor : this.defaultColor;
      ctx.strokeStyle = isSelected
        ? this.selectedStrokeColor
        : this.defaultStrokeColor;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowOffsetY = this.shadowOffsetY;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
    },
  },
  gemsStyle: {
    fontSize: 8,
    fontFamily: "RetroGaming",
    lineWidth: 1.5,
    shadowOffsetY: 1.5,
    applyStyle: function (ctx, scaleFactor) {
      ctx.font = `${this.fontSize * scaleFactor}px ${this.fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = this.lineWidth * scaleFactor;
      ctx.shadowOffsetY = this.shadowOffsetY * scaleFactor;
    },
  },
  highlightStyle: {
    fontSize: 12,
    fontFamily: "RetroGaming",
    lineWidth: 3,
    fillColor: colors.white,
    strokeColor: colors.brown,
    shadowColor: colors.brown,
    shadowOffsetY: 3,
    applyStyle: function (ctx, scaleFactor) {
      ctx.font = `${this.fontSize * scaleFactor}px ${this.fontFamily}`;
      ctx.lineWidth = this.lineWidth * scaleFactor;
      ctx.fillStyle = this.fillColor;
      ctx.strokeStyle = this.strokeColor;
      ctx.shadowColor = this.shadowColor;
      ctx.shadowOffsetY = this.shadowOffsetY * scaleFactor;
    },
  },
  detailTextStyle: {
    fontSize: 8,
    fontFamily: "RetroGaming",
    lineWidth: 2,
    fillColor: colors.yellow,
    strokeColor: colors.brown,
    applyStyle: function (ctx, scaleFactor) {
      ctx.font = `${this.fontSize * scaleFactor}px ${this.fontFamily}`;
      ctx.lineWidth = this.lineWidth * scaleFactor;
      ctx.fillStyle = this.fillColor;
      ctx.strokeStyle = this.strokeColor;
    },
  },
};
