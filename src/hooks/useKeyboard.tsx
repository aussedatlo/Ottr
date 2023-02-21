import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export const useKeyboard = () => {
  const [open, setOpen] = useState<boolean>();

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      setOpen(true);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      setOpen(false);
    });

    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, []);

  return { open: open };
};
