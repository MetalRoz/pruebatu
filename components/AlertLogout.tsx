import React from "react";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogBody,
  Heading,
  ButtonText,
  ButtonGroup,
  Button,
  Text,
} from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AlertLogout = ({ isOpen, onClose, logout }: any) => {
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading size="lg">Cerrar sesión</Heading>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text>¿Estás seguro que deseas cerrar sesión?</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <ButtonGroup space="lg">
            <Button variant="outline" action="secondary" onPress={onClose}>
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button
              bg="$error600"
              action="negative"
              onPress={async () => {
                onClose();
                logout();
              }}
            >
              <ButtonText>Cerrar sesión</ButtonText>
            </Button>
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertLogout;
