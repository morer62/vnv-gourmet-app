import { ResizeMode, Video } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function IntroVideo({ onFinish }) {
  const videoRef = useRef(null);
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    let mounted = true;

    const startVideo = async () => {
      try {
        if (videoRef.current) {
          await videoRef.current.playAsync();
        }
      } catch (error) {
        console.error('❌ Error playing intro video:', error);
        if (mounted && !hasFinished && onFinish) {
          setHasFinished(true);
          onFinish();
        }
      }
    };

    const timer = setTimeout(() => {
      startVideo();
    }, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [hasFinished, onFinish]);

  const handleFinish = () => {
    if (hasFinished) return;
    setHasFinished(true);
    if (onFinish) {
      onFinish();
    }
  };

  return (
    <View style={styles.container} pointerEvents="none">
      <Video
        ref={videoRef}
        source={require('../../../assets/videos/intro.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping={false}
        isMuted={false}
        useNativeControls={false}
        onPlaybackStatusUpdate={(status) => {
          if (!status?.isLoaded) return;

          if (status.didJustFinish) {
            handleFinish();
          }
        }}
        onError={(error) => {
          console.error('❌ Video error:', error);
          handleFinish();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});