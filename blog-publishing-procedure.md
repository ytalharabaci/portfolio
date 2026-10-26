# Blog Yazısı Yayınlama Standartları ve Prosedürü (Blog Publishing Standards & Procedure)

Bu doküman, yusufarbc blog sitesinde yeni yazı yazma, çeviri, görsel/ses optimizasyonu ve seslendirme süreçlerinde takip edilmesi gereken standartları belirler.

---

## 📂 Klasör Yapısı ve Dosya Hiyerarşisi

Tüm varlıklar (görsel, ses, metin) yazının kendi klasörü (slug) altında saklanmalıdır. Genel `/public` klasörü **kullanılmamalıdır**.

```text
content/yazı-slug-adı/
├── index.tr.md           # Türkçe makale
├── index.en.md           # İngilizce makale
├── featured.webp         # Kapak görseli (WebP - En çok 1200 x 630 piksel, 1.91:1 oranında)
└── [diger-gorseller].webp # Diğer görseller (WebP)
```

> [!IMPORTANT]
> Depo boyutunu korumak amacıyla ham görsel (`.png`, `.jpg`) ve yüksek boyutlu ham ses (`.wav`) dosyaları kesinlikle repoya eklenmemelidir.
>
> ### 🖼️ Kapak Görseli (Featured Image) ve Open Graph (OG) Standardı
> - **Tam Boyut:** 1200 × 630 piksel
> - **En-Boy Oranı:** 1.91:1
> - **Format:** `featured.webp` (WebP kalitesi %80-85, dosya boyutu < 150 KB)
> - **Kullanım Amacı:** Web ve dijital pazarlama dünyasında buna **Open Graph (OG) Görsel Boyutu** denir. Web sitesinin linki WhatsApp, LinkedIn, Facebook, X (Twitter / `summary_large_image`), Slack veya Telegram gibi yerlere yapıştırıldığında otomatik açılan önizleme kartının (kart banner'ının) kesilmeden, tam oturması için belirlenmiş evrensel standarttır.
> - **Tasarım & Kompozisyon Kuralı:** Görsel kenardan kenara (full-bleed / edge-to-edge) tüm çerçeveyi doldurmalıdır. Kare bir görselin sağına/soluna beyaz veya siyah boşluk (pillarbox/letterbox) eklenerek 1200x630 yapılmamalıdır. Ana odak noktası (ikon/logo/merkez öge) merkezdeki güvenli alanda (Safe Zone ~ 1080 × 560 px) yer almalıdır.
yazı içermemeli
---

## 🏷️ İçerik ve Yazım Standartları

### 1. Başlık Hiyerarşisi
- **Numaralandırma Yok:** Başlıklarda `1.`, `1.1` gibi numaralar kullanılmaz. Otomatik TOC (İçindekiler) menüsü ve seslendirme scriptleri hiyerarşiyi kendiliğinden yönetir.
- **Seviyeler:** Makale gövdesinde `# H1` kullanılmaz (YAML frontmatter'daki `title` alanından çekilir). Bölümler için `## H2`, alt başlıklar için `### H3` (en fazla `#### H4`) kullanılır.
- **Geçişler:** Her `## H2` başlığından önce yatay çizgi (`---`) eklenmelidir. H2 başlığının hemen altına araya açıklayıcı bir paragraf girmeden H3 başlığı getirilmemelidir.

### 2. Giriş ve Sonuç Bölümleri
- **H2 Başlığı Kullanılmamalıdır:** Giriş ve Sonuç kısımları için kesinlikle `## Giriş` veya `## Sonuç` gibi H2 başlıkları açılmamalıdır. Bu sayede sol TOC menüsü yalnızca teknik ana bölümlere odaklanır.
- **Giriş:** Doğrudan başlar, 1-2 paragrafın ardından kıyaslama tablosu içeren `<div class="glass-panel reveal-on-scroll">` bloğu ile devam eder.
- **Sonuç:** Son teknik bölümden (veya `---` çizgisinden) sonra düz paragraf olarak akmalıdır. Türkçe kapanışta `"Verinizin mimarı olun, egemenliğinizi geri alın. Dinlediğiniz için teşekkürler!"` veya benzeri bir ifade kullanılmalıdır.

### 3. Mermaid Diyagramları
- **Sadelik:** Node sayısı 8-10 adedi geçmeyen, doğrusal/katmanlı (`graph TD` veya `graph LR`) akışlar tercih edilmelidir.
- **Dinamik Temalandırma:** Kutuların renkleri için elle hex kod yazılmamalı, Aydınlık/Karanlık modla uyumlu küresel CSS sınıfları atanmalıdır:
  - `node-accent` (Mavi/Vurgu)
  - `node-success` (Yeşil/Güvenli/İç sistem)
  - `node-danger` (Kırmızı/Saldırı/Tehdit)
  - `node-warning` (Sarı/Ara durum/Uyarı)
- **Örnek:**
  ```text
  graph LR
      A[Saldırgan] -->|Prompt Injection| B[AI İstemcisi]
      class A node-danger;
      class B node-accent;
  ```

- **Etiketlerde Parantez:** Parantez veya özel karakter içeren kenar etiketleri tırnak içine alınmalıdır: `A -->|"Çekme (Outbound mTLS)"| B`. Tırnaksız `|... (x)|` etiketleri diyagramın hata grafiği olarak çizilmesine yol açar.
- **Çeviri Eşleşmesi:** TR ve EN diyagramlar aynı sözdizimini kullanmalıdır; yalnızca etiket metinleri çevrilir.

### 4. Okunabilirlik ve Erişilebilirlik
- **Kod Blokları:** Her kod bloğunda dil belirtilmelidir (` ```bash `, ` ```python `, ` ```powershell `, ` ```yaml `, ` ```kql `, ` ```log ` vb.). Dil belirtilen bloklar derleme anında renklendirilir; belirtilmeyenler düz metin kalır.
- **Görsel Alt Metni:** `![](gorsel.webp)` yerine `![Görselin kısa açıklaması](gorsel.webp)` kullanılmalıdır (ekran okuyucular ve SEO için).
- **Tablolar:** Geniş tablolar mobilde kendi içinde yatay kaydırılır; yine de 5'ten fazla sütundan kaçınılmalı, uzun sorgular tablo yerine kod bloğuna konmalıdır.
- **Renkler:** HTML bloklarında `color: #f1f5f9` gibi yalnızca koyu temada okunan sabit renkler kullanılmamalıdır. Renk gerekiyorsa `var(--app-text)`, `var(--app-text-dim)`, `var(--app-accent-color)` tokenları tercih edilmelidir.
- **Stil/Script:** Markdown içine `<style>` veya `<script>` bloğu eklenmemelidir; `<script>` derlemede zaten temizlenir, `<style>` ise tüm siteyi etkiler. Ortak bileşen stilleri `src/styles/base.css` dosyasındadır.

---

## 🛠️ Otomasyon Scriptleri ve Adım Adım İş Akışı

Scriptlerin ve bu dokümanın depo kökünde (`/`) bulunması, yapay zeka ajanlarının bu kuralları doğrudan okuyabilmesini sağlar.

### Ön Gereksinimler:
Sisteminizde Python 3, Pillow kütüphanesi ve FFmpeg kurulu olmalıdır:
```powershell
pip install pillow
winget install ffmpeg
```

### Adım 1: Klasör ve Metin Dosyaları
`content/yazı-slug-adı/` klasörünü oluşturup içine `index.tr.md` ve `index.en.md` dosyalarını yazın. (`index.<dil>.md` adlandırması CMS'in iki dilli yapısıdır; `tr.md` gibi adlar siteye yüklenmez.)

### Adım 2: Görsel Optimizasyonu (WebP) ve Kapak Görseli
Görselleri WebP formatına dönüştürüp kalitelerini optimize etmek (2000px üzeri görselleri yeniden boyutlandırıp %80 WebP yapar) ve ham dosyaları silmek için:
```bash
python optimize_images.py content/yazı-slug-adı/ --delete
```
*(Yazı içerisindeki görsel referanslarını `.webp` olarak güncellemeyi unutmayın!)*

> [!IMPORTANT]
> **Kapak Görseli (`featured.webp`):** Yazının kapak görseli (`featured.webp`) kesinlikle **1200 x 630 piksel** (1.91:1 Open Graph standardı) boyutunda olmalıdır. Kenarlarda boşluk kalmamalı (full-bleed), sosyal medya ve link paylaşımlarında kusursuz görünmelidir.


### Adım 3 YAML Frontmatter Yapılandırması
`index.tr.md` ve `index.en.md` dosyalarının başına ses parametrelerini ekleyin:
```yaml
---
title: "Ofis Ekosisteminden Kaçış"
date: 2026-05-18
description: "Veri egemenliğini geri kazanmak."
tags: ["Sovereign Stack", "Open Source"]
draft: false
image: featured.webp
type: posts
topic: cloud-infrastructure
# featured: true   # isteğe bağlı: ana sayfadaki "Öne Çıkan Yazılar"da gösterir (en fazla 3)
---
```

- **`topic` (zorunlu):** Blog ve write-up listelerindeki konu filtresini besler. Yalnızca `src/config/site.ts` içindeki `TOPICS` anahtarlarından biri olabilir (`detection-response`, `appsec-devsecops`, `cloud-infrastructure`, `network-endpoint`, `offensive-security`); bilinmeyen bir değer build'i durdurur.
- **`featured`:** Ana sayfa en yeni 3 öne çıkan yazıyı gösterir. Taslak (`draft: true`) yazılar öne çıkarılmaz.

### Adım 4: Test ve Yayına Alma
Yerel sunucuda test edip yayına alın:
```bash
npm run dev
```

### Alternatif: Tarayıcıdan CMS ile Yayınlama
Adım 1–3, `https://ytalharabaci.dev/admin/` (Sveltia CMS) üzerinden de yapılabilir. Giriş ve kurulum ayrıntıları `README.md` içindeki "Content editing (CMS)" bölümündedir.

1. **Yazılar** koleksiyonunda yeni yazı açın ve `Type` alanında Blog ya da Write-up seçin. Slug panelinde klasör adını girin (ör. `detection-engineering-as-code`). Yazı `draft: true` olarak başlar.
2. Türkçe ve İngilizce sürümler aynı girdide yan yana düzenlenir. Tarih, tür, konu ve kapak görseli gibi ortak alanlar TR'den EN'e otomatik kopyalanır. Başlık, açıklama, etiketler ve gövde her dilde ayrıdır.
3. **Kapak görseli** alanında görseli seçin; açılan pencerede 1200 × 630 çerçeveye göre kırpın, sonuç `featured.webp` olarak kaydedilir. Yazı içi görseller yazının klasörüne kaydedilir ve otomatik olarak WebP'ye (en fazla 1200 px genişlik) dönüştürülür.
   - Bir yazının tüm görsellerini görmek, toplu yüklemek veya silmek için panelin medya simgesini kullanın: **Görseller** sayfası (`/admin/media/`) her yazıyı bir klasör olarak gösterir, yazıda kullanılmayan görselleri işaretler ve görselin Markdown kodunu (`![Görselin kısa açıklaması](dosya.webp)`) kopyalar.
4. Hazır olduğunda iki dilde de `Draft` işaretini kaldırıp kaydedin. Her kayıt `main`'e commit edilir ve GitHub Actions siteyi yeniden yayınlar.

---

## 🤖 Yapay Zeka (AI) ve LLM Prompt Standartları

### 1. Yeni Blog Yazısı Yazma Promptu
```text
Role: Senior Security/System Engineer and Technical Writer.
Task: Write a deep-dive technical blog post.
Guidelines:
1. Provide rich technical details, keeping it engaging.
2. Use markdown tables and Mermaid.js diagrams.
3. Utilize CSS styles/HTML panels:
   - <div class="glass-panel reveal-on-scroll"> (for comparison tables/highlights)
   - <div class="render-cards"> and <article class="render-card ..."> (for alternative tools/features)
4. Reference local WebP images: `![Alt Text](filename.webp)`.
5. Add the following YAML frontmatter block at the top:
---
title: "[Post Title]"
date: [YYYY-MM-DD]
description: "[Brief hook description]"
tags: ["Tag1", "Tag2"]
draft: true
image: featured.webp
type: posts
topic: [one of the TOPICS keys in src/config/site.ts]
---

Topic: [ENTER BLOG TOPIC OR OUTLINE HERE]
```

### 2. Çeviri ve Senkronizasyon (1:1) Promptu
```text
Role: Technical Translator.
Task: Translate the blog post from source language to target language.
Guidelines:
1. Maintain strict 1:1 structural alignment. Do not split, merge, or change the order of paragraphs.
2. Keep all HTML tags (`<div>`, `<span>`, `<table>`, `<img>`) and class names intact.
3. Keep image filenames exactly the same (e.g., `featured.webp`).
4. Translate frontmatter `title` and `description`. Keep `date`, `tags`, `image`, `type`, `topic`, and `featured` identical.
5. Use standard, precise industry terms in the target language.

Source Text:
[ENTER SOURCE MD CONTENT HERE]
```

