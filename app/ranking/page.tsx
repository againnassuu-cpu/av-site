"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { uniqueActresses } from "../data";

const cupOrder = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];

type FilterMode = "none" | "min" | "max" | "range" | "exact";

export default function ActressesPage() {

  const [selectedType, setSelectedType] = useState("");

  const [heightMode, setHeightMode] = useState<FilterMode>("none");

  const [heightValue, setHeightValue] = useState(160);

  const [heightMin, setHeightMin] = useState(145);

  const [heightMax, setHeightMax] = useState(170);

  const [cupMode, setCupMode] = useState<FilterMode>("none");

  const [cupValue, setCupValue] = useState("C");

  const [cupMin, setCupMin] = useState("C");

  const [cupMax, setCupMax] = useState("F");

  const [results, setResults] = useState<typeof uniqueActresses>([]);

  const [searched, setSearched] = useState(false);

  const filtered = useMemo(() => {

    return uniqueActresses.filter((item) => {

      const typeMatch =

        selectedType === "" || item.type.includes(selectedType);

      let heightMatch = true;

      const itemHeight = Number(item.height) || 0;

      if (heightMode === "min") {

        heightMatch = itemHeight >= heightValue;

      }

      if (heightMode === "max") {

        heightMatch = itemHeight <= heightValue;

      }

      if (heightMode === "range") {

        const min = Math.min(heightMin, heightMax);

        const max = Math.max(heightMin, heightMax);

        heightMatch = itemHeight >= min && itemHeight <= max;

      }

      let cupMatch = true;

      const currentCupIndex = item.cup

        ? cupOrder.indexOf(item.cup.toUpperCase())

        : -1;

      if (cupMode === "exact") {

        cupMatch = !!item.cup && item.cup.toUpperCase() === cupValue;

      }

      if (cupMode === "min") {

        cupMatch =

          currentCupIndex >= cupOrder.indexOf(cupValue);

      }

      if (cupMode === "max") {

        cupMatch =

          currentCupIndex <= cupOrder.indexOf(cupValue);

      }

      if (cupMode === "range") {

        const minIndex = Math.min(

          cupOrder.indexOf(cupMin),

          cupOrder.indexOf(cupMax)

        );

        const maxIndex = Math.max(

          cupOrder.indexOf(cupMin),

          cupOrder.indexOf(cupMax)

        );

        cupMatch =

          currentCupIndex >= minIndex && currentCupIndex <= maxIndex;

      }

      return typeMatch && heightMatch && cupMatch;

    });

  }, [

    selectedType,

    heightMode,

    heightValue,

    heightMin,

    heightMax,

    cupMode,

    cupValue,

    cupMin,

    cupMax,

  ]);

  const handleSearch = () => {

    setResults(filtered.slice(0, 30));

    setSearched(true);

  };

  const handleReset = () => {

    setSelectedType("");

    setHeightMode("none");

    setHeightValue(160);

    setHeightMin(145);

    setHeightMax(170);

    setCupMode("none");

    setCupValue("C");

    setCupMin("C");

    setCupMax("F");

    setResults([]);

    setSearched(false);

  };

  const currentConditionText = useMemo(() => {

    const parts: string[] = [];

    if (heightMode === "min") {

      parts.push(`身長 ${heightValue}cm以上`);

    } else if (heightMode === "max") {

      parts.push(`身長 ${heightValue}cm以下`);

    } else if (heightMode === "range") {

      parts.push(`身長 ${Math.min(heightMin, heightMax)}〜${Math.max(heightMin, heightMax)}cm`);

    }

    if (cupMode === "exact") {

      parts.push(`バスト ${cupValue}カップ`);

    } else if (cupMode === "min") {

      parts.push(`バスト ${cupValue}カップ以上`);

    } else if (cupMode === "max") {

      parts.push(`バスト ${cupValue}カップ以下`);

    } else if (cupMode === "range") {

      const minIndex = Math.min(cupOrder.indexOf(cupMin), cupOrder.indexOf(cupMax));

      const maxIndex = Math.max(cupOrder.indexOf(cupMin), cupOrder.indexOf(cupMax));

      parts.push(`バスト ${cupOrder[minIndex]}〜${cupOrder[maxIndex]}カップ`);

    }

    if (selectedType) {

      parts.push(`タイプ ${selectedType}`);

    }

    return parts.length > 0 ? parts.join(" / ") : "こだわり無し";

  }, [

    heightMode,

    heightValue,

    heightMin,

    heightMax,

    cupMode,

    cupValue,

    cupMin,

    cupMax,

    selectedType,

  ]);

  return (

    <main className="min-h-screen bg-white text-black p-6">

      <h1 className="text-3xl font-bold mb-6">女優一覧</h1>

      <div className="filter-panel">

        <div className="filter-head">

          <div className="filter-title">条件で探す</div>

          <div className="filter-current">{currentConditionText}</div>

        </div>

        <div className="filter-section">

          <div className="filter-label">身長</div>

          <div className="mode-row">

            <label className="mode-chip">

              <input

                type="radio"

                name="heightMode"

                checked={heightMode === "none"}

                onChange={() => setHeightMode("none")}

              />

              <span>こだわり無し</span>

            </label>

            <label className="mode-chip">

              <input

                type="radio"

                name="heightMode"

                checked={heightMode === "min"}

                onChange={() => setHeightMode("min")}

              />

              <span>以上</span>

            </label>

            <label className="mode-chip">

              <input

                type="radio"

                name="heightMode"

                checked={heightMode === "max"}

                onChange={() => setHeightMode("max")}

              />

              <span>以下</span>

            </label>

            <label className="mode-chip">

              <input

                type="radio"

                name="heightMode"

                checked={heightMode === "range"}

                onChange={() => setHeightMode("range")}

              />

              <span>範囲</span>

            </label>

          </div>

          {(heightMode === "min" || heightMode === "max") && (

            <div className="slider-block">

              <div className="slider-value">

                {heightValue}cm

              </div>

              <input

                className="red-slider"

                type="range"

                min="135"

                max="180"

                value={heightValue}

                onChange={(e) => setHeightValue(Number(e.target.value))}

              />

              <div className="slider-scale">

                <span>135cm</span>

                <span>180cm</span>

              </div>

            </div>

          )}

          {heightMode === "range" && (

            <div className="slider-block">

              <div className="slider-value">

                {Math.min(heightMin, heightMax)}cm 〜 {Math.max(heightMin, heightMax)}cm

              </div>

              <input

                className="red-slider"

                type="range"

                min="135"

                max="180"

                value={heightMin}

                onChange={(e) => setHeightMin(Number(e.target.value))}

              />

              <input

                className="red-slider"

                type="range"

                min="135"

                max="180"

                value={heightMax}

                onChange={(e) => setHeightMax(Number(e.target.value))}

              />

              <div className="slider-scale">

                <span>135cm</span>

                <span>180cm</span>

              </div>

            </div>

          )}

        </div>

        <div className="filter-section">

          <div className="filter-label">バスト</div>

          <div className="mode-row">

            <label className="mode-chip">

              <input

                type="radio"

                name="cupMode"

                checked={cupMode === "none"}

                onChange={() => setCupMode("none")}

              />

              <span>こだわり無し</span>

            </label>

            <label className="mode-chip">

              <input

                type="radio"

                name="cupMode"

                checked={cupMode === "exact"}

                onChange={() => setCupMode("exact")}

              />

              <span>指定</span>

            </label>

            <label className="mode-chip">

              <input

                type="radio"

                name="cupMode"

                checked={cupMode === "min"}

                onChange={() => setCupMode("min")}

              />

              <span>以上</span>

            </label>

            <label className="mode-chip">

              <input

                type="radio"

                name="cupMode"

                checked={cupMode === "max"}

                onChange={() => setCupMode("max")}

              />

              <span>以下</span>

            </label>

            <label className="mode-chip">

              <input

                type="radio"

                name="cupMode"

                checked={cupMode === "range"}

                onChange={() => setCupMode("range")}

              />

              <span>範囲</span>

            </label>

          </div>

          {cupMode === "exact" && (

            <div className="slider-block">

              <div className="slider-value">{cupValue}カップ</div>

              <select

                value={cupValue}

                onChange={(e) => setCupValue(e.target.value)}

                className="border rounded px-3 py-2"

              >

                {cupOrder.map((cup) => (

                  <option key={cup} value={cup}>

                    {cup}カップ

                  </option>

                ))}

              </select>

            </div>

          )}

            {(cupMode === "min" || cupMode === "max") && (

            <div className="slider-block">

              <div className="slider-value">{cupValue}カップ</div>

              <input

                className="red-slider"

                type="range"

                min="0"

                max={cupOrder.length - 1}

                value={cupOrder.indexOf(cupValue)}

                onChange={(e) => setCupValue(cupOrder[Number(e.target.value)])}

              />

              <div className="slider-scale">

                <span>A</span>

                <span>O</span>

              </div>

            </div>

          )}

          {cupMode === "range" && (

            <div className="slider-block">

              <div className="slider-value">

                {cupOrder[Math.min(cupOrder.indexOf(cupMin), cupOrder.indexOf(cupMax))]}

                カップ 〜{" "}

                {cupOrder[Math.max(cupOrder.indexOf(cupMin), cupOrder.indexOf(cupMax))]}

                カップ

              </div>

              <input

                className="red-slider"

                type="range"

                min="0"

                max={cupOrder.length - 1}

                value={cupOrder.indexOf(cupMin)}

                onChange={(e) => setCupMin(cupOrder[Number(e.target.value)])}

              />

              <input

                className="red-slider"

                type="range"

                min="0"

                max={cupOrder.length - 1}

                value={cupOrder.indexOf(cupMax)}

                onChange={(e) => setCupMax(cupOrder[Number(e.target.value)])}

              />

              <div className="slider-scale">

                <span>A</span>

                <span>O</span>

              </div>

            </div>

          )}

        </div>

        <div className="filter-section">

          <div className="filter-label">タイプ</div>

          <select

            value={selectedType}

            onChange={(e) => setSelectedType(e.target.value)}

            className="border rounded px-3 py-2"

          >

            <option value="">こだわり無し</option>

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

        </div>

        <div className="filter-actions">

          <button onClick={handleSearch} className="action-btn primary-btn">

            更新

          </button>

          <button onClick={handleReset} className="action-btn secondary-btn">

            条件を解除

          </button>

        </div>

      </div>

      {!searched && (

        <p className="mb-4 text-sm text-gray-600">

          条件を選んで検索してください

        </p>

      )}

      {searched && (

        <p className="mb-4 text-sm text-gray-600">

          {filtered.length}件見つかりました（表示は上位30件）

        </p>

      )}

      {searched && results.length === 0 && (

        <p className="mb-4 text-sm text-gray-600">

          条件に合う女優が見つかりませんでした

        </p>

      )}

      <div className="card-grid">

        {results.map((item, index) => (

          <Link

            href={`/actresses/${item.fanzaActressId}`}

            key={`${item.fanzaActressId}-${index}`}

            style={{ textDecoration: "none", color: "inherit" }}

          >

            <div className="card">

              <div

                style={{

                  width: "110px",

                  margin: "0 auto",

                }}

              >

                <div

                  style={{

                    width: "110px",

                    height: "110px",

                    background: "#f5f5f5",

                    borderRadius: "8px",

                    marginBottom: "8px",

                    overflow: "hidden",

                  }}

                >

                  <img

                    src={item.image}

                    alt={item.name}

                    style={{

                      width: "110px",

                      height: "110px",

                      objectFit: "contain",

                      display: "block",

                    }}

                  />

                </div>

                <div

                  style={{

                    fontSize: "16px",

                    fontWeight: 700,

                    lineHeight: 1.3,

                    marginBottom: "2px",

                    textAlign: "center",

                  }}

                >

                  {item.name}

                </div>

                <div

                  style={{

                    fontSize: "12px",

                    color: "#888",

                    lineHeight: 1.2,

                    marginBottom: "6px",

                    textAlign: "center",

                    whiteSpace: "nowrap",

                    overflow: "hidden",

                    textOverflow: "ellipsis",

                  }}

                  title={item.ruby || ""}

                >

                  {item.ruby || " "}

                </div>

                <div

                  style={{

                    fontSize: "12px",

                    color: "#333",

                    lineHeight: 1.4,

                    textAlign: "center",

                  }}

                >

                  <div>身長: {item.height}cm</div>

                  <div>バスト: {item.cup ? `${item.cup}カップ` : "-"}</div>

                  <div>

                    B{item.bust || "-"} / W{item.waist || "-"} / H{item.hip || "-"}

                  </div>

                </div>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </main>

  );

}