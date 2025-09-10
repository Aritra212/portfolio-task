import { IStock } from "@/types/common.interfaces";

export default function getFilterOptionsFromData(data: IStock[]) {
  const categorySet = new Set<string>();

  data.forEach((stock) => {
    if (stock.category) categorySet.add(stock.category);
  });

  const categoryOptions = Array.from(categorySet).map((category) => ({
    label: category,
    value: category,
  }));

  return [
    {
      id: "category",
      label: "Sector",
      options: categoryOptions,
    },
  ];
}
