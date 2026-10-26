---
title: "Popüler Uç Nokta Güvenlik Çözümleri: Mimari ve Operasyonel Analiz"
date: '2025-03-01'
draft: false
description: "Kurumsal uç nokta güvenliğinde yaygın olarak tercih edilen CrowdStrike, SentinelOne, Microsoft Defender ve Trend Micro gibi EDR/XDR çözümlerinin mimari, telemetri ve operasyonel analizi."
image: featured.webp
type: posts
topic: network-endpoint
tags: ["Endpoint Security", "EDR", "XDR", "EPP", "Antivirus"]
featuredImageAlt: "Koyu mavi arka plan üzerinde parlayan, anahtar delikli kalkan"
---

Kurumsal uç nokta güvenliğinde geleneksel antivirüs ve EPP modelleri, modern saldırganların Living-off-the-Land (LotL) tekniklerine, bellek içi kod enjeksiyonlarına ve kimlik suistimallerine karşı tek başına ayakta kalamıyor. Tehditleri yalnızca statik imza veritabanlarıyla engellemeye çalışmak artık geçmişte kaldı. Uç noktada gerçekleşen her sistem çağrısını izleyen, süreç zincirlerini korele eden ve saniyeler içinde otonom müdahale kabiliyeti sunan EDR ve XDR platformları, kurumsal savunmanın omurgasını oluşturuyor.

Bu yazıda, sektörde yaygın kabul gören lider uç nokta güvenlik platformlarını mimari yaklaşımları, telemetri derinlikleri ve operasyonel avantaj/dezavantajlarıyla mercek altına alıyoruz.

---

## EPP, EDR ve XDR: Temel Farklar ve Evrim

Güvenlik yatırımlarını değerlendirirken yalnızca toplanan telemetriye değil, yönetim mimarisine ve toplam sahip olma maliyetine (TCO) odaklanmak gerekir. Modern uç nokta güvenlik katmanları şu temel dinamiklerle birbirinden ayrılır:

| Özellik | EPP (Endpoint Protection) | EDR (Endpoint Detection & Response) | XDR (Extended Detection & Response) |
| :--- | :--- | :--- | :--- |
| **Yönetim Tarzı** | Pasif / Kuralcı ("Kur ve unut"). Politikalar merkezden periyodik basılır. | Aktif / Analitik. Sürekli telemetri takibi ve proaktif tehdit avcılığı (Threat Hunting) gerektirir. | Hibrit / Otomatize. Uç nokta, ağ, kimlik ve bulut sistemlerinin orkestre edilmiş merkezi yönetimidir. |
| **Alarm Tipi** | İkili (Binary 0/1). Tehdit ya engellenmiştir ya da yoktur. Genellikle "Temizlendi" çıktısı üretir. | Konseptsel ve bağlamsal. Davranışın neden şüpheli olduğunu kanıt zinciriyle sunar. | Bütünsel (Storyline). Saldırı zincirinin (Kill Chain) tamamını tek bir hikaye akışı olarak görselleştirir. |
| **Alarm Yönetimi** | Az sayıda alarm üretir, ancak kaçırma (False Negative) riski yüksektir. | Düşük anomalileri de raporlar, bu durum analistlerde alarm yorgunluğu (Alert Fatigue) yaratabilir. | Çok kaynaklı korelasyon motorlarıyla alakasız sinyalleri eler, gürültüyü %50-70 oranında düşürür. |
| **Müdahale (Response)** | Dosya karantinası, USB engelleme, temel sistem taraması. | Cihaz izolasyonu, süreç (process) sonlandırma, RAM dökümü alma, uzaktan komut çalıştırma. | EDR kabiliyetlerine ek olarak, güvenlik duvarında IP engelleme, kimlik oturumu kapatma, zararlı e-postayı silme. |
| **Gerekli Kaynak** | IT veya Sistem Yöneticisi tarafından kolayca idare edilebilir. | Yetkin SOC analistleri ve güvenlik mühendisleri gerektirir. | Üst düzey güvenlik mimarları veya Yönetilen Tespit ve Müdahale (MDR) desteği ister. |

---

## CrowdStrike Falcon

Cloud-native mimarinin öncülerinden olan CrowdStrike Falcon, hafif istemci tasarımı ve yüksek ölçeklenebilirliğiyle kurumsal pazarda standartları belirleyen çözümlerden biri. Uç noktaya binen yükü asgari seviyede tutan tek bir ajan üzerinden çalışır. Çekirdek sürücüsü düzeyinde toplanan olay verileri anlık olarak Threat Graph motoruna aktarılır.

Platformun öne çıkan modüllerinden **Falcon Discover**, ağdaki yetkisiz yazılımları ve hesap hijyenini takip ederken: **Falcon for IT** modülü ise osquery altyapısını kullanarak tüm filoda SQL sorgularıyla gerçek zamanlı operasyonel veri çekilmesini sağlar. Doğal dil destekli Charlotte AI katmanı, analistlerin karmaşık tehdit sorgularını hızla sonuçlandırmasına yardımcı olur.

*   **Artıları:** Sisteme yük bindirmeyen son derece hafif ajan mimarisi, yapay zeka destekli Charlotte AI sorgulama desteği, kapsamlı küresel tehdit istihbaratı.
*   **Eksileri:** Modüler lisanslama modeli nedeniyle genişleme maliyetlerinin hızla yükselmesi, zafiyetleri tespit etmesine rağmen yerleşik doğrudan yama dağıtım yeteneğinin bulunmaması.

![CrowdStrike Falcon Yönetim Konsolu ve Tehdit Grafiği](1__kgTgnMeuxdWZpaqUIRQuA.webp)

> [CrowdStrike Resmi Dokümantasyonu ve XDR Rehberi](https://www.crowdstrike.com/cybersecurity-101/what-is-xdr/)

---

## Cybereason

Cybereason, uç nokta tespit ve müdahale alanında görsel analiz kabiliyetiyle fark yaratan bir platformdur. Bulut hizmetlerinin yanı sıra şirket içi (on-premise) dağıtım seçeneği sunabilen nadir kurumsal oyunculardan biridir, ancak gelişmiş XDR yetenekleri ağırlıklı olarak bulut sürümünde yer alır.

Platformun kalbinde **Malop (Malicious Operation)** motoru yer alır. Malop, dağınık gibi görünen yüzlerce şüpheli olayı tek bir saldırı senaryosu altında gruplayarak kök neden analizini kolaylaştırır. Analistler, saldırganın ilk giriş noktasından yana doğru hareket (lateral movement) adımlarına kadar tüm aşamaları tek ekranda görsel bir soy ağacı gibi inceleyebilir.

*   **Artıları:** Dağınık olayları anlamlı bir anlatıya dönüştüren başarılı Malop görselleştirmesi, şirket içi (on-premise) kurulum esnekliği.
*   **Eksileri:** Kapsamlı XDR özelliklerinin buluta bağımlı olması, pazar lideri rakiplere kıyasla üçüncü parti entegrasyon ekosisteminin daha sınırlı kalması.

![Cybereason Malop Saldırı Analiz Görünümü](1_aAxP6F9J1jCk4t9qtoMjtw.webp)

> [Cybereason Platform Genel Bakış](https://www.cybereason.com/platform)

---

## Microsoft Defender for Endpoint

Eski adıyla Microsoft Defender ATP, Windows ekosisteminin çekirdeğine doğrudan entegre edilmiş yerleşik bir EDR/XDR platformudur. Ayrı bir ajan kurulumuna ihtiyaç duymaması, Windows ağırlıklı kurumsal filolarda dağıtım ve bakım maliyetlerini neredeyse sıfıra indirir.

Microsoft 365 Defender çatısı altında kimlik (Entra ID), e-posta (Defender for Office 365) ve bulut iş yükleriyle (Defender for Cloud) yerel olarak haberleşir. Bu sıkı entegrasyon, kimlik hırsızlığıyla başlayan ve uç noktada komut çalıştırmaya uzanan saldırı zincirlerini tek bir konsolda birleştirme gücü kazandırır.

*   **Artıları:** Windows işletim sistemine yerleşik olması (ek ajan dağıtımı gerektirmez), Microsoft kurumsal ekosistemiyle eksiksiz ve doğal entegrasyon.
*   **Eksileri:** Linux ve macOS ortamlarında yönetim karmaşıklığı, en kritik koruma ve otomasyon kabiliyetlerinin yalnızca üst düzey (E5/G5) lisans paketlerinde sunulması.

![Microsoft Defender for Endpoint Güvenlik Portalı](1_V8WCU_-sfrU6AN97IFk8mQ.webp)

> [Microsoft Defender XDR ve Sıfır Güven Mimarisi](https://www.infusedinnovations.com/blog/secure-intelligent-workplace/budgeting-for-microsoft-defender-xdr-and-zero-trust-security)

---

## Palo Alto Cortex XDR

Palo Alto Cortex XDR, sadece uç noktaya odaklanmak yerine ağ trafiğini, güvenlik duvarı günlüklerini ve bulut telemetrisini aynı potada eriten kapsamlı bir XDR yaklaşımı benimser. Palo Alto'nun Yeni Nesil Güvenlik Duvarları (NGFW) ile doğrudan entegre çalışması, ağ seviyesinde benzersiz bir görünürlük sağlar.

Özellikle **Pathfinder** teknolojisi, ajan kurulamayan IoT cihazları, tıbbi ekipmanlar ve akıllı altyapı bileşenlerinin ağ hareketlerini profillemede etkilidir. Şüpheli bir hareket saptandığında, yerleşik SOAR yetenekleri devreye girerek hem uç noktayı hem de ağ portunu anında karantinaya alabilir.

*   **Artıları:** Ağ, uç nokta ve bulut telemetrisi arasında sektörün en tutarlı korelasyon motoru, NGFW entegrasyonuyla otomatik ağ seviyesi izolasyon.
*   **Eksileri:** Çözümden tam verim alabilmek için Palo Alto ağ donanımlarına bağımlı olunması, yüksek lisanslama ve veri saklama maliyetleri.

![Palo Alto Cortex XDR Olay İnceleme Ekranı](1_isZKTqF4Dh4MoKGRIFmEBw.webp)

> [Palo Alto Cortex XDR Mimarisi ve İncelemesi](https://www.xcitium.com/palo-alto-cortex-xdr/)

---

## SentinelOne Singularity

SentinelOne Singularity, karar mekanizmasını doğrudan uç nokta ajanına yükleyen otonom yapısıyla bilinir. Cihazın internet bağlantısı kesilse veya ağdan tamamen izole edilse bile, yerel davranışsal yapay zeka motoru zararlı aktiviteleri tespit edip engelleyebilir.

Platformun **Storyline** teknolojisi, süreçlerin (process) tüm yaşam döngüsünü benzersiz bir kimlikle etiketler. En çarpıcı kabiliyetlerinden biri olan **Rollback**, Windows Gölge Kopyaları (VSS) silinmiş olsa bile tahrif edilemez yerel günlüğü kullanarak fidye yazılımlarının şifrelediği dosyaları dakikalar içinde saldırı öncesi haline döndürebilir. **Singularity Ranger** ise her ajanı pasif bir sensöre dönüştürerek alt ağlardaki yönetilmeyen cihazları (Shadow IT) anında haritalandırır.

*   **Artıları:** VSS servisinden bağımsız çalışan tahrif edilemez (Tamperproof) Rollback yeteneği, Ranger ile ajansız ağ keşfi, çevrimdışı ortamlarda dahi tam kapasite çalışan otonom ajan motoru.
*   **Eksileri:** Ranger, RSO ve zafiyet yönetimi gibi gelişmiş özelliklerin ek lisanslara (Add-on) tabi olması, yönetim panelindeki paket yapısının karmaşıklığı.

![SentinelOne Singularity Yönetim Konsolu](1_OezKFGZY0Xx-TjZ1ZpmN7A.webp)

> [SentinelOne Singularity Platform Dokümantasyonu](https://www.sentinelone.com/platform/)

---

## VMware Carbon Black

VMware Carbon Black, hem bulut tabanlı hem de veri merkezi içi (on-premise) dağıtım modelleri sunan köklü bir EDR çözümüdür. Özellikle kurumsal sanallaştırma altyapılarıyla (VMware vSphere ve vCenter) hipervizör seviyesinde kurduğu doğrudan entegrasyon sayesinde sanal sunucuları ve kritik iş yüklerini en az ek yükle korur.

Çekirdek düzeyinde davranışsal analiz ve makine öğrenimi modelleri kullanan platform, veri egemenliği ve regülasyon gereksinimleri nedeniyle bulut kullanamayan finans, kamu ve savunma sanayii kuruluşları için sağlam bir on-premise kale işlevi görür.

*   **Artıları:** Sanallaştırma katmanıyla derin hipervizör entegrasyonu, on-premise veri merkezleri için güvenilir ve stabil mimari.
*   **Eksileri:** Broadcom satın alımı sonrasındaki lisanslama ve destek belirsizlikleri, eski donanımlarda göreceli olarak yüksek kaynak tüketimi.

![VMware Carbon Black Tehdit Takip Paneli](1_o3iQ7r-BtNGQaYYCkPoItw.webp)

> [VMware Carbon Black Hosted EDR Dokümantasyonu](https://www.vmware.com/docs/vmw-datasheet-carbon-black-hosted-edr)

---

## Wazuh

Wazuh, uç nokta koruması, merkezi log yönetimi, dosya bütünlüğü izleme (FIM), tehdit avcılığı ve uyumluluk denetimlerini tek çatı altında buluşturan popüler bir açık kaynaklı güvenlik platformudur. Esnek yapısı sayesinde SIEM ve EDR fonksiyonlarını bir arada sunar.

Özellikle bütçe kısıtı bulunan küçük ve orta ölçekli işletmeler ya da kendi güvenlik yığınını sıfırdan inşa etmek isteyen mühendisler için harika bir alternatiftir. PCI DSS, GDPR, NIST ve HIPAA gibi regülatif standartlar için hazır panolar sunması, uyumluluk denetimlerinde operasyonel kolaylık sağlar.

*   **Artıları:** Tamamen açık kaynaklı ve ücretsiz olması, yüksek özelleştirilebilirlik, güçlü dosya bütünlüğü izleme (FIM) ve log ayrıştırma yetenekleri.
*   **Eksileri:** Dağıtım, kural yazımı ve ölçekleme süreçlerinin ileri düzey teknik uzmanlık gerektirmesi, ticari rakiplerdeki gibi anahtar teslim bir kurumsal destek ekosisteminin bulunmaması.

![Wazuh Güvenlik Olayları ve Uyumluluk Panosu](1_SRprtJmrWdmwclsziL7B7w.webp)

> [Wazuh Mimarisi ve Başlangıç Kılavuzu](https://documentation.wazuh.com/current/getting-started/components/index.html)

---

## Elastic Security

Elastic Stack (ELK) altyapısının analiz ve arama gücü üzerine inşa edilen Elastic Security, SIEM ile uç nokta güvenliğini hibrit bir mimaride birleştirir. Bulut, şirket içi ve hibrit ortamlarda devasa veri kümelerini dizinlemeden anlık olarak arayabilen mimarisiyle tehdit avcılarına benzersiz bir hız kazandırır.

Uç noktalara kurulan Elastic Agent, sistem telemetrisini doğrudan Elasticsearch kümesine basarken, yerleşik makine öğrenimi modelleri anormal davranışları ve yetki yükseltme girişimlerini saniyeler içinde yakalar.

*   **Artıları:** Milyonlarca log satırını saniyeler içinde sorgulama ve filtreleme hızı, esnek gösterge paneli (Kibana) tasarımları, topluluk desteği.
*   **Eksileri:** Log hacmi büyüdükçe donanım, RAM ve depolama maliyetlerinin hızla tırmanması, sorgulama için ESQL/KQL dillerinde uzmanlaşma ihtiyacı.

![Elastic Security Tehdit Avcılığı ve Kibana Paneli](1_eM1tia-nqbzoMV6tho98xw.webp)

> [Elastic Security ile Tehdit Avcılığı Mimarisi](https://dzlab.github.io/2023/04/26/elastic-cybersecurity/)

---

## Bitdefender GravityZone

Bitdefender GravityZone, kurumsal sanallaştırma ortamlarındaki mühendislik deneyimini modern EDR/XDR yetenekleriyle harmanlayan hibrit bir platformdur. Docker tabanlı mikroservis mimarisiyle Linux sanal cihazları (Virtual Appliance) olarak kolayca dağıtılabilir, bu sayede ek Windows Server lisans masraflarını ortadan kaldırır.

Platformun **BEST (Bitdefender Endpoint Security Tools)** ajanı, modüler yapısıyla kaynak tüketimini optimize eder. **Ransomware Mitigation** modülü, şüpheli şifreleme girişimlerini hissettiği anda hedef dosyaların tahrif edilemez anlık kopyalarını alır ve saldırıyı durdurduktan sonra verileri otomatik olarak eski yerine koyar. Ayrıca ağ paylaşımları üzerinden gelen uzaktan şifreleme (Remote Encryption) ataklarını IP seviyesinde engelleme kabiliyetine sahiptir.

*   **Artıları:** Entegre yama yönetimi (Patch Management), sanal sunucular için merkezi tarama desteği (Security Server) ile minimum kaynak tüketimi, uzaktan fidye yazılımı engelleme.
*   **Eksileri:** Zafiyet ve yama yönetiminin ek lisans gerektirmesi, gelişmiş EDR özelliklerinin eski işletim sistemlerinde sınırlı çalışması.

![Bitdefender GravityZone Yönetim Paneli](bitdefender.webp)

> [Bitdefender GravityZone Yönetim Dokümantasyonu](https://www.bitdefender.com/business/support/en/77212-376327-endpoint-protection.html)

---

## Trend Micro Apex One

Trend Micro Apex One, özellikle şirket içi kurumsal mimarilerde **Sanal Yamalama (Virtual Patching)** teknolojisiyle öne çıkar. Apex Central üzerinden yönetilen çözüm, Windows Server ve SQL tabanlı kararlı bir altyapıya dayanır.

Sanal Yamalama teknolojisi, bir zafiyet kamuoyuna duyurulduğu andan fiziksel yama test edilip sunucuya uygulanana kadar geçen kritik sürede, zafiyeti istismar etmeye çalışan paketleri ağ seviyesindeki HIPS motoruyla engeller. Bu yaklaşım, sistemin yeniden başlatılmasını gerektirmediği için kesintiye tahammülü olmayan endüstriyel kontrol sistemleri (OT/ICS) ve kritik veri tabanı sunucularında operasyonel kurtarıcıdır.

*   **Artıları:** Windows XP, 7 ve Server 2008 gibi eski sistemler için uzun süreli genişletilmiş destek, yeniden başlatma gerektirmeyen ağ seviyesinde zafiyet koruması.
*   **Eksileri:** Yönetim sunucusunun MSSQL ve Windows Server bağımlılığı, HIPS motorunun eski donanımlarda ağ trafiğini kısmen yavaşlatabilmesi.

![Trend Micro Apex One Konsol Görünümü](apexone-trendmicro.webp)

> [Trend Micro Apex Central ve Telemetri Dokümantasyonu](https://docs.trendmicro.com/en-us/documentation/article/trend-micro-apex-central-2019-online-help-syslog-mapping-cef)

---

## Kaspersky Endpoint Security for Business

Kaspersky Endpoint Security (KES), yerel kurulum (on-premise) pazarında sunduğu kapsamlı sistem yönetimi araçlarıyla tanınır. Kaspersky Security Center (KSC), hiyerarşik (Master/Slave) mimarisi sayesinde coğrafi olarak dağınık şubelere sahip büyük ağları merkezi bir noktadan başarıyla yönetebilir.

Saldırı anında devreye giren **System Watcher** ve **Remediation Engine**, Windows VSS servisinden tamamen bağımsız çalışarak kötü niyetli kayıt defteri değişikliklerini geri alır ve şifrelenmiş dosyaları yerel korumalı alandan geri yükler. Yerleşik **Systems Management** modülü ise WSUS alternatifi olarak çalışarak üçüncü parti yazılım yamalarını ve işletim sistemi imajlarını tek merkezden dağıtır.

*   **Artıları:** VSS servisinden bağımsız çalışan güçlü yerel sistem onarımı, zengin BT operasyon ve yama yönetim araçları, eski donanımlar için optimize edilmiş Embedded ajanı.
*   **Eksileri:** Jeopolitik kısıtlamalar ve regülatif engeller, yönetim ajanı (Network Agent) ile güvenlik motorunun ayrı paketler halinde güncellenme zorunluluğu.

![Kaspersky Security Center Yönetim Konsolu](kaspersky.webp)

> [Kaspersky Endpoint Security for Business Dokümantasyonu](https://support.kaspersky.com/KESB/14.2/en-US/181954.htm)

---

## ESET PROTECT

ESET PROTECT, siber güvenlik dünyasında bilinen "hafiflik" ve asgari kaynak tüketimi felsefesini modern XDR yetenekleriyle birleştiren bir çözümdür. Sunucu bileşeni hem Windows hem Linux üzerine kurulabildiği gibi, önceden yapılandırılmış sanal cihaz (appliance) olarak da hızla devreye alınabilir.

Fidye yazılımlarına karşı geliştirdiği koruma katmanına ek olarak **Intel TDT (Threat Detection Technology)** entegrasyonu sunar. Bu teknoloji, fidye yazılımları bellek üzerinde şifreleme faaliyeti yürütürken CPU donanım telemetrisini (PMU) izleyerek tespiti donanım seviyesinde gerçekleştirir. Böylece bellek içine gizlenen gelişmiş tehditler sıfır performans kaybıyla bertaraf edilir.

*   **Artıları:** VDI ve eski donanımlarda bile hissedilmeyen ultra düşük CPU ve RAM tüketimi, donanım tabanlı Intel TDT fidye yazılımı tespiti.
*   **Eksileri:** Linux platformlarında yama yönetim yeteneklerinin sınırlı olması, en gelişmiş koruma modülleri için üst seviye lisanslama paketlerine ihtiyaç duyulması.

![ESET PROTECT Yönetim Konsolu](eset.webp)

> [ESET PROTECT Yönetim ve Entegrasyon Kılavuzu](https://help.eset.com/protect_admin/11.0/en-US/admin_server_settings_syslog.html)

---

## Tanium

Tanium XEM (Converged Endpoint Management), geleneksel istemci-sunucu veritabanı sorgu modellerini yıkan patentli **Doğrusal Zincir (Linear Chain)** mimarisiyle çalışır. Milyonlarca uç noktanın bulunduğu devasa ağlarda sorgular sunucudan tek tek istemcilere gitmez, komşu ajanlar P2P benzeri bir zincir kurarak sorguyu ve veriyi birbirine aktarır.

Bu mimari sayesinde 100.000'den fazla uç noktada saniyeler içinde canlı varlık envanteri çıkarmak veya acil bir sıfır gün yamasını WAN hattını tıkamadan dağıtmak mümkündür. **Tanium Performance** modülü ise cihazların kaynak tüketim geçmişini saniye çözünürlüğünde kaydederek kullanıcı deneyimi problemlerinin kök nedenini tek bakışta ortaya koyar.

*   **Artıları:** Eşi benzeri olmayan sorgulama hızı (binlerce cihazdan saniyeler içinde yanıt alma), WAN bant genişliğini koruyan P2P yama dağıtımı, saniye hassasiyetinde sistem performans geçmişi.
*   **Eksileri:** Yüksek ilk yatırım maliyeti, küçük ve orta ölçekli ağlar için gereksiz ölçüde karmaşık ve ağır bir altyapı gerektirmesi.

![Tanium XEM Konsolu ve Gerçek Zamanlı Sorgu Ekranı](tanium.webp)

> [Tanium XEM ve Performans Yönetimi Rehberi](https://www.tanium.com/products/tanium-performance/)

---

## Sophos Intercept X

Sophos Intercept X, "Senkronize Güvenlik" (Synchronized Security) mimarisiyle uç nokta katmanını doğrudan Sophos Firewall cihazlarıyla konuşturan hibrit bir ekosistemdir. Ajan ile ağ donanımı arasında kesintisiz çalışan **Security Heartbeat** kanalı, cihazların sağlık durumunu anlık olarak doğrular.

Uç noktada şüpheli bir süreç veya fidye yazılımı başladığında (cihazın durumu kırmızıya döndüğünde), güvenlik duvarı bu sinyali anında alarak cihazı ağ seviyesinde izole eder, diğer VLAN'lara ve internete erişimini bloke eder. **Synchronized Application Control** özelliği ise ağda tanımlanamayan şifreli bir trafik saptandığında doğrudan uç noktaya danışarak trafiği üreten uygulamanın adını ve yolunu gün ışığına çıkarır.

*   **Artıları:** Uç nokta ve güvenlik duvarı arasında otonom ve anlık izolasyon zinciri, bilinmeyen ağ uygulamalarını kaynağında tespit etme gücü.
*   **Eksileri:** Bu entegre yeteneklerin tam kapasite çalışabilmesi için tüm ağ altyapısının Sophos donanımlarıyla donatılmasını gerektirmesi.

![Sophos Central ve Intercept X Yönetim Paneli](sophos.webp)

> [Sophos Intercept X ve Senkronize Güvenlik](https://www.sophos.com/en-us/products/intercept-x)

---

## Fortinet FortiEDR

Ağ güvenliği pazarının liderlerinden Fortinet'in Security Fabric ekosistemine entegre ettiği FortiEDR, patentli gerçek zamanlı **enfeksiyon sonrası koruma (post-infection protection)** teknolojisiyle ayrışır.

Geleneksel çözümlerden farklı olarak, zararlı bir yazılım uç noktada çalışmaya başlasa dahi, FortiEDR şifreleme veya veri sızdırma eyleminin işletim sistemi çekirdeğinde gerçekleşmesini engeller. **FortiTelemetry** protokolü sayesinde FortiGate güvenlik duvarlarıyla el sıkışarak SD-WAN performansını ve SaaS erişim gecikmelerini uç noktadan ölçümleyip NOC ekiplerine iletir.

*   **Artıları:** Saldırı başladıktan sonra dahi veri hırsızlığını ve dosya şifrelemeyi durduran çekirdek koruması, Fortinet Fabric ekosistemiyle eksiksiz uyum.
*   **Eksileri:** Yönetim konsolu deneyiminin saf EDR rakiplerine göre daha az sezgisel olması, Fortinet dışı ağ ekipmanlarıyla entegrasyon derinliğinin azalması.

![Fortinet FortiEDR Olay Müdahale Paneli](fortiedr.webp)

> [Fortinet FortiEDR Çözüm Detayları](https://www.fortinet.com/products/endpoint-security/fortiedr)

---

## NOC ve SOC Yakınsaması: Bütünleşik BT Operasyonları

Güvenlik Operasyon Merkezi (SOC) ile BT Altyapı Yönetimi (NOC) ekiplerinin farklı araç setleri, farklı telemetri kaynakları ve kopuk terminolojiler kullanması, operasyonel kör noktalara ve olay müdahale sürelerinin uzamasına yol açar.

Modern XDR ve Bütünleşik Uç Nokta Yönetimi (XEM) platformları, çekirdek seviyesindeki derin erişimleri sayesinde geleneksel RMM (Remote Monitoring & Management) ve NMS sistemlerinin rollerini tek çatı altında topluyor:

1.  **Tek Ajan Mimarisi (Agent Consolidation):** Performans izleme, envanter, yama dağıtımı ve antivirüs için ayrı ayrı yazılımlar kurmak sistemlerde ajan yorgunluğuna yol açar. Modern ajanlar (SentinelOne, CrowdStrike, Tanium) tek bir hafif servis üzerinden hem güvenlik hem de operasyon verisi toplar.
2.  **Otonom Varlık Keşfi (Asset Discovery):** SentinelOne Ranger veya Tanium Discover gibi modüller, her uç noktayı pasif bir ağ dinleyicisine dönüştürür. Alt ağlara habersiz bağlanan sahipsiz cihazlar (Shadow IT) ağda ek trafik yaratılmadan tespit edilir ve gerekirse ağ geçidinden izole edilir.
3.  **Çalışan Deneyimi ve Performans Analizi (DEX):** Tanium Performance veya osquery destekli Falcon for IT, bir bilgisayar yavaşladığında geçmişe dönük olarak CPU, RAM ve disk tüketimini saniye çözünürlüğünde raporlar, yardım masasının kök neden tespit süresini (MTTR) radikal biçimde kısaltır.
4.  **Uzaktan Orkestrasyon ve Betik Çalıştırma (RSO & RTR):** SentinelOne RSO veya CrowdStrike Real Time Response (RTR), sistem yöneticilerinin binlerce cihazda SYSTEM yetkileriyle anında PowerShell veya Bash scriptleri koşturmasını sağlar. Bu yetenekler SOAR iş akışlarıyla birleştiğinde, "disk dolduğunda otomatik temizleme yap" gibi kendi kendini onaran (Self-Healing) dinamik altyapılar kurulabilir.
