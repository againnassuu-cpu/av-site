import json
import time
from pathlib import Path

import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

API_ID = "eWzF0B1uCSpW1fLrkLt7"
AFFILIATE_ID = "nassuu-990"

INPUT_PATH = Path("data/actresses_light.json")
OUTPUT_PATH = Path("data/actresses_with_samples.json")

SLEEP_SECONDS = 0.3
HITS = 5


def normalize_url(url: str | None) -> str:
    if not url:
        return ""
    return url.replace("http://", "https://")


from datetime import datetime


def parse_date(date_str: str) -> datetime:
    """
    DMMの date 例: 2023/05/01 10:00
    失敗したら遠い未来日にして、最古判定で不利にする
    """
    if not date_str:
        return datetime.max

    for fmt in ("%Y/%m/%d %H:%M", "%Y-%m-%d %H:%M:%S", "%Y/%m/%d"):
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue

    return datetime.max


def is_single_actress_like(item: dict, actress_name: str, actress_id: int) -> bool:
    title = item.get("title", "") or ""

    actresses_info = item.get("iteminfo", {}).get("actress", [])
    actress_ids = []
    actress_names = []

    for a in actresses_info:
        if isinstance(a, dict):
            actress_ids.append(str(a.get("id", "")))
            actress_names.append(a.get("name", ""))

    # 🎯① 女優1人 + ID一致 → 最強OK
    if len(actress_ids) == 1 and str(actress_id) == actress_ids[0]:
        return True

    # 🎯② OKワード
    ok_words = ["単体", "デビュー", "新人", "初撮り", "解禁", "専属", "初作品"]

    has_ok = any(word in title for word in ok_words)

    # 🎯③ NGワード
    ng_words = [
        "ベスト", "BEST", "総集編", "コンプリート",
        "4時間", "8時間", "12時間", "16時間",
        "共演", "コラボ", "複数", "厳選", "大全集"
    ]

    has_ng = any(word in title for word in ng_words)

    # OKかつNGなし、かつ名前含む
    if has_ok and not has_ng and actress_name in title:
        return True

    return False


def fetch_sample_for_actress(actress_id: int, actress_name: str) -> dict:
    url = "https://api.dmm.com/affiliate/v3/ItemList"

    params = {
        "api_id": API_ID,
        "affiliate_id": AFFILIATE_ID,
        "site": "FANZA",
        "service": "digital",
        "floor": "videoa",
        "hits": 20,
        "sort": "date",
        "article": "actress",
        "article_id": actress_id,
        "output": "json",
    }

    response = requests.get(url, params=params, timeout=30, verify=False)

    if response.status_code != 200:
        print("====================================")
        print("status:", response.status_code)
        print("actress_id:", actress_id)
        print("request_url:", response.url)
        print("response_text:", response.text[:1000])
        print("====================================")
        response.raise_for_status()

    data = response.json()
    items = data.get("result", {}).get("items", [])

    if not items:
        return {
            "sampleImageUrl": "",
            "sampleItemUrl": "",
            "sampleTitle": "",
            "sampleDate": "",
        }

    # 単体っぽい作品だけに絞る
    filtered_items = [
        item for item in items
        if is_single_actress_like(item, actress_name, actress_id)
    ]

    # 単体候補があればそれを優先、なければ全件で最古を探す
    target_pool = filtered_items if filtered_items else items

    # 最古作品を選ぶ
    target_item = min(
        target_pool,
        key=lambda item: parse_date(item.get("date", ""))
    )

    # サムネ取得
    sample_image_url = ""
    sample_l = target_item.get("sampleImageURL", {}).get("sample_l", [])
    if sample_l and isinstance(sample_l, list):
        first = sample_l[0]
        if isinstance(first, dict):
            sample_image_url = first.get("image", "") or ""

    if not sample_image_url:
        image_url = target_item.get("imageURL", {})
        sample_image_url = (
            image_url.get("large", "")
            or image_url.get("list", "")
            or image_url.get("small", "")
            or ""
        )

    return {
        "sampleImageUrl": normalize_url(sample_image_url),
        "sampleItemUrl": target_item.get("affiliateURL", "") or "",
        "sampleTitle": target_item.get("title", "") or "",
        "sampleDate": target_item.get("date", "") or "",
    }


def main():
    if not INPUT_PATH.exists():
        raise FileNotFoundError(f"{INPUT_PATH} が見つかりません。")

    if not API_ID or API_ID == "ここにDMMのAPI_ID":
        raise ValueError("API_ID を設定してください。")

    if not AFFILIATE_ID or AFFILIATE_ID == "ここにアフィリエイトID":
        raise ValueError("AFFILIATE_ID を設定してください。")

    with INPUT_PATH.open("r", encoding="utf-8") as f:
        actresses = json.load(f)

    results = []
    total_count = len(actresses)

    for index, actress in enumerate(actresses, start=1):

        name = actress.get("name", "不明")
        actress_id = actress.get("fanzaActressId")

        print(f"[{index}/{total_count}] {name}")

        if not actress_id:
            results.append({
                **actress,
                "sampleImageUrl": "",
                "sampleItemUrl": "",
                "sampleTitle": "",
            })
            continue

        try:
            sample = fetch_sample_for_actress(int(actress_id), name)
            merged = {
                **actress,
                "sampleImageUrl": sample["sampleImageUrl"],
                "sampleItemUrl": sample["sampleItemUrl"],
                "sampleTitle": sample["sampleTitle"],
            }
            results.append(merged)

            if sample["sampleImageUrl"]:
                print(f"  -> sample ok")
            else:
                print(f"  -> sampleなし")

        except Exception as e:
            print(f"  -> error: {e}")
            results.append({
                **actress,
                "sampleImageUrl": "",
                "sampleItemUrl": "",
                "sampleTitle": "",
            })

        time.sleep(SLEEP_SECONDS)

    with OUTPUT_PATH.open("w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print("====================================")
    print(f"保存完了: {OUTPUT_PATH}")
    print(f"件数: {len(results)}")


if __name__ == "__main__":
    main()