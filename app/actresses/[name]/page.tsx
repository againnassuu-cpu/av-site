import Image from "next/image";
import { uniqueActresses } from "../../data";

export function generateStaticParams() {
  return uniqueActresses.map((actress) => ({
    name: actress.name,
  }));
}

export default async function ActressDetail({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const actress = uniqueActresses.find((a) => a.name === decodedName);

  if (!actress) {
    return (
      <main>
        <p>女優が見つかりません</p>
      </main>
    );
  }

  const fanzaSearchUrl = `https://video.dmm.co.jp/av/list/?key=${encodeURIComponent(`${actress.name} 単体`)}`;
  return (
    <main>
      <h1>{actress.name}</h1>

      <div className="card">
        <Image
          src={actress.image}
          alt={actress.name}
          width={600}
          height={800}
          style={{
            width: "100%",
            maxWidth: "600px",
            height: "auto",
            borderRadius: "12px",
            marginBottom: "16px",
            display: "block",
          }}
          unoptimized
        />

        <p>身長: {actress.height}cm</p>
        <p>バスト: {actress.bust}cm</p>
        <p>カップ: {actress.cup}</p>
        <p>タイプ: {actress.type.join(" / ")}</p>
        <p>人気度: {actress.popularity}</p>
        <p>誕生日: {actress.birthday}</p>

        <div style={{ marginTop: "20px" }}>
          <a
            href={fanzaSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "#ff2d75",
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: "10px",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            FANZAで見る
          </a>
        </div>
      </div>
    </main>
  );
}