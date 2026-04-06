"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { uniqueActresses } from "../data";

export default function ActressesPage() {
  const cupOrder = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];

  const [selectedCup, setSelectedCup] = useState("");
  const [minCup, setMinCup] = useState("");
  const [maxCup, setMaxCup] = useState("");
  const [cupMode, setCupMode] = useState("exact");

  const [minHeight, setMinHeight] = useState("");
  const [maxHeight, setMaxHeight] = useState("");
  const [heightMode, setHeightMode] = useState("min");

  const [selectedType, setSelectedType] = useState("");

  const filtered = uniqueActresses.filter((item) => {
    let cupMatch = true;

    if (cupMode === "exact" && selectedCup !== "") {
      cupMatch = !!item.cup && item.cup.toUpperCase() === selectedCup;
    }

    if (cupMode === "min" && minCup !== "") {
      cupMatch =
        !!item.cup &&
        cupOrder.indexOf(item.cup.toUpperCase()) >= cupOrder.indexOf(minCup);
    }

    if (cupMode === "max" && maxCup !== "") {
      cupMatch =
        !!item.cup &&
        cupOrder.indexOf(item.cup.toUpperCase()) <= cupOrder.indexOf(maxCup);
    }

    if (cupMode === "range" && minCup !== "" && maxCup !== "") {
      const currentCupIndex = item.cup ? cupOrder.indexOf(item.cup.toUpperCase()) : -1;
      cupMatch =
        currentCupIndex >= cupOrder.indexOf(minCup) &&
        currentCupIndex <= cupOrder.indexOf(maxCup);
    }

    const typeMatch =
      selectedType === "" || item.type.includes(selectedType);

    let heightMatch = true;

    if (heightMode === "min" && minHeight !== "") {
      heightMatch = item.height >= Number(minHeight);
    }

    if (heightMode === "max" && maxHeight !== "") {
      heightMatch = item.height <= Number(maxHeight);
    }

    if (heightMode === "range" && minHeight !== "" && maxHeight !== "") {
      heightMatch =
        item.height >= Number(minHeight) &&
        item.height <= Number(maxHeight);
    }

    return cupMatch && typeMatch && heightMatch;
  });

  return (
    <main className="min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold mb-6">女優一覧</h1>

      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          value={cupMode}
          onChange={(e) => setCupMode(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="exact">カップ指定</option>
          <option value="min">カップ以上</option>
          <option value="max">カップ以下</option>
          <option value="range">カップ範囲</option>
        </select>

        {cupMode === "exact" && (
          <select
            value={selectedCup}
            onChange={(e) => setSelectedCup(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">カップ</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
            <option value="H">H</option>
            <option value="I">I</option>
            <option value="J">J</option>
            <option value="K">K</option>
            <option value="L">L</option>
            <option value="M">M</option>
            <option value="N">N</option>
            <option value="O">O</option>
          </select>
        )}

        {cupMode === "min" && (
          <select
            value={minCup}
            onChange={(e) => setMinCup(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">カップ以上</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
            <option value="H">H</option>
            <option value="I">I</option>
            <option value="J">J</option>
            <option value="K">K</option>
            <option value="L">L</option>
            <option value="M">M</option>
            <option value="N">N</option>
            <option value="O">O</option>
          </select>
        )}

        {cupMode === "max" && (
          <select
            value={maxCup}
            onChange={(e) => setMaxCup(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">カップ以下</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
            <option value="H">H</option>
            <option value="I">I</option>
            <option value="J">J</option>
            <option value="K">K</option>
            <option value="L">L</option>
            <option value="M">M</option>
            <option value="N">N</option>
            <option value="O">O</option>
          </select>
        )}

        {cupMode === "range" && (
          <>
            <select
              value={minCup}
              onChange={(e) => setMinCup(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">最小カップ</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="G">G</option>
              <option value="H">H</option>
              <option value="I">I</option>
              <option value="J">J</option>
              <option value="K">K</option>
              <option value="L">L</option>
              <option value="M">M</option>
              <option value="N">N</option>
              <option value="O">O</option>
            </select>

            <select
              value={maxCup}
              onChange={(e) => setMaxCup(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">最大カップ</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="G">G</option>
              <option value="H">H</option>
              <option value="I">I</option>
              <option value="J">J</option>
              <option value="K">K</option>
              <option value="L">L</option>
              <option value="M">M</option>
              <option value="N">N</option>
              <option value="O">O</option>
            </select>
          </>
        )}

        <select
          value={heightMode}
          onChange={(e) => setHeightMode(e.target.value)}
          className="border rounded px-3 py-2"
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
            className="border rounded px-3 py-2"
          />
        )}

        {heightMode === "max" && (
          <input
            type="number"
            value={maxHeight}
            onChange={(e) => setMaxHeight(e.target.value)}
            placeholder="身長以下"
            className="border rounded px-3 py-2"
          />
        )}

        {heightMode === "range" && (
          <>
            <input
              type="number"
              value={minHeight}
              onChange={(e) => setMinHeight(e.target.value)}
              placeholder="最小身長"
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              value={maxHeight}
              onChange={(e) => setMaxHeight(e.target.value)}
              placeholder="最大身長"
              className="border rounded px-3 py-2"
            />
          </>
        )}

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border rounded px-3 py-2"
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

        <button
          onClick={() => {
            setSelectedCup("");
            setMinCup("");
            setMaxCup("");
            setCupMode("exact");
            setMinHeight("");
            setMaxHeight("");
            setHeightMode("min");
            setSelectedType("");
          }}
          className="border rounded px-4 py-2 bg-gray-100 hover:bg-gray-200 transition"
        >
          リセット
        </button>
      </div>

         <p className="mb-4 text-sm text-gray-600">
        {filtered.length}件見つかりました
      </p>

      <div className="card-grid">
        {filtered.map((item, index) => (
          <Link href={`/actresses/${item.name}`} key={`${item.name}-${index}`}>
            <div className="card">
              <Image
                src={item.image}
                alt={item.name}
                width={400}
                height={240}
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginBottom: "12px",
                }}
              />
              <h2>{item.name}</h2>
              <p>身長: {item.height}cm</p>
              <p>カップ: {item.cup}</p>
              <p>タイプ: {item.type.join(" / ")}</p>
              <p>人気度: {item.popularity}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}