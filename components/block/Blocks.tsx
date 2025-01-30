import React from "react";
import { View, StyleSheet } from "react-native";
import { Block } from "./BaseBlock";

interface PieceProps {
  size: number;
}

const PieceI = ({ size }: PieceProps) => (
  <View>
    <Block size={size} color="#00FFFF" />
    <Block size={size} color="#00FFFF" />
    <Block size={size} color="#00FFFF" />
    <Block size={size} color="#00FFFF" />
  </View>
);

const PieceO = ({ size }: PieceProps) => (
  <View>
    <View style={{ flexDirection: "row" }}>
      <Block size={size} color="#FFFF00" />
      <Block size={size} color="#FFFF00" />
    </View>
    <View style={{ flexDirection: "row" }}>
      <Block size={size} color="#FFFF00" />
      <Block size={size} color="#FFFF00" />
    </View>
  </View>
);

const PieceT = ({ size }: PieceProps) => (
  <View>
    <View style={{ flexDirection: "row" }}>
      <Block size={size} color="#800080" />
      <Block size={size} color="#800080" />
      <Block size={size} color="#800080" />
    </View>
    <View style={{ alignItems: "center" }}>
      <Block size={size} color="#800080" />
    </View>
  </View>
);

const PieceS = ({ size }: PieceProps) => (
  <View>
    <View style={{ flexDirection: "row" }}>
      <Block size={size} color="#00FF00" />
      <Block size={size} color="#00FF00" />
    </View>
    <View style={{ flexDirection: "row", marginLeft: size }}>
      <Block size={size} color="#00FF00" />
      <Block size={size} color="#00FF00" />
    </View>
  </View>
);

const PieceZ = ({ size }: PieceProps) => (
  <View>
    <View style={{ flexDirection: "row", marginLeft: size }}>
      <Block size={size} color="#FF0000" />
      <Block size={size} color="#FF0000" />
    </View>
    <View style={{ flexDirection: "row" }}>
      <Block size={size} color="#FF0000" />
      <Block size={size} color="#FF0000" />
    </View>
  </View>
);

const PieceJ = ({ size }: PieceProps) => (
  <View>
    <View style={{ flexDirection: "row" }}>
      <Block size={size} color="#0000FF" />
    </View>
    <View style={{ flexDirection: "row" }}>
      <Block size={size} color="#0000FF" />
      <Block size={size} color="#0000FF" />
      <Block size={size} color="#0000FF" />
    </View>
  </View>
);

const PieceL = ({ size }: PieceProps) => (
  <View>
    <View style={{ flexDirection: "row", marginLeft: size * 2 }}>
      <Block size={size} color="#FFA500" />
    </View>
    <View style={{ flexDirection: "row" }}>
      <Block size={size} color="#FFA500" />
      <Block size={size} color="#FFA500" />
      <Block size={size} color="#FFA500" />
    </View>
  </View>
);

export { PieceI, PieceO, PieceT, PieceS, PieceZ, PieceJ, PieceL };
