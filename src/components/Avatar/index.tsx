import { thumbs } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import React, { memo, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar as AvatarPaper } from 'react-native-paper';
import { SvgCss } from 'react-native-svg';
import useProfile from '../../hooks/useProfile';

type AvatarProps = {
  pubkey: string;
  picture?: string;
  size?: number;
};

const AvatarFromPicture = ({ pubkey, picture, size }: AvatarProps) => {
  const [isPictureError, setIsPictureError] = useState<boolean>(false);
  const avatar = createAvatar(thumbs, {
    seed: pubkey,
  }).toString();

  useEffect(() => {
    setIsPictureError(false);
  }, [picture]);

  if (isPictureError || picture.length === 0)
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

const AvatarFromPubkey = ({ pubkey, size }: AvatarProps) => {
  const profile = useProfile(pubkey);
  const avatar = createAvatar(thumbs, {
    seed: pubkey,
  }).toString();

  if (!!profile && !!profile.picture && profile.picture.includes('http'))
    return (
      <View style={styles.avatar}>
        <AvatarPaper.Image source={{ uri: profile.picture }} size={size} />
      </View>
    );

  return (
    <View style={styles.avatar}>
      <SvgCss xml={avatar} width={size} height={size} />
    </View>
  );
};

const Avatar = (props: AvatarProps) => {
  if (props.picture === undefined) return <AvatarFromPubkey {...props} />;

  return <AvatarFromPicture {...props} />;
};

const styles = StyleSheet.create({
  avatar: { overflow: 'hidden', borderRadius: 100 },
});

export default memo(Avatar);
