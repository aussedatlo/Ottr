import { Kind } from 'nostr-tools';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import Avatar from '../../components/Avatar';
import Input from '../../components/Input';
import { useNostrContext } from '../../context/NostrContext';
import { useUserContext } from '../../context/UserContext';
import { Theme } from '../../providers/ThemeProvider';

const ProfileSection = () => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { pubkey, user, setUser } = useUserContext();
  const { publish } = useNostrContext();
  const [name, setName] = useState<string>('');
  const [about, setAbout] = useState<string>('');
  const [picture, setPicture] = useState<string>('');

  useEffect(() => {
    setName(user?.name || '');
    setAbout(user?.about || '');
    setPicture(user?.picture || '');
  }, [user]);

  const onUpdateProfile = () => {
    setUser({
      ...user,
      pubkey: pubkey,
      name: name,
      about: about,
      picture: picture,
    });

    publish({
      content: JSON.stringify({
        name: name,
        about: about,
        picture: picture,
        pubkey: pubkey,
      }),
      kind: Kind.Metadata,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
    });
  };

  return (
    <View style={styles.root}>
      <View style={styles.picture}>
        <Avatar pubkey={pubkey} picture={picture} size={60} />
      </View>
      <Text variant="labelLarge" style={styles.title}>
        Display name:
      </Text>
      <Input
        style={styles.input}
        value={name}
        placeholder="name to display"
        onChange={(e) => setName(e.nativeEvent.text)}
      />
      <Text variant="labelLarge" style={styles.title}>
        About you:
      </Text>
      <Input
        style={styles.input}
        value={about}
        placeholder="A little description of yourself"
        onChange={(e) => setAbout(e.nativeEvent.text)}
        numberOfLines={3}
        multiline
      />
      <Text variant="labelLarge" style={styles.title}>
        Picture url:
      </Text>
      <Input
        style={styles.input}
        value={picture}
        placeholder="https://"
        onChange={(e) => setPicture(e.nativeEvent.text)}
      />

      <View style={styles.buttonContainer}>
        <Button
          onPress={onUpdateProfile}
          style={styles.button}
          mode="contained"
          compact={false}
        >
          Update Profile
        </Button>
      </View>
    </View>
  );
};

const createStyles = ({ colors }: Theme) => {
  return StyleSheet.create({
    root: {
      margin: 15,
    },
    title: {
      marginTop: 15,
      marginBottom: 5,
    },
    input: {
      borderRadius: 10,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      backgroundColor: colors.secondaryContainer,
      fontSize: 14,
    },
    picture: {
      width: 60,
      alignSelf: 'center',
      overflow: 'hidden',
      borderRadius: 100,
    },
    button: {
      marginTop: 5,
    },
    buttonContainer: {
      marginTop: 30,
      width: 200,
      alignSelf: 'center',
    },
  });
};

export default ProfileSection;
