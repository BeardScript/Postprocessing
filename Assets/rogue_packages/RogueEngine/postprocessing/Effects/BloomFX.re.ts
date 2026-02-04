import * as RE from 'rogue-engine';
import { EffectPass, BloomEffect, BlendFunction, KernelSize, SelectiveBloomEffect } from 'postprocessing';
import FXComposer from '../FXComposer.re';

@RE.registerComponent
export default class BloomFX extends RE.Component {
  effect: BloomEffect;
  effectPass: EffectPass;

  @FXComposer.require()
  effectComposer: FXComposer;

  protected _intensity = 3;
  @RE.props.num(0, 10)
  get intensity() {return this._intensity}
  set intensity(v: number) {
    this._intensity = v;
    this.effect && (this.effect.intensity = v);
  }

  protected _radius = 0.85;
  @RE.props.num(0, 1)
  get radius() {return this._radius}
  set radius(v: number) {
    this._radius = v;
    this.effect && (this.effect.mipmapBlurPass.radius = v);
  }

  protected _filter = true;
  @RE.props.checkbox()
  get filter() {return this._filter}
  set filter(v: boolean) {
    this._filter = v;
    this.effect && (this.effect.luminancePass.enabled = v);
  }

  protected _threshold = 0.4;
  @RE.props.num(0, 1)
  get threshold() {return this._threshold}
  set threshold(v: number) {
    this._threshold = v;
    this.effect && (this.effect.luminanceMaterial.threshold = v);
  }

  protected _smoothing = 0.2;
  @RE.props.num(0, 1)
  get smoothing() {return this._smoothing}
  set smoothing(v: number) {
    this._smoothing = v;
    this.effect && (this.effect.luminanceMaterial.smoothing = v);
  }

  protected _dithering = false;
  @RE.props.checkbox()
  get dithering() {return this._dithering}
  set dithering(v: boolean) {
    this._dithering = v;
    this.effect && (this.effect.dithering = v);
  }

  protected _opacity = 1;
  @RE.props.num(0, 1)
  get opacity() {return this._opacity}
  set opacity(v: number) {
    this._opacity = v;
    this.effect && (this.effect.blendMode.setOpacity(v));
  }

  private _resolution = 2;
  @RE.props.select()
  get resolution() {
    return this._resolution;
  }

  set resolution(value: number) {
    value = Number(value);
    const res = Number(this.resolutionOptions[value])
    this._resolution = value;
    this.effect && (this.effect.resolution.height = res);
  }

  resolutionOptions = ["240", "360", "480", "720", "1080"];

  protected _kernelSize: KernelSize = 2;
  @RE.props.select()
  get kernelSize() {
    return this._kernelSize;
  }

  set kernelSize(value: number) {
    value = Number(value);
    this._kernelSize = value;
    this.effect && (this.effect.kernelSize = value);
  }

  kernelSizeOptions = [
    "VERY_SMALL",
    "SMALL",
    "MEDIUM",
    "LARGE",
    "VERY_LARGE",
    "HUGE",
  ];


  protected _blendMode: BlendFunction = 2;
  @RE.props.select()
  get blendMode() {
    return this._blendMode;
  }

  set blendMode(value: number) {
    value = Number(value);
    this._blendMode = value;
    this.effect && (this.effect.blendMode.blendFunction = value);
  }

  blendModeOptions = Object.keys(BlendFunction);

  start() {
    if (!this.effectComposer) return;

    this.effect = new BloomEffect({
      blendFunction: this._blendMode,
      luminanceThreshold: this._threshold,
			luminanceSmoothing: this._smoothing,
      radius: this._radius,
			height: this._resolution,
    });

    this.effect.kernelSize = this._kernelSize;
    this.effect.luminancePass.enabled = this._filter;
    this.effect.dithering = this._dithering;
    this.effect.blendMode.setOpacity(this._opacity);
    this.effect.intensity = this._intensity;

    this.effectPass = new EffectPass(RE.Runtime.camera, this.effect);
    this.effectComposer.effectComposer.addPass(this.effectPass);
  }

  clear() {
    this.effectComposer.effectComposer.removePass(this.effectPass);
    this.effectPass.dispose();
  }

  onBeforeRemoved() {
    this.clear();
  }

  onDisabled() {
    this.clear();
  }
}
