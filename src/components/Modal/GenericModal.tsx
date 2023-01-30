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
  useRef,
  useState,
} from 'react';
import ModalController, { CustomModalRef } from './ModalController';
import { IconButton } from 'react-native-paper';

const GenericModal = () => {
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#ffffff',
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
  },
  outside: {
    backgroundColor: '#30303070',
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
