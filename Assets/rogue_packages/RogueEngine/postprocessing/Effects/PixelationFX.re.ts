import { EffectPass, PixelationEffect } from 'postprocessing';
import * as RE from 'rogue-engine';
import BaseFX from '../BaseFX.re';

@RE.registerComponent
export default class PixelationFX extends BaseFX {
  effect: PixelationEffect;

  protected _granularity = 1.5;
  @RE.props.num(0, 50)
  get granularity() {return this._granularity}
  set granularity(v: number) {
    this._granularity = v;
    this.effect && (this.effect.granularity = v);
  }

  start() {
    if (!this.effectComposer) return;

    this.effect = new PixelationEffect(this._granularity);

    this.effectPass = new EffectPass(RE.Runtime.camera, this.effect);
    this.effectComposer.effectComposer.addPass(this.effectPass);
  }
}
