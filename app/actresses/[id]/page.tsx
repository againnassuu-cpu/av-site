import { uniqueActresses } from "../../data";

export function generateStaticParams() {
  return uniqueActresses.map((actress) => ({
    id: String(actress.fanzaActressId),
  }));
}

export default async function ActressDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const actress = uniqueActresses.find(
    (a) => String(a.fanzaActressId) === id
  );

  if (!actress) {
    return (
      <main>
        <p>女優が見つかりません</p>
      </main>
    );
  }

  const fanzaUrl =
    actress.fanzaUrl ||
    `https://video.dmm.co.jp/av/list/?key=${encodeURIComponent(
      actress.name + " 単体"
    )}`;

  return (
    <main>
      <h1>{actress.name}</h1>

      <div className="card">
        <img
          src={actress.image}
          alt={actress.name}
          style={{
            width: "100%",
            maxWidth: "600px",
            height: "auto",
            borderRadius: "12px",
            marginBottom: "16px",
            display: "block",
            background: "#f0f0f0",
          }}
        />

        <p>身長: {actress.height}cm</p>
        <p>バスト: {actress.bust}cm</p>
        <p>カップ: {actress.cup}</p>
        <p>タイプ: {actress.type.length ? actress.type.join(" / ") : "-"}</p>
        <p>人気度: {actress.popularity}</p>
        <p>誕生日: {actress.birthday || "-"}</p>
        <p>出身地: {actress.prefectures || "-"}</p>
        <p>趣味: {actress.hobby || "-"}</p>
        <p>読み方: {actress.ruby || "-"}</p>

        <div style={{ marginTop: "20px" }}>
          <a
            href={fanzaUrl}
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
            FANZAで作品を見る
          </a>
        </div>
      </div>
    </main>
  );
}