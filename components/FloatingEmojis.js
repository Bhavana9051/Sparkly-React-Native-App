import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withDelay
} from 'react-native-reanimated';

const FloatingEmojis = ({ emojis, count = 20, size = 24, speed = 10 }) => {
  const [emojisList, setEmojisList] = useState([]);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    const newEmojis = Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      size: size + Math.random() * 20,
      duration: 5000 + Math.random() * 10000,
      delay: Math.random() * 2000,
      startX: Math.random() * width,
      startY: Math.random() * height,
      endX: Math.random() * width,
      endY: height + 50,
    }));
    setEmojisList(newEmojis);
  }, [emojis, count, size, width, height]);

  const FloatingEmoji = ({ item }) => {
    const progress = useSharedValue(0);
    
    useEffect(() => {
      progress.value = withDelay(
        item.delay,
        withRepeat(
          withTiming(1, {
            duration: item.duration,
            easing: Easing.linear,
          }),
          -1,
          true
        )
      );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { 
            translateX: progress.value * 
              (item.endX - item.startX) + item.startX 
          },
          { 
            translateY: progress.value * 
              (item.endY - item.startY) + item.startY 
          }
        ],
        opacity: 1 - progress.value * 0.7,
      };
    });

    return (
      <Animated.Text 
        style={[
          styles.emoji, 
          { fontSize: item.size },
          animatedStyle
        ]}
      >
        {item.emoji}
      </Animated.Text>
    );
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {emojisList.map(item => (
        <FloatingEmoji key={item.id} item={item} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  emoji: {
    position: 'absolute',
    top: -50,
  }
});

export default FloatingEmojis;