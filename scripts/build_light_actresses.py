import json
from pathlib import Path


INPUT_PATH = Path("data/actresses_all_unique.json")
OUTPUT_PATH = Path("data/actresses_light.json")


def safe_get(d: dict, *keys, default=None):
    current = d
    for key in keys:
        if not isinstance(current, dict):
            return default
        current = current.get(key)
        if current is None:
            return default
    return current


def main():
    if not INPUT_PATH.exists():
        raise FileNotFoundError(f"{INPUT_PATH} が見つかりません。")

    with INPUT_PATH.open("r", encoding="utf-8") as f:
        raw_items = json.load(f)

    light_items = []

    for item in raw_items:
        light_item = {
            "fanzaActressId": item.get("id"),
            "name": item.get("name"),
            "ruby": item.get("ruby"),
            "cup": item.get("cup"),
            "bust": item.get("bust"),
            "waist": item.get("waist"),
            "hip": item.get("hip"),
            "height": item.get("height"),
            "birthday": item.get("birthday"),
            "bloodType": item.get("blood_type"),
            "hobby": item.get("hobby"),
            "prefectures": item.get("prefectures"),
            "imageUrl": safe_get(item, "imageURL", "large"),
            "fanzaDigitalUrl": safe_get(item, "listURL", "digital"),
        }

        light_items.append(light_item)

    with OUTPUT_PATH.open("w", encoding="utf-8") as f:
        json.dump(light_items, f, ensure_ascii=False, indent=2)

    print("======================================")
    print("軽量データ作成完了")
    print(f"入力件数: {len(raw_items)}")
    print(f"出力件数: {len(light_items)}")
    print(f"保存先: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()