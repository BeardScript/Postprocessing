import { Effect, EffectPass } from 'postprocessing';
import * as RE from 'rogue-engine';
import * as THREE from 'three';
import FXComposer from './FXComposer.re';

@RE.registerComponent
export default class BaseFX extends RE.Component {
  effect: Effect;
  effectPass: EffectPass;

  @FXComposer.require()
  effectComposer: FXComposer;

  update() {
    if (RE.Runtime.camera !== this.effectPass.mainCamera) {
      this.effectPass.mainCamera = RE.Runtime.camera;
    }
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
