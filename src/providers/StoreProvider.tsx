import * as SplashScreen from 'expo-splash-screen';
import { observer, Provider } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import RootStore, { useStores } from '../store';

type StoreProviderProps = {
  children: React.ReactNode;
};

const StoreContainer = observer(({ children }: StoreProviderProps) => {
  const [appIsLoaded, setAppIsLoaded] = useState<boolean>(false);
  const { userStore, messageStore, contactStore } = useStores();

  useEffect(() => {
    if (userStore.isLoaded && messageStore.isLoaded && contactStore.isLoaded)
      setAppIsLoaded(true);
  }, [userStore.isLoaded, messageStore.isLoaded, contactStore.isLoaded]);

  const onLayout = useCallback(() => {
    if (appIsLoaded) SplashScreen.hideAsync().catch(console.error);
  }, [appIsLoaded]);

  if (!appIsLoaded) return <></>;

  return (
    <View style={styles.root} onLayout={onLayout}>
      <>{children}</>
    </View>
  );
});

const StoreProvider = ({ children }: StoreProviderProps) => {
  return (
    <Provider observableStore={RootStore}>
      <StoreContainer>{children}</StoreContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default StoreProvider;
