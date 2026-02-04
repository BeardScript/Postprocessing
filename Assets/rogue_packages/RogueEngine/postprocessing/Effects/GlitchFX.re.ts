import { BlendFunction, EffectPass, GlitchEffect, GlitchMode } from 'postprocessing';
import * as RE from 'rogue-engine';
import BaseFX from '../BaseFX.re';

@RE.registerComponent
export default class GlitchFX extends BaseFX {
  effect: GlitchEffect;

  protected _mode: GlitchMode = 1;
  @RE.props.select()
  get mode() {
    return this._mode;
  }

  set mode(value: number) {
    value = Number(value);
    this._mode = value;
    this.effect && (this.effect.mode = value);
  }

  modeOptions = Object.keys(GlitchMode);

  protected _minDelay = 1.5;
  @RE.props.num(0, 2)
  get minDelay() {return this._minDelay}
  set minDelay(v: number) {
    this._minDelay = v;
    this.effect && (this.effect.minDelay = v);
  }

  protected _maxDelay = 3.5;
  @RE.props.num(2, 4)
  get maxDelat() {return this._maxDelay}
  set maxDelat(v: number) {
    this._maxDelay = v;
    this.effect && (this.effect.maxDelay = v);
  }

  protected _minDuration = 0.6;
  @RE.props.num(0, 0.6)
  get minDuration() {return this._minDuration}
  set minDuration(v: number) {
    this._minDuration = v;
    this.effect && (this.effect.minDuration = v);
  }

  protected _maxDuration = 1;
  @RE.props.num(0.6, 1.8)
  get maxDuration() {return this._maxDuration}
  set maxDuration(v: number) {
    this._maxDuration = v;
    this.effect && (this.effect.maxDuration = v);
  }

  protected _minStrength = 0.3;
  @RE.props.num(0, 1)
  get minStrength() {return this._maxDuration}
  set minStrength(v: number) {
    this._maxDuration = v;
    this.effect && (this.effect.minStrength = v);
  }


  protected _maxStrength = 1;
  @RE.props.num(0, 1)
  get maxStrength() {return this._maxDuration}
  set maxStrength(v: number) {
    this._maxDuration = v;
    this.effect && (this.effect.maxStrength = v);
  }

  protected _ratio = 0.85;
  @RE.props.num(0, 1)
  get ratio() {return this._maxDuration}
  set ratio(v: number) {
    this._maxDuration = v;
    this.effect && (this.effect.ratio = v);
  }

  protected _columns = 0.05;
  @RE.props.num(0, 0.5)
  get columns() {return this._columns}
  set columns(v: number) {
    this._columns = v;
    const cols = this.effect?.uniforms?.get("columns");
    this.effect && cols && (cols.value = v);
  }

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

    this.effect = new GlitchEffect({
      blendFunction: this._blendMode,
    });

    this.effect.minDelay = this._minDelay;
    this.effect.maxDelay = this._maxDelay;
    this.effect.minDuration = this._minDuration;
    this.effect.maxDuration = this._maxDuration;
    this.effect.minStrength = this._minStrength;
    this.effect.maxStrength = this._maxStrength;
    this.effect.ratio = this._ratio;
    const cols = this.effect.uniforms?.get("columns");
    cols && (cols.value = this._columns);

    this.effectPass = new EffectPass(RE.Runtime.camera, this.effect);
    this.effectComposer.effectComposer.addPass(this.effectPass);
  }
}
