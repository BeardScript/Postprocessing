import * as RE from 'rogue-engine';
import { EffectPass, BloomEffect, BlendFunction, KernelSize } from 'postprocessing';
import VPEffectComposer from '../VPEffectComposer.re';

@RE.registerComponent
export default class VPBloomEffect extends RE.Component {
  effect: BloomEffect;
  effectPass: EffectPass;

  @VPEffectComposer.require()
  effectComposer: VPEffectComposer;

  start() {
    if (!this.effectComposer) return;

    this.effect = new BloomEffect({
      blendFunction: BlendFunction.SCREEN,
			kernelSize: KernelSize.MEDIUM,
      luminanceThreshold: 0.4,
			luminanceSmoothing: 0.1,
			height: 480
    });

    // this.effect.blurPass.scale = 1;
    this.effect.luminancePass.enabled = true;
    this.effectPass = new EffectPass(RE.Runtime.camera, this.effect);
    this.effectPass.renderToScreen = true;
    this.effectComposer.effectComposer.addPass(this.effectPass);
  }
}
