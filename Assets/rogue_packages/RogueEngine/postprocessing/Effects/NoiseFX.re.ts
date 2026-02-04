import * as RE from 'rogue-engine';
import { BlendFunction, EffectPass, NoiseEffect } from 'postprocessing';
import BaseFX from '../BaseFX.re';

@RE.registerComponent
export default class NoiseFX extends BaseFX {
  effect: NoiseEffect;

  protected _opacity = 0.1;
  @RE.props.num(0, 1)
  get opacity() {return this._opacity}
  set opacity(v: number) {
    this._opacity = v;
    this.effect && (this.effect.blendMode.setOpacity(v));
  }

  protected _blendMode: BlendFunction = 7;
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
    if (!this.effectComposer?.effectComposer) return;

    this.effect = new NoiseEffect({
      blendFunction: this._blendMode,
    });
    
    this.effect.blendMode.setOpacity(this._opacity);

    this.effectPass = new EffectPass(RE.Runtime.camera, this.effect);
    this.effectComposer.effectComposer.addPass(this.effectPass);
  }
}
