---
title: "Detection Engineering ve Detection-as-Code: Sigma ve ATT&CK ile Kural Mühendisliği"
date: 2026-10-09
description: "Tespit kurallarını modern yazılım disipliniyle geliştirmek: MITRE ATT&CK hipotezlerinden Sigma kurallarına, Elastic ve Splunk sorgu dönüşümünden doğrulama testlerine ve kural yaşam döngüsüne uzanan rehber."
tags: ["Detection Engineering", "Detection-as-Code", "Sigma", "MITRE ATT&CK", "SIEM", "Elastic", "Splunk", "SOC"]
image: featured.webp
type: posts
topic: detection-response
draft: true
featuredImageAlt: "Detection-as-Code kapağı: graf simgeli kalkan ve Sigma, MITRE ATT&CK etiketleri"
---

Bir Güvenlik Operasyon Merkezi'nin (SOC) olgunluğu, her gün içeriye akıttığı terabaytlarca log miktarıyla değil, o log yığınlarının arasından çekip çıkardığı tespitlerin kalitesiyle ölçülür. 

Pek çok kurumda manzara ne yazık ki tanıdık: Tespit kuralları hâlâ SIEM konsolunda alelacele elle yazılıyor, kimin neyi neden değiştirdiği belgelenmiyor, bir kuralın gerçekten çalışıp çalışmadığı ise ancak kritik bir saldırı kaçırıldığında fark ediliyor. Sonuç? Analistleri tüketen alarm yorgunluğu ve kimsenin dokunmaya cesaret edemediği yüzlerce unutulmuş miras kural.

İşte tam bu noktada **Detection-as-Code (DaC)** devreye giriyor. Tespit mühendisliğine modern yazılım geliştirme disiplinini getiriyoruz: Kurallar Git üzerinde sürüm kontrolünde yaşıyor, platformdan bağımsız bir formatta yazılıyor, örnek loglarla test ediliyor, kod incelemesiyle (Pull Request) onaylanıyor ve sürüm geçmişi tutularak yönetiliyor.

Gelin bir MITRE ATT&CK tekniğinden yola çıkıp Sigma kuralı, otomatik sorgu dönüşümü, doğrulama testleri ve kalite metrikleriyle tamamlanan yaşayan bir tespit döngüsünü birlikte inceleyelim.

<div class="glass-panel reveal-on-scroll">

| Kriter | Geleneksel Kural Yönetimi | Detection-as-Code (DaC) |
| :--- | :--- | :--- |
| **Kuralın Yaşadığı Yer** | SIEM konsolu, kişisel notlar | Git deposu (tek doğruluk kaynağı) |
| **Format** | Ürüne özgü kapalı sorgu dili | Platformdan bağımsız Sigma + otomatik derleme |
| **Değişiklik Kontrolü** | Belgelenmemiş, geri alınamaz | Pull Request, kod incelemesi, commit geçmişi |
| **Doğrulama** | Olay kaçırılınca anlaşılır | Pozitif/negatif loglarla doğrulama testleri |
| **Kalite Ölçümü** | Sezgisel ve kulaktan dolma | Precision, alarm hacmi ve ATT&CK kapsama metrikleri |
| **Dağıtım** | Elle kopyala-yapıştır | Sürüm kontrollü, tekrarlanabilir dağıtım |

</div>

---

## Tespit Yaşam Döngüsü

Detection-as-Code tek bir araç değil, uçtan uca yaşayan bir mühendislik sürecidir. Her kural bir tehdit hipoteziyle doğar, kontrollü testlerle olgunlaşır ve sahadaki performansına göre ya ince ayara (tuning) tabi tutulur ya da emekliye ayrılır.

```mermaid
flowchart TD
    subgraph Tasarim ["1. Kural Tasarımı"]
        Intel["Tehdit İstihbaratı & ATT&CK"] --> Rule["Sigma Kuralı (Git)"]
    end

    subgraph CI ["2. CI/CD Doğrulama"]
        Rule --> Validate["Sözdizimi & Format Kontrolü"]
        Validate --> Test["Örnek Loglarla Test"]
        Test --> Review["Takım İncelemesi & PR Onayı"]
    end

    subgraph Canli ["3. Dağıtım & Geri Bildirim"]
        Review --> Deploy["SIEM / EDR Dağıtımı"]
        Deploy --> Metrics["Canlı Ortam Metrikleri"]
        Metrics -.->|İnce Ayar (Tuning)| Rule
    end
```

### Hipotezden Kurala

İyi bir tespit mühendisliği çalışması her zaman şu soruyla başlar: *"Bu saldırı tekniği bizim ağımızda ve sunucularımızda nasıl bir ayak izi bırakır?"* 

MITRE ATT&CK matrisi bu soruyu çerçevelemek için harika bir ortak sözlük sunar. Ancak kural yazmaya başlamadan önce şu üç kritik sorunun cevabını netleştirmeniz gerekir:

1. **Görünürlük:** Bu tekniği yakalamak için gereken telemetri (örneğin Sysmon Event ID 1, Windows Event ID 4688, EDR süreç olayları) gerçekten merkezi log havuzuna akıyor mu?
2. **Meşru Gürültü:** Aynı davranışı ortamımızda hangi yönetim araçları, yedekleme betikleri veya IT ekipleri meşru olarak sergiliyor?
3. **Aksiyon:** Bu alarm tetiklendiğinde nöbetçi analist ne yapacak? Net bir müdahale adımı (Playbook) olmayan bir alarm, sadece ekrana düşen gereksiz bir gürültüdür.

---

## Sigma: Platformdan Bağımsız Kural Standardı

Sigma, tespit mantığını temiz bir YAML yapısıyla, belirli bir SIEM'in sorgu diline kilitlenmeden ifade etmenizi sağlar. Yazdığınız tek bir Sigma kuralı Elastic (Lucene/ES|QL), Splunk (SPL), Microsoft Sentinel (KQL) veya Chronicle platformlarına otomatik olarak derlenebilir. Bu sayede hem ürün bağımlılığından kurtulursunuz hem de kurallarınızı küresel toplulukla rahatça paylaşabilirsiniz.

### Örnek Kural: Kodlanmış PowerShell Çalıştırması

Aşağıdaki kural, PowerShell'in Base64 ile kodlanmış parametrelerle başlatılmasını tespit eder (ATT&CK T1059.001). Bu yöntem hem saldırganların hem de bazı kurumsal dağıtım araçlarının sıkça başvurduğu bir teknik olduğu için `falsepositives` ve `filter_*` alanları özenle tanımlanmıştır:

```yaml
title: PowerShell Encoded Command Execution
id: 6f3c2a8e-1d4b-4c7e-9a2f-5b8d0e7c1a93
status: test
description: Detects PowerShell launched with a Base64-encoded command parameter.
references:
  - https://attack.mitre.org/techniques/T1059/001/
author: Yusuf Talha ARABACI
date: 2026-10-09
tags:
  - attack.execution
  - attack.t1059.001
logsource:
  category: process_creation
  product: windows
detection:
  selection_img:
    Image|endswith:
      - '\powershell.exe'
      - '\pwsh.exe'
  selection_cli:
    CommandLine|contains:
      - ' -enc '
      - ' -encodedcommand '
      - ' -ec '
  filter_known_admin:
    ParentImage|endswith: '\ccmexec.exe'
  condition: all of selection_* and not filter_known_admin
falsepositives:
  - Software deployment agents and signed administrative scripts
level: medium
```

Bu yapıda öne çıkan detaylar:
- **`id`:** Benzersiz bir UUID. Kuralın adı ileride değişse bile üretim metrikleri ve sürüm geçmişi bu kimlik üzerinden izlenir.
- **`status`:** Kuralın yaşam evresi (`experimental` → `test` → `stable`). Dağıtım politikalarınızı bu alana göre şekillendirebilirsiniz.
- **`filter_*`:** Meşru istisnaları kural içinde açıkça belgeler. Böylece "Bu istisna neden eklendi?" sorusunun cevabı doğrudan kodun içinde yaşar.

---

## Otomatik Sorgu Dönüşümü (Pipelines)

Sigma kurallarını hedef SIEM formatına çevirmek için `sigma-cli` ve pySigma backend'lerini kullanırız. Dönüşüm sırasında **pipeline (dönüşüm hattı)**, genel alan adlarını hedef ortamın şemasına eşler, örneğin Elastic tarafında Elastic Common Schema (ECS) alanlarına:

```bash
pip install sigma-cli
sigma plugin install elasticsearch
sigma plugin install splunk

# Sözdizimi ve şema doğrulaması
sigma check rules/

# Elastic (Lucene sorgusu, ECS alan eşlemesi)
sigma convert -t lucene -p ecs_windows rules/windows/process_creation/

# Splunk (SPL sorgusu)
sigma convert -t splunk -p splunk_windows rules/windows/process_creation/
```

> [!WARNING]
> **Sessiz Alan Eşleme Hatası:** Detection-as-Code projelerinde en tehlikeli hata türü, sözdizimi doğru olan fakat hedef SIEM şemasında karşılığı bulunmayan bir alanın sorgulanmasıdır. Kural hata vermez, ama ilgili alan loglarda hiç olmadığı için hiçbir zaman tetiklenmez. Bu yüzden bir kuralı sadece derlemek yetmez, mutlaka otomatik testlerden geçirmek gerekir.

---

## Örnek Loglarla Kural Doğrulama

Bir kuralın sahada gerçekten çalıştığını kanıtlamanın en güvenilir yolu, onu bilinen örnek log setlerine karşı doğrulamaktır. Her kural için depomuzda iki tür test verisi bulundururuz:

- **Pozitif Örnekler (`positive.ndjson`):** Kuralın kesinlikle yakalaması gereken zararlı olay logları (lab ortamında üretilmiş simülasyonlar veya gerçek saldırı kayıtları).
- **Negatif Örnekler (`negative.ndjson`):** Kuralın asla tetiklenmemesi gereken, üretimden anonimleştirilmiş günlük meşru trafik logları.

### Test ve Doğrulama Senaryosu

Dönüştürülen kural sorgusunu örnek log setine karşı test eden basit bir doğrulama betiği:

```python
import json
from pathlib import Path
import pytest
from elasticsearch import Elasticsearch

es = Elasticsearch("http://localhost:9200")
CASES = sorted(Path("tests").glob("*/expected.json"))

def load(index: str, path: Path) -> None:
    for line in path.read_text(encoding="utf-8").splitlines():
        es.index(index=index, document=json.loads(line))
    es.indices.refresh(index=index)

@pytest.mark.parametrize("case", CASES, ids=lambda p: p.parent.name)
def test_rule(case: Path) -> None:
    spec = json.loads(case.read_text(encoding="utf-8"))
    query = Path(spec["query_file"]).read_text(encoding="utf-8").strip()

    for kind in ("positive", "negative"):
        index = f"test-{case.parent.name}-{kind}"
        load(index, case.parent / f"{kind}.ndjson")
        hits = es.count(index=index, q=query)["count"]
        assert hits == spec[f"{kind}_hits"], f"{kind}: {hits} != {spec[f'{kind}_hits']}"
```

Bu doğrulama yaklaşımı sayesinde iki büyük problem sahaya çıkmadan yakalanır:
1. Hiçbir şeyi yakalamayan kör kurallar (pozitif testte 0 sonuç).
2. Ortamı gürültüye boğacak aşırı hassas kurallar (negatif testte beklenmeyen sonuçlar).

---

## Metrikler ve Kural Kalitesinin Ölçülmesi

Bir tespit kuralının gerçek başarısı, analistin vaktini ne kadar verimli kullandığıyla doğrudan ilişkilidir. Üretimdeki her alarm, triyaj aşamasında net olarak etiketlenmelidir (True Positive, False Positive, Legitimate Activity).

<div class="render-cards">
  <article class="render-card">
    <h4>Precision (Kesinlik)</h4>
    <p>Gerçek pozitiflerin toplam alarm sayısına oranı: <code>TP / (TP + FP)</code>. Düşük precision, analistleri tüketen gürültü anlamına gelir.</p>
  </article>
  <article class="render-card">
    <h4>Alarm Hacmi</h4>
    <p>Kural başına günlük tetiklenme sayısı. Ani sıçramalar ya aktif bir saldırıyı ya da ağda değişen meşru bir operasyonu işaret eder.</p>
  </article>
  <article class="render-card">
    <h4>ATT&CK Kapsaması</h4>
    <p>Yalnızca yazılan değil, testlerle doğrulanmış kuralların kapsadığı teknikler. Hangi alanlarda kör noktamız olduğunu gösterir.</p>
  </article>
  <article class="render-card">
    <h4>Tespit Süresi (MTTD)</h4>
    <p>Saldırının gerçekleştiği an ile alarmın analist ekranına düştüğü an arasındaki fark, log alma gecikmelerini ortaya çıkarır.</p>
  </article>
</div>

Saha tecrübesiyle sabit harika bir kural: Precision oranı belirlenen eşiğin (örneğin %70) altına inen kurallar otomatik olarak "inceleme kuyruğuna" alınmalı ve sorumlu mühendise atanmalıdır. Kural deposu zamanla büyüyen bir çöplük değil, sürekli budanan sağlıklı bir bahçe gibi yönetilmelidir.

---

## Sürüm Kontrolü ve Dağıtım İlkeleri

Kurallar için Git tek doğruluk kaynağıdır (Single Source of Truth). Kod incelemesinden geçen ve test edilen kurallar doğrudan sürüm kontrolü altında saklanır. Birisi SIEM arayüzünden kural üzerinde elle değişiklik yaptığında, sürüm geçmişi sayesinde bu değişiklikler kolayca tespit edilebilir ve kontrol altında tutulabilir.

### Güvenli Dağıtım İlkeleri

- **Gölge Mod (Shadow Mode):** Yeni bir kural doğrudan alarm üretmek yerine önce birkaç gün sessizce çalışır, sadece log eşleşmeleri kaydedilir. Böylece gerçek ortamdaki gürültü seviyesi önceden görülür.
- **Seviye Bazlı Ayrıştırma:** `level: low` kurallar yalnızca korelasyon veya tehdit avcılığı için arka planda tutulurken, `high` ve `critical` kurallar analistin önüne doğrudan vaka olarak düşer.
- **Geri Alma (Rollback):** Her dağıtım bir Git etiketiyle ilişkilendirilir. Sorun çıkaran bir kural seti tek bir Git komutuyla anında eski sürümüne döndürülebilir.

---

## Nereden Başlamalı?

Detection-as-Code dönüşümünü bir gecede tamamlayamazsınız, adım adım ilerlemek gerekir:

1. **Önce Görünürlük:** Mevcut SIEM kurallarınızı dışa aktarın ve bir Git deposuna koyun. Henüz dönüştürmeye çalışmayın, önce kurallarınızı sürüm kontrolüne alın.
2. **Yeni Kurallarla Başlayın:** Bugünden itibaren yazılacak her yeni kuralı yalnızca Sigma ile yazın ve deponuzda `sigma check` adımını zorunlu kılın.
3. **İlk Test Seti:** En kritik 5-10 kuralınız için pozitif ve negatif örnek log dosyaları oluşturup kural mantığını doğrulayın.
4. **Metrikleri Takip Edin:** Triyaj sonuçlarını kural kimlikleriyle eşleştirerek gerçek precision değerlerinizi ölçmeye başlayın.
5. **Arayüzü Kilitleyin:** Kuralları merkezi Git deposunda toplayın ve SIEM arayüzünden doğrudan elle kural düzenlemeyi sınırlandırın.

Tespit mühendisliği, saldırganların dinamizmine ayak uydurabilmek için ölçülebilir, test edilebilir ve tekrarlanabilir olmak zorundadır. Kurallarınızı kod gibi yönettiğinizde, her alarm rastlantısal bir uyarı değil, matematiksel bir hipotezin doğrulanmış sonucu haline gelir.
