import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { initialGroups } from "./initialGroups";
import { Group, useGroupsStore } from "./groupsStore";
import { Settings as SettingsIcon } from "lucide-react";
import { SettingsForm } from "./SettingsForm";

type SettingsProps = {};

export function Settings(props: SettingsProps) {
  const save = useGroupsStore((store) => store.save);
  const localGroups = useGroupsStore((store) => store.groups);
  const [groups, setGroups] = useState<Group[]>(localGroups);

  const { isOpen, onOpen, onClose } = useDisclosure();

  let onOk = () => {
    save(groups);
    onClose();
  };

  // Handle the body scroll when the Drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <div className="fixed right-5 bottom-5">
      <IconButton
        colorScheme="teal"
        icon={<SettingsIcon />}
        aria-label="Open Settings"
        onClick={onOpen}
      />
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={() => {
          setGroups(localGroups);
          onClose();
        }}
        size="full"
      >
        <DrawerOverlay width="full" h="full" />
        <DrawerContent className="flex flex-col h-full">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Tickers and groups
          </DrawerHeader>

          <DrawerBody className="flex-1 overflow-y-auto" p={4}>
            <SettingsForm groups={groups} setGroups={setGroups} />
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px" className="border-t p-4">
            <div className="flex justify-between w-full">
              <div>
                <Button
                  colorScheme="teal"
                  mr={3}
                  onClick={() => {
                    setGroups(initialGroups);
                  }}
                >
                  Reset
                </Button>
              </div>
              <div>
                <Button
                  mr={3}
                  onClick={() => {
                    setGroups(localGroups);
                    onClose();
                  }}
                >
                  Close
                </Button>
                <Button colorScheme="teal" onClick={onOk}>
                  OK
                </Button>
              </div>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
