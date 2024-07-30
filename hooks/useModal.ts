import React from "react";
import { Modal } from "@ui-kitten/components";

const useModal = () => {
  const modalRef = React.useRef<Modal>(null);

  const show = React.useCallback(() => {
    return modalRef.current?.render();
  }, []);

  // const hide = React.useCallback(() => {
  //   return modalRef.current?.();
  // }, []);

  return { modalRef, show };
};

export default useModal;
