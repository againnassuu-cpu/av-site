"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { uniqueActresses } from "../data";
const cupOrder = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"] as const;
type FilterMode = "none" | "min" | "max" | "range" | "exact";
export default function ActressesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState(searchParams.get("type") ?? "");
  const [heightMode, setHeightMode] = useState<FilterMode>(
    (searchParams.get("heightMode") as FilterMode) ?? "none"
  );
  const [heightValue, setHeightValue] = useState(
    Number(searchParams.get("heightValue") ?? 160)
  );
  const [heightMin, setHeightMin] = useState(
    Number(searchParams.get("heightMin") ?? 145)
  );
  const [heightMax, setHeightMax] = useState(
    Number(searchParams.get("heightMax") ?? 170)
  );
  const [cupMode, setCupMode] = useState<FilterMode>(
    (searchParams.get("cupMode") as FilterMode) ?? "none"
  );
  const [cupValue, setCupValue] = useState(searchParams.get("cupValue") ?? "C");
  const [cupMin, setCupMin] = useState(searchParams.get("cupMin") ?? "C");
  const [cupMax, setCupMax] = useState(searchParams.get("cupMax") ?? "F");
  const [sortType, setSortType] = useState(
    searchParams.get("sortType") ?? "popular"
  );
  const [results, setResults] = useState<typeof uniqueActresses>([]);
  const [searched, setSearched] = useState(false);
  useEffect(() => {
    const savedY = sessionStorage.getItem("actressesScrollY");
    if (savedY) {
      const y = Number(savedY);
      setTimeout(() => {
        window.scrollTo(0, y);
      }, 50);
      sessionStorage.removeItem("actressesScrollY");
    }
  }, []);
  const filtered = useMemo(() => {
    return uniqueActresses.filter((item) => {
      const typeMatch =
        selectedType === "" || item.type.includes(selectedType);
      let heightMatch = true;
      const itemHeight = Number(item.height) || 0;
      if (heightMode === "min") {
        heightMatch = itemHeight >= heightValue;
      } else if (heightMode === "max") {
        heightMatch = itemHeight <= heightValue;
      } else if (heightMode === "range") {
        const min = Math.min(heightMin, heightMax);
        const max = Math.max(heightMin, heightMax);
        heightMatch = itemHeight >= min && itemHeight <= max;
      }
      let cupMatch = true;
      const currentCupIndex = item.cup
        ? cupOrder.indexOf(item.cup.toUpperCase() as (typeof cupOrder)[number])
        : -1;
      if (cupMode === "exact") {
        cupMatch = !!item.cup && item.cup.toUpperCase() === cupValue;
      } else if (cupMode === "min") {
        cupMatch =
          currentCupIndex >= cupOrder.indexOf(cupValue as (typeof cupOrder)[number]);
      } else if (cupMode === "max") {
        cupMatch =
          currentCupIndex <= cupOrder.indexOf(cupValue as (typeof cupOrder)[number]);
      } else if (cupMode === "range") {
        const minIndex = Math.min(
          cupOrder.indexOf(cupMin as (typeof cupOrder)[number]),
          cupOrder.indexOf(cupMax as (typeof cupOrder)[number])
        );
        const maxIndex = Math.max(
          cupOrder.indexOf(cupMin as (typeof cupOrder)[number]),
          cupOrder.indexOf(cupMax as (typeof cupOrder)[number])
        );
        cupMatch = currentCupIndex >= minIndex && currentCupIndex <= maxIndex;
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
  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortType === "popular") {
      return arr.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }
    if (sortType === "height") {
      return arr.sort((a, b) => (b.height || 0) - (a.height || 0));
    }
    if (sortType === "heightAsc") {
      return arr.sort((a, b) => (a.height || 0) - (b.height || 0));
    }
    if (sortType === "cup") {
      return arr.sort((a, b) => {
        const aIndex = a.cup
          ? cupOrder.indexOf(a.cup as (typeof cupOrder)[number])
          : -1;
        const bIndex = b.cup
          ? cupOrder.indexOf(b.cup as (typeof cupOrder)[number])
          : -1;
        return bIndex - aIndex;
      });
    }
    if (sortType === "cupAsc") {
      return arr.sort((a, b) => {
        const aIndex = a.cup
          ? cupOrder.indexOf(a.cup as (typeof cupOrder)[number])
          : -1;
        const bIndex = b.cup
          ? cupOrder.indexOf(b.cup as (typeof cupOrder)[number])
          : -1;
        return aIndex - bIndex;
      });
    }
    if (sortType === "name") {
      return arr.sort((a, b) => a.name.localeCompare(b.name, "ja"));
    }
    return arr;
  }, [filtered, sortType]);
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
      const minIndex = Math.min(
        cupOrder.indexOf(cupMin as (typeof cupOrder)[number]),
        cupOrder.indexOf(cupMax as (typeof cupOrder)[number])
      );
      const maxIndex = Math.max(
        cupOrder.indexOf(cupMin as (typeof cupOrder)[number]),
        cupOrder.indexOf(cupMax as (typeof cupOrder)[number])
      );
      parts.push(`バスト ${cupOrder[minIndex]}〜${cupOrder[maxIndex]}カップ`);
    }
    if (selectedType) {
      parts.push(`タイプ ${selectedType}`);
    }
    return parts.length > 0 ? parts.join(" / ") : "";
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
  useEffect(() => {
    const hasCondition =
      selectedType !== "" ||
      heightMode !== "none" ||
      cupMode !== "none";
    if (hasCondition) {
      setResults(sorted.slice(0, 30));
      setSearched(true);
    } else {
      setResults([]);
      setSearched(false);
    }
  }, [sorted, selectedType, heightMode, cupMode]);
  const scrollToSearchPanel = () => {
    const el = document.getElementById("search-panel");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
    setSortType("popular");
    setResults([]);
    setSearched(false);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (selectedType) {
        params.set("type", selectedType);
      }
      if (heightMode !== "none") {
        params.set("heightMode", heightMode);
        if (heightMode === "min" || heightMode === "max") {
          params.set("heightValue", String(heightValue));
        }
        if (heightMode === "range") {
          params.set("heightMin", String(heightMin));
          params.set("heightMax", String(heightMax));
        }
      }
      if (cupMode !== "none") {
        params.set("cupMode", cupMode);
        if (cupMode === "exact" || cupMode === "min" || cupMode === "max") {
          params.set("cupValue", cupValue);
        }
        if (cupMode === "range") {
          params.set("cupMin", cupMin);
          params.set("cupMax", cupMax);
        }
      }
      if (sortType !== "popular") {
        params.set("sortType", sortType);
      }
      const query = params.toString();
      router.replace(
        query ? `/actresses?${query}` : "/actresses",
        { scroll: false }
      );
    }, 300);
    return () => clearTimeout(timer);
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
    sortType,
    router,
  ]);
  return (
    <main className="min-h-screen bg-white text-black p-6">
      <h1>女優一覧</h1>
      {currentConditionText && (
        <div
          className="sticky-bar"
          onClick={scrollToSearchPanel}
          style={{ cursor: "pointer" }}
          title="クリックで検索条件へ戻る"
        >
          {currentConditionText}
        </div>
      )}
      <div className="filter-panel" id="search-panel">
        <div className="filter-inner">
          <div className="filter-head">
            <div className="filter-title">条件で探す</div>
            {currentConditionText && (
              <div className="filter-current">{currentConditionText}</div>
            )}
          </div>
          <div className="sort-row">
            <div className="sort-label">並び替え</div>
            <div className="sort-chip-wrap">
              <button
                type="button"
                className={`sort-chip ${sortType === "popular" ? "active" : ""}`}
                onClick={() => {
                  setSortType("popular");
                  scrollToSearchPanel();
                }}
              >
                人気順
              </button>
              <button
                type="button"
                className={`sort-chip ${sortType === "height" ? "active" : ""}`}
                onClick={() => {
                  setSortType("height");
                  scrollToSearchPanel();
                }}
              >
                身長高い順
              </button>
              <button
                type="button"
                className={`sort-chip ${sortType === "heightAsc" ? "active" : ""}`}
                onClick={() => {
                  setSortType("heightAsc");
                  scrollToSearchPanel();
                }}
              >
                身長低い順
              </button>
              <button
                type="button"
                className={`sort-chip ${sortType === "cup" ? "active" : ""}`}
                onClick={() => {
                  setSortType("cup");
                  scrollToSearchPanel();
                }}
              >
                カップ大きい順
              </button>
              <button
                type="button"
                className={`sort-chip ${sortType === "cupAsc" ? "active" : ""}`}
                onClick={() => {
                  setSortType("cupAsc");
                  scrollToSearchPanel();
                }}
              >
                カップ小さい順
              </button>
              <button
                type="button"
                className={`sort-chip ${sortType === "name" ? "active" : ""}`}
                onClick={() => {
                  setSortType("name");
                  scrollToSearchPanel();
                }}
              >
                名前順
              </button>
            </div>
          </div>
          <div className="filter-two-col">
            <div className="filter-section filter-half">
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
              {heightMode !== "none" && (
                <div className="slider-block">
                  <div className="slider-value">
                    {heightMode === "min" && `${heightValue}cm以上`}
                    {heightMode === "max" && `${heightValue}cm以下`}
                    {heightMode === "range" &&
                      `${Math.min(heightMin, heightMax)}cm 〜 ${Math.max(heightMin, heightMax)}cm`}
                  </div>
                  <div className="range-slider-wrap">
                    <div className="range-track" />
                    <div
                      className="range-fill"
                      style={{
                        left:
                          heightMode === "max"
                            ? "0%"
                            : `${((Math.min(heightMin, heightMax) - 135) / (180 - 135)) * 100}%`,
                        right:
                          heightMode === "min"
                            ? "0%"
                            : `${100 - ((Math.max(heightMin, heightMax) - 135) / (180 - 135)) * 100}%`,
                      }}
                    />
                    {(heightMode === "max" || heightMode === "range") && (
                      <input
                        className="range-thumb range-thumb-left"
                        type="range"
                        min="135"
                        max="180"
                        value={heightMode === "max" ? heightValue : heightMin}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (heightMode === "max") setHeightValue(v);
                          else setHeightMin(v);
                        }}
                      />
                    )}
                    {(heightMode === "min" || heightMode === "range") && (
                      <input
                        className="range-thumb range-thumb-right"
                        type="range"
                        min="135"
                        max="180"
                        value={heightMode === "min" ? heightValue : heightMax}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (heightMode === "min") setHeightValue(v);
                          else setHeightMax(v);
                        }}
                      />
                    )}
                  </div>
                  <div className="slider-scale">
                    <span>135cm</span>
                    <span>180cm</span>
                  </div>
                </div>
              )}
            </div>
            <div className="filter-section filter-half">
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
                  >
                    {cupOrder.map((cup) => (
                      <option key={cup} value={cup}>
                        {cup}カップ
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {(cupMode === "min" || cupMode === "max" || cupMode === "range") && (
                <div className="slider-block">
                  <div className="slider-value">
                    {cupMode === "min" && `${cupValue}カップ以上`}
                    {cupMode === "max" && `${cupValue}カップ以下`}
                    {cupMode === "range" &&
                      `${
                        cupOrder[
                          Math.min(
                            cupOrder.indexOf(cupMin as (typeof cupOrder)[number]),
                            cupOrder.indexOf(cupMax as (typeof cupOrder)[number])
                          )
                        ]
                      }カップ 〜 ${
                        cupOrder[
                          Math.max(
                            cupOrder.indexOf(cupMin as (typeof cupOrder)[number]),
                            cupOrder.indexOf(cupMax as (typeof cupOrder)[number])
                          )
                        ]
                      }カップ`}
                  </div>
                  <div className="range-slider-wrap">
                    <div className="range-track" />
                    <div
                      className="range-fill"
                      style={{
                        left:
                          cupMode === "max"
                            ? "0%"
                            : `${
                                (Math.min(
                                  cupOrder.indexOf(cupMin as (typeof cupOrder)[number]),
                                  cupOrder.indexOf(cupMax as (typeof cupOrder)[number])
                                ) /
                                  (cupOrder.length - 1)) *
                                100
                              }%`,
                        right:
                          cupMode === "min"
                            ? "0%"
                            : `${
                                100 -
                                (Math.max(
                                  cupOrder.indexOf(cupMin as (typeof cupOrder)[number]),
                                  cupOrder.indexOf(cupMax as (typeof cupOrder)[number])
                                ) /
                                  (cupOrder.length - 1)) *
                                  100
                              }%`,
                      }}
                    />
                    {(cupMode === "max" || cupMode === "range") && (
                      <input
                        className="range-thumb range-thumb-left"
                        type="range"
                        min="0"
                        max={cupOrder.length - 1}
                        value={
                          cupMode === "max"
                            ? cupOrder.indexOf(cupValue as (typeof cupOrder)[number])
                            : cupOrder.indexOf(cupMin as (typeof cupOrder)[number])
                        }
                        onChange={(e) => {
                          const v = cupOrder[Number(e.target.value)];
                          if (cupMode === "max") setCupValue(v);
                          else setCupMin(v);
                        }}
                      />
                    )}
                    {(cupMode === "min" || cupMode === "range") && (
                      <input
                        className="range-thumb range-thumb-right"
                        type="range"
                        min="0"
                        max={cupOrder.length - 1}
                        value={
                          cupMode === "min"
                            ? cupOrder.indexOf(cupValue as (typeof cupOrder)[number])
                            : cupOrder.indexOf(cupMax as (typeof cupOrder)[number])
                        }
                        onChange={(e) => {
                          const v = cupOrder[Number(e.target.value)];
                          if (cupMode === "min") setCupValue(v);
                          else setCupMax(v);
                        }}
                      />
                    )}
                  </div>
                  <div className="slider-scale">
                    <span>A</span>
                    <span>K</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="filter-section">
            <div className="filter-label">タイプ</div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
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
            <button
              onClick={() => {
                handleReset();
                scrollToSearchPanel();
              }}
              className="action-btn secondary-btn"
            >
              条件を解除
            </button>
          </div>
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
            onClick={() => {
              sessionStorage.setItem("actressesScrollY", String(window.scrollY));
            }}
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


