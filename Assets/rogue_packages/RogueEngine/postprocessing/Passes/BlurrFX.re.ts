import * as RE from 'rogue-engine';
import { KawaseBlurPass } from 'postprocessing';
import FXComposer from '../FXComposer.re';

@RE.registerComponent
export default class BlurrFX extends RE.Component {
  pass: KawaseBlurPass;

  @FXComposer.require()
  effectComposer: FXComposer;

  protected _scale = 1;
  protected _resolution = 2;
  protected _kernelSize = 2;

  @RE.props.num()
  get scale() {
    return this._scale;
  }

  set scale(value: number) {
    this._scale = value;
    this.pass && (this.pass.scale = value);
  }

  @RE.props.select()
  get resolution() {
    return this._resolution;
  }

  set resolution(value: number) {
    value = Number(value);
    const res = Number(this.resolutionOptions[value])
    this._resolution = value;
    this.pass && (this.pass.resolution.height = res);
  }

  resolutionOptions = ["240", "360", "480", "720", "1080"];

  @RE.props.select()
  get kernelSize() {
    return this._kernelSize;
  }

  set kernelSize(value: number) {
    value = Number(value);
    this._kernelSize = value;
    this.pass && (this.pass.kernelSize = value);
  }

  kernelSizeOptions = [
    "VERY_SMALL",
    "SMALL",
    "MEDIUM",
    "LARGE",
    "VERY_LARGE",
    "HUGE",
  ];

  start() {
    if (!this.effectComposer) return;

    this.pass = new KawaseBlurPass();
    this.pass.scale = this.scale;
    this.pass.resolution.height = Number(this.resolutionOptions[this.resolution]);
    this.pass.kernelSize = this.kernelSize;

    this.effectComposer.effectComposer.addPass(this.pass);
  }

  update() {
    if (RE.Runtime.camera !== this.pass.mainCamera) {
      this.pass.mainCamera = RE.Runtime.camera;
    }
  }

  clear() {
    this.effectComposer.effectComposer.removePass(this.pass);
    this.pass.dispose();
  }

  onBeforeRemoved() {
    this.clear();
  }

  onDisabled() {
    this.clear();
  }
}
