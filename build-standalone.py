#!/usr/bin/env python3
"""
fragrance-spot.html（assets/w/*.webp を参照）から
画像を data URI で埋め込んだ単一ファイル fragrance-spot-standalone.html を生成する

  python3 build-standalone.py

生成物はどこに置いても動く（相対パス依存なし）。共有URLで配布する版はこちら。
"""
import base64, re, os, sys

SRC = "fragrance-spot.html"
DST = "fragrance-spot-standalone.html"

def main():
    if not os.path.exists(SRC):
        sys.exit(f"{SRC} が見つかりません")
    s = open(SRC, encoding="utf-8").read()
    refs = sorted(set(re.findall(r"assets/w/[A-Za-z0-9._-]+\.webp", s)))
    missing = [r for r in refs if not os.path.exists(r)]
    if missing:
        sys.exit("画像が見つかりません: " + ", ".join(missing))
    total = 0
    for r in refs:
        blob = open(r, "rb").read()
        total += len(blob)
        uri = "data:image/webp;base64," + base64.b64encode(blob).decode()
        s = s.replace(f'"{r}"', f'"{uri}"').replace(f"'{r}'", f"'{uri}'")
    left = re.findall(r"assets/[^\"')]+", s)
    if left:
        print("警告: 埋め込まれなかった参照:", left[:5])
    open(DST, "w", encoding="utf-8").write(s)
    print(f"{len(refs)} 点を埋め込み ({total/1024:.0f} KB) -> {DST} "
          f"({os.path.getsize(DST)/1024/1024:.2f} MB)")

if __name__ == "__main__":
    main()
