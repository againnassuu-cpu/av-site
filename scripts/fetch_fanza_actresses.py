import json
import os
import time
from pathlib import Path

import requests
from dotenv import load_dotenv


# .env 読み込み
load_dotenv()

API_ID = os.getenv("DMM_API_ID")
AFFILIATE_ID = os.getenv("DMM_AFFILIATE_ID")

if not API_ID or not AFFILIATE_ID:
    raise ValueError(".env に DMM_API_ID または DMM_AFFILIATE_ID がありません。")

BASE_URL = "https://api.dmm.com/affiliate/v3/ActressSearch"
HITS = 100
SLEEP_SECONDS = 0.5

INITIALS = [
    "あ", "い", "う", "え", "お",
    "か", "き", "く", "け", "こ",
    "さ", "し", "す", "せ", "そ",
    "た", "ち", "つ", "て", "と",
    "な", "に", "ぬ", "ね", "の",
    "は", "ひ", "ふ", "へ", "ほ",
    "ま", "み", "む", "め", "も",
    "や", "ゆ", "よ",
    "ら", "り", "る", "れ", "ろ",
    "わ"
]


def fetch_one_page(initial: str, offset: int, hits: int = 100) -> dict:
    params = {
        "api_id": API_ID,
        "affiliate_id": AFFILIATE_ID,
        "initial": initial,
        "hits": hits,
        "offset": offset,
        "output": "json",
    }

    response = requests.get(BASE_URL, params=params, timeout=30)
    response.raise_for_status()
    return response.json()


def dedupe_by_id(items: list[dict]) -> list[dict]:
    seen = {}
    for item in items:
        item_id = item.get("id")
        if item_id is not None:
            seen[item_id] = item
    return list(seen.values())


def main():
    all_actresses = []

    for initial in INITIALS:
        print(f"================ {initial} 開始 ================")
        offset = 1

        while True:
            data = fetch_one_page(initial=initial, offset=offset, hits=HITS)

            result = data.get("result", {})
            actress_list = result.get("actress", [])
            total_count = int(result.get("total_count", 0))
            result_count = int(result.get("result_count", 0))

            print(f"{initial} offset={offset} result_count={result_count} total_count={total_count}")

            if not actress_list:
                print(f"{initial} データが空なので終了")
                break

            all_actresses.extend(actress_list)

            offset += HITS

            if offset > total_count:
                print(f"{initial} 完了")
                break

            time.sleep(SLEEP_SECONDS)

        time.sleep(SLEEP_SECONDS)

    unique_actresses = dedupe_by_id(all_actresses)

    output_dir = Path("data")
    output_dir.mkdir(exist_ok=True)

    raw_output_path = output_dir / "actresses_all_raw.json"
    with raw_output_path.open("w", encoding="utf-8") as f:
        json.dump(all_actresses, f, ensure_ascii=False, indent=2)

    unique_output_path = output_dir / "actresses_all_unique.json"
    with unique_output_path.open("w", encoding="utf-8") as f:
        json.dump(unique_actresses, f, ensure_ascii=False, indent=2)

    print("======================================")
    print("全取得完了")
    print(f"取得件数（重複込み）: {len(all_actresses)}")
    print(f"取得件数（重複除去後）: {len(unique_actresses)}")
    print(f"保存先 raw   : {raw_output_path}")
    print(f"保存先 unique: {unique_output_path}")


if __name__ == "__main__":
    main()