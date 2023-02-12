import { thumbs } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar as AvatarPaper } from 'react-native-paper';
import { SvgCss } from 'react-native-svg';

type AvatarProps = {
  pubkey: string;
  picture?: string;
  size?: number;
};

const Avatar = ({ pubkey, picture, size }: AvatarProps) => {
  const [isPictureError, setIsPictureError] = useState<boolean>(false);
  const avatar = createAvatar(thumbs, {
    seed: pubkey,
  }).toString();

  useEffect(() => {
    setIsPictureError(false);
  }, [picture]);

  if (isPictureError || !picture || picture.length === 0)
    return (
      <View style={styles.avatar}>
        <SvgCss xml={avatar} width={size} height={size} />
      </View>
    );

  return (
    <AvatarPaper.Image
      size={size}
      source={{ uri: picture }}
      onError={() => setIsPictureError(true)}
    />
  );
};

const styles = StyleSheet.create({
  avatar: { overflow: 'hidden', borderRadius: 100 },
});

export default Avatar;
