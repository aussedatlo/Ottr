import { MutableRefObject, ReactElement } from 'react';

export type CustomModalRef = {
  show: (title: string, children: ReactElement) => void;
  hide: () => void;
};

export default class ModalController {
  static modalRef: MutableRefObject<CustomModalRef>;
  static setModalRef = (ref: any) => {
    this.modalRef = ref;
  };

  static showModal = (title: string, children: ReactElement) => {
    this.modalRef.current?.show(title, children);
  };
  static hideModal = () => {
    this.modalRef.current?.hide();
  };
}
