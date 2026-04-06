import { uniqueActresses } from "../../data";

export default async function ActressDetail({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const actress = uniqueActresses.find((a) => a.name === decodedName);

  const fanzaUrl = `https://video.dmm.co.jp/av/list/?key=${encodeURIComponent(
    decodedName + " 単体"
  )}`;

  if (!actress) {
    return (
      <main>
        <h1>女優詳細</h1>
        <p>女優が見つかりません</p>

        <a href={fanzaUrl} target="_blank">
          FANZAで見る
        </a>
      </main>
    );
  }

  return (
    <main>
      <h1>{actress.name}</h1>

      <img
        src={actress.image}
        alt={actress.name}
        style={{
          width: "100%",
          maxWidth: "600px",
          height: "auto",
          borderRadius: "12px",
        }}
      />

      <p>身長: {actress.height}cm</p>
      <p>カップ: {actress.cup}</p>
      <p>タイプ: {actress.type.join(" / ")}</p>
      <p>人気度: {actress.popularity}</p>

      <a href={fanzaUrl} target="_blank">
        FANZAで見る
      </a>
    </main>
  );
}