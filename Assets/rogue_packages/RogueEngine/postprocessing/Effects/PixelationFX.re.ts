import { EffectPass, PixelationEffect } from 'postprocessing';
import * as RE from 'rogue-engine';
import FXComposer from '../FXComposer.re';

@RE.registerComponent
export default class PixelationFX extends RE.Component {
  effect: PixelationEffect;
  effectPass: EffectPass;

  @FXComposer.require()
  effectComposer: FXComposer;

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
