import * as RE from 'rogue-engine';
import FXComposer from '../FXComposer.re';
import { BlendFunction, DepthOfFieldEffect, EffectPass, KernelSize } from 'postprocessing';
import BaseFX from '../BaseFX.re';

@RE.registerComponent
export default class DepthOfFieldFX extends BaseFX {
  effect: DepthOfFieldEffect;

  protected _focusDistance = 3.1;
  @RE.props.num(0, 15)
  get focusDistance() {return this._focusDistance}
  set focusDistance(v: number) {
    this._focusDistance = v;
    this.effect && (this.effect.cocMaterial.focusDistance = v);
  }

  protected _focusRange = 2.2;
  @RE.props.num(0, 5)
  get focusRange() {return this._focusRange}
  set focusRange(v: number) {
    this._focusRange = v;
    this.effect && (this.effect.cocMaterial.focusRange = v);
  }

  protected _bokehScale = 2.2;
  @RE.props.num(0, 5)
  get bokehScale() {return this._bokehScale}
  set bokehScale(v: number) {
    this._bokehScale = v;
    this.effect && (this.effect.bokehScale = v);
  }

  protected _opacity = 1;
  @RE.props.num(0, 1)
  get opacity() {return this._opacity}
  set opacity(v: number) {
    this._opacity = v;
    this.effect && (this.effect.blendMode.setOpacity(v));
  }

  protected _resolution = 2;
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

  start() {
    if (!this.effectComposer) return;

    this.effect = new DepthOfFieldEffect(RE.Runtime.camera, {
      blendFunction: BlendFunction.SCREEN,
			focusDistance: this._focusDistance,
			focusRange: this._focusRange,
			bokehScale: this._bokehScale,
      height: this._resolution,
    });

    this.effect.blendMode.setOpacity(this._opacity);

    this.effectPass = new EffectPass(RE.Runtime.camera, this.effect);
    this.effectComposer.effectComposer.addPass(this.effectPass);
  }
}
