const postion = {
  x: 0,
  y: 0,
};

export const getPostion = () => {
  return postion;
};

export const move = (
  direction: string,
  distance: number
): { x: number; y: number } => {
  switch (direction) {
    case "UP":
      postion.y -= distance;
      break;
    case "RIGHT":
      postion.x += distance;
      break;
    case "DOWN":
      postion.y += distance;
      break;
    case "LEFT":
      postion.x -= distance;
      break;
  }
  return postion;
};
