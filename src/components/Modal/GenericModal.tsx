import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {
  forwardRef,
  ReactElement,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ModalController, { CustomModalRef } from './ModalController';
import { IconButton, useTheme } from 'react-native-paper';
import { Theme } from '../../providers/ThemeProvider';

const GenericModal = () => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [modalVisible, setModalVisible] = useState(false);
  const [children, setChildren] = useState<ReactElement | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [{ width, height }, setSize] = useState({ width: 0, height: 0 });

  const modalRef = useRef<CustomModalRef>();

  useLayoutEffect(() => {
    ModalController.setModalRef(modalRef);
  }, []);

  useImperativeHandle(
    modalRef,
    () => ({
      show: (title, children) => {
        setModalVisible(true);
        if (children) {
          setChildren(children);
          setTitle(title);
        }
      },
      hide: () => {
        setModalVisible(false);
        setChildren(undefined);
      },
    }),
    [],
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        ModalController.hideModal();
      }}
    >
      <View
        style={styles.root}
        onLayout={() => setSize(Dimensions.get('window'))}
      >
        <TouchableWithoutFeedback onPress={() => ModalController.hideModal()}>
          <View style={[styles.outside, { width, height }]}></View>
        </TouchableWithoutFeedback>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <IconButton
              icon="close"
              onPress={() => ModalController.hideModal()}
            />
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default forwardRef(GenericModal);

const createStyles = ({ colors }: Theme) => {
  return StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      backgroundColor: colors.background,
      borderRadius: 5,
      padding: 15,
      elevation: 5,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      flex: 1,
      color: colors.onBackground,
    },
    outside: {
      backgroundColor: colors.backdrop,
      position: 'absolute',
      left: 0,
      top: 0,
    },
  });
};
