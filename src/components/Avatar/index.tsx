import { thumbs } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { memo, useEffect, useState } from 'react';
import { View } from 'react-native';
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
      <View style={{ width: size, borderRadius: 100, overflow: 'hidden' }}>
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
    return <AvatarPaper.Image source={{ uri: profile.picture }} size={size} />;

  return (
    <View style={{ overflow: 'hidden', borderRadius: 100 }}>
      <SvgCss xml={avatar} width={size} height={size} />
    </View>
  );
};

const Avatar = (props: AvatarProps) => {
  if (props.picture === undefined) return <AvatarFromPubkey {...props} />;

  return <AvatarFromPicture {...props} />;
};

export default memo(Avatar);
