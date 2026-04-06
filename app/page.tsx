import Link from "next/link";

const menuItems = [
  { label: "人気女優ランキング", href: "/ranking" },
  { label: "新着女優", href: "/actresses" },
  { label: "身長から探す", href: "/actresses" },
  { label: "カップから探す", href: "/actresses" },
  { label: "タイプ検索", href: "/actresses" },
  { label: "AIおすすめ", href: "/actresses" },
];

export default function Home() {
  return (
    <main>
      <header>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ margin: 0 }}>AV Search Lab</h1>

          <nav>
            <Link href="/actresses">女優一覧</Link>
            <Link href="/ranking">ランキング</Link>
            <Link href="/actresses">検索</Link>
          </nav>
        </div>
      </header>

      <section style={{ paddingTop: "24px" }}>
        <h2>好みで探せるAV検索サービス</h2>
        <p>身長・カップ・タイプから女優を探す</p>

        <p>
このサイトは、人気女優のプロフィールや特徴、ジャンル別の傾向をまとめたデータベースです。
気になる女優の情報を一覧・ランキング形式でチェックできます。
</p>

<p>
随時データを更新しており、新人女優や注目作品の情報も追加予定です。
</p>

        <div className="card-grid" style={{ marginTop: "24px" }}>
          {menuItems.map((item) => (
            <Link href={item.href} key={item.label}>
              <div className="button">
                <h3 style={{ margin: 0 }}>{item.label}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}