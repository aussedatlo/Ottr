import React, { useEffect, useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Avatar from '../../components/Avatar';
import Input from '../../components/Input';
import { useUserContext } from '../../context/UserContext';

const ProfileSection = () => {
  const { pubkey, user, setUser } = useUserContext();
  const [name, setName] = useState<string>('');
  const [about, setAbout] = useState<string>('');
  const [picture, setPicture] = useState<string>('');

  useEffect(() => {
    setName(user?.name || '');
    setAbout(user?.about || '');
    setPicture(user?.picture || '');
  }, [user]);

  const onUpdateProfile = () => {
    ToastAndroid.show('updated', ToastAndroid.SHORT);
    setUser({
      ...user,
      pubkey: pubkey,
      name: name,
      about: about,
      picture: picture,
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
        value={name}
        placeholder="name to display"
        onChange={(e) => setName(e.nativeEvent.text)}
      />
      <Text variant="labelLarge" style={styles.title}>
        About you:
      </Text>
      <Input
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

const styles = StyleSheet.create({
  root: {
    margin: 15,
  },
  title: {
    marginTop: 15,
    marginBottom: 5,
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

export default ProfileSection;
