import {
  Box,
  Button,
  CloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { initialGroups } from "./initialGroups";
import { Group, useGroupsStore } from "./groupsStore";

type SettingsProps = {};

export function Settings(props: SettingsProps) {
  const save = useGroupsStore((store) => store.save);
  const localGroups = useGroupsStore((store) => store.groups);
  const [groups, setGroups] = useState<Group[]>(localGroups);

  const { isOpen, onOpen, onClose } = useDisclosure();

  let onOk = () => {
    save(groups);
    //setRefresh(refresh + 1);
    onClose();
  };

  return (
    <div className="fixed right-5 bottom-5">
      <Button onClick={onOpen}>|||</Button>
      <Modal
        size="xxl"
        isOpen={isOpen}
        onClose={() => {
          setGroups(localGroups);
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tickers and groups</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SettingsForm groups={groups} setGroups={setGroups} />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                setGroups(initialGroups);
              }}
            >
              Reset
            </Button>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                setGroups(localGroups);
                onClose();
              }}
            >
              Close
            </Button>
            <Button variant="ghost" onClick={onOk}>
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

let periods = [
  "1d",
  "3d",
  "5d",
  "10d",
  "1m",
  "3m",
  "5m",
  "1r",
  "2l",
  "3l",
  "5l",
  "10l",
  "20l",
  "30l",
  "50l",
  "100l",
  "Max",
];

type SettingsFormProps = {
  groups: Group[];
  setGroups: (groups: Group[]) => any;
};

export function SettingsForm(props: SettingsFormProps) {
  const { groups, setGroups } = props;

  const handleGroupNameChange = (id: number, newLabel: string) => {
    setGroups(
      groups.map((group) =>
        group.id === id ? { ...group, label: newLabel } : group
      )
    );
  };

  const handleFieldChange = (
    groupId: number,
    tickerId: number,
    property: string,
    value: string | string[]
  ) => {
    let newValue = value;
    if (property === "references") {
      newValue =
        typeof value === "string"
          ? value.split(" ").map((r) => r.trim())
          : value;
    }

    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              tickers: group.tickers.map((ticker) =>
                ticker.id === tickerId
                  ? { ...ticker, [property]: newValue }
                  : ticker
              ),
            }
          : group
      )
    );
  };

  const handleAddGroup = () => {
    setGroups([
      ...groups,
      {
        id: Date.now(),
        label: "Example",
        tickers: [{ id: Date.now(), ticker: "", period: "5m" }],
      },
    ]);
  };

  const handleRemoveGroup = (groupId: number) => {
    setGroups(groups.filter((group) => group.id !== groupId));
  };

  const handleAddField = (groupId: number) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              tickers: [
                ...group.tickers,
                { id: Date.now(), ticker: "", period: "5m" },
              ],
            }
          : group
      )
    );
  };

  const handleRemoveField = (groupId: number, tickerId: number) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              tickers: group.tickers.filter((ticker) => ticker.id !== tickerId),
            }
          : group
      )
    );
  };

  return (
    <div className="flex flex-wrap sm:flex-wrap md:flex-nowrap">
      <div className="col-span-7">
        {groups.map((group) => (
          <div key={group.id} className="border rounded-md p-4 mb-4">
            <div className="flex justify-between items-center space-x-4 pb-2">
              <FormLabel>Group name</FormLabel>
              <Input
                placeholder="Type group name..."
                className="mb-2"
                onChange={(event) => {
                  handleGroupNameChange(group.id, event.target.value);
                }}
                value={group.label}
              />
              <Button onClick={() => handleAddField(group.id)}>
                Add ticker
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleRemoveGroup(group.id)}
              >
                Delete group
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {group.tickers.map((ticker) => (
                <Box key={ticker.id} className="border rounded-md p-1">
                  <div className="flex flex-col items-end">
                    <CloseButton
                      size="sm"
                      onClick={() => handleRemoveField(group.id, ticker.id)}
                    />
                  </div>
                  <FormControl className="flex flex-col gap-2 p-3">
                    <div className="grid grid-cols-3 items-center">
                      <FormLabel className="col-span-1">Ticker</FormLabel>
                      <Input
                        className="col-span-2"
                        onChange={(event) => {
                          handleFieldChange(
                            group.id,
                            ticker.id,
                            "ticker",
                            event.target.value
                          );
                        }}
                        value={ticker.ticker}
                      />
                    </div>
                    <div className="grid grid-cols-2 items-center">
                      <FormLabel>Period</FormLabel>
                      <Select
                        placeholder="Period"
                        value={ticker.period}
                        onChange={(event) => {
                          handleFieldChange(
                            group.id,
                            ticker.id,
                            "period",
                            event.target.value
                          );
                        }}
                      >
                        {periods.map((period) => {
                          return <option key={period}>{period}</option>;
                        })}
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 items-center">
                      <FormLabel className="mt-2">References</FormLabel>
                      <Input
                        value={ticker.references?.join(" ")}
                        onChange={(event) => {
                          handleFieldChange(
                            group.id,
                            ticker.id,
                            "references",
                            event.target.value
                          );
                        }}
                      />
                    </div>
                  </FormControl>
                </Box>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4">
        <Button colorScheme="green" className="px-4" onClick={handleAddGroup}>
          Add group
        </Button>
      </div>
    </div>
  );
}
