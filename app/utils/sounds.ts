import { Audio } from "expo-av";

const soundSettings = {
  shouldPlay: true,
  isLooping: false,
  volume: 0.5,
};

// export async function playClearSound() {
//   const { sound } = await Audio.Sound.createAsync(
//     require("@/assets/sounds/clear.wav"),
//     soundSettings
//   );
//   await sound.playAsync();
//   sound.unloadAsync();
// }


// export async function playGameOverSound() {
//   const { sound } = await Audio.Sound.createAsync(
//     require("@/assets/sounds/gameover.wav"),
//     soundSettings
//   );
//   await sound.playAsync();
//   sound.unloadAsync();
// }
