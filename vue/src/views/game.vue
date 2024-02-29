<template lang='pug'>
.render-canvas(ref="renderCanvas")
</template>

<script lang='ts' setup>
import { onMounted, ref } from "vue";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders"; // 如果需要加載模型

const renderCanvas = ref(null);

onMounted(() => {
  const canvas = renderCanvas.value;
  const engine = new BABYLON.Engine(canvas, true);

  const createScene = function () {
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera(
      "Camera",
      Math.PI / 2,
      Math.PI / 2,
      2,
      new BABYLON.Vector3(0, 0, 5),
      scene
    );
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(1, 1, 0),
      scene
    );
    const ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 6, height: 6 },
      scene
    );

    // 在這裡加載你的動物模型
    // 例如：BABYLON.SceneLoader.ImportMesh("", "模型路徑", "文件名.babylon", scene, function (newMeshes) { ... });

    return scene;
  };

  const scene = createScene();

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener("resize", () => {
    engine.resize();
  });
});
</script>

<style lang='sass' scoped>
.render-canvas
  width: 100%
  height: 100vh
</style>