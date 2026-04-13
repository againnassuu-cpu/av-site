export type Actress = {
  id: number;
  name: string;
  height: number;
  cup: string;
  type: string[];
  sampleImageUrl: string;
  sampleItemUrl: string;
  fanzaUrl: string;
};

export const fanzaActresses: Actress[] = [
  {
    id: 1,
    name: "サンプル女優",
    height: 160,
    cup: "F",
    type: ["美人"],
    sampleImageUrl: "https://example.com/sample.jpg",
    sampleItemUrl: "https://example.com/item",
    fanzaUrl: "https://example.com/list"
  }
];