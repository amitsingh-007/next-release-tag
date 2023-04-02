const permuteRec = ({
  arr,
  map,
  res,
  curRes,
  index,
}: {
  arr: any[];
  res: Set<string>;
  curRes: string[];
  map: boolean[];
  index: number;
}) => {
  if (index >= arr.length) {
    if (curRes.length > 1) {
      res.add(curRes.join('.'));
    }
    return res;
  }
  arr.forEach((p, i) => {
    if (!map[i]) {
      res = permuteRec({ res, curRes, map, index: index + 1, arr });
      map[i] = true;
      curRes.push(p);
      res = permuteRec({ res, curRes, map, index: index + 1, arr });
      map[i] = false;
      curRes.pop();
    }
  });
  return res;
};

export const permute = (arr: any[]) =>
  Array.from(
    permuteRec({
      arr,
      curRes: [],
      map: new Array(arr.length).fill(false),
      res: new Set<string>(),
      index: 0,
    })
  );
