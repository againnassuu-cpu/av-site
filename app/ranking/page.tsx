"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { uniqueActresses } from "../data";

export default function RankingPage() {
  const cupOrder = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];

  const [searchWord, setSearchWord] = useState("");
  const [selectedCup, setSelectedCup] = useState("");
  const [minCup, setMinCup] = useState("");
  const [maxCup, setMaxCup] = useState("");
  const [cupMode, setCupMode] = useState("exact");

  const [minHeight, setMinHeight] = useState("");
  const [maxHeight, setMaxHeight] = useState("");
  const [heightMode, setHeightMode] = useState("min");

  const [selectedType, setSelectedType] = useState("");
  const [sortType, setSortType] = useState("popularity");

  const filteredAndSorted = useMemo(() => {
    let data = [...uniqueActresses];

    const keyword = searchWord.trim().toLowerCase();
    if (keyword) {
      data = data.filter((item) => {
        return (
          item.name.toLowerCase().includes(keyword) ||
          item.cup.toLowerCase().includes(keyword) ||
          item.type.some((t) => t.toLowerCase().includes(keyword))
        );
      });
    }

    if (cupMode === "exact" && selectedCup !== "") {
      data = data.filter(
        (item) => item.cup && item.cup.toUpperCase() === selectedCup
      );
    }

    if (cupMode === "min" && minCup !== "") {
      data = data.filter(
        (item) =>
          item.cup &&
          cupOrder.indexOf(item.cup.toUpperCase()) >= cupOrder.indexOf(minCup)
      );
    }

    if (cupMode === "max" && maxCup !== "") {
      data = data.filter(
        (item) =>
          item.cup &&
          cupOrder.indexOf(item.cup.toUpperCase()) <= cupOrder.indexOf(maxCup)
      );
    }

    if (cupMode === "range" && minCup !== "" && maxCup !== "") {
      data = data.filter((item) => {
        const currentCupIndex = item.cup ? cupOrder.indexOf(item.cup.toUpperCase()) : -1;
        return (
          currentCupIndex >= cupOrder.indexOf(minCup) &&
          currentCupIndex <= cupOrder.indexOf(maxCup)
        );
      });
    }

    if (heightMode === "min" && minHeight !== "") {
      data = data.filter((item) => item.height >= Number(minHeight));
    }

    if (heightMode === "max" && maxHeight !== "") {
      data = data.filter((item) => item.height <= Number(maxHeight));
    }

    if (heightMode === "range" && minHeight !== "" && maxHeight !== "") {
      data = data.filter(
        (item) =>
          item.height >= Number(minHeight) &&
          item.height <= Number(maxHeight)
      );
    }

    if (selectedType !== "") {
      data = data.filter((item) => item.type.includes(selectedType));
    }

    if (sortType === "popularity") {
      data.sort((a, b) => b.popularity - a.popularity);
    } else if (sortType === "heightHigh") {
      data.sort((a, b) => b.height - a.height);
    } else if (sortType === "heightLow") {
      data.sort((a, b) => a.height - b.height);
    }

    return data;
  }, [
    searchWord,
    selectedCup,
    minCup,
    maxCup,
    cupMode,
    minHeight,
    maxHeight,
    heightMode,
    selectedType,
    sortType,
  ]);

  const handleReset = () => {
    setSearchWord("");
    setSelectedCup("");
    setMinCup("");
    setMaxCup("");
    setCupMode("exact");
    setMinHeight("");
    setMaxHeight("");
    setHeightMode("min");
    setSelectedType("");
    setSortType("popularity");
  };

  return (
    <main>
      <h1>ランキング</h1>
      <p>検索・絞り込み・並び替えつきのランキングページ</p>
      <p style={{ marginBottom: "20px", color: "#666" }}>
        人気順・身長順・カップ範囲・タイプ別で女優を探せます
      </p>

      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "16px",
        }}
      >
        <input
          type="text"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          placeholder="女優名 / カップ / タイプ検索"
        />

        <select value={cupMode} onChange={(e) => setCupMode(e.target.value)}>
          <option value="exact">カップ指定</option>
          <option value="min">カップ以上</option>
          <option value="max">カップ以下</option>
          <option value="range">カップ範囲</option>
        </select>

        {cupMode === "exact" && (
          <select value={selectedCup} onChange={(e) => setSelectedCup(e.target.value)}>
            <option value="">カップ</option>
            {cupOrder.map((cup) => (
              <option key={cup} value={cup}>
                {cup}
              </option>
            ))}
          </select>
        )}

        {cupMode === "min" && (
          <select value={minCup} onChange={(e) => setMinCup(e.target.value)}>
            <option value="">カップ以上</option>
            {cupOrder.map((cup) => (
              <option key={cup} value={cup}>
                {cup}
              </option>
            ))}
          </select>
        )}

        {cupMode === "max" && (
          <select value={maxCup} onChange={(e) => setMaxCup(e.target.value)}>
            <option value="">カップ以下</option>
            {cupOrder.map((cup) => (
              <option key={cup} value={cup}>
                {cup}
              </option>
            ))}
          </select>
        )}

        {cupMode === "range" && (
          <>
            <select value={minCup} onChange={(e) => setMinCup(e.target.value)}>
              <option value="">最小カップ</option>
              {cupOrder.map((cup) => (
                <option key={cup} value={cup}>
                  {cup}
                </option>
              ))}
            </select>

            <select value={maxCup} onChange={(e) => setMaxCup(e.target.value)}>
              <option value="">最大カップ</option>
              {cupOrder.map((cup) => (
                <option key={cup} value={cup}>
                  {cup}
                </option>
              ))}
            </select>
          </>
        )}

        <select
          value={heightMode}
          onChange={(e) => setHeightMode(e.target.value)}
        >
          <option value="min">身長以上</option>
          <option value="max">身長以下</option>
          <option value="range">身長範囲</option>
        </select>

        {heightMode === "min" && (
          <input
            type="number"
            value={minHeight}
            onChange={(e) => setMinHeight(e.target.value)}
            placeholder="身長以上"
          />
        )}

        {heightMode === "max" && (
          <input
            type="number"
            value={maxHeight}
            onChange={(e) => setMaxHeight(e.target.value)}
            placeholder="身長以下"
          />
        )}

        {heightMode === "range" && (
          <>
            <input
              type="number"
              value={minHeight}
              onChange={(e) => setMinHeight(e.target.value)}
              placeholder="最小身長"
            />
            <input
              type="number"
              value={maxHeight}
              onChange={(e) => setMaxHeight(e.target.value)}
              placeholder="最大身長"
            />
          </>
        )}

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">タイプ</option>
          <option value="清楚">清楚</option>
          <option value="ギャル">ギャル</option>
          <option value="美人">美人</option>
          <option value="スレンダー">スレンダー</option>
          <option value="上品">上品</option>
          <option value="高身長">高身長</option>
          <option value="かわいい">かわいい</option>
          <option value="巨乳">巨乳</option>
          <option value="小柄">小柄</option>
          <option value="大人">大人</option>
          <option value="童顔">童顔</option>
          <option value="若手">若手</option>
          <option value="レジェンド">レジェンド</option>
        </select>

        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="popularity">人気順</option>
          <option value="heightHigh">身長（高い順）</option>
          <option value="heightLow">身長（低い順）</option>
        </select>

        <button onClick={handleReset}>リセット</button>
      </div>

      <p style={{ marginBottom: "16px" }}>
        {filteredAndSorted.length}件見つかりました
      </p>

      <div className="card-grid">
        {filteredAndSorted.map((item, index) => {
          const rank = index + 1;
          const rankClass =
            rank === 1
              ? "rank-card rank-1"
              : rank === 2
              ? "rank-card rank-2"
              : rank === 3
              ? "rank-card rank-3"
              : "card";

          return (
            <Link
              href={`/actresses/${encodeURIComponent(item.name)}`}
              key={`${item.name}-${index}`}
            >
              <div className={rankClass}>
                <p className="rank-number">#{rank}</p>

                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginBottom: "12px",
                    display: "block",
                    background: "#f0f0f0",
                  }}
                />

                <h2>{item.name}</h2>
                <p>人気度: {item.popularity}</p>
                <p>身長: {item.height}cm</p>
                <p>カップ: {item.cup}</p>
                <p>タイプ: {item.type.join(" / ")}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}