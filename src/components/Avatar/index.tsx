import { thumbs } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { View } from "react-native";
import { Avatar as AvatarPaper } from "react-native-paper";
import { SvgCss } from "react-native-svg";
import useProfile from "../../hooks/useProfile";

type AvatarProps = {
  pubkey: string;
  size?: number;
};
const Avatar = ({ pubkey, size = 30 }: AvatarProps) => {
  const profile = useProfile(pubkey);
  const avatar = createAvatar(thumbs, {
    seed: pubkey,
  }).toString();

  if (!!profile && !!profile.picture && profile.picture.includes("http"))
    return <AvatarPaper.Image source={{ uri: profile.picture }} size={size} />;

  return (
    <View style={{ overflow: "hidden", borderRadius: 100 }}>
      <SvgCss xml={avatar} width={size} height={size} />
    </View>
  );
};

export default Avatar;
