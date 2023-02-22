import React, { ReactElement, useEffect, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import RBSheet, { RBSheetProps } from 'react-native-raw-bottom-sheet';
import { Theme } from '../../providers/ThemeProvider';

type BottomSheetProps = RBSheetProps & {
  visible: boolean;
  children: ReactElement;
};

const CustomRBSheet = React.forwardRef<RBSheet, BottomSheetProps>(
  (props, ref) => <RBSheet ref={ref} {...props} />,
);

const BottomSheet = (props: BottomSheetProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const bottomSheetRef = useRef(undefined);

  useEffect(() => {
    if (props.visible) bottomSheetRef.current?.open();
  }, [props.visible]);

  return (
    <CustomRBSheet
      ref={bottomSheetRef}
      closeOnDragDown={true}
      closeOnPressMask={true}
      closeOnPressBack={true}
      customStyles={{
        wrapper: styles.wrapper,
        draggableIcon: styles.draggableIcon,
        container: styles.container,
      }}
      height={250}
      {...props}
    >
      {props.children}
    </CustomRBSheet>
  );
};

const createStyles = ({ colors }: Theme) => {
  return StyleSheet.create({
    wrapper: { backgroundColor: colors.backdrop },
    draggableIcon: {
      backgroundColor: colors.onPrimaryContainer,
      marginBottom: 20,
    },
    container: {
      backgroundColor: colors.primaryContainer,
      borderRadius: 20,
      paddingLeft: 20,
      paddingRight: 20,
    },
  });
};

export default BottomSheet;
