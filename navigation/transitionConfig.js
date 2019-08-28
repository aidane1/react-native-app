import {Easing, Animated} from 'react-native';

const transitionConfig = () => {
  return {
    transitionSpec: {
      duration: 600,
      easing: Easing.out (Easing.poly (4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {
      const {layout, position, scene} = sceneProps;
      //   console.log ({layout, position, scene});
      console.log (layout);
      const thisSceneIndex = scene.index;
      const width = layout.initWidth;

      const translateX = position.interpolate ({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [width, 0],
      });
      const newWidth = position.interpolate ({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [150, width],
      });
      const translateY = position.interpolate ({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [150, 0],
      });
      const scale = position.interpolate ({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [0.5, 1],
      });
      const opacity = position.interpolate ({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [0, 1],
      });

      //   return {transform: [{translateX}, {scale}]};
      // return {transform: [{translateX}], borderRadius: 5, overflow: 'hidden', height: 150};
      return {
        height: 250,
        // width: newWidth,
        transform: [{translateY}],
        borderRadius: 5,
        overflow: 'hidden',
      };
      //   return {transform: [{scale}], opacity};
      //   return {opacity};
    },
  };
};

module.exports = transitionConfig;
