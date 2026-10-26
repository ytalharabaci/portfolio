---
date: '2025-09-29'
description: "Siber Tehdit İstihbaratı (CTI) kaynakları, IoC analizi, tehdit aktörü takibi ve hipotez odaklı tehdit avcılığı üzerine LetsDefend laboratuvar çözümü."
draft: false
image: featured.webp
title: CTI ile Tehdit Avcılığı Çözümü - LetsDefend
type: writeups
topic: detection-response
tags: ["LetsDefend", "Threat Hunting", "Write-up", "Blue Team", "SIEM", "Threat Intelligence", "CTI"]
featuredImageAlt: "LetsDefend Blue Team Training logosu"
---

[Letsdefend Blue Team Eğitim Platformu](https://letsdefend.io/)

Siber Tehdit İstihbaratı (CTI), siber tehditler hakkında toplanan, değerlendirilen ve analiz edilen bilgileri ifade eder. Saldırıların nasıl, nerede ve kim tarafından gerçekleştirildiğini, hedeflerin ne olduğunu ve hangi tekniklerin kullanıldığını kapsar. CTI, güvenlik ekiplerinin siber tehditler hakkında bilinçli kararlar almasına, savunma stratejileri geliştirmesine ve siber güvenlik olaylarına daha etkili yanıt vermesine yardımcı olur.

---

## CTI Kullanımı

* **Tehdit Avı:** CTI, olası tehditleri belirlemeye yardımcı olmak için tehdit avı süreçlerinde kullanılır. Siber güvenlik ekipleri, şüpheli faaliyetleri araştırmak ve tehditleri belirlemek için CTI verilerini kullanır.
* **Güvenlik Operasyon Merkezi (SOC):** SOC analistleri, günlük güvenlik olaylarını izlemek ve analiz etmek için CTI verilerini kullanır. Bu sayede analistler tehditleri hızlıca tespit edip yanıt verebilir.
* **Kötü Amaçlı Yazılım Analizi:** CTI, kötü amaçlı yazılımların analizinde ve tespitinde kullanılır. Analistler, zararlı yazılımların davranışını ve yayılma yöntemlerini anlamak için CTI verilerini kullanır.
* **Güvenlik Politikaları ve Stratejileri:** CTI, güvenlik politikaları ve stratejilerinin geliştirilmesine katkı sağlar. Tehditlerin niteliği ve kapsamı hakkında bilgi sunarak politikaların daha etkili olmasını sağlar.
* **Risk Değerlendirmesi:** CTI, siber risklerin değerlendirilmesinde kullanılır. Risk yönetimi süreçlerine entegre edildiğinde tehditlerin olası etkisini ve gerçekleşme ihtimalini anlamaya yardımcı olur.
* **Saldırı Yüzeyi Analizi:** CTI, kuruluşların saldırı yüzeylerini analiz etmelerine ve zayıf noktaları belirlemelerine yardımcı olur. Bu da açıkların azaltılmasını ve savunma önlemlerinin iyileştirilmesini sağlar.

---

## CTI Kaynakları

Siber Tehdit İstihbaratı (CTI) kaynakları, siber tehditleri tespit etmek, analiz etmek ve bunlara karşı savunma stratejileri geliştirmek için kritik öneme sahiptir. CTI kaynakları, açık kaynak istihbaratı (OSINT), ticari CTI sağlayıcıları, dark web istihbaratı ve tehdit istihbaratı paylaşım ağları (ISAC’ler) gibi çeşitli kaynaklardan elde edilen bilgileri içerir. Bu kaynaklar, siber güvenlik ekiplerine güncel ve doğru tehdit bilgisi sağlayarak olası saldırıları önlemelerine ve olaylara daha hızlı yanıt vermelerine yardımcı olur.## Açık Kaynak İstihbaratı (OSINT)

Açık Kaynak İstihbaratı (OSINT), kamuya açık kaynaklardan toplanan bilgiler kullanılarak tehdit istihbaratı oluşturma sürecidir. İnternette serbestçe erişilebilen veri ve belgeleri kapsar.

![Açık Kaynak İstihbaratı (OSINT), kamuya açık kaynaklardan toplanan bilgiler kullanılarak tehdit istihbaratı oluşturma](./0_QCFb2afqMZEyappU.webp)

( **Görsel Kaynağı** : <https://www.linkedin.com/pulse/osint-top-15-open-source-intelligence-tools-securetriad/> )

---

## OSINT’in Amaçları

* **Bilgi Toplama:** Tehdit aktörleri hakkında kapsamlı bir anlayış kazanmak için çeşitli açık kaynaklardan bilgi toplamak.
* **Analiz ve Değerlendirme:** Toplanan bilgileri analiz ederek olası tehditleri değerlendirmek.
* **Erken Uyarı:** Olası tehditler hakkında erken uyarılar sağlamak ve güvenlik önlemleri geliştirmek.

---

## OSINT İş Akışı

* **Kaynak Belirleme:** İnternette güvenilir ve ilgili kaynakları belirlemek.
* **Veri Toplama:** Belirlenen kaynaklardan veri toplama süreci manuel veya otomatik olabilir.
* **Veri Analizi:** Toplanan verileri analiz ederek anlamlı bilgiye dönüştürmek.
* **Raporlama:** Analiz sonuçlarını raporlamak ve ilgili taraflara sunmak.

---

## OSINT Kaynakları

* **Sosyal Medya:** Twitter, Facebook ve LinkedIn gibi platformlardan gelen veriler.
* **Bloglar ve Forumlar:** Güvenlik araştırmacılarının blogları ve siber güvenlik forumları.
* **Haber Siteleri:** Siber saldırılar ve tehditler hakkındaki güncel haberler.
* **Resmî Yayınlar:** Devlet ve güvenlik kuruluşlarının raporları ve duyuruları.

---

## OSINT’in Avantajları

* **Erişilebilirlik:** Serbestçe erişilebilen bilgiler, geniş bir veri kaynağı yelpazesine ulaşmayı sağlar.
* **Maliyet Etkinliği:** Tehdit istihbaratı, ücretsiz ya da düşük maliyetli bilgi kaynakları kullanılarak elde edilir.
* **Çeşitlilik:** Farklı kaynaklardan gelen veriler, kapsamlı ve çok yönlü analiz yapılmasına olanak tanır.

---

## OSINT’in Dezavantajları

* **Doğruluk ve Güvenilirlik Eksikliği:** Açık kaynaklardaki bilgilerin doğruluğunu ve güvenilirliğini doğrulamak zor olabilir.
* **Veri Yığılması:** Büyük miktarda veri, anlamlı bilgiyi ayırt etmeyi zorlaştırabilir.
* **Gizlilik ve Etik Sorunları:** Bilgi toplama sürecinde gizlilik ve etik kurallara uyulmalıdır.

Özetle, Açık Kaynak İstihbaratı (OSINT), siber tehditler hakkında geniş ve erişilebilir bir bilgi kaynağı sunar. Doğru kaynaklar ve analiz yöntemleriyle kullanıldığında, OSINT siber güvenlik stratejilerini destekler ve tehditlerin tespitinde önemli bir rol oynar.

---

## Ticari CTI Sağlayıcıları

Ticari CTI sağlayıcıları, kapsamlı tehdit istihbaratı sunmak için ücretli hizmet veren kuruluşlardır. Sağlayıcılar, çeşitli kaynaklardan toplanan verileri analiz eder ve müşterilerine sunar.

---

## Ticari CTI Sağlayıcılarının Amaçları

* **Profesyonel Hizmet:** Müşterilere yüksek kaliteli ve doğrulanmış tehdit istihbaratı sunmak.
* **Risk Azaltma:** Müşterilerin siber güvenlik risklerini azaltmalarına yardımcı olmak.
* **Olay Müdahalesi:** Siber güvenlik olaylarına hızlı ve etkili yanıt verebilmek için gerekli bilgileri sağlamak.

---

## CTI Ürünlerinin İş Akışı

* **Veri Toplama:** Birden fazla kaynaktan veri toplama (açık kaynaklar, dark web, uzmanlaşmış veritabanları).
* **Analiz:** Verilerin gelişmiş analiz araçları ve uzman analistler tarafından incelenmesi.
* **Raporlama ve Bildirim:** Analiz sonuçlarının müşterilere raporlanması.
* **Entegrasyon:** SIEM ve EDR gibi sistemlerle entegrasyon sayesinde tehdit verilerinin işlenmesinin otomatikleştirilmesi.

---

## Ticari CTI Kaynakları

* **Tehdit İstihbaratı Platformları:** MISP, ThreatConnect ve Anomali gibi platformlar.
* **Güvenlik Şirketleri:** FireEye, CrowdStrike ve Recorded Future gibi şirketler.
* **Özel Raporlar ve Analizler:** Belirli tehditler ve saldırı kampanyaları hakkında raporlar.

---

## Ticari CTI Kaynaklarının Avantajları

* **Yüksek Kalite:** Doğrulanmış ve analiz edilmiş yüksek kaliteli tehdit istihbaratı sunar.
* **Zaman Tasarrufu:** Müşterilerin veriyi kendilerinin toplamasına ve analiz etmesine gerek bırakmaz.
* **Uzman Analizi:** Güvenlik uzmanları tarafından derinlemesine analiz ve öneriler sağlar.

---

## Ticari CTI Kaynaklarının Dezavantajları

* **Maliyet:** Ticari CTI hizmetleri genellikle pahalıdır.
* **Gizlilik Sorunları:** Müşteriler, paylaşılan bilgilerin gizliliğini sağlamalıdır.
* **Bağımlılık:** Müşteriler güvenlik stratejileri için ticari sağlayıcılara aşırı derecede bağımlı hale gelebilir.

Özetle, ticari CTI sağlayıcıları derinlemesine bilgi ve analiz sunarak kuruluşların güvenlik kabiliyetlerini güçlendirir. Bu hizmetler özellikle büyük ölçekli ve hedefli saldırılarla karşı karşıya olan kuruluşlar için kritik öneme sahiptir.

---

## Dark Web İstihbaratı

Dark Web İstihbaratı, internetin gizli ve kısıtlı alanlarında (dark web) yürütülen faaliyetlerden elde edilen tehdit istihbaratını ifade eder. Dark web, işlemlerin anonim olduğu ve izlenmesinin zor olduğu siber suç faaliyetlerinin merkezidir.

![Dark Web İstihbaratı, internetin gizli ve kısıtlı alanlarında (dark web) yürütülen faaliyetlerden elde edilen tehdit](./0_gLkIRKtsRkm_AvVk.webp)

( **Görsel Kaynağı** : <https://www.hawk-eye.io/2020/12/dark-web-and-threat-intelligence-darkint/> )

---

## Dark Web İstihbaratının Amaçları

* **Siber Suç İzleme:** Dark web üzerindeki siber suç faaliyetlerini izlemek ve analiz etmek.
* **Önleyici Tedbirler:** Olası tehditlere karşı önleyici tedbirler almak için dark web’den gelen bilgileri kullanmak.
* **Olay Müdahalesi:** Dark web’deki tehditleri hızlıca tespit etmek ve olaylara yanıt vermek.

---

## Dark Web İstihbaratının İş Akışı

* **Erişim ve İzleme:** Dark web’e erişmek ve çeşitli kaynaklardan veri toplamak.
* **Veri Toplama:** Dark web pazar yerlerinden, forumlardan ve diğer kaynaklardan veri toplamak.
* **Analiz:** Toplanan verileri anlamlı içgörüler elde etmek için analiz etmek.
* **Raporlama:** Bulguları raporlamak ve ilgili ekiplere sunmak.

---

## Dark Web İstihbaratı Kaynakları

* **Dark Marketler:** Kötü amaçlı yazılım, çalıntı veri ve sahte belgelerin satıldığı platformlar.
* **Hacker Forumları:** Saldırganların bilgi paylaştığı ve iş birliği yaptığı platformlar.
* **Dark Web Arama Motorları:** Dark web’de bilgi bulmak için kullanılan özel arama motorları.

---

## Dark Web İstihbaratının Avantajları

* **Erken Uyarı:** Dark web’deki faaliyetler hakkında erken uyarı sağlayarak olası tehditlere karşı hazırlık yapılmasına olanak tanır.
* **Derinlemesine Bilgi:** Siber suç faaliyetleri hakkında ayrıntılı içgörüler sunar.
* **Önleyici Tedbirler:** Dark web istihbaratına dayalı proaktif önleyici önlemlerin alınmasını sağlar.

---

## Dark Web İstihbaratının Dezavantajları

* **Erişim Zorlukları:** Dark web’e erişmek ve veri toplamak teknik uzmanlık ve özel araçlar gerektirir.
* **Güvenilirlik Eksikliği:** Toplanan bilgilerin doğruluğunu ve güvenilirliğini sağlamak zor olabilir.
* **Gizlilik ve Hukuki Sorunlar:** Bilgi toplama sürecinde gizlilik ve hukuki kaygılar ortaya çıkabilir.

Özetle, Dark Web İstihbaratı siber güvenlik tehditlerinin erken tespiti ve önlenmesinde kritik bir rol oynar. Dark web üzerindeki faaliyetleri izlemek ve analiz etmek, kuruluşların siber güvenlik stratejilerini güçlendirir ve olası tehditlere karşı onları hazırlar.

---

## Tehdit İstihbaratı Paylaşım Ağları (ISAC’ler)

Information Sharing and Analysis Centers (ISAC’ler), belirli sektörler veya bölgeler arasında tehdit istihbaratı paylaşımını ve iş birliğini kolaylaştırmak için kurulmuş kuruluşlardır. ISAC’ler, üyeler arasında güvene dayalı bilgi alışverişini teşvik ederek siber tehditlere karşı kolektif bir savunma mekanizması oluşturur.

![Information Sharing and Analysis Centers (ISAC’ler), belirli sektörler veya bölgeler arasında tehdit istihbaratı paylaşımını](./0_ndThW-HJCSsjSzE-.webp)

( **Görsel Kaynağı** : <https://www.anomali.com/blog/the-power-of-active-collaboration-in-isacs-isaos-and-security-interest-groups> )

---

## ISAC’lerin Amaçları

* **Bilgi Paylaşımı:** Siber tehditler, açıklar ve saldırılarla ilgili bilgilerin üyeler arasında paylaşılmasını kolaylaştırmak.
* **Analiz ve Değerlendirme:** Toplanan bilgileri analiz ederek sektöre özel tehdit değerlendirmeleri ve raporlar üretmek.
* **Savunma Stratejileri:** Üyeler için özel güvenlik önerileri ve savunma stratejileri geliştirmek.
* **Olay Müdahalesi Desteği:** Siber güvenlik olayları sırasında üyelere destek ve yönlendirme sağlamak.

---

## ISAC’lerin İş Akışı

* **Üyelik:** ISAC’ler genellikle sektöre özeldir ve belirli sektörlerden kuruluşları üye olarak kabul eder.
* **Bilgi Toplama ve Dağıtım:** ISAC’ler üyelerden ve çeşitli kaynaklardan tehdit bilgisi toplar, analiz eder ve tekrar üyelere dağıtır.
* **İş Birliği ve Koordinasyon:** Üyeler arasında iş birliğini teşvik eder, bilgi paylaşımını koordine eder ve ortak savunma stratejileri geliştirir.
* **Eğitim ve Farkındalık:** ISAC’ler üyeler için eğitim programları, atölyeler ve farkındalık kampanyaları düzenler.

---

## ISAC Örnekleri

* **Financial Services ISAC (FS-ISAC):** Finans sektörü için tehdit istihbaratı paylaşımı.
* **Health Information Sharing and Analysis Center (H-ISAC):** Sağlık sektörü için tehdit istihbaratı paylaşımı.
* **Automotive Information Sharing and Analysis Center (Auto-ISAC):** Otomotiv sektörü için tehdit istihbaratı paylaşımı.
* **Energy Information Sharing and Analysis Center (E-ISAC):** Enerji sektörü için tehdit istihbaratı paylaşımı.

---

## ISAC’lerin Avantajları

* **Erken Uyarı:** ISAC’ler sektörde ortaya çıkan tehditler için erken uyarı sağlar.
* **Kolektif Savunma:** ISAC’ler, bilgi paylaşımı yoluyla daha güçlü ve daha koordineli savunma stratejileri geliştirmenize olanak tanır.
* **Kaynak Verimliliği:** Bilgi paylaşımı ve iş birliği sayesinde güvenlik kaynaklarını daha verimli kullanabilirsiniz.
* **Artan Güven:** Sektör genelinde güvenlik farkındalığını ve iş birliğini artırabilirsiniz.

---

## ISAC’lerin Dezavantajları

* **Ortaklar Arasında Güven Eksikliği:** Üyeler arasında bilgi paylaşımı için güven oluşturmak zor olabilir.
* **Veri Gizliliği:** Paylaşılan bilgilerin gizliliğini ve doğru kullanımını sağlamak zor olabilir.
* **Koordinasyon Zorlukları:** Farklı kuruluşlar arasında koordinasyon ve iş birliği sağlamak zor olabilir.

Tehdit İstihbaratı Paylaşım Ağları (ISAC’ler), sektöre özel siber güvenlikte kritik bir rol oynar. Üyeler arasında güvene dayalı bilgi paylaşımını teşvik ederek ISAC’ler, siber tehditlere karşı kolektif bir savunma mekanizması oluşturur. Bu ağlar, sektörlerin siber güvenlik yeteneklerini geliştirir ve daha dayanıklı bir savunma sağlar.

---

## CTI ile Tehdit Avı Süreci

Siber Tehdit İstihbaratı (CTI), tehditleri tespit etmek, analiz etmek ve yanıt vermek için kritik bilgiler sunarken, tehdit avı süreçleri bu bilgileri kullanarak potansiyel tehditleri proaktif biçimde arar. CTI, hipotez oluşturmadan yeni tehdit kalıplarını ortaya çıkarmaya kadar tehdit avı döngüsünün her aşamasında hayati bir rol oynar.

![Siber Tehdit İstihbaratı (CTI), tehditleri tespit etmek, analiz etmek ve yanıt vermek için kritik bilgiler sunarken, tehdit](./0_166341rvbHYBcLS5.webp)

**(Görsel Kaynağı:** <https://www.researchgate.net/figure/The-Threat-Hunting-Loop_fig2_344319370> **)**

---

## Hipotez Oluşturma

CTI, tehdit avı sürecinde hipotez oluşturmada önemli bir rol oynar. Bu aşamada şu şekillerde katkı sağlar:

* **Tehdit Göstergeleri (IOC’ler):** CTI, kötü amaçlı yazılım imzaları, zararlı IP adresleri ve alan adları gibi tehdit göstergeleri sağlar. Bu göstergeler hipotez oluşturmak için temel bilgi olarak kullanılır.
* **Tehdit Aktörleri Hakkında Bilgi:** CTI, belirli tehdit aktörlerinin motivasyonları, yetenekleri ve hedefleri hakkında içgörüler sunar. Bu içgörüler, olası tehditlerin nasıl ve neden ortaya çıkabileceğine dair hipotezler geliştirmede kullanılır.

---

## Araçlar ve Tekniklerle Araştırma

CTI, araştırma aşamasında kullanılan araçlar ve teknikler için kritik bilgi sağlar. Bu aşamada CTI şunları sunar:

* **Tehdit İstihbaratı Entegrasyonu:** CTI verileri, tehdit avı sürecini desteklemek için SIEM, EDR ve diğer güvenlik araçlarına entegre edilir.
* **Gelişmiş Analiz Teknikleri:** CTI, tehditlerin daha derinlemesine analiz edilmesini sağlar. Örneğin, belirli bir kötü amaçlı yazılımın nasıl çalıştığını ve yayıldığını anlamak, bu bilginin analiz süreçlerinde kullanılmasını sağlar.
* **Tehdit Tespiti ve İzleme:** CTI, belirli tehdit göstergeleri (IOC’ler) ve saldırı yöntemleri (TTP’ler) hakkında bilgi sağlayarak güvenlik araçlarının tehditleri tespit etmesini ve izlemesini kolaylaştırır.

---

## Yeni Kalıpları ve TTP’leri Ortaya Çıkarma

CTI, yeni tehdit kalıplarını ve saldırı tekniklerini (TTP’ler) ortaya çıkarmada kilit rol oynar. Bu aşamada CTI’nın sundukları şunlardır:

* **Veri Zenginleştirme:** CTI, mevcut verileri zenginleştirerek yeni tehdit kalıplarının ve TTP’lerin keşfedilmesini sağlar.
* **Anomali Tespiti:** CTI, normal davranış kalıplarından sapmaları ve anormallikleri belirlemeye yardımcı olur, bu da yeni tehdit kalıplarının tespit edilmesine yol açar.
* **Sürekli Güncellenen Bilgi:** CTI, tehdit aktörlerinin gelişen taktik ve teknikleri hakkında güncel bilgi sağlar. Bu bilgi, tehdit avcılarının yeni tehditleri daha hızlı tespit etmesine yardımcı olur.

---

## Analitiği Bilgilendirme ve Zenginleştirme

CTI, tehdit avı sürecinde analitiği bilgilendirmede ve zenginleştirmede kritik bir rol oynar. Bu aşamada CTI şunları sunar:

* **Bağlamsal Bilgi Sağlama:** CTI, tehditleri daha geniş bir bağlamda anlamaya yardımcı olur. Örneğin, yalnızca bir kötü amaçlı yazılım dosya adı hakkında değil, onu kullanan tehdit aktörü grubu hakkında da bilgi sunar.
* **Veri Korelasyonu:** Birden fazla veri kaynağından gelen bilgilerin CTI verileriyle karşılaştırılması, anormalliklerin ve tehditlerin tespitini hızlandırır.
* **Olay Doğrulama:** CTI verileri, tespit edilen olayları doğrulamak için kullanılır. Örneğin, bir güvenlik olayı CTI veritabanındaki bir IOC ile eşleştiğinde, olay doğrulanmış olur.

---

## Hipotez Değerlendirmesi

CTI, tehdit avının tüm aşamalarında gereklidir. Hipotez oluşturmadan yeni tehdit kalıplarını ortaya çıkarmaya kadar CTI’nin sağladığı bilgi ve analizler, siber güvenlik ekiplerinin tehditleri daha etkili biçimde tespit etmesine ve yanıt vermesine yardımcı olur.

---

## CTI ile Oltalama Kampanyası Hipotezi

---

## Hipotez

Kuruluşunuzun çalışanlarını hedef alan bir oltalama (phishing) kampanyası olabilir. Kampanya, çalışan kimlik bilgilerini çalmayı, finansal bilgilere erişmeyi veya kötü amaçlı yazılım yüklemeyi amaçlıyor olabilir.

---

## Veri Kaynakları

* **Siber Tehdit İstihbaratı (CTI) Platformu:** Güvenlik tehditleri hakkında bilgi toplar ve analiz eder.
* **Tehdit İstihbaratı Akışları:** Oltalama kampanyalarında kullanılan bilinen e-posta adresleri, URL’ler ve IP adresleri hakkında bilgi sağlar.
* **SIEM Sistemi:** Logları ve güvenlik olaylarını toplamak ve analiz etmek için kullanılan bir araçtır.
* **E-posta Ağ Geçidi Logları:** Gelen ve giden e-posta trafiğini izler.
* **Web Proxy Logları:** Kullanıcıların internet erişim kayıtlarını takip eder.
* **Uç Nokta Algılama ve Yanıt (EDR) Logları:** Uç nokta cihaz etkinliklerini izler ve anormal davranışları tespit eder.
* **Kullanıcı ve Varlık Davranış Analitiği (UEBA):** Anomalileri belirlemek için kullanıcı ve varlık davranışlarını analiz eder.

---

## Analiz Adımları

* SIEM, e-posta ağ geçidi, web proxy ve EDR sistemlerinden logları toplayın.
* CTI platformundan ve tehdit istihbaratı akışlarından oltalama kampanyalarıyla ilgili verileri toplayın.
* Logları, CTI platformu ve akışlardaki bilgilerle karşılaştırın.
* Logları bilinen oltalama e-posta adresleri, URL’ler ve IP adresleriyle eşleştirin.
* Oltalama kampanyalarında kullanılan teknikleri (ör. sahte web siteleri, oltalama e-postaları) belirleyin ve loglarda bu tekniklere ait izleri arayın.
* E-posta ağ geçidi loglarında bilinen oltalama e-posta adreslerinden gelen e-postaları tespit edin.
* Web proxy loglarında kullanıcıların oltalama URL’lerine erişimini kontrol edin.
* EDR loglarında oltalama saldırılarına maruz kalan kullanıcıların cihazlarındaki anormal etkinlikleri belirleyin.
* Oltalama e-postalarının içeriğini analiz edin ve sosyal mühendislik tekniklerini tespit edin.
* Oltalama e-postasına tıklayan veya sahte sitelere erişen kullanıcıları belirlemek için kullanıcı davranışını analiz edin.
* UEBA kullanarak olağandışı kullanıcı davranışlarını ve olası hesap ele geçirme girişimlerini tespit edin.
* Tespit edilen şüpheli e-postaları ve web erişim olaylarını olay müdahale ekibine iletin.
* Olay müdahale ekibi, oltalama kampanyasının ayrıntılarını analiz eder ve hedeflenen kullanıcıları belirler.
* Bulgulara dayanarak, daha fazla zararı önlemek için etkilenen hesapları ve cihazları izole edin.

---

## Hipotez Doğrulama ve Beklenen Bulgular

* Hedeflenen oltalama kampanyasının ayrıntıları ve teknikleri belirlenecektir.
* Kampanya sırasında gönderilen oltalama e-postaları ve kullanıcıların eriştiği sahte siteler tespit edilecektir.
* Şüpheli davranışlar ve olası hesap ele geçirme girişimleri tespit edilecek, ilgili kullanıcılar bilgilendirilecek ve gerekli önlemler alınacaktır.
* CTI verileriyle korelasyon kurularak oltalama saldırıları daha erken tespit edilebilir ve proaktif önlemler hızlıca alınabilir.

---

## Hipotez Değerlendirmesi

Bu hipotez, CTI kullanarak ağ üzerinde oltalama kampanyalarını tespit etmek için izlenecek adımları özetler. Şirketin güvenlik duruşunu güçlendirmek ve olası oltalama saldırılarını önlemek için bu adımlar kritik önemdedir.

---

## Pratik Laboratuvar-1

---

## Hipotez-1

**Not:** Bu bölümdeki sorular, aşağıdaki hipoteze dayanarak tehdit avı yapmak için hazırlanmıştır.

**Hipotez:** Saldırganlar çalışanları kandırmak ve kötü amaçlı yazılım dağıtmak için sosyal mühendislik teknikleri kullanabilir.

---

## Tehdit Avı Laboratuvar Ortamı

* **Şirket Adı:** RiverKids
* **Şirket Alan Adı:** riverkidscorp.com
* CTI Olayları ([Threat Intel LetsDefend Platformu](https://app.letsdefend.io/threat-intelligence-feed))
* E-posta Güvenliği ([LetsDefend Platformu](https://app.letsdefend.io/email-security))
* SIEM (Wazuh)
* EDR Olayları (Sysmon)
* Güvenlik Duvarı Trafik Olayları

---

## Laboratuvar Notları

* Aşağıdaki soruları yanıtlamak için "Aug 1, 2024 00:00--Aug 7, 2024 00:00" arasındaki logları analiz edin.
* Sonraki sorular, önceki soruların doğru cevaplarını gerektirir. **Tüm soruları göründükleri sırayla yanıtlayın.**

---

## Sorular

**Not:** Aşağıdaki soruları yanıtlamak için "Aug 1, 2024 00:00--Aug 7, 2024 00:00" arasındaki logları analiz edin.

**Not:** Sonraki sorular, önceki soruların doğru cevaplarını gerektirir. Tüm soruları göründükleri sırayla yanıtlayın.

> **CTI Platformuna göre (LetsDefend — Threat Intel), şirket adına benzer bir isimle hangi alan adı kaydedilmişti?**

CTI platformunda bu isme benzer bir alan adı arayalım.

* **Şirket Adı:** RiverKids
* **Şirket Alan Adı:** riverkidscorp.com

![Şirket Alan Adı: riverkidscorp.com](./1_yekAJru0KMyVhlg6bpmN6A.webp)

Threat Intel Platformu

**Cevap:** riverkidscompany.com

![E-posta güvenliği platformuna göre (LetsDefend — Email Security), şirketin adına benzeyen alan adından şirket personeline](./1_eqSXziyOfwwoJ53kaNcWOQ.webp)
> **E-posta güvenliği platformuna göre (LetsDefend — Email Security), şirketin adına benzeyen alan adından şirket personeline gönderilen e-postanın alıcı e-posta adresi nedir?**

Email Security’de bulduğumuz e-posta adresini aradığımızda ilgili e-postayı buluruz.

![Email Security’de bulduğumuz e-posta adresini aradığımızda ilgili e-postayı buluruz](./1_Pxwjuuz1HFyqSglRUJg30A.webp)

E-posta Güvenliği

Oltalama e-postasını yakaladık!

![Oltalama e-postasını yakaladık!](./1_ZKap_okrbnuoS-Wx9yXUlw.webp)

Oltalama E-postası

**Cevap:** mike@riverkidscorp.com

![E-posta güvenliği platformuna göre (LetsDefend — Email Security) şirkete benzeyen alan adından şirket personeline gönderilen](./1_5d15bAExCgOM6kBBzZSuLQ.webp)
> **E-posta güvenliği platformuna göre (**[**LetsDefend — Email Security**](https://app.letsdefend.io/email-security)**) şirkete benzeyen alan adından şirket personeline gönderilen e-postanın gönderen e-posta adresi nedir?**

**Cevap:** support@riverkidscompany.com

![E-posta güvenliği platformuna göre (LetsDefend — Email Security), şirketin adına benzeyen alan adından şirket personeline (2)](./1_7JSWzpHE1uJMtG9fX3vv_A.webp)
> **E-posta güvenliği platformuna göre (LetsDefend — Email Security), şirketin adına benzeyen alan adından şirket personeline gönderilen e-posta için hangi işlem uygulanmıştır?**

**Cevap:** supportcenter.login.vpnccloudd.io

![Threat Intel kaynağına göre (LetsDefend), şirkete benzeyen alan adından şirket personeline gönderilen e-postadaki alan](./1_XnJPvu9tSbR-XsOLVEVkEA.webp)
> **Threat Intel kaynağına göre (**[**LetsDefend**](https://app.letsdefend.io/threat-intelligence-feed)**), şirkete benzeyen alan adından şirket personeline gönderilen e-postadaki alan adının kategorisi (TAG) nedir?**

Alan adını LetsDefend Threat Intel modülünde arayın.

![Alan adını LetsDefend Threat Intel modülünde arayın](./1_g2esRTQHtNb0XrjnKlYQ8g.webp)

Threat Intel Modülü

**Cevap:** phishing

![Şirkete benzeyen alan adından şirket personeline gönderilen e-postadaki alan adına erişmeye çalışan uç noktanın IP adresi](./1_c0BoESPwDPtS1IFQOBMWPw.webp)
> **Şirkete benzeyen alan adından şirket personeline gönderilen e-postadaki alan adına erişmeye çalışan uç noktanın IP adresi nedir?**

Wazuh SIEM’de, "data.win.eventdata.queryName: [alan_adı]" filtresini kullanarak alan adını arayın ve sonuçlarda "agent.ip" değerini bulun.

![Wazuh SIEM’de, "data.win.eventdata.queryName: alanadı " filtresini kullanarak alan adını arayın ve sonuçlarda "agent.ip"](./1_MnrquF9HFTs54z9kKVQHGQ.webp)

wazuh araması

**Cevap:** 192.168.16.54

![Bir önceki soruda belirlenen uç noktada, şirkete benzeyen alan adından şirkete gönderilen e-postada geçen alan adı için DNS](./1_jnK249p3Rv6oQ_nZ94bJ-Q.webp)
> **Bir önceki soruda belirlenen uç noktada, şirkete benzeyen alan adından şirkete gönderilen e-postada geçen alan adı için DNS isteğini hangi süreç gönderdi?**

SIEM’de, "data.win.eventdata.queryName: [alan_adı]" filtresini kullanarak alan adını arayın ve sonuçlarda "data.win.eventdata.image" değerini bulun.

![SIEM’de, "data.win.eventdata.queryName: alanadı " filtresini kullanarak alan adını arayın ve sonuçlarda](./1_Fq2HwaplZwaRH9a-_mO_Cw.webp)

wazuh araması

**Cevap:** outlook.exe

![Şirkete benzeyen alan adından şirket personeline gönderilen e-postada yer alan URL’nin IP adresi nedir?](./1_-9bmE04JZ54U5ox3oR6IJA.webp)
> **Şirkete benzeyen alan adından şirket personeline gönderilen e-postada yer alan URL’nin IP adresi nedir?**

SIEM’de, "data.win.eventdata.queryName: [alan_adı]" filtresiyle alan adını arayın ve sonuçlarda "data.win.eventdata.queryResults" değerini bulun.

![SIEM’de, "data.win.eventdata.queryName: alanadı " filtresiyle alan adını arayın ve sonuçlarda](./1_lOwxv9KQu_KFIVzOY44tDA.webp)

**Cevap:** 111.222.111.222

![Şirkete benzeyen alan adından şirket personeline gönderilen e-postada yer alan IP adresine erişim girişimi için alınan işlem](./1_tqKZvyHyVL6ksLSSaCj1nA.webp)
> **Şirkete benzeyen alan adından şirket personeline gönderilen e-postada yer alan IP adresine erişim girişimi için alınan işlem nedir?**

SIEM’de "data.dstip: [IP_Adresi]" filtresini uygulayın ve sonuçlarda "data.action" değerini kontrol edin.

![SIEM’de "data.dstip: IPAdresi " filtresini uygulayın ve sonuçlarda "data.action" değerini kontrol edin](./1_ReStdK8t9Nb3Whp8CGUR-Q.webp)

wazuh araması

**Cevap:** deny

![LetsDefend laboratuvar soruları](./1_Gmgyn6K9WEEeLku8z4fthQ.webp)

---

## Pratik Laboratuvar-2

---

## Hipotez-2

**Not:** Bu bölümdeki sorular, aşağıdaki hipoteze dayanarak tehdit avı yapmak için hazırlanmıştır.

**Hipotez:** Enerji sektörünü hedef alan APT-ENR-88 grubuyla ilişkili yayımlanmış ihlal göstergeleri (IoC’ler) sistem olaylarında bulunuyor olabilir.

---

## Tehdit Avı Laboratuvar Ortamı

* **DMZ Sunucu IP Bloğu**: 172.16.8.0/24
* CTI Olayları ([Threat Intel LetsDefend Platformu](https://app.letsdefend.io/threat-intelligence-feed))
* SIEM (Wazuh)
* EDR Olayları (Sysmon)
* Güvenlik Duvarı Trafik Olayları

---

## Laboratuvar Notları

* Aşağıdaki soruları yanıtlamak için "Aug 1, 2024 00:00--Aug 7, 2024 00:00" arasındaki logları analiz edin.
* Sonraki sorular, önceki soruların doğru cevaplarını gerektirir. **Tüm soruları göründükleri sırayla yanıtlayın.**

---

## Sorular

**Not:** Aşağıdaki soruları yanıtlamak için "Aug 1, 2024 00:00--Aug 7, 2024 00:00" arasındaki logları analiz edin.

**Not:** Sonraki sorular, önceki soruların doğru cevaplarını gerektirir. Tüm soruları göründükleri sırayla yanıtlayın.

> **CTI Platformuna göre (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), "APT-ENR-88" grubuna ait kaç farklı IoC yayımlanmıştır?**

CTI platformunda APT grup adını arayın.

![CTI platformunda APT grup adını arayın](./1_5Yuk_f52Y7TVsNN1wozHhQ.webp)

CTI platformu

**Cevap:** 3

![CTI Platformuna göre (LetsDefend — Threat Intel), "APT-ENR-88" grubunun IoC’lerinde listelenen IP adresiyle iletişim kuran](./1_OFq10HlazVH4-1m47GftKA.webp)
> **CTI Platformuna göre (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), "APT-ENR-88" grubunun IoC’lerinde listelenen IP adresiyle iletişim kuran sistemin IP adresi nedir?**

IoC’ler arasından IP adresini bulun. SIEM’de hedef IP adresi olarak sorgulayın. (data.dstip: 123.123.123.123)

![IoC’ler arasından IP adresini bulun](./1_0d8zs5GYGq5AfOg8lySnRg.webp)

**Cevap:** 192.168.123.123

![CTI Platformuna göre (LetsDefend — Threat Intel), APT-ENR-88 grubu için yayımlanan IoC’lerde listelenen IP adresiyle](./1_PC6mnau3Vpt421Z3joovIQ.webp)
> **CTI Platformuna göre (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), APT-ENR-88 grubu için yayımlanan IoC’lerde listelenen IP adresiyle iletişim kuran süreç adı nedir?**

SIEM’de hedef IP adresi filtresiyle IP adresini arayın ("data.win.eventdata.destinationIp: [IP_Adresi]").

![SIEM’de hedef IP adresi filtresiyle IP adresini arayın ("data.win.eventdata.destinationIp: IPAdresi ")](./1_77gDh5EzbCf2l-IX5_fpfA.webp)

wazuh araması

**Cevap:** netapp0.exe

![CTI Platformuna göre (LetsDefend — Threat Intel), APT-ENR-88 tehdit grubunun IoC’lerinde listelenen hash tespit edildiğinde](./1_i9S0sk7Z3f8fGyoR_Zn5yQ.webp)
> **CTI Platformuna göre (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), APT-ENR-88 tehdit grubunun IoC’lerinde listelenen hash tespit edildiğinde sistemin IP adresi nedir?**

Hash’i SIEM’de "*[Hash_Değeri]*" ya da "data.win.eventdata.hashes" filtresinde "MD5=[Hash_Değeri]" ile arayın.

![Hash’i SIEM’de " HashDeğeri " ya da "data.win.eventdata.hashes" filtresinde "MD5= HashDeğeri " ile arayın](./1_EqomnGHWJy4E4AHcqXnRnA.webp)

wazuh araması

**Cevap:** 192.168.123.123

![CTI Platformuna göre (LetsDefend — Threat Intel), APT-ENR-88 grubunun IoC’lerinde listelenen hash’in tespit edildiği](./1_kT63X4o_kgQsMH130lQfOA.webp)
> **CTI Platformuna göre (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), APT-ENR-88 grubunun IoC’lerinde listelenen hash’in tespit edildiği olaydaki süreç adı nedir?**

Hash’i SIEM’de "*[Hash_Değeri]*" olarak arayın veya "data.win.eventdata.hashes" alanında "MD5=[Hash_Değeri]" girerek arama yapın. Ardından çıktıda "data.win.eventdata.image" değerini bulun.

**Cevap:** C:\Program Files\App\app0.exe

![CTI Platformuna göre (LetsDefend — Threat Intel), APT-ENR-88 grubunun IoC’lerinde listelenen IP adresiyle ilgili erişim](./1_OTzASTm8XfJBVN-KCNrN_g.webp)
> **CTI Platformuna göre (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), APT-ENR-88 grubunun IoC’lerinde listelenen IP adresiyle ilgili erişim logları için güvenlik duvarının eylemi nedir?**

SIEM’in güvenlik duvarı olaylarında "data.dstip: [IP_Adresi]" filtresini uygulayın ve "data.action" değerini bulun.

![SIEM’in güvenlik duvarı olaylarında "data.dstip: IPAdresi " filtresini uygulayın ve "data.action" değerini bulun](./1_VfcxKaLhEbOxymFXcFH5og.webp)

wazuh araması

**Cevap:** deny

![CTI Platformuna göre (LetsDefend — Threat Intel), APT-ENR-88 grubunun IoC’lerinde listelenen alan adının çözdüğü IP adresi](./1_nKIDHVE_5oVV9mW1KJ-Z9A.webp)
> **CTI Platformuna göre (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), APT-ENR-88 grubunun IoC’lerinde listelenen alan adının çözdüğü IP adresi için erişim logu eylemi nedir?**

"data.win.eventdata.queryName:" [AlanAdı] filtresini uygulayın. Sonucun "data.win.system.message" alanında yer alan "QueryResults" değerini bulun, ardından güvenlik duvarı loglarında "data.dstip: [IP Adresi]" filtresiyle arama yapın. Son olarak sonuçtaki "data.action" değerini kontrol edin.

!["data.win.eventdata.queryName:" AlanAdı filtresini uygulayın](./1_EtU9JpvdEEO5-a_z6uUVNg.webp)

wazuh araması

Sorgu yanıtının döndürdüğü IP adresinin "18.22.0.44" olduğunu bulduk. Bu IP adresine yönelik erişim loglarını güvenlik duvarında kontrol edelim.

![Sorgu yanıtının döndürdüğü IP adresinin "18.22.0.44" olduğunu bulduk](./1_GUauV7aGVrW6-Zo53Yujeg.webp)

"18.22.0.44" erişim logları

Burada erişimin izinli olduğunu görüyoruz.

**Cevap:** allow

![CTI Platformuna göre (LetsDefend — Threat Intel), APT-ENR-88 grubunun IoC’lerinde listelenen IP adresinden gelen bağlantı](./1_AciJMgtZ5zsX86eXkZC1Yg.webp)
> **CTI Platformuna göre (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), APT-ENR-88 grubunun IoC’lerinde listelenen IP adresinden gelen bağlantı girişimlerini alan kuruluş ağı içindeki hedef IP adresi neydi?**

SIEM’in güvenlik duvarı olaylarında "data.srcip: [IP_Adresi]" filtresini uygulayın ve "data.dstip" değerini kontrol edin.

![SIEM’in güvenlik duvarı olaylarında "data.srcip: IPAdresi " filtresini uygulayın ve "data.dstip" değerini kontrol edin](./1_nnRFUmUVzzSZUTbvFe9S1g.webp)

wazuh araması

**Cevap:** 172.16.8.5

![CTI Platformuna göre (LetsDefend — Threat Intel), APT-ENR-88 grubunun IoC’lerinde listelenen IP adresinden gelen erişim](./1_3pwV0CkT0kfvgtpif8qvYw.webp)
> **CTI Platformuna göre (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), APT-ENR-88 grubunun IoC’lerinde listelenen IP adresinden gelen erişim girişimleri tarafından tetiklenen IPS saldırı olayının adı neydi?**

SIEM’in güvenlik duvarı olaylarında "data.srcip: [IP_Adresi]" ve "data.subtype: ips" filtrelerini uygulayın, ardından "data.attack" değerini bulun.

![SIEM’in güvenlik duvarı olaylarında "data.srcip: IPAdresi " ve "data.subtype: ips" filtrelerini uygulayın, ardından](./1_yfpmGF6Qhoo7pWeuG2qfHQ.webp)

IPS logu

**Cevap:** Apache.Log4j.Remote.Code.Execution

![CTI Platformuna göre (LetsDefend — Threat Intel), APT-ENR-88 grubunun IoC’lerinde listelenen IP adresinden kuruluş](./1_GlUWLDW7W8y8H4Yntn_OCw.webp)
> **CTI Platformuna göre (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), APT-ENR-88 grubunun IoC’lerinde listelenen IP adresinden kuruluş sistemlerine yönelik erişim girişimleri karşısında IPS ürünü hangi eylemi gerçekleştirdi?**

Logdaki action alanına baktığımızda cevabı görüyoruz.

**Cevap:** dropped

![LetsDefend laboratuvar soruları (2)](./1_gYGSs3ryd1QXYwme6XrTEw.webp)

---

## Pratik Laboratuvar-3

---

## Hipotez-3

**Not:** Bu bölümdeki sorular, aşağıdaki hipoteze dayanarak tehdit avı yapmak için hazırlanmıştır.

**Hipotez:** Bir tehdit aktörü grubu bu kuruluşu hedefleyen bir Business Email Compromise (BEC) saldırısına hazırlanıyor olabilir.

---

## Tehdit Avı Laboratuvar Ortamı

* **Şirket Adı:** CNCHome
* **Şirket Alan Adı:** cnchomecorp.io
* **Üçüncü Taraf Şirketler:** vertexenterprise.io, universalventures.io, pioneersystems.io
* CTI Olayları ([Threat Intel LetsDefend Platformu](https://app.letsdefend.io/threat-intelligence-feed))
* E-posta Güvenliği ([LetsDefend Platformu](https://app.letsdefend.io/email-security))

---

## Laboratuvar Notları

* Aşağıdaki soruları yanıtlamak için "Aug 1, 2024 00:00--Aug 7, 2024 00:00" arasındaki logları analiz edin.
* Sonraki sorular, önceki soruların doğru cevaplarını gerektirir. **Tüm soruları göründükleri sırayla yanıtlayın.**

---

## Sorular

**Not:** Aşağıdaki soruları yanıtlamak için "Aug 1, 2024 00:00--Aug 7, 2024 00:00" arasındaki logları analiz edin.

**Not:** Sonraki sorular, önceki soruların doğru cevaplarını gerektirir. Tüm soruları göründükleri sırayla yanıtlayın.

> **CTI Platformuna göre (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threath-intelligence-feed)**), kuruluşun birlikte çalıştığı üçüncü taraf şirkete ait olduğu düşünülen hangi şüpheli alan adı rapor edilmiştir?**

CTI platformunda üçüncü taraf şirket adlarına benzeyen alan adlarını arayın. Üç tane **üçüncü taraf alan adı** var: vertexenterprise.io, universalventures.io, pioneersystems.io. universalventures için arama yaptığımızda sonuçlar buluruz.

![CTI platformunda üçüncü taraf şirket adlarına benzeyen alan adlarını arayın](./1_ua7S4nb6DNNl4oqnLNtrcQ.webp)

Threat Intel

**Cevap:** universalventures.top

![CTI Platformuna göre (LetsDefend — Threat Intel), kuruluşun birlikte çalıştığı üçüncü taraf şirkete ait olduğu düşünülen](./1_DDaOijlpvt4V2OpR9e_ixA.webp)
> **CTI Platformuna göre (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threath-intelligence-feed)**), kuruluşun birlikte çalıştığı üçüncü taraf şirkete ait olduğu düşünülen alan adının TAG’i (CTI kategorisi) nedir?**

CTI platformunda üçüncü taraf şirket adlarına benzeyen alan adlarını arayın. TAG’i kontrol edin.

**Cevap:** phishing

![CTI Platformuna göre (LetsDefend — Threat Intel), kuruluşun üçüncü taraf şirkete ait olduğu düşünülen şüpheli alan adından](./1_VqdaS78Ws4oLPuNhFQolRg.webp)
> **CTI Platformuna göre (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), kuruluşun üçüncü taraf şirkete ait olduğu düşünülen şüpheli alan adından organizasyona gönderilen e-postanın gönderen e-posta adresi nedir?**

Şüpheli alan adını "Email Security" modülünde arayın.  
E-postanın konu satırı, banka hesabı ile ilgili acil bir çağrı içeriyor. Bu, bilinen bir oltalama taktiğidir. Üç e-posta karantinaya alınmış, biri ise kullanıcıya teslim edilmiştir.

![E-postanın konu satırı, banka hesabı ile ilgili acil bir çağrı içeriyor](./1_bGbWtToYCmuqTiLaa-fYAw.webp)

**Cevap:** john@universalventures.top

![CTI Platformuna göre (LetsDefend — Threat Intel), kuruluşun üçüncü taraf şirkete ait olduğu düşünülen şüpheli alan adından (2)](./1_zE5kH1ztCuVG7cLF3hDUiQ.webp)
> **CTI Platformuna göre (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), kuruluşun üçüncü taraf şirkete ait olduğu düşünülen şüpheli alan adından gelen e-postaları organizasyonda kaç farklı e-posta hesabı aldı?**

Önceki soruda cevabı bulduk. anna@cnchomecorp.io, suzan@cnchomecorp.io ve eric@cnchomecorp.io

**Cevap: 3**

![CTI Platformuna göre (LetsDefend — Threat Intel), şüpheli alan adından (üçüncü taraf şirkete ait olduğu düşünülen) başarıyla](./1_Du_xuBHSPOaxb2OifGfqNQ.webp)
> **CTI Platformuna göre (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), şüpheli alan adından (üçüncü taraf şirkete ait olduğu düşünülen) başarıyla teslim edilen e-postanın alıcı e-posta adresi nedir?**

Önceki soruda cevabı bulduk

**Cevap:** anna@cnchomecorp.io

![CTI Platformuna göre (LetsDefend — Threat Intel), organizasyondan üçüncü taraf şirkete ait olduğu düşünülen şüpheli alan](./1_tb_QjISiTu62kXXDp0CCUw.webp)
> **CTI Platformuna göre (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), organizasyondan üçüncü taraf şirkete ait olduğu düşünülen şüpheli alan adına herhangi bir e-posta gönderildi mi?**

"Detailed Search" içinde "Recipients:" alanını kullanarak "Email Security" modülünde şüpheli alan adını arayın. Yanıt e-postası olmadığını görürüz.

**Cevap: Hayır**

![LetsDefend laboratuvar soruları (3)](./1_lkGq5dGpu6eSWAY6ZSwKsA.webp)
