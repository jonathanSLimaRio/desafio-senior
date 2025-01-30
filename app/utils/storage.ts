import AsyncStorage from "@react-native-async-storage/async-storage";

const HIGH_SCORE_KEY = "highScore";
const LAST_SCORE_KEY = "lastScore";

export const saveHighScore = async (score: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(HIGH_SCORE_KEY, score.toString());
  } catch (e) {
    console.error("Erro ao salvar recorde:", e);
  }
};

export const loadHighScore = async (): Promise<number> => {
  try {
    const value = await AsyncStorage.getItem(HIGH_SCORE_KEY);
    return value ? parseInt(value, 10) : 0;
  } catch (e) {
    console.error("Erro ao carregar recorde:", e);
    return 0;
  }
};

export const saveLastScore = async (score: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(LAST_SCORE_KEY, score.toString());
  } catch (e) {
    console.error("Erro ao salvar última pontuação:", e);
  }
};

export const loadLastScore = async (): Promise<number> => {
  try {
    const value = await AsyncStorage.getItem(LAST_SCORE_KEY);
    return value ? parseInt(value, 10) : 0;
  } catch (e) {
    console.error("Erro ao carregar última pontuação:", e);
    return 0;
  }
};
