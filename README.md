# Yildiz Tief & Netzausbau GmbH Website

Statik GitHub Pages sitesi (build step yok).

## Güncel yapı

- `index.html`: Tek sayfa içerik ve semantik yapı
- `css/main.css`: Tüm stil sistemi (responsive + reduced-motion dahil)
- `js/main.js`: Menü, scroll, animasyon, sayaç, galeri modal davranışları
- `Media/`: Kurumsal logo ve proje görselleri
- `legacy/`: Eski CSS/JS dosyalarının arşivi (referanssız)

## Lokal önizleme

```bash
cd /Users/dersa/Desktop/yildiz-web/yildizweb.github.io
python3 -m http.server 8080
```

Tarayıcı:

- `http://127.0.0.1:8080`

## Deploy

`main` branch'e push edildiğinde GitHub Pages otomatik güncellenir.
