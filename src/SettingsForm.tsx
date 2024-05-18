import {
  Box,
  Button,
  CloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { Group } from "./groupsStore";
import { CirclePlus, Trash, Boxes } from "lucide-react";

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
    <div className="flex flex-wrap md:flex-nowrap">
      <div className="w-full md:w-11/12">
        {groups.map((group) => (
          <div
            key={group.id}
            className="border rounded-md p-6 mb-6 shadow-lg bg-white"
          >
            <div className="flex justify-between items-center pb-4">
              <div className="flex w-full md:w-1/3">
                <FormLabel
                  htmlFor={`group-name-${group.id}`}
                  className="w-1/4 font-semibold"
                >
                  Group Name
                </FormLabel>
                <Input
                  id={`group-name-${group.id}`}
                  placeholder="Type group name..."
                  className="mb-2 w-full"
                  onChange={(event) =>
                    handleGroupNameChange(group.id, event.target.value)
                  }
                  value={group.label}
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  leftIcon={<CirclePlus />}
                  colorScheme="teal"
                  onClick={() => handleAddField(group.id)}
                >
                  Add Ticker
                </Button>
                <Button
                  leftIcon={<Trash />}
                  colorScheme="red"
                  onClick={() => handleRemoveGroup(group.id)}
                >
                  Delete Group
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {group.tickers.map((ticker) => (
                <Box
                  key={ticker.id}
                  className="border rounded-md p-4 shadow-sm bg-gray-50"
                >
                  <div className="flex justify-end">
                    <CloseButton
                      size="sm"
                      onClick={() => handleRemoveField(group.id, ticker.id)}
                    />
                  </div>
                  <FormControl className="space-y-4 pt-4">
                    <div className="grid grid-cols-3 items-center">
                      <FormLabel className="col-span-1">Ticker</FormLabel>
                      <Input
                        className="col-span-2"
                        onChange={(event) =>
                          handleFieldChange(
                            group.id,
                            ticker.id,
                            "ticker",
                            event.target.value
                          )
                        }
                        value={ticker.ticker}
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <FormLabel className="col-span-1">Period</FormLabel>
                      <Select
                        className="col-span-2"
                        placeholder="Select period"
                        value={ticker.period}
                        onChange={(event) =>
                          handleFieldChange(
                            group.id,
                            ticker.id,
                            "period",
                            event.target.value
                          )
                        }
                      >
                        {periods.map((period) => (
                          <option key={period} value={period}>
                            {period}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <FormLabel className="col-span-1">References</FormLabel>
                      <Input
                        className="col-span-2"
                        value={ticker.references?.join(" ")}
                        onChange={(event) =>
                          handleFieldChange(
                            group.id,
                            ticker.id,
                            "references",
                            event.target.value
                          )
                        }
                      />
                    </div>
                  </FormControl>
                </Box>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full md:w-1/12 flex justify-center md:justify-start p-4">
        <Button
          leftIcon={<Boxes />}
          colorScheme="teal"
          className="w-full md:w-auto"
          onClick={handleAddGroup}
        >
          Add Group
        </Button>
      </div>
    </div>
  );
}
