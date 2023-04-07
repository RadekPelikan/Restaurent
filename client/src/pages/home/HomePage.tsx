import { FC, ReactNode, useRef, useEffect, useState, MouseEvent } from "react";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowLeft,
} from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Page } from "../../components";
import { getPostion, move } from "../../api/tiles";

const SIZE = 30;

const COLORS = new Map<string, string>([
  ["chair", "bg-green-200"],
  ["table", "bg-blue-200"],
]);

const buttonTypeMap = new Map<number, string>([
  [0, "chair"],
  [2, "table"],
  [1, "DELETE"],
]);

type IactiveTile = {
  x: number;
  y: number;
  type: string;
};

const activeTiles = new Set<IactiveTile>();

const getType = (button: number | undefined): string => {
  if (button === undefined) return "";
  return buttonTypeMap.get(button) || "";
};

type IHomePageProps = {
  children?: ReactNode;
};

const HomePage: FC<IHomePageProps> = () => {
  return (
    <Page title="HomePage">
      <div className="container">
        <h1>HomePage</h1>
      </div>

      <div className="container flex-grow bg-red-200">
        <Tiles />
        <button
          className="px-5 py-2 rounded bg-lime-300"
          onClick={() => console.log(activeTiles)}
        >
          SHOW
        </button>
      </div>
    </Page>
  );
};

type ITilePos = {
  x: number;
  y: number;
};

type ITilesProps = {
  children?: ReactNode;
};

const Tiles: FC<ITilesProps> = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState<number>(0);
  const [tileRows, setTileRows] = useState<ReactNode[][]>([]);

  const [mouseDownButton, setMouseDownButton] = useState<number | undefined>();

  const { data, status } = useQuery({
    queryKey: ["position"],
    queryFn: getPostion,
    onSuccess: (data) => {
      updateTiles();
    },
  });

  let changedTiles: ITilePos[] = [];

  const resetChangedTiles = () => {
    changedTiles = [];
  };

  const hasChanged = (tile: ITilePos) => {
    if (changedTiles.some((t) => t.x === tile.x && t.y === tile.y)) return true;
    changedTiles.push(tile);
    return false;
  };

  const updateTiles = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const tiles: ReactNode[][] = [];
    const wrapperWidth = wrapper.clientWidth;
    const wrapperHeight = wrapper.clientHeight;

    const cols = Math.floor(wrapperWidth / SIZE);
    const rows = Math.floor(wrapperHeight / SIZE);

    for (let i = 0; i < rows; i++) {
      let row: ReactNode[] = [];
      for (let j = 0; j < cols; j++) {
        const x = j + data.x;
        const y = i + data.y;
        row.push(
          <Tile
            key={`${x}-${y}`}
            x={x}
            y={y}
            changingType={mouseDownButton !== undefined}
            newType={getType(mouseDownButton)}
            type={
              [...activeTiles]
                .filter((tile) => tile.x === x && tile.y === y)
                .pop()?.type || ""
            }
            hasChanged={hasChanged}
          />
        );
      }
      tiles.push(row);
    }

    setTileRows(tiles);
    setCols(cols);
  };

  useEffect(() => {
    updateTiles();
    const listeners = [
      {
        event: "resize",
        callback: updateTiles,
        target: window,
      },
    ];
    listeners.forEach(({ event, callback, target }) => {
      target.addEventListener(event, callback as EventListener);
    });
    return () => window.removeEventListener("resize", updateTiles);
  }, []);

  useEffect(() => {
    updateTiles();
  }, [mouseDownButton]);

  if (status === "loading") return <div>Loading...</div>;

  if (status === "error") return <div>Error...</div>;

  return (
    <div className="h-full mt-8">
      <ControlsWrapper>
        <div
          className="relative col-start-2 row-start-2 overflow-hidden outline"
          ref={wrapperRef}
          onMouseDown={(e) => {
            e.preventDefault();
            setMouseDownButton(e.button);
          }}
          onMouseUp={() => {
            setMouseDownButton(undefined);
            resetChangedTiles();
          }}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
        >
          <div
            className="absolute inset-0 grid scale-[112%]"
            style={{ gridTemplateColumns: `repeat(${cols},1fr)` }}
          >
            {tileRows}
          </div>
        </div>
      </ControlsWrapper>
    </div>
  );
};

type ITileProps = {
  children?: ReactNode;
  x: number;
  y: number;
  changingType: boolean;
  newType: string;
  type: string;
  hasChanged: (tile: ITilePos) => boolean;
};

const Tile: FC<ITileProps> = (props) => {
  const [type, setType] = useState<string>(props.type);

  const changeType = (type: string) => {
    if (props.hasChanged({ x: props.x, y: props.y })) return;

    const newTile: IactiveTile = {
      x: props.x,
      y: props.y,
      type: type,
    };

    const sameTile = [...activeTiles]
      .filter((tile) => tile.x === props.x && tile.y === props.y)
      .pop();

    if (type === "DELETE") {
      if (sameTile) activeTiles.delete(sameTile);
      return setType("");
    }

    // If clicked on same tile nad same type, clear type
    // if (sameTile && sameTile.type === type) {
    //   activeTiles.delete(sameTile);
    //   return setType("");
    // }

    // If clicked on same tile but different type, change type
    if (sameTile) activeTiles.delete(sameTile);

    activeTiles.add(newTile);
    setType(type);
  };

  return (
    <div
      className="relative overflow-visible bg-white hover:brightness-95 hover:outline outline-1 outline-slate-500"
      onMouseOver={(e: MouseEvent<HTMLDivElement>) => {
        if (!props.changingType) return;
        changeType(props.newType);
      }}
      onMouseDown={(e: MouseEvent<HTMLDivElement>) => {
        changeType(getType(e.button));
      }}
      style={{ right: `${SIZE * 0.9}px`, bottom: `${SIZE * 0.9}px` }}
    >
      <div
        className={`absolute border-white border inset-0 inline-block hover:brightness-95 ${
          type && COLORS.get(type)
        }`}
      ></div>
    </div>
  );
};

type IControlsWrapperProps = {
  children?: ReactNode;
};

const ControlsWrapper: FC<IControlsWrapperProps> = (props) => {
  const sideControlsSize = 30;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (direction: string) => move(direction, 1),
    onSuccess: () => {
      queryClient.invalidateQueries("position");
    },
  });

  return (
    <div
      className="grid overflow-hidden min-h-[50rem] mx-auto w-full max-w-[60rem]"
      style={{
        gridTemplateColumns: `${sideControlsSize}px 1fr ${sideControlsSize}px`,
        gridTemplateRows: `${sideControlsSize}px 1fr ${sideControlsSize}px`,
      }}
    >
      <button
        className={`col-start-2 row-start-1 rounded-t-xl`}
        onMouseDown={() => mutation.mutate("UP")}
      >
        <MdOutlineKeyboardArrowUp className="w-full h-full hover:scale-[200%]" />
      </button>
      <button
        className={`col-start-3 row-start-2 rounded-r-xl`}
        onMouseDown={() => mutation.mutate("RIGHT")}
      >
        <MdOutlineKeyboardArrowRight className="w-full h-full hover:scale-[200%]" />
      </button>
      <button
        className={`col-start-2 row-start-3 rounded-b-xl`}
        onMouseDown={() => mutation.mutate("DOWN")}
      >
        <MdOutlineKeyboardArrowDown className="w-full h-full hover:scale-[200%]" />
      </button>
      <button
        className={`col-start-1 row-start-2 rounded-l-xl`}
        onMouseDown={() => mutation.mutate("LEFT")}
      >
        <MdOutlineKeyboardArrowLeft className="w-full h-full hover:scale-[200%]" />
      </button>
      {props.children}
    </div>
  );
};

export default HomePage;
