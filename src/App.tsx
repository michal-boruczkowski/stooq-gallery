import { Settings } from "./Settings";
import { useGroupsStore } from "./groupsStore";
import { Image } from "@chakra-ui/image";
import { CircleHelp } from "lucide-react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

function App() {
  const localGroups = useGroupsStore((store) => store.groups);

  return (
    <div>
      <div className="h-svh w-svh bg-[#f2f3f8] overflow-y-auto">
        {localGroups.map((group) => (
          <StooqGroup key={group.id} tiles={group.tickers} />
        ))}
      </div>
      <Settings />
    </div>
  );
}

type StooqGroupProps = {
  tiles: any[];
};

function StooqGroup(props: StooqGroupProps) {
  const { tiles } = props;
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:min-h-[25svh]">
      {tiles.map((tile, index) => {
        return (
          <StooqTile
            key={index}
            ticker={tile.ticker}
            period={tile.period}
            references={tile.references}
          />
        );
      })}
    </div>
  );
}

type StooqTileProps = {
  ticker: string;
  period: string;
  references?: string[];
};

function StooqTile(props: StooqTileProps) {
  const { ticker, period, references = [] } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const { data } = useQuery({
  //   queryKey: ["names", ticker],
  //   queryFn: ({ queryKey }) =>
  //     fetch(toLink(toUrl(queryKey[1], "5m"))).then((res) => res.json()),
  // });

  const url = toUrl(ticker, period, references);
  let label = [ticker, ...references].join("+").toUpperCase();
  return (
    <div onClick={() => onOpen()}>
      <StooqTileBody url={url} label={label} />

      <Modal onClose={onClose} isOpen={isOpen} isCentered size="3xl">
        <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)" />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={0}>
            <StooqTileBody url={url} label={label} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

type StooTileBodyProps = {
  url: string;
  label: string;
};

function StooqTileBody(props: StooTileBodyProps) {
  const { url, label } = props;
  return (
    <div className="relative p-1 w-fit h-full">
      <div className="absolute flex justify-center items-center left-6 top-5">
        <a
          href={`https://www.biznesradar.pl/notowania/${label}`}
          target="_blank"
          className="p-1"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
        >
          <CircleHelp size={16} />
        </a>
        <a
          href={toLink(url)}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
        >
          <b>{label}</b>
        </a>
      </div>

      <Image
        src={url}
        alt={label}
        className="h-full rounded-lg shadow-lg p-2 bg-white"
      />
    </div>
  );
}

function toUrl(ticker: string, period: string, references?: string[]) {
  let reference =
    references && references.length > 0 ? `&r=${references.join("+")}` : "";

  return `https://stooq.pl/c/?s=${ticker}&c=${period}&t=l&a=lg&b=1${reference}`;
}

function toLink(url: string) {
  return url.replace("/c/", "/q/");
}

export default App;
