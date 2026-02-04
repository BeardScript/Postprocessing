import * as RE from 'rogue-engine';
import { EffectComposer, RenderPass } from 'postprocessing';
import * as THREE from 'three';

@RE.registerComponent
export default class FXComposer extends RE.Component {
  effectComposer: EffectComposer;
  renderPass: RenderPass;

  start() {
    this.effectComposer = new EffectComposer(RE.Runtime.renderer, {
      frameBufferType: THREE.HalfFloatType,
    });

    RE.Runtime.renderFunc = this.render;

    this.renderPass = new RenderPass(RE.Runtime.scene, RE.Runtime.camera);
    this.effectComposer.addPass(this.renderPass);
  }

  update() {
    if (RE.Runtime.camera !== this.renderPass.mainCamera) {
      this.renderPass.mainCamera = RE.Runtime.camera;
    }
  }

  render = () => {
    this.effectComposer.render(RE.Runtime.deltaTime);
  }

  clear() {
    RE.Runtime.renderFunc = RE.Runtime.defaultRenderFunc;
  }

  onBeforeRemoved(): void {
    this.clear();
  }

  onDisabled(): void {
    this.clear();
  }
}
