---
date: '2025-10-23'
description: Domain Name System (DNS), internetin temel yapı taşlarından biridir. Kullanıcılar internette belirli bir web sitesine erişmek istediklerinde DNS, alan adlarını (örneğin www.example.com) IP adreslerine çevirir. Bu çeviri, kullanıcıların web sitelerine kolayca erişmesini sağlar ve internet trafiğinin sorunsuz işlemesine katkıda bulunur. Ancak DNS'in bu kritik rolü siber suçlular tarafından kötüye kullanılabilir.
draft: false
image: featured.webp
title: DNS ile Tehdit Avcılığı Çözümü - LetsDefend
type: writeups
topic: detection-response
tags: ["LetsDefend", "Threat Hunting", "Write-up", "Blue Team", "SIEM", "DNS"]
featuredImageAlt: "LetsDefend Blue Team Training logosu"
---

[Letsdefend Blue Team Eğitim Platformu](https://letsdefend.io/)

Domain Name System (DNS), internetin temel yapı taşlarından biridir. Kullanıcılar internette belirli bir web sitesine erişmek istediklerinde DNS, alan adlarını (örneğin [www.example.com](http://www.example.com)) IP adreslerine çevirir. Bu çeviri, kullanıcıların web sitelerine kolayca erişmesini sağlar ve internet trafiğinin sorunsuz işlemesine katkıda bulunur. Ancak DNS'in bu kritik rolü siber suçlular tarafından kötüye kullanılabilir.

Siber saldırganlar, çeşitli saldırılar gerçekleştirmek için DNS altyapısını hedef alabilir. DNS tabanlı saldırılar, organizasyon ağlarına sızmak, veri çalmak ve hizmetleri kesintiye uğratmak için kullanılabilir. Sonuç olarak, DNS tabanlı tehdit avcılığı siber güvenlik stratejilerinin temel bir parçası haline gelmiştir.

---

## DNS Tünelleme (DNS Tunneling)

DNS tünelleme, saldırganların veri sızdırmak veya kötü amaçlı içerik göndermek için DNS protokolünü kötüye kullandığı bir yöntemdir. Bu saldırı türünde veriler veya komutlar DNS isteklerinin içine gizlenir. Saldırganlar bu tekniği bir ağdan veri sızdırmak veya bir cihazla uzaktan iletişim kurmak için kullanabilirler.

DNS tünelleme saldırıları tipik olarak şu şekilde çalışır:

* Saldırganlar bir DNS sorgusuna şifrelenmiş veya kodlanmış veriler yerleştirir.
* Bu sorgular hedef sunucuya ulaştığında, şifrelenmiş veriler çözülür ve kötü amaçlı içerik yayılır veya veriler sızdırılır.

Bu yöntem genellikle güvenlik duvarlarını (firewall) atlatarak saldırganların gizlice veri iletmesine olanak tanır.

DNS trafiği genellikle güvenilir kabul edildiği ve çoğu ağda yakından izlenmediği için bu tür saldırıların tespiti zordur.

![DNS trafiği genellikle güvenilir kabul edildiği ve çoğu ağda yakından izlenmediği için bu tür saldırıların tespiti zordur](./0_3YJ3tUfJ7251zTLD.webp)

( **Görsel Kaynağı** : <https://bluecatnetworks.com/blog/four-major-dns-attack-types-and-how-to-mitigate-them/> )

---

## DNS Önbellek Zehirlemesi (DNS Cache Poisoning)

DNS önbellek zehirlemesi, saldırganların kullanıcıları sahte web sitelerine yönlendirmek için DNS sunucularını yanlış bilgilerle doldurduğu bir saldırı türüdür. Kullanıcıların DNS sunucusundan yanlış bir IP adresi almasına neden olarak onları saldırganlar tarafından kontrol edilen bir siteye yönlendirir.

![DNS önbellek zehirlemesi, saldırganların kullanıcıları sahte web sitelerine yönlendirmek için DNS sunucularını yanlış](./0_L1eAUJSW2NeDaZvE.webp)

( **Görsel Kaynağı** : <https://www.cloudflare.com/learning/dns/dns-cache-poisoning/> )

Örneğin bir kullanıcı bir bankanın web sitesine erişmeye çalıştığında, bir DNS önbellek zehirlemesi saldırısı yanlış bir IP adresi almasına ve sahte bir bankacılık sitesine yönlendirilmesine neden olabilir.

Eğer kullanıcı bu sahte sitede kimlik bilgilerini girerse, bu bilgiler saldırganlar tarafından ele geçirilir.

Bu saldırı türü genellikle kişisel bilgileri çalmak veya kötü amaçlı yazılım yaymak için kullanılır.

---

## DNS Yükseltme (DNS Amplification) Saldırıları

DNS yükseltme, dağıtık hizmet dışı bırakma (DDoS) saldırılarında kullanılan bir tekniktir. Bu saldırı türünde saldırganlar, hedef sunucuyu veya ağı çökertmek için DNS sunucularını yansıtıcı olarak kullanır. DNS yükseltme saldırıları muazzam miktarda trafik oluşturarak hedeflenen sistemi kullanılamaz hale getirir.

![DNS yükseltme, dağıtık hizmet dışı bırakma (DDoS) saldırılarında kullanılan bir tekniktir](./0_YvqKAYqmpqLK-K4v.webp)

( **Görsel Kaynağı** : <https://www.cloudflare.com/learning/ddos/dns-amplification-ddos-attack/> )

Saldırganlar küçük bir DNS sorgusu gönderir ancak bu sorgu büyük bir yanıt oluşturur.

Bu büyük yanıtlar hedef sunucuya yönlendirilerek sistemin aşırı yüklenmesine ve hizmet dışı kalmasına (DoS) neden olur.

Bu tür saldırılar genellikle zayıf veya yanlış yapılandırılmış DNS sunucularını hedef alır.

---

## Typosquatting

Typosquatting, kullanıcıların yazım hataları nedeniyle sahte veya kötü amaçlı web sitelerine yönlendirildiği bir saldırıdır. Bu saldırı türünde saldırganlar, yaygın olarak yapılan yazım hatalarına dayanan alan adlarını kaydederler.

Örneğin kullanıcılar yanlışlıkla "google.com" yerine "gooogle.com" yazabilirler.

Saldırganlar bu yanlış yazılmış alan adlarını kaydeder ve kullanıcıları oltalama saldırıları veya kötü amaçlı yazılım indirmeleriyle dolu sitelere yönlendirir.

Typosquatting genellikle finansal bilgileri veya kişisel verileri çalmak için kullanılır ve kullanıcılar sahte bir siteye girdiklerini kolayca fark edemeyebilirler.

---

## DNS Tahribatı (DNS Hijacking)

DNS tahribatı, saldırganların kullanıcıları sahte web sitelerine veya kötü amaçlı içeriğe göndermek için DNS sorgularını yönlendirdiği bir saldırıdır. Bu saldırı türü genellikle DNS sunucularına veya kullanıcıların yönlendiricilerine (router) erişim sağlanarak gerçekleştirilir.

Saldırganlar DNS ayarlarını değiştirir ve kullanıcıları kendi seçtikleri bir IP adresine yönlendirir.

Kullanıcılar bilmeden sahte bir siteye girer ve kişisel bilgilerini paylaşabilirler.

Bu tür saldırılar özellikle kullanıcıların sahte DNS sunucularına yönlendirilebildiği halka açık Wi-Fi ağlarında yaygındır.

![Bu tür saldırılar özellikle kullanıcıların sahte DNS sunucularına yönlendirilebildiği halka açık Wi-Fi ağlarında yaygındır](./0__BHKZ-d0fx6pAfsY.webp)

( **Görsel Kaynağı** : <https://www.cloudns.net/blog/dns-hijacking-what-it-is-and-how-to-protect-yourself/> )

---

## DNS Rebinding

DNS rebinding, saldırganların kurbanın yerel ağındaki sistemlere saldırmak için kurbanın tarayıcısını kullandığı bir tekniktir. Bu saldırı genellikle kötü amaçlı reklamlar veya güvenli olmayan web sitelerinden indirilen kodlar aracılığıyla gerçekleştirilir.

Saldırganlar, kurbanın tarayıcısını kurbanın yerel ağındaki bir IP adresine yönlendirmek için DNS yanıtlarını manipüle eder.

Tarayıcı bu yanıta güvenir ve saldırganın yerel ağdaki cihazlara erişmesine olanak tanır.

Bu saldırı türü genellikle dahili ağlar hakkında bilgi toplamak veya kötü amaçlı yazılım yaymak için kullanılır.

---

## DNS Güvenlik Sistemlerinin Rolü

Domain Name System (DNS), internetin temel bileşenlerinden biri olarak, web sitesi erişiminden ağ iletişimine kadar birçok kritik işlevi yerine getirir. Ancak bu önemli rolü nedeniyle DNS, siber saldırganlar için de cazip bir hedef haline gelmiştir. DNS protokolünü hedef alan siber saldırıları tespit etmek ve önlemek için DNS güvenlik sistemleri geliştirilmiştir. Tehdit avcılığı (threat hunting), bu sistemlerin sağladığı verileri kullanarak potansiyel saldırıları proaktif olarak tespit eder ve meydana gelmeden durdurur.![Domain Name System (DNS), internetin temel bileşenlerinden biri olarak, web sitesi erişiminden ağ iletişimine kadar birçok](./0_6CNsYsPjQY7wLFts.webp)

( **Görsel Kaynağı** : <https://www.varonis.com/blog/dns-security> )

---

## DNS Güvenlik Sistemlerinin Rolü

DNS güvenlik sistemleri, siber tehditleri tespit etmek ve önlemek amacıyla DNS trafiğini izlemek ve analiz etmek için kullanılır. Bu sistemler ağdaki DNS isteklerini takip eder, şüpheli aktiviteleri belirler ve uyarılar oluşturur. DNS güvenlik sistemleri tarafından sağlanan temel işlevlerden bazıları şunlardır:

* **Anomali Tespiti:** Normal DNS trafiği modellerinin belirlenmesi ve bu modellerden sapan aktivitelerin tespit edilmesi sürecidir.
* **Zararlı Alan Adlarını Engelleme:** Bilinen kötü niyetli alan adlarına yönelik isteklerin önlenmesi ve kullanıcıların zararlı sitelere yönlendirilmesinin durdurulmasıdır.
* **DNS Tünelleme ve Diğer Tehditleri Tespit Etme:** DNS tünelleme ve önbellek zehirlemesi gibi DNS tabanlı saldırıların belirlenmesi ve bunları hafifletmek için önlemler alınması sürecidir.
* **Gerçek Zamanlı İzleme ve Analiz:** Şüpheli aktiviteleri hızlı bir şekilde tespit etmek için DNS trafiğinin gerçek zamanlı olarak sürekli izlenmesidir.

---

## DNS Güvenlik Sistemleri ile Tehdit Avcılığı

DNS güvenlik sistemleri, tehdit avcılığı sürecinde siber güvenlik ekiplerine kritik veriler sağlar. Tehdit avcılığı, siber saldırıları meydana gelmeden önce tespit etmek ve durdurmak için tasarlanmış proaktif bir süreçtir.

![DNS güvenlik sistemleri, tehdit avcılığı sürecinde siber güvenlik ekiplerine kritik veriler sağlar](./0_KJRV96BtV4PfdcNt.webp)

( **Görsel Kaynağı** : <https://detect.fyi/threat-hunting-suspicious-tlds-a742c2adbf58> )

![DNS Güvenlik Sistemleri ile Tehdit Avcılığı](./0_ttE2ZaJyqy_emnQe.webp)

( **Görsel Kaynağı** : <https://detect.fyi/threat-hunting-suspicious-tlds-a742c2adbf58> )

DNS güvenlik sistemlerinin bu süreçteki rolü büyüktür:

* **Proaktif İzleme:** DNS güvenlik sistemleri DNS trafiğini sürekli izler ve anormal aktiviteleri tanımlar. Bu sistemler belirli bir zaman dilimindeki DNS isteklerini kaydeder ve bu veriler tehdit avcıları tarafından analiz edilir.
* **Veri Zenginleştirme:** DNS logları, daha geniş bir güvenlik perspektifi sağlamak için SIEM (Güvenlik Bilgisi ve Olay Yönetimi) gibi platformlarla entegre edilir. Bu entegrasyon tehdit avcılarının DNS verilerini diğer güvenlik olaylarıyla ilişkilendirmesine olanak tanır.
* **Şüpheli Aktivite Tespiti:** Tehdit avcıları, şüpheli alan adlarına yapılan istekleri, DNS tünelleme girişimlerini ve diğer anormal aktiviteleri tespit etmek için DNS güvenlik sistemlerinden gelen verileri kullanır. Bu aktiviteler, ağa kötü amaçlı yazılım sızdırma veya veri sızdırma girişimlerini gösterebilir.
* **Olay Müdahalesi (Incident Response):** Tespit edilen tehditlerin ayrıntılı analizi hızlı bir müdahaleye olanak tanır. DNS güvenlik sistemleri olay müdahale sürecinde saldırıların kaynağını ve yöntemlerini belirlemek için kritik bilgiler sağlar.

---

## DNS Güvenlik Sistemleri ile Tehdit Avcılığında Kullanılan Teknikler

DNS güvenlik sistemleri ile tehdit avcılığında kullanılan başlıca teknikler şunlardır:

* **Makine Öğrenmesi (Machine Learning):** DNS güvenlik sistemleri, normal DNS trafiği modellerini öğrenmek ve bu modellerden sapan aktiviteleri tespit etmek için makine öğrenmesi algoritmalarını kullanır. Makine öğrenmesi bilinmeyen tehditleri tanımlamada oldukça etkilidir.
* **Davranışsal Analiz:** DNS istekleri, normal davranıştan sapıp sapmadıklarını belirlemek için analiz edilir. Anormal davranışlar genellikle bir saldırının erken aşamalarında ortaya çıkar ve bunun tespiti saldırıları önlemeye yardımcı olur.
* **Tehdit İstihbaratı:** DNS güvenlik sistemleri, bilinen kötü niyetli alan adlarını hızla tanımlamak ve bunlara yönelik istekleri engellemek için tehdit istihbaratı kaynaklarıyla entegre olur. Tehdit istihbaratı güncel tehditler hakkında en son bilgileri sağlar.
* **DNS Log Analizi:** DNS loglarının ayrıntılı analizi tehdit avcılığında kritik bir rol oynar. Loglar ağdaki şüpheli aktiviteleri izlemek ve potansiyel saldırıları tanımlamak için kullanılır. DNS log analizi genellikle SIEM platformlarıyla entegrasyon halinde gerçekleştirilir.

---

## DNS Güvenlik Sistemleri ile Tehdit Avcılığının Faydaları

DNS güvenlik sistemleri ile tehdit avcılığı organizasyonlara çeşitli faydalar sağlar:

* **Erken Tehdit Tespiti:** DNS güvenlik sistemleri, tehdit avcılarının tehditleri erken bir aşamada tespit etmesine yardımcı olarak saldırıların meydana gelmeden durdurulmasını sağlar.
* **Veri Kaybını Önleme:** DNS tabanlı saldırılar genellikle veri sızdırmayı amaçlar. DNS güvenlik sistemleri bu tür saldırıları tespit edip engelleyerek veri kaybını önler.
* **Ağ Güvenliğini Güçlendirme:** DNS güvenlik sistemleri ağdaki tüm DNS faaliyetlerini izleyerek güvenlik açıklarının belirlenmesine ve ağ güvenliğinin güçlendirilmesine yardımcı olur.
* **Saldırı Yüzeyini Azaltma:** DNS güvenlik sistemleri bilinen zararlı alan adlarına yönelik istekleri engelleyerek saldırganlar için potansiyel giriş noktalarını azaltır.

---

## Hipotez Değerlendirmesi

DNS güvenlik sistemleri, siber saldırıları önleme ve tespit etme konusunda tehdit avcılığı sürecinde kritik bir rol oynar. Bu sistemler, DNS trafiğini sürekli izleyerek ve analiz ederek proaktif bir savunma hattı oluşturur. Makine öğrenmesi, davranışsal analiz ve tehdit istihbaratı gibi gelişmiş tekniklerin kullanımı bilinmeyen tehditlerin bile erken tespit edilmesini sağlar. DNS güvenlik sistemlerinin etkili kullanımı organizasyonların siber güvenlik stratejilerini güçlendirir ve ağlarının güvenliğini sağlamada hayati bir rol oynar.

---

## DNS Güvenlik Sistemlerinin Kullanımı

Domain Name System (DNS) güvenlik sistemleri siber güvenlik stratejilerinin kritik bir parçası haline gelmiştir. Siber suçlular veri sızdırma, kötü amaçlı yazılım dağıtımı ve ağ kesintisi gibi çeşitli saldırıları gerçekleştirmek için DNS'i kullanabilirler. Bu nedenle DNS güvenlik sistemlerinin etkili kullanımı tehdit avcılığı süreçlerinde hayati bir rol oynar.## DNS Log Verilerinin Toplanması ve Analizi

DNS log verileri ağdaki DNS istek ve yanıtlarının kayıtlarından oluşur ve tehdit avcılığı süreçlerinde önemli bir rol oynar. DNS logları bir ağdaki şüpheli aktiviteleri izlemek ve tehditleri erken aşamada tespit etmek için kullanılır. DNS log verilerinin toplanması ve analizinde dikkat edilmesi gereken temel noktalar şunlardır:

*   **Veri Toplama:** DNS logları ağdaki tüm DNS sorgularını ve yanıtlarını içerir. Bu veriler DNS sunucularından, güvenlik duvarlarından ve diğer ağ cihazlarından toplanır. Toplanan veriler genellikle zaman damgalarını, kaynak ve hedef IP adreslerini, sorgulanan alan adlarını ve yanıt kodlarını içerir.
*   **Merkezi Log Yönetimi:** DNS loglarını merkezi bir log yönetimi sistemine veya SIEM (Güvenlik Bilgisi ve Olay Yönetimi) platformuna aktarmak, verilerin yönetilmesini ve analiz edilmesini kolaylaştırır. Bu sistemler büyük hacimli verileri verimli bir şekilde depolayabilir ve analiz edebilir.
*   **Normal Trafik Modellerinin Tanımlanması:** Normal DNS trafiği modellerini anlamak, anormal aktiviteleri tespit etmenin ilk adımıdır. Analistler belirli bir dönemde toplanan DNS loglarını inceleyerek ağdaki tipik DNS sorgularını ve yanıtlarını belirleyebilirler.
*   **Anomali Tespiti:** Normal trafik modellerinden sapmaların tespiti potansiyel tehditlerin belirlenmesinde kritik bir rol oynar. Örneğin normalde az istek alan belirli bir IP adresine yönelik DNS isteklerinde ani bir artış olması bir anomaliye işaret edebilir.

---

## Kötü Niyetli DNS Aktivitelerinin Tespiti ve Analizi

Kötü niyetli DNS aktiviteleri ağ güvenliğini tehdit eden çeşitli saldırıları içerir. Bu aktivitelerin tespiti ve analizi tehdit avcılığı sürecinin merkezinde yer alır. Bu süreçte kullanılan teknikler şunlardır:

*   **İmza Tabanlı Tespit:** İmza tabanlı tespit yöntemleri bilinen tehditleri tanımlamak için kullanılır. Bu yöntemler DNS loglarını bilinen kötü niyetli alan adları veya IP adresleriyle karşılaştırmayı içerir. Eğer bir DNS sorgusu bu imzalarla eşleşirse tehdit olarak işaretlenir.
*   **Davranışsal Analiz:** Davranışsal analiz teknikleri bilinmeyen veya sıfırıncı gün (zero-day) tehditlerini tespit etmek için kullanılır. DNS sorgularının normal davranıştan sapıp sapmadığını analiz eder. Örneğin bir kullanıcı cihazı aniden çok sayıda farklı alan adıyla iletişim kurmaya başlarsa bu durum kötü amaçlı yazılım varlığına işaret edebilir.
*   **Makine Öğrenmesi:** Makine öğrenmesi algoritmaları, normal ve anormal davranışları birbirinden ayırmak için DNS loglarını analiz edebilir. Algoritmalar sürekli öğrenir ve ağdaki yeni tehditleri tespit etmede daha etkili hale gelir.

![Makine Öğrenmesi: Makine öğrenmesi algoritmaları, normal ve anormal davranışları birbirinden ayırmak için DNS loglarını](./0_c5g2_96WlVIt_-c7.webp)

( **Görsel Kaynağı** : <https://medium.com/data-reply-it-datatech/dga-detection-with-data-analytics-121d4289fdf7> )

* **Tehdit İstihbaratı Entegrasyonu:** DNS güvenlik sistemleri, bilinen kötü niyetli alan adlarına yönelik istekleri engellemek için tehdit istihbaratıyla entegre olabilir. Bu entegrasyon tehdit avcılarına en son tehdit verilerine erişim sağlar.
* **Anomalilerin Korelasyonu:** Kötü niyetli DNS aktivitelerinin tespiti tek bir veri kaynağına dayanamaz. Tehdit avcıları DNS loglarını diğer güvenlik logları ve olaylarıyla ilişkilendirerek daha güvenilir bir tehdit analizi yürütürler. Örneğin bir DNS sorgusu bir kullanıcı cihazından kaynaklanıyorsa ve o cihazda bir güvenlik uyarısı varsa, bu durum daha ciddi bir tehdidi gösteriyor olabilir.

---

## Gerçek Zamanlı ve Geçmişe Dönük DNS Trafik Analizi

Hem gerçek zamanlı hem de geçmişe dönük DNS trafiği analizi tehdit avcılığı sürecinde önemli bir rol oynar. Her iki yaklaşım da farklı avantajlar sunar ve birlikte kullanıldıklarında daha etkili sonuçlar sağlarlar.

* **Gerçek Zamanlı DNS Analizi:** Gerçek zamanlı analiz DNS trafiğinin anlık olarak izlenmesini ve şüpheli etkinliklerin hızla tespit edilmesini içerir. DNS güvenlik sistemleri tüm gelen ve giden DNS sorgularını izler ve anomaliler tespit edildiğinde uyarılar oluşturur. Örneğin bir cihaz aniden çok sayıda DNS sorgusu yapmaya başlarsa bu bir saldırı belirtisi olabilir ve gerçek zamanlı analiz yoluyla derhal tanımlanabilir.
* **Geçmişe Dönük (Retrospective) DNS Analizi:** Geçmişe dönük analiz geçmiş olayların incelenmesidir. Bu yöntem bir saldırının geriye dönük olarak nasıl gerçekleştiğini anlamak ve gelecekte benzer saldırıları önlemek için kullanılır. Geçmişe dönük analiz genellikle büyük veri setleri üzerinde çalışır ve daha derinlemesine analiz sağlar. Örneğin bir güvenlik sızıntısının ardından saldırgan tarafından hangi DNS sorgularının kullanıldığını anlamak için geçmişe dönük bir log analizi yapılabilir.
* **Olay Müdahalesi ve Soruşturma**: Hem gerçek zamanlı hem de geçmişe dönük DNS analizi olay müdahale sürecinde kritik bir rol oynar. Bir saldırı tespit edildiğinde olayın kapsamını ve etkisini anlamak için her iki analiz türü de kullanılabilir. Gerçek zamanlı analiz hızlı müdahaleye olanak tanırken geçmişe dönük analiz olayın tüm ayrıntılarını ortaya çıkarır.
* **İzleme ve Raporlama:** Gerçek zamanlı ve geçmişe dönük analizlerin sonuçları sürekli izleme ve raporlama süreçleriyle desteklenmelidir. Bu raporlar ağın güvenlik durumuna genel bir bakış sağlar ve gelecekteki tehditleri önlemek için alınacak önlemleri belirler.

![İzleme ve Raporlama: Gerçek zamanlı ve geçmişe dönük analizlerin sonuçları sürekli izleme ve raporlama süreçleriyle](./0_YUkXocl1qAwWgz4i.webp)

( **Görsel Kaynağı** : <https://blog.pentesteracademy.com/elk-log-analysis-dns-logs-875f669c87fd> )

---

## Hipotez Değerlendirmesi

Tehdit avcılığı sürecinde DNS güvenlik sistemlerinin etkili kullanımı, siber saldırıların erken tespiti ve etkisiz hale getirilmesinde kritik bir rol oynar. DNS loglarının toplanması ve analizi, kötü niyetli DNS faaliyetlerinin tespiti ve analizi ile DNS trafiğinin gerçek zamanlı ve geçmişe dönük analizi ağ güvenliğini güçlendiren temel süreçlerdir. Siber tehditlere karşı proaktif bir savunma hattı oluşturmak için DNS güvenlik sistemlerinin sağladığı kapsamlı izleme ve analiz yetenekleri esastır. Organizasyonlar bu süreçleri etkili bir şekilde yürüterek güvenlik stratejilerini güçlendirebilir ve potansiyel saldırılara karşı hazırlıklı olabilirler.

---

## DNS Sorguları ve Veri Sızdırma Hipotezi

---

## Hipotez

Bir cihaz (bir komuta kontrol sunucusuyla iletişim kurduktan sonra) kötü niyetli DNS istekleri yaparak veri sızdırıyor olabilir.

![Bir cihaz (bir komuta kontrol sunucusuyla iletişim kurduktan sonra) kötü niyetli DNS istekleri yaparak veri sızdırıyor](./0_V929J_K82XTd_WdZ.webp)

( **Görsel Kaynağı** : <https://www.infoblox.com/glossary/data-exfiltration/> )

---

## Veri Kaynakları

* **DNS Logları:** Yapılan DNS isteklerinin kayıtları.
* **Güvenlik Duvarı (Firewall) Logları:** Dahili ve harici ağlar arasındaki veri trafiği kayıtları.
* **DLP (Veri Kaybı Önleme) Logları:** Veri sızıntısıyla ilgili kayıtlar.
* **DNS Güvenlik Logları:** DNS güvenliği (DNS kategorizasyonu) çözümleriyle ilgili loglar.

Tehdit avcılığı etkinliği, merkezi bir log yönetimi veya SIEM çözümü aracılığıyla bu veri kaynaklarından gelen loglara erişilerek optimize edilebilir.

---

## Analiz Adımları

* **Alan Adı İstekleri:** DNS loglarında bilinen kötü niyetli veya şüpheli alan adlarına yapılan istekleri belirleyin.
* **Alan Adı İtibar Kontrolü:** DNS isteklerinde sorgulanan alan adlarının itibarını kontrol edin ve bunları kötü niyetli alan adları listesiyle karşılaştırın.
* **İstek Sıklığı:** Belirli bir cihazın kısa bir süre içinde anormal derecede yüksek sayıda DNS isteği yapıp yapmadığını kontrol edin.
* **Zaman Analizi:** Olağandışı zamanlarda (örneğin mesai saatleri dışında veya gece geç saatlerde) yapılan DNS isteklerini izleyin.
* **Büyük Boyutlu DNS İstekleri:** Normal DNS isteklerinden daha büyük boyutta olan ve daha fazla veri içeren DNS isteklerini tanımlayın.
* **Hedef IP Adresi Analizi:** DNS isteklerinin ardından harici IP adreslerine yapılan veri transferlerini izleyin.
* **Güvenlik Duvarı Kuralları:** Güvenlik duvarı tarafından izin verilen veya engellenen trafiği kontrol edin ve anormal aktiviteleri tanımlayın.
* **Beklenmeyen Portlar:** Normalde kullanılmayan veya beklenmeyen portlar üzerinden yapılan bağlantıları kontrol edin.
* **Şüpheli Veri Transferleri:** Hassas verilerin harici IP adreslerine aktarılıp aktarılmadığını görmek için DLP loglarını kontrol edin.
* **Anormal Kullanıcı Davranışı:** Normal kullanıcı davranışı modellerinden sapmaları izleyin (örneğin büyük dosya transferleri, sık dosya erişimi).

---

## Hipotez Doğrulama ve Beklenen Bulgular

* Kötü niyetli veya bilinmeyen alan adlarına yönelik yoğun DNS istekleri.
* Aynı cihazdan aynı hedefe yapılan büyük miktarda veri transferi.
* Veri sızıntısını belirten DLP uyarıları.

---

## Hipotez Değerlendirmesi

Tehdit avcılığı. DNS, güvenlik duvarı, DLP ve DNS güvenlik logları gibi kaynaklar kullanılarak gerçekleştirilebilir. Analiz, şüpheli alan adı isteklerini, alan adı itibarını, istek sıklığını, zamanlamayı, büyük DNS isteklerini ve beklenmedik port kullanımını incelemeyi içerir. Veri sızıntısını tespit etmek için anormal kullanıcı davranışı ve güvenlik duvarı logları da değerlendirilir. Kötü niyetli alan adlarına yapılan yoğun istekler veya büyük veri transferleri gibi bulgular sızıntıyı doğrulayabilir.

---

## Şüpheli DNS Sorguları Hipotezi

---

## Hipotez

Belirli bir dahili IP adresinden şüpheli veya bilinmeyen alan adlarına yönelik isteklerdeki ani bir artış, bir cihazın kötü amaçlı yazılım tarafından ele geçirildiğinin veya DNS tünelleme gibi kötü niyetli bir faaliyetin devam ettiğinin bir göstergesi olabilir.

![Belirli bir dahili IP adresinden şüpheli veya bilinmeyen alan adlarına yönelik isteklerdeki ani bir artış, bir cihazın kötü](./0_PMpCsxejUFxwF9Da.webp)

( **Görsel Kaynağı** : <https://www.socinvestigation.com/how-dns-tunneling-works-detection-response/> )

---

## Veri Kaynakları

* **DNS Logları:** Ağdaki tüm DNS istek ve yanıtlarının kayıtları.
* **SIEM Logları:** Bir SIEM platformuna entegre edilmiş DNS loglarının merkezi olarak toplanması ve analizi.
* **Güvenlik Duvarı (Firewall) Logları:** Dahili ve harici ağ trafiğini izleyen ve DNS ile ilgili anormal faaliyetleri kaydeden loglar.
* **Tehdit İstihbaratı Veritabanları:** Bilinen kötü niyetli alan adları ve IP adresleri hakkında güncel bilgiler.
* **DNS Sunucu Yapılandırma Logları:** DNS sunucusu yapılandırma değişikliklerinin kayıtlarını tutan loglar.

---

## Analiz Adımları

* DNS loglarını merkezi bir log yönetimi sistemine veya SIEM çözümüne aktarın.
* Belirli bir dönemde toplanan tüm DNS sorgularını ve yanıtlarını kaydedin.
* Normal DNS trafiği modellerini tanımlamak için DNS loglarını analiz edin.
* Hangi alan adlarının sıkça sorgulandığını ve hangi IP adreslerine yönlendirildiklerini belirleyin.
* Şüpheli veya bilinmeyen alan adlarına yönelik DNS sorgularını tespit edin.
* Normal trafikten sapan veya bilinen kötü niyetli alan adlarına yönlendirilen sorguları araştırın.
* DNS loglarını diğer güvenlik loglarıyla (örneğin güvenlik duvarı logları) ilişkilendirin.
* Aynı IP adresinden gelen şüpheli trafik ile diğer ağ faaliyetleri arasındaki bağlantıyı araştırın.
* Anormal DNS trafiğinin ayrıntılı bir analizini yapın.
* DNS tünelleme, veri sızdırma veya kötü amaçlı yazılım iletişimi gibi tehditleri tespit etmek için logları ayrıntılı olarak inceleyin.
* Tespit edilen şüpheli etkinliklerin doğruluğunu ve önemini değerlendirin.
* Şüpheli DNS sorgularının kaynağını ve hedeflenen alan adlarının güvenilirliğini değerlendirin.
* Olayı doğrulamak ve saldırının aşamasını belirlemek için ek veriler toplayın.
* Daha fazla kanıt toplamak ve potansiyel saldırının kapsamını belirlemek için ek loglar ve tehdit istihbaratı kullanın.

---

## Hipotez Doğrulama ve Beklenen Bulgular

Şunları yapacaksınız:

* DNS loglarında belirli bir dahili IP adresinden gelen anormal sayıda DNS sorgusu tespit edeceksiniz.
* Bu alan adlarının kötü niyetli olduğuna dair kanıtlarla birlikte şüpheli veya bilinmeyen alan adlarına yönelik sorguları tanımlayacaksınız.
* Bu faaliyetin potansiyel bir saldırının göstergesi olup olmadığını belirlemek için SIEM ve diğer güvenlik loglarıyla ilişkilendirme yapacaksınız.
* DNS tünelleme veya kötü amaçlı yazılım iletişimi gibi tehditleri tespit edip engelleyeceksiniz.

---

## Hipotez Değerlendirmesi

Bu adımlar, belirli bir dahili IP adresinden gelen şüpheli veya bilinmeyen alan adı isteklerindeki ani artışı tespit etmek için stratejiler sağlar. DNS logları bu tür anormal faaliyetleri izlemek ve tanımlamak için kritik bir veri kaynağıdır. Tespit edilen anomaliler potansiyel saldırıların erken teşhis edilmesini sağlar ve hızlı müdahaleyi kolaylaştırır. Bu süreç ağ güvenliği ve proaktif tehdit yönetimi için kritiktir.

---

## Uygulamalı Laboratuvar

---

## Hipotez

**Not**: Bu bölümdeki sorular, aşağıdaki hipoteze dayalı olarak Tehdit Avcılığı için hazırlanmıştır:

**Hipotez:** Saldırganlar, organizasyon içindeki sistemlerin komuta ve kontrol (C2) sunucularıyla iletişim kurmasını sağlamak için DNS protokolünü kötüye kullanıyor olabilir.

---

## Tehdit Avcılığı Laboratuvar Ortamı

* SIEM (Wazuh)
* IDS (Suricata)
* Güvenlik Duvarı Trafik Olayları

---

## Laboratuvar Notları

* Aşağıdaki soruları yanıtlamak için "8 Ağustos 2024 00:00 - 13 Ağustos 2024 00:00" arasındaki logları analiz edin.
* Sonraki sorular bir öncekilerin doğru cevaplarını gerektirir. Tüm soruları kesinlikle göründükleri sırayla yanıtlayın.

**Not:** Aşağıdaki soruları yanıtlamak için "8 Ağustos 2024 00:00 - 13 Ağustos 2024 00:00" arasındaki logları analiz edin.

**Not**: Sonraki sorular bir öncekilerin doğru cevaplarını gerektirir. Tüm soruları kesinlikle göründükleri sırayla yanıtlayın.

> DNS ile ilgili tetiklenen IDS uyarısının adı (data.alert.signature) nedir?

SIEM'de "rule.groups: ids" filtresini kullanın ve sonuçları analiz edin. Ayrıca \*DOMAIN\* terimini de aratabilirsiniz.

![SIEM'de "rule.groups: ids" filtresini kullanın ve sonuçları analiz edin](./1_WbxtJqV3TZLKNpOVMpUjCQ.webp)

**Cevap:** ETPRO TROJAN Possible Virut DGA NXDOMAIN Responses (com)

> IDS olayları arasında DNS ile ilgili IDS uyarısını hangi kaynak IP adresi tetikledi?

SIEM'de "rule.groups: ids" filtresini kullanın ve sonuçları analiz edin. Ayrıca \*DOMAIN\* terimini de aratabilirsiniz.

**Cevap:** 172.16.11.11

> DNS ile ilgili IDS uyarısı içindeki DNS isteğinde sorgulanan alan adı nedir?

SIEM'de "rule.groups: ids" filtresini uygulayın ve sonuçları analiz edin. "data.payload_printable" alanını kontrol edin.

**Cevap:** nptnsx.com

> IDS uyarısındaki sorgulanan alan adı için DNS sunucusundan gelen DNS yanıtında hangi IP adresi yer almaktadır?

SIEM'de "rule.groups: ids" filtresini uygulayın ve sonuçları analiz edin. "data.payload_printable" alanını kontrol edin.

**Cevap:** 113.88.23.11

> DNS yanıtında verilen IP adresine yapılan erişim girişimi için güvenlik duvarı eylemi (firewall action) nedir?

SIEM'de "rule.groups: firewall" ve "data.dstip: [IP_Adresi]" filtrelerini uygulayın. "data.action" alanını kontrol edin.

![SIEM'de "rule.groups: firewall" ve "data.dstip: IPAdresi " filtrelerini uygulayın](./1_NkQtyQH5Dz0Mx50Y3GUKfA.webp)

**Cevap:** accept

> DNS sunucusunun yanıtında yer alan IP adresinde hangi port numarası talep edilmiştir?

SIEM'de "rule.groups: firewall" ve "data.dstip: [IP_Adresi]" filtrelerini uygulayın. "data.dstport" alanını kontrol edin.

**Cevap:** 443

> DNS sunucusu tarafından sağlanan yanıtta yer alan IP adresi ile ilgili diğer IDS uyarısının adı nedir? (data.alert.signature)

SIEM'de "rule.groups: ids" filtresini uygulayın ve sonuçları analiz edin. IDS uyarıları içinde tanımlanan IP adresini arayın.

![SIEM'de "rule.groups: ids" filtresini uygulayın ve sonuçları analiz edin](./1_4ymR0dCKyKsFJe3PxID59w.webp)

**Cevap:** ET EXPLOIT Apache log4j RCE Attempt–lower/upper UDP Bypass M2 (Outbound) (CVE-2021–44228)

> DNS yanıtında sağlanan IP adresi ile ilgili diğer IDS uyarısını tetikleyen kaynak IP adresi nedir?

SIEM'de "rule.groups: ids" filtresini uygulayın ve sonuçları analiz edin. "data.src_ip" alanını kontrol edin.

**Cevap:** 10.200.200.10
