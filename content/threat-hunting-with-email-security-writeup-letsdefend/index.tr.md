---
date: '2025-10-30'
description: "E-posta kaynaklı saldırı vektörleri, kimlik avı (phishing) altyapıları, BEC göstergeleri ve posta kutusu telemetrisi üzerine LetsDefend laboratuvar analizi."
draft: false
image: featured.webp
title: E-Posta Güvenliği ile Tehdit Avcılığı Çözümü - LetsDefend
type: writeups
topic: detection-response
tags: ["LetsDefend", "Threat Hunting", "Write-up", "Blue Team", "SIEM", "Email Security", "Phishing"]
featuredImageAlt: "LetsDefend Blue Team Training logosu"
---

[Letsdefend Blue Team Eğitim Platformu](https://letsdefend.io/)

Kurumsal ihlallerin başlangıç erişim (initial access) telemetrisinde e-posta altyapısı ilk sıralarda yer alır. Saldırganlar kimlik avı, zararlı ekler ve İş E-postası İhlali (BEC) yöntemleriyle insan faktörünü ve kimlik mekanizmalarını hedef alır. E-posta tabanlı tehdit avcılığı, güvenlik ağ geçitlerinin ötesine geçerek başlık (header) anomalilerini, kimlik doğrulama kayıtlarını (SPF, DKIM, DMARC) ve teslim sonrası posta kutusu telemetrisini proaktif olarak sorgulama sürecidir.

E-posta tabanlı tehdit avcılığı, potansiyel tehditleri ve saldırıları tanımlamak, analiz etmek ve önlemek için e-posta trafiğinin derinlemesine analiz edilmesi sürecidir. Şüpheli aktivitelerin ve kötü niyetli içeriklerin tespiti, gelişmiş analiz teknikleri, tehdit istihbaratı ve otomasyon araçları gerektirir. Amaç, tehditleri yayılmaya başlamadan önce mümkün olduğunca çabuk yakalamak ve etkisiz hale getirmektir.

![E-posta tabanlı tehdit avcılığı, potansiyel tehditleri ve saldırıları tanımlamak, analiz etmek ve önlemek için e-posta](./0_EnY1qtDQU3ZuBq7k.webp)

---

## Yaygın E-Posta Tehditleri

* **Spam:** Toplu olarak gönderilen istenmeyen e-postalar olarak sınıflandırılır. Bazı durumlarda spam e-postalar, kötü amaçlı dosyalar indiren bağlantılar içerebilir.
* **Oltalama (Phishing):** Siber suçluların kişisel bilgileri çalmak veya çevrimiçi hesaplara erişim sağlamak için yanıltıcı e-postalar, reklamlar, bağlantılar veya mesajlar kullandığı bir saldırı türüdür. Verizon'a göre ihlallerin %36'sı oltalama kaynaklıdır.
* **Kötü Amaçlı Yazılım (Malware):** Siber suçluların bir veya daha fazla cihaza virüs bulaştırmak için e-posta mesajlarında kötü amaçlı kod kullandığı bir saldırı yöntemidir. 2020 yılına gelindiğinde e-posta tabanlı kötü amaçlı yazılım saldırıları %600 oranında artmıştır.
* **Sahtecilik (Spoofing):** Siber suçlular tarafından spam ve oltalama saldırılarında kullanılan bir tekniktir. Kullanıcıları, mesajın tanıdıkları veya güvendikleri biri veya bir kuruluş gibi tanıdık bir kişiden geldiğine inandırarak aldatır.
* **Botnet Mesajları:** Bir bilgisayar ağına kötü amaçlı yazılım bulaştırma yöntemidir. Ağ, "botnet lideri" olarak bilinen tek bir saldırgan tarafından kontrol edilir. Botnet mesajları saldırı başlatmak, veri çalmak, spam göndermek ve cihazlara erişim sağlamak için kullanılır.
* **İş E-postası İhlali (BEC):** Bu yöntemde saldırganlar bir iş e-posta hesabına erişim sağlar ve hesabın sahibiymiş gibi davranır. Bu saldırganlar genellikle para transferi yapan ve denizaşırı tedarikçileri olan şirketleri hedef alır.

![İş E-postası İhlali (BEC): Bu yöntemde saldırganlar bir iş e-posta hesabına erişim sağlar ve hesabın sahibiymiş gibi](./0_hxh8nRQD_XyksTwL.webp)

( **Görsel Kaynağı** : <https://www.mailmunch.com/blog/email-security-best-practices> )

---

## Tehdit Avcılığında E-Posta Güvenlik Sistemlerinin Rolü

E-posta, siber saldırganlar için en popüler ve etkili saldırı vektörlerinden biridir. Oltalama, kötü amaçlı yazılım dağıtımı, fidye yazılımı (ransomware) ve iş e-postası ihlali (BEC) gibi e-posta saldırıları hem bireyleri hem de kuruluşları hedef alır. Sonuç olarak, e-posta güvenlik sistemleri tehdit avcılığı sürecinde kritik bir rol oynar.

---

## E-Posta Güvenlik Sistemlerinin Temel Fonksiyonları

E-posta güvenlik sistemleri öncelikle e-posta trafiğindeki kötü niyetli içerikleri filtrelemek, analiz etmek ve tespit etmek için tasarlanmıştır. Temel fonksiyonları şunları içerir:

* **Spam Filtreleme:** E-posta güvenlik sistemleri, gereksiz ve potansiyel olarak zararlı e-postaların kullanıcıların gelen kutularına ulaşmasını engeller.
* **Oltalamaya Karşı Koruma:** Meşru kullanıcılardan bilgi çalmak için oluşturulan sahte e-postaları tespit eder ve engeller.
* **Zararlı Yazılım Tespiti:** E-posta güvenlik sistemleri eklerdeki, bağlantılardaki veya e-posta içeriğindeki kötü amaçlı yazılımları tarar ve tespit eder.
* **URL ve Bağlantı Analizi:** E-postalardaki bağlantıların kötü niyetli olup olmadığını kontrol ederler.
* **İçerik Tarama:** Riskli durumları tanımlamak için e-posta içeriğini belirli anahtar kelimeler ve şüpheli örüntüler açısından tararlar.

---

## Tehdit Avcılığında E-Posta Güvenlik Sistemlerinin Rolü

Tehdit avcılığı, saldırıları meydana gelmeden önce tespit etmeyi amaçlayan proaktif bir siber güvenlik stratejisidir. E-posta güvenlik sistemleri bu süreçte kritik bir rol oynar. İşte bu sistemlerin tehdit avcılığında oynadığı temel rollerden bazıları:

* **Gelişmiş Tehdit Tespiti:** E-posta güvenlik sistemleri, gelişmiş tehditleri tespit etmek için davranışsal analiz, makine öğrenmesi ve tehdit istihbaratını kullanarak geleneksel imza tabanlı tehdit tespit yöntemlerinin ötesine geçer. Bu fonksiyonlar sistemlerin yeni ve daha önce görülmemiş saldırı yöntemlerini tanımlamasını sağlar.
* **Olay Müdahalesi için Veri Sağlama:** Bir saldırı gerçekleştiğinde veya şüpheli bir etkinlik tespit edildiğinde, e-posta güvenlik sistemleri, tehdit avcılarının saldırının kaynağını, yöntemini ve amacını belirlemek için analiz ettiği verileri sağlar. Bu veriler olay müdahale süreçlerinde son derece değerlidir.
* **İçerik ve Bağlantı Analizi:** E-posta güvenlik sistemleri, tehdit avcılarının şüpheli e-postalardaki içeriği ve bağlantıları incelemek için kullandığı ayrıntılı analiz raporları oluşturur. Bu raporlar, özellikle hedefli saldırılarda kullanılan oltalama e-postalarını tespit etmek ve analiz etmek için önemlidir.
* **Otomatik Avcılık Süreçleri:** E-posta güvenlik sistemleri otomatik tehdit avcılığı süreçlerini destekleyerek büyük ölçekli ağlarda bile etkili tehdit avcılığına olanak tanır. E-posta trafiğinin sürekli izlenmesini ve anormal aktivitelerin anında tespit edilmesini sağlarlar.

![Otomatik Avcılık Süreçleri: E-posta güvenlik sistemleri otomatik tehdit avcılığı süreçlerini destekleyerek büyük ölçekli](./0_jp6OHhzpkRJrZAkD.webp)

( **Görsel Kaynağı** : <https://www.mailmunch.com/blog/email-security-best-practices> )

---

## E-Posta Güvenlik Yazılımlarında Yer Alan Teknikler ve Teknolojiler

E-posta güvenlik sistemlerinde kullanılan temel teknik ve teknolojilerden bazıları şunlardır:

* **Makine Öğrenmesi ve Yapay Zeka:** E-posta güvenlik sistemleri, anormal davranışları ve şüpheli aktiviteleri tespit etmek için makine öğrenmesi ve yapay zekayı kullanır. Sürekli öğrenme yetenekleri sayesinde saldırı yöntemleri gelişse bile uyum sağlayabilirler.
* **Sandboxing (Kumlama):** E-posta güvenlik sistemleri, gelen e-postalardaki dosya ve bağlantıları davranışlarını analiz etmek için izole edilmiş sanal ortamlarda çalıştırarak kötü niyetli içeriğin gerçek sistemlere zarar vermeden önce tespit edilmesini sağlar.
* **Tehdit İstihbaratı Entegrasyonu:** E-posta güvenlik sistemleri, bilinen tehditleri hızla tespit etmek için küresel tehdit istihbaratından yararlanır. Tehdit istihbaratı entegrasyonu, sürekli güncellenen tehdit veritabanlarıyla birleştiğinde daha etkili koruma sağlar.

![Tehdit İstihbaratı Entegrasyonu: E-posta güvenlik sistemleri, bilinen tehditleri hızla tespit etmek için küresel tehdit](./0_k2M_qgmzF64cPQmD.webp)

( **Görsel Kaynağı** : <https://www.anubisnetworks.com/email-sandboxing-integration> )

E-posta güvenlik sistemleri, tehdit avcılığı sürecinde proaktif bir rol oynayarak siber saldırıları önlemek ve tespit etmek için hayati önem taşır. Gelişmiş teknolojilerle donatılmış bu sistemler, kurumsal siber güvenlik stratejilerinin vazgeçilmez bir parçasıdır.

---

## E-Posta Güvenlik Sistemlerinin Kullanımı

E-posta güvenlik sistemleri, siber güvenlik analistlerinin şüpheli etkinlikleri tespit etmesine ve analiz etmesine yardımcı olur. Oltalama e-postalarını ve kötü amaçlı yazılım içeren e-postaları tespit etmek en önemli işlevlerinden biridir. E-posta güvenlik sistemleri, makine öğrenmesi algoritmaları, davranışsal analiz ve tehdit istihbaratı gibi gelişmiş teknolojilerle donatılmıştır. Sonuç olarak, sadece bilinen tehditleri değil, aynı zamanda daha önce görülmemiş veya hedeflenmiş saldırıları da tespit edebilirler.

Tehdit avcılığı sürecinde e-posta güvenlik sistemlerinin kullanılması, kurumsal ağların ve verilerin korunması için kritiktir. Bu sistemler sadece gelen e-posta trafiğini değil, aynı zamanda dahili e-posta trafiğini de izleyerek iç tehditlerin tespit edilmesine yardımcı olur. Tehdit avcılığında e-posta güvenlik sistemlerinin etkili kullanımı, siber saldırıları önlemede ve potansiyel tehditleri en aza indirmede kritik bir adımdır.

---

## E-Posta Verilerinin Toplanması ve Log Analizi

E-posta verilerinin toplanması ve bu logların analizi tehdit avcılığı süreçlerinde önemli bir yer tutar. E-posta logları, organizasyonların e-posta trafiğini izlemek, anomalileri tespit etmek ve siber saldırılara karşı önlemler almak için kullanabileceği kritik bilgiler içerir.

**E-Posta Verilerinin Toplanması:** E-posta güvenlik sistemleri bir kuruluş içindeki tüm e-posta trafiğini izleyebilir ve bu verileri güvenli bir şekilde depolayabilir. Bu veriler gönderen ve alıcı e-posta adreslerini, konu satırlarını, IP adreslerini, e-posta boyutlarını, zaman damgalarını ve ek ayrıntılarını içerebilir. Ayrıca e-postalarda kullanılan bağlantılar ve hedef adresleri de toplanabilir. Bu verilerin düzgün ve eksiksiz toplanması, tehdit avcılığı süreci boyunca siber saldırı izlerinin tespiti için çok önemlidir.

**Log Analizi:** E-posta logları siber güvenlik analistlerine ayrıntılı bilgi sağlayarak normal davranıştan sapmaları ve anormal aktiviteleri tespit etmelerini sağlar. Log analizi, potansiyel tehditleri belirlemek için belirli bir zaman dilimi içindeki tüm e-posta aktivitelerinin incelenmesini içerir. Anormal aktivite, olağandışı kullanıcı e-posta modellerini, bilinmeyen IP adreslerinden gelen e-postaları veya oltalama girişimlerini içerir. Log analizi araçları bu tür anomalileri otomatik olarak tespit edebilir ve analistleri uyararak potansiyel tehditlerin erken bir aşamada belirlenmesine ve azaltılmasına olanak tanır.

E-posta veri toplama ve log analizi tehdit avcılığının temel unsurlarından biridir. Tehditlerin zamanında tespit edilmesi ve siber saldırılara karşı etkili bir savunma stratejisi geliştirmek için bu süreç kritiktir.

![E-posta veri toplama ve log analizi tehdit avcılığının temel unsurlarından biridir](./0_Yapx_un0sVdyuHfS.webp)

( **Görsel Kaynağı** : <https://documentation.wazuh.com/current/cloud-security/office365/monitoring-office365-activity.html> )

---

## Kötü Niyetli E-Posta İçeriklerinin Tespiti ve Analizi

Kötü niyetli e-posta içeriklerinin tespiti ve analizi siber güvenlik dünyasında önemli bir savunma mekanizmasıdır. Siber saldırganlar, kötü amaçlı yazılım yaymak, oltalama yapmak veya kullanıcıları e-posta yoluyla aldatmak için çeşitli teknikler kullanırlar. Bu nedenle, bir kuruluşun güvenliğini sağlamak için kötü niyetli içeriğin tespiti ve etkili analizi esastır.

* **Tespit Yöntemleri:** Kötü niyetli e-posta içeriğini tespit etmek için kullanılan birkaç yöntem vardır. İmza tabanlı tespit yöntemleri bilinen tehditleri tanımlamak için etkilidir. Ancak daha gelişmiş saldırılar için davranışsal analiz, makine öğrenmesi ve sandboxing (kumlama) gibi teknikler kullanılır. Bu yöntemler şüpheli e-posta içeriğini analiz eder ve anormal davranışları tespit eder. Örneğin sandboxing, e-posta eklerini kötü amaçlı yazılım açısından test etmek için izole bir ortamda çalıştırır.
* **İçerik Analizi:** E-posta içerik analizi hem metnin hem de eklerin ayrıntılı bir incelemesini içerir. Oltalama e-postaları genellikle kullanıcıları aldatmak için belirli örüntüler kullanır ve bu örüntüleri tespit etmek için doğal dil işleme (NLP) teknikleri kullanılır. Ayrıca e-posta eklerindeki dosyalar bilinen kötü amaçlı yazılımlar için taranır. Kötü niyetli e-posta içeriği genellikle kullanıcıları belirli eylemleri yapmaya zorlayan unsurlar içerir (örneğin aciliyet duygusu yaratmak). Bu tür unsurların tespiti potansiyel tehditlerin belirlenmesine yardımcı olur.

![İçerik Analizi: E-posta içerik analizi hem metnin hem de eklerin ayrıntılı bir incelemesini içerir](./0_DT2LjsW9O_eWD-VB.webp)

( **Görsel Kaynağı** : <https://www.proofpoint.com/us/blog/security-awareness-training/new-clear-solution-automation-email-reporting-remediation> )

Kötü niyetli e-posta içeriğinin tespiti ve analizi, siber tehditlerin hızlı ve etkili bir şekilde etkisiz hale getirilmesi için kritik öneme sahiptir, hem mevcut tehditlerin belirlenmesinde hem de gelecekteki saldırılara karşı korunmada hayati bir rol oynar.

---

## Gerçek Zamanlı ve Geçmişe Dönük E-Posta Analizi

Hem gerçek zamanlı hem de geçmişe dönük e-posta analizi e-posta güvenliği için önemlidir. Bu yöntemler siber tehditleri tespit etmek ve önleyici tedbirler almak için kullanılır. Gerçek zamanlı analiz aktif tehditlerin anında tespit edilmesini sağlarken, geçmişe dönük analiz geçmiş olayların araştırılmasına olanak tanır.

* **Gerçek Zamanlı E-Posta Analizi:** Bu yöntem, e-posta güvenlik sistemlerinin e-posta trafiğini gerçek zamanlı olarak izlediği ve şüpheli etkinlikleri tespit ettiği süreci ifade eder. Gerçek zamanlı analiz, oltalama girişimlerini, kötü amaçlı yazılım dağıtımını veya olağandışı e-posta etkinliğini anında tanımlayabilir. Bu analiz türü, saldırıları tam olarak gerçekleşmeden durdurabilir. Örneğin bir e-posta sistemi normal davranıştan sapan bir kullanıcıyı tespit ederse, kullanıcıyı veya BT birimini gerçek zamanlı olarak uyarabilir.
* **Geçmişe Dönük (Retrospective) E-Posta Analizi:** Bu yöntem geçmiş e-posta trafiğinin analiz edilmesini içerir. Özellikle bir güvenlik ihlalinden sonra ihlalin nasıl gerçekleştiğini anlamak ve gelecekte benzer olayları önlemek için geçmişe dönük analiz kullanılır. E-posta loglarının ayrıntılı bir incelemesini içerir ve ayrıca siber suçlular tarafından kullanılan yöntemleri ve saldırıların nasıl yayıldığını anlamak için de kullanılır. Bulgulara dayanarak kuruluşlar güvenlik politikalarını gözden geçirebilir ve yeni stratejiler geliştirebilirler.

![Geçmişe Dönük (Retrospective) E-Posta Analizi: Bu yöntem geçmiş e-posta trafiğinin analiz edilmesini içerir](./0_2wuURSlxtdaPcfeN.webp)

( **Görsel Kaynağı** : <https://emailanalytics.com/> )

Siber güvenlik tehditlerini analiz etmeye ve bunlara yanıt vermeye yönelik bu iki yaklaşım birbirini tamamlar. Gerçek zamanlı e-posta analizi acil tehditlere hızlı yanıtlar sağlarken, geçmişe dönük analiz uzun vadeli güvenlik önlemlerine katkıda bulunan daha geniş bir perspektif sunar.

E-posta güvenlik sistemleri tehdit avcılığı sürecinde hem proaktif hem de reaktif roller oynayarak siber saldırılara karşı güçlü bir savunma hattı oluşturur. E-posta veri toplama, log analizi, kötü niyetli içerik tespiti ve analizi ile gerçek zamanlı ve geçmişe dönük e-posta analizi gibi kritik adımlar, potansiyel tehditlerin erkenden tespit edilmesini ve etkisiz hale getirilmesini sağlar. Bu süreçler organizasyonel güvenliğin sağlanması ve gelecekteki saldırılara hazırlanma açısından kritiktir. E-posta güvenlik sistemlerinin etkili kullanımı, güvenlik ekiplerinin saldırılara hızlı ve bilgili bir şekilde yanıt vermesini sağlar.

---

## Anormal E-Posta Gönderim Modeli Hipotezi

---

## Hipotez

Bir çalışanın e-posta hesabı, olağandışı bir şekilde aynı anda birden fazla harici e-posta adresine yüksek hacimli spam veya kötü niyetli içerik göndermek için kullanılıyor olabilir.

![Bir çalışanın e-posta hesabı, olağandışı bir şekilde aynı anda birden fazla harici e-posta adresine yüksek hacimli spam veya](./0_kmTdkqA1mLC8gnr-.webp)

( **Görsel Kaynağı** : <https://www.howtogeek.com/412316/how-email-bombing-uses-spam-to-hide-an-attack/> )

---

## Veri Kaynakları

* **E-Posta Güvenlik Sistemi Logları:** Gelen ve giden e-posta trafiği, e-posta ekleri, e-posta içerik taramaları ve spam filtreleme sonuçları.
* **SIEM Logları:** E-posta güvenlik sistemlerini ve diğer güvenlik loglarını entegre eden merkezi bir platform.
* **SMTP Sunucu Logları:** Giden e-posta trafiği, başarısız e-posta teslim girişimleri ve spam olarak işaretlenen e-postalar.
* **Kullanıcı Aktivite Logları:** Çalışan e-posta hesaplarından gelen olağandışı gönderim faaliyetleri.
* **DNS Logları:** E-posta gönderimi sırasında kullanılan alan adı çözümleme süreçleri ve şüpheli alan adlarıyla olan ilişkiler.

---

## Analiz Adımları

* Gelen ve giden e-posta trafiğini ayrıntılı olarak analiz edin.
* Günlük ortalama kaç e-posta gönderildiğini belirleyin.
* Tipik alıcı profillerini ve e-posta içeriğini analiz edin.
* Spam ve kötü niyetli içerik tespiti için e-posta güvenlik sistemi sonuçlarını analiz edin.
* Şüpheli e-posta eklerini, olağandışı içerikleri ve bilinen kötü amaçlı yazılımların tespit edildiği gönderimleri tanımlayın.
* SMTP sunucu loglarını analiz edin.
* E-posta teslimat hatalarını ve spam olarak işaretlenen e-postaları analiz edin.
* Kullanıcı aktivite loglarını analiz edin.
* E-posta hesaplarındaki olağandışı faaliyetleri, özellikle yoğun e-posta gönderimini tanımlayın.
* DNS loglarını inceleyin ve analiz edin.
* Şüpheli alan adlarına gönderilen e-postaları tanımlayın.
* Anormal e-posta gönderimlerini tespit etmek için normal gönderim modellerinden sapmalar analiz edilir.
* Aynı anda çok sayıda farklı harici e-posta adresine gönderim, alışılmadık bir frekansta gönderim gibi faaliyetleri tanımlayın.
* SIEM ile tüm güvenlik loglarının korelasyon analizini yapın.
* E-posta güvenlik sistemi loglarını, kullanıcı aktivitelerini ve SMTP sunucu loglarını ilişkilendirerek şüpheli etkinlikleri ayrıntılı olarak analiz edin.
* Tespit edilen anomalileri potansiyel tehditler açısından değerlendirin.
* Bir anomali tespit edilirse bunun bir spam saldırısı mı, bir oltalama kampanyası mı yoksa bir hesap ele geçirme girişimi mi olduğu belirlenir.
* Anomaliyi doğrulamak için daha fazla kanıt toplayın.
* Şüpheli faaliyetin bir saldırı olup olmadığını doğrulamak için ek kontroller yapın.
* Daha fazla işlem için bulgular hakkında uygun güvenlik ekiplerini bilgilendirin.

---

## Hipotez Doğrulama ve Beklenen Bulgular

* E-posta güvenlik sistemleri, belirli bir hesaptan aynı anda birden fazla harici e-posta adresine gönderilen yüksek hacimli e-postaları tespit eder.
* Gönderilen e-postalar kötü niyetli ekler, oltalama bağlantıları veya olağandışı metinler içerebilir.
* SMTP sunucu loglarında olağandışı e-posta gönderim sıklığı veya çok sayıda başarısız teslimat girişimi gözlemlenir.
* Kullanıcı aktivite loglarında e-posta hesabıyla ilişkili farklı IP adreslerinden olağandışı oturum açma girişimleri veya etkinlikler tespit edilir.
* DNS loglarında bilinmeyen veya kötü niyetli alan adlarına e-posta yönlendirmeleri gözlemlenir.
* SIEM logları, şüpheli e-posta etkinliğini, hesap ele geçirme girişimleri veya kötü amaçlı yazılım yayılımı gibi diğer güvenlik olaylarıyla ilişkilendirir.

---

## Hipotez Değerlendirmesi

E-posta güvenliği kuruluşlar için en kritik savunma noktalarından biridir. Tehdit avcıları, anormal e-posta gönderim modellerini ve potansiyel kötü niyetli faaliyetleri tespit etmek için e-posta güvenlik sistemleri ve SIEM logları gibi veri kaynaklarını analiz edebilirler.

---

## Uygulamalı Laboratuvar

---

## Hipotez

**Not**: Bu bölümdeki sorular, aşağıdaki hipoteze dayalı olarak Tehdit Avcılığı için hazırlanmıştır:

**Hipotez**: Kurum ağı saldırganlar tarafından hedeflenmekte olabilir ve çalışanlara ".top" uzantılı alan adlarından gönderilen e-postalarda yer alan kötü amaçlı yazılımlar ile sistemler zarar görebilir.

---

## Tehdit Avcılığı Laboratuvar Ortamı

* **Kurum Adı**: Quantum Synergy Solutions
* **Kurum Alan Adı**: quantumsynergy.io
* E-Posta Güvenliği ([LetsDefend Platformu](https://app.letsdefend.io/email-security))
* EDR Olayları (Sysmon)
* SIEM (Wazuh)
* Güvenlik Duvarı Trafik Olayları
* CTI Olayları ([Threat Intel LetsDefend Platformu](https://app.letsdefend.io/threat-intelligence-feed))

---

## Laboratuvar Notları

* Aşağıdaki soruları yanıtlamak için "8 Ağustos 2024 00:00 - 13 Ağustos 2024 00:00" arasındaki logları analiz edin.
* Sonraki sorular bir öncekilerin doğru cevaplarını gerektirir. Tüm soruları kesinlikle göründükleri sırayla yanıtlayın.

**Not:** Aşağıdaki soruları yanıtlamak için "8 Ağustos 2024 00:00 - 13 Ağustos 2024 00:00" arasındaki logları analiz edin.

**Not**: Sonraki sorular bir öncekilerin doğru cevaplarını gerektirir. Tüm soruları kesinlikle göründükleri sırayla yanıtlayın.

> Kurum tarafından ".top" uzantılı alan adlarından toplam kaç adet e-posta alınmıştır?

İpucu: E-posta Güvenliği platformunda kurumun alan adını arayın.

![İpucu: E-posta Güvenliği platformunda kurumun alan adını arayın](./1_qV0CknjOHxiP59Igt92dag.webp)

**Cevap:** 5

> ".top" alan adlarından gelen e-postalardan kaç tanesinin "Final Action" (Son Eylem) değeri "allowed" (izin verildi) olarak belirlenmiştir?

E-posta Güvenliği platformunda kurumun alan adını arayın. "Final Action" değeri "Allowed" olan e-postaları bulun.

**Cevap:** 2

> ".top" uzantılı alan adlarından kuruma gönderilen ve "Final Action" değeri "Allowed" olan e-postaların gönderen adresi nedir?

E-posta Güvenliği platformunda kurumun alan adına göre filtreleme yapın ve "Final Action" değeri "Allowed" olan e-postaların "Sender" (Gönderen) alanını kontrol edin.

**Cevap:** YouWon@chronocampaign.top

> ".top" uzantılı alan adlarından kuruma gönderilen ve "Final Action" değeri "Allowed" olan e-postalarda yer alan URL nedir?

E-posta Güvenliği platformunda kurumun alan adına göre filtreleme yapın. "Final Action" değeri "Allowed" olan e-postaların içeriğini kontrol edin.

![E-posta Güvenliği platformunda kurumun alan adına göre filtreleme yapın](./1_1At4pliPGDB2TcEUv-bXpQ.webp)

**Cevap:** http://chronocampaign.top/claim-your-gift-card

> .top uzantılı alan adlarından gelen ve "Allowed" (İzin Verildi) olarak işaretlenen e-postalardaki URL'de yer alan alan adını sorgulayan sistemin IP adresi nedir?

SIEM'de "data.win.eventdata.queryName: [Alan_Adı]" filtresini kullanın ve sonuçtaki "agent.ip" alanını kontrol edin.

![SIEM'de "data.win.eventdata.queryName: AlanAdı " filtresini kullanın ve sonuçtaki "agent.ip" alanını kontrol edin](./1_6tgFZ_ohAkw-TUf995DN4w.webp)![SIEM'de "data.win.eventdata.queryName: AlanAdı " filtresini kullanın ve sonuçtaki "agent.ip" alanını kontrol edin (2)](./1_mgepSPhyEbCn2fUEQ-tKpw.webp)![SIEM'de "data.win.eventdata.queryName: AlanAdı " filtresini kullanın ve sonuçtaki "agent.ip" alanını kontrol edin (3)](./1_IPfEO_93MHgn1DbF61laOg.webp)

**Cevap:** 192.168.150.5

> .top uzantılı alan adlarından gelen ve "Allowed" olarak işaretlenen e-postalardaki URL'ye erişen sistem için güvenlik duvarı eylemi (firewall action) nedir?

SIEM'de "rule.groups: firewall" ve "data.dstip: [IP_Adresi]" filtrelerini uygulayın. "data.action" alanını kontrol edin.

![SIEM'de "rule.groups: firewall" ve "data.dstip: IPAdresi " filtrelerini uygulayın](./1_YusX_zBn1U4QYnNrcL4TlA.webp)![SIEM'de "rule.groups: firewall" ve "data.dstip: IPAdresi " filtrelerini uygulayın (2)](./1_hgZ6HtCz8Tke9nN-s9sTvA.webp)

112.156.83.45 C2 IP adresidir

**Cevap:** allow

> .top uzantılı alan adlarından gelen ve "Allowed" olarak işaretlenen e-postalardaki URL ile hangi APT grubu ilişkilendirilmiştir?

Alan adını veya C2 IP'sini Tehdit İstihbaratı (Threat Intel) platformunda arayın.

![Alan adını veya C2 IP'sini Tehdit İstihbaratı (Threat Intel) platformunda arayın](./1_70ifhGyPn9ae3y7Ea8eM2g.webp)

**Cevap:** APT-SR-34

> .top uzantılı alan adlarından gelen ve "Allowed" olarak işaretlenen e-postalardaki URL'ye erişen sistemde, erişim sırasında çalışan ve "Company Name" (Şirket Adı) değeri "Unknown" (Bilinmiyor) olan işlemin adı nedir?

SIEM'in EDR olaylarında sistemin "agent.ip" değerine göre filtreleme yapın. Ardından "data.win.eventdata.company: Unknown" filtresini uygulayın ve "data.win.eventdata.originalFileName" değerini kontrol edin.

![SIEM'in EDR olaylarında sistemin "agent.ip" değerine göre filtreleme yapın](./1_lakPCbw0YecNuPmyqk1zyA.webp)

**Cevap:** outlook.exe

> CTI platformunda aratıldığında, .top uzantılı alan adlarından kuruma gönderilen ve "Final Action" değeri "Allowed" olan e-postalardaki URL'ye erişen sistemde çalışan işlemin MD5 hash'i ile hangi APT grubu ilişkilendirilmiştir?

Önceki soruyla aynı.

**Cevap:** APT-SR-34
