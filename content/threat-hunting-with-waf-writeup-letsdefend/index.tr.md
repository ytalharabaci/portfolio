---
date: '2025-10-03'
description: Web Uygulama Güvenlik Duvarı (WAF), web uygulamalarını korumak için kullanılan bir güvenlik katmanıdır. Geleneksel güvenlik duvarlarının aksine, WAF'lar özellikle web uygulamalarını hedef alan tehditleri hedefler. Bu tehditler arasında SQL enjeksiyonları, XSS (Cross-Site Scripting) saldırıları, dosya yükleme saldırıları ve diğer web tabanlı tehditler yer alır.
draft: false
image: featured.webp
title: WAF ile Tehdit Avcılığı Çözümü - LetsDefend
type: writeups
topic: detection-response
tags: ["LetsDefend", "Threat Hunting", "Write-up", "Blue Team", "SIEM", "WAF"]
featuredImageAlt: "LetsDefend Blue Team Training logosu"
---

[Letsdefend Blue Team Eğitim Platformu](https://letsdefend.io/)

Web Uygulama Güvenlik Duvarı (WAF), web uygulamalarını korumak için kullanılan bir güvenlik katmanıdır. Geleneksel güvenlik duvarlarının aksine, WAF'lar özellikle web uygulamalarını hedef alan tehditleri hedefler. Bu tehditler arasında SQL enjeksiyonları, XSS (Cross-Site Scripting) saldırıları, dosya yükleme saldırıları ve diğer web tabanlı tehditler yer alır.

WAF tabanlı tehdit avcılığı, web uygulamalarını korumayı amaçlayan proaktif bir güvenlik yaklaşımıdır. Bu süreç WAF'lar tarafından sağlanan loglar, uyarılar ve analizler kullanılarak yürütülür. Tehdit avcıları, potansiyel tehditleri belirlemek, bu tehditlerin kaynağını analiz etmek ve gelecekte benzer saldırıları önlemek için stratejiler geliştirmek amacıyla WAF verilerini inceler.

![WAF tabanlı tehdit avcılığı, web uygulamalarını korumayı amaçlayan proaktif bir güvenlik yaklaşımıdır](./0_DvRCHqrdmU5Lv1or.webp)

( **Görsel Kaynağı** : <https://www.linkedin.com/pulse/what-waf-web-application-firewall-ronen-taieb/> )

---

## Tehdit Avcılığında WAF'ın Rolü

WAF (Web Application Firewall), tehdit avcılığı sürecinde kritik bir rol oynar. WAF tarafından sağlanan katkılar tehdit avcılığı için son derece değerlidir. Aşağıda, WAF'ın tehdit avcılığına sağladığı temel katkılar özetlenmiştir.

---

## Gerçek Zamanlı Trafik İzleme ve Saldırı Tespiti

Bir Web Uygulama Güvenlik Duvarı (WAF), web uygulamalarına gelen ve giden trafiği sürekli olarak izler. WAF'lar potansiyel saldırıları erken aşamalarda tespit edebilir, bu da tehdit avcılığı için kritiktir.

* **Sürekli İzleme:** WAF, web uygulamalarına yapılan tüm istekleri izler ve gelen her paketi analiz eder. Uygulamaya yönelik tehditlerin anında tespit edilmesini sağlar. Trafik izleme. IP adresleri, kullanılan protokoller, veri hacimleri ve istek türleri gibi parametreleri içerir.
* **Saldırı Tespiti:** WAF, trafiği belirli saldırı modelleri ve imzaları için sürekli tarar. Örneğin, SQL enjeksiyonu veya XSS (Cross-Site Scripting) gibi yaygın web saldırılarını içeren istekler WAF tarafından anında tespit edilir ve engellenir. Bu durum, saldırganların hedeflerine ulaşmadan durdurulmalarını sağlar.
* **Gerçek Zamanlı Müdahale:** WAF'ın anlık izleme yeteneği, bir saldırı tespit edildiğinde hızlı yanıt verilmesine olanak tanır. Tehdit avcıları daha sonra saldırının kaynağını belirleyebilir ve derhal güvenlik önlemi alabilirler.

![Gerçek Zamanlı Müdahale: WAF'ın anlık izleme yeteneği, bir saldırı tespit edildiğinde hızlı yanıt verilmesine olanak tanır](./0_cx66MkIkLNYO93wM.webp)

( **Görsel Kaynağı** : <https://www.radware.com/cyberpedia/application-security/what-is-waf/> )

---

## İmza ve Davranış Tabanlı Tespit

WAF tehditleri tespit etmek için iki ana yöntem kullanır: imza tabanlı tespit ve davranış tabanlı tespit. Bu yöntemler tehdit avcılığı sürecinde kapsamlı koruma sağlar.

---

## İmza Tabanlı Tespit

* **Bilinen Saldırılara Karşı Koruma:** İmza tabanlı tespit, bilinen saldırı türlerinin karakteristik izlerine dayanır. Bu imzaları kullanarak WAF, saldırıların web trafiğinde bıraktığı izleri tespit eder. Örneğin, WAF bilinen bir SQL enjeksiyon saldırı modelini tespit eder ve saldırıyı engeller.
* **Sürekli Güncellemeler:** WAF'ların imza veritabanları siber güvenlik tehditlerine karşı sürekli güncellenir. Bu durum, yeni keşfedilen tehditlerin hızla tespit edilmesini sağlar.

---

## Davranış Tabanlı Tespit

* **Anomali Tespiti:** Davranış tabanlı tespit, sistemin normal işleyişinden sapmaları izler. Daha önce görülmemiş veya bilinmeyen saldırıları tespit etmek için bu yöntem çok etkilidir. Örneğin bir kullanıcının olağandışı zamanlarda büyük miktarlarda veri yüklemesi veya indirmesi bir saldırı belirtisi olabilir.
* **Makine Öğrenmesi Desteği:** Davranış tabanlı sistemler genellikle makine öğrenmesi algoritmalarıyla desteklenir. Bu durum, WAF'ın zaman içinde normal ve anormal davranışı daha iyi ayırt etmesini ve saldırıları daha doğru bir şekilde tespit etmesini sağlar.

![Makine Öğrenmesi Desteği: Davranış tabanlı sistemler genellikle makine öğrenmesi algoritmalarıyla desteklenir](./0_gGxXzd_gWOk-1NXL.webp)

( **Görsel Kaynağı** : <https://my.f5.com/manage/s/article/K28426659> )

---

## Ayrıntılı Loglama ve Raporlama

Tehdit avcılığı sürecinde WAF'ın en büyük avantajlarından biri kapsamlı loglama ve raporlama yetenekleridir. Bu özellikler tehditlerin izlenmesinde ve analiz edilmesinde çok önemli bir rol oynar.

---

## Kapsamlı Loglama

* **Veri İzleme:** WAF, web uygulamalarına yapılan her isteği ve bu isteklere verilen yanıtları kaydeder. Kullanıcı aktivitesi, IP adresleri, zaman damgaları ve kullanılan protokoller gibi ayrıntılı bilgileri içerir.
* **Şüpheli Aktivite Kaydı:** WAF tespit ettiği tüm şüpheli aktiviteleri ve engellenen saldırıları kaydeder. Bu loglar tehdit avcılarının saldırıların kaynağını ve doğasını anlamalarına yardımcı olur.

---

## Raporlama

* **Özelleştirilmiş Raporlar:** WAF, belirli bir zaman dilimindeki saldırı faaliyetleri hakkında ayrıntılı raporlar oluşturabilir. Saldırı türleri, frekansı ve kaynakları bu raporlarda yer alır.
* **Görselleştirme ve Analiz:** WAF raporları tehdit avcılarının saldırıları daha iyi anlamaları için görselleştirilmiş veriler sağlar. Grafikler ve tablolar saldırıların zaman içindeki dağılımını ve etkisini gösterir.

![Görselleştirme ve Analiz: WAF raporları tehdit avcılarının saldırıları daha iyi anlamaları için görselleştirilmiş veriler](./0_luGMiMpdx75uiwTa.webp)

( **Görsel Kaynağı** : <https://splunkbase.splunk.com/app/2873> )

---

## Kök Neden Analizi (Root Cause Analysis)

Tehdit avcılığı sürecinde, saldırıların kök nedenini anlamak gelecekte benzer saldırıları önlemek için kritiktir. Bu tür analizler için WAF temel bir araçtır.

---

## Kök Nedenin Belirlenmesi

* **Saldırının Kaynağı:** WAF logları saldırıların hangi IP adreslerinden geldiğini ve hangi user-agent'ların kullanıldığını gösterir. Bu durum saldırının kaynağını belirlemede ilk adımdır.
* **Saldırı Yöntemi:** WAF, saldırganlar tarafından kullanılan tekniklerin ve bu tekniklerin nasıl çalıştığının belirlenmesine yardımcı olur. Örneğin WAF logları, bir SQL enjeksiyon saldırısının nasıl yürütüldüğünü ve hangi komutların kullanıldığını anlamak için kullanılabilir.

---

## Saldırı Yayılım Analizi

* **Zaman Çizelgesi:** Bir WAF saldırının ne zaman başladığını, nasıl ilerlediğini ve saldırgan tarafından atılan adımları belirlemeye yardımcı olabilir.
* **Etkilenen Sistemler:** WAF logları saldırıdan hangi sistemlerin ve uygulamaların etkilendiğini gösterir. Bu saldırının yayılmasını durdurmak ve hasarı en aza indirmek için önemlidir.

---

## Gerçek Zamanlı ve Geçmişe Dönük Analiz

WAF tehdit avcılığı sürecinde hem acil tehditleri tespit etmek hem de geçmiş saldırıları analiz etmek için kullanılır.

---

## Gerçek Zamanlı Analiz

* **Hızlı Tehdit Tespiti:** WAF gelen trafiği anlık olarak izler ve tehditleri tespit ettiğinde derhal yanıt vererek saldırganların hızla durdurulmasını sağlar.
* **Otomatik Yanıt:** Belirli bir saldırı tespit edildiğinde WAF belirtilen kuralları otomatik olarak uygulayarak saldırıların yayılmadan kontrol altına alınmasını sağlar.

---

## Geçmişe Dönük (Retrospective) Analiz

* **Arşivlenmiş Logların Analizi:** WAF geçmişte meydana gelen saldırıları analiz etmek için logları arşivler. Bu durum saldırıların nasıl gerçekleştiğini ve hangi yöntemlerin kullanıldığını anlamaya yardımcı olur.
* **Korelasyon Analizi:** Eski loglar saldırıların birbirleriyle ilişkili olup olmadığını belirlemek için kullanılabilir. Bu karmaşık ve büyük saldırıları anlamaya yardımcı olur.

---

## Saldırı Sonrası İyileştirme ve Strateji Geliştirme

WAF tabanlı tehdit avcılığı sadece saldırıları tespit etmekle sınırlı değildir, aynı zamanda saldırı sonrası süreçlerin iyileştirilmesinde ve gelecekteki tehditlere karşı stratejiler geliştirilmesinde kritik bir rol oynar.

---

## Saldırı Sonrası Analiz

* **Olay Hasar Değerlendirmesi:** WAF bir saldırıdan sonra etkilenen sistemlerin ve uygulamaların belirlenmesine yardımcı olur. Hangi verilerin tehlikeye atıldığını ve hangi alanların iyileştirilmesi gerektiğini anlamak için kullanılır.
* **Güvenlik Açığı Tespiti:** Saldırıdan sonra sistemdeki güvenlik açıklarını belirlemek için WAF logları analiz edilir. Gelecekte benzer saldırıları önlemek için bu açıklar kapatılmalıdır.

---

## Strateji Geliştirme

* **Güvenlik Politikalarını Güncelleme:** WAF tabanlı analizler mevcut güvenlik politikalarının etkinliğini değerlendirmek ve daha güçlü bir savunma hattı oluşturmak için gerekli güncellemeleri yapmak amacıyla kullanılır.
* **Eğitim ve Farkındalık:** WAF'tan elde edilen içgörüler güvenlik ekiplerini eğitmek ve farkındalıklarını artırmak için kullanılabilir, böylece tehditleri daha erken tanımlamaları ve daha etkili yanıt vermeleri sağlanabilir.

WAF tabanlı tehdit avcılığı, web uygulaması tehditlerine karşı proaktif bir savunma mekanizması sağlar. Anlık trafik izleme, imza ve davranış tabanlı tespit, ayrıntılı loglama ve saldırı analizi gibi özellikler tehdit avcılarının saldırıları erkenden tanımlamasına ve daha etkili güvenlik önlemleri geliştirmesine olanak tanır. Bu süreç sadece mevcut tehditleri yönetmek için değil, aynı zamanda potansiyel gelecek tehditleri önlemek için de kritik bir araçtır.

---

## Tehdit Avcılığı Sürecinde WAF Kullanımı

Web Uygulama Güvenlik Duvarı (WAF), web uygulamalarını çeşitli tehditlere karşı korumada kritik bir rol oynar. Dahası tehdit avcılığı sürecinde WAF tarafından sağlanan veriler, tehdit avcıları tarafından oluşturulan hipotezlerin test edilmesini önemli ölçüde destekler. WAF, tehdit avcılarının web tabanlı saldırıları izlemelerine ve saldırganların eylemlerini anlamalarına yardımcı olur.

---

## WAF ve Tehdit Avcılığı

WAF web uygulamalarını hedef alan potansiyel saldırıların tespit edilmesinde tehdit avcılarına yardımcı olur. Tehdit avcıları WAF tarafından oluşturulan loglar ve uyarılar aracılığıyla saldırıların kaynaklarını ve hedeflerini belirleyebilirler. Web uygulamalarını hedef alan karmaşık saldırılar için bu süreç kritiktir.

---

## Hipotez Testi için WAF Kullanımı

Tehdit avcılığı sürecinde tehdit avcıları belirli saldırı vektörlerini veya saldırganların motivasyonlarını test etmek için hipotezler oluştururlar. WAF bu hipotezleri test etmek için kullanılabilecek veriler sağlar. Örneğin belirli bir IP adresinden gelen tekrarlanan saldırı girişimleri veya olağandışı trafik artışları tehdit avcılarının hipotezlerini doğrulamalarına yardımcı olabilir.

---

## Erken Uyarılar ve Anomali Tespiti

WAF tehdit avcılarının web uygulaması saldırılarını erkenden tespit etmesini sağlayarak saldırıları daha geniş bir perspektiften analiz etmelerine ve saldırının ağ üzerindeki genel etkisini değerlendirmelerine olanak tanır.

---

## Veri Toplama ve Log Analizi

Veri toplama ve log analizi, tehdit avcılığı sürecinde WAF'ın temel işlevlerinden biridir. WAF web uygulamalarına yönlendirilen tüm trafiği izler ve bu trafik için loglar oluşturur. Bu loglar tehdit avcıları için değerli bilgiler sağlar.

---

## WAF Loglarını Toplama

WAF. HTTP/HTTPS istekleri, user-agent'lar, IP adresleri, kullanılan protokoller ve yanıt kodları gibi çeşitli veri türlerini toplar. Bu loglar tehdit avcıları için bir başlangıç noktası görevi görür ve potansiyel tehditleri izlemek için analiz edilir.

---

## Log Analizi

WAF loglarını analiz etmek tehdit avcılarının saldırıların kaynağını, türünü ve kapsamını anlamalarına yardımcı olur. Loglar bir saldırının nasıl yürütüldüğünü ve saldırgan tarafından kullanılan teknikleri ortaya çıkarabilir. Örneğin belirli bir user-agent'tan gelen tekrarlanan şüpheli istekler bir botun veya otomatik saldırı aracının varlığına işaret edebilir.

---

## Korelasyon ve Anomali Tespiti

Daha kapsamlı analizler için WAF logları diğer güvenlik sistemlerinden gelen loglarla ilişkilendirilebilir (correlation). Bu durum tehdit avcılarının daha büyük ölçekli saldırıları tespit etmesine yardımcı olabilir. Ayrıca log anomalileri normal davranıştan sapmaları belirlemeye ve bilinmeyen tehditleri ortaya çıkarmaya yardımcı olabilir.

![Daha kapsamlı analizler için WAF logları diğer güvenlik sistemlerinden gelen loglarla ilişkilendirilebilir (correlation)](./0_jGSe2YBLcuWJfZtg.webp)

( **Görsel Kaynağı** : <https://www.techmatrix.de/app-protect-dashboard/> )

---

## Web Saldırılarının Tespiti ve Analizi

Web uygulamalarını hedef alan saldırılar genellikle saldırının ilk aşamasında bir WAF tarafından tespit edilir. Farklı saldırı türlerini belirlemek ve bunların web uygulamaları üzerindeki etkilerini analiz etmek için WAF önemli bir araçtır.

---

## Saldırı Türlerini Belirleme

WAF. SQL enjeksiyonu, XSS (Cross-Site Scripting), file inclusion ve diğer web tabanlı saldırı türlerini tespit eder. WAF logları bu saldırıların nasıl gerçekleştirildiğini ve saldırganlar tarafından kullanılan yöntemleri ortaya çıkararak tehdit avcılarının saldırı vektörlerini anlamalarına ve daha geniş analizler yapmalarına olanak tanır.

---

## Saldırıları Analiz Etme

WAF logları, saldırının kaynağı, hedefi, kullanılan yöntemler ve sonuçları hakkında bilgi sağlayarak tespit edilen saldırıları detaylandırır. Tehdit avcıları saldırının etkisini ve saldırganın motivasyonunu anlamak için bu verileri analiz edebilirler. Örneğin tek bir IP adresinden gelen tekrarlanan SQL enjeksiyon saldırıları saldırganın veritabanlarına erişim sağlamaya çalıştığını gösterebilir.

---

## Saldırıların Etkisini Değerlendirme

WAF logları saldırıların web uygulamaları üzerindeki etkisini değerlendirmek için de kullanılır. Saldırının başarılı olup olmadığını, hangi verilere erişildiğini ve saldırının uygulamanın diğer bileşenlerini nasıl etkilediğini belirlemek için kritiktir.

---

## Gerçek Zamanlı ve Geçmişe Dönük Web Trafiği Analizi

WAF tehdit avcılarının web trafiğini hem gerçek zamanlı hem de geçmişe dönük olarak analiz etmelerini sağlar. Bu iki yöntem tehdit avcılığı sürecinde farklı bakış açıları sunar.

---

## Gerçek Zamanlı Analiz

Gerçek zamanlı trafik izleme, WAF'ın web uygulamalarını hedef alan tehditleri anında tespit etmesini sağlar. Tehdit avcıları bu verileri derhal müdahale etmek ve saldırının yayılmasını önlemek için kullanabilirler. Gerçek zamanlı analiz yoluyla saldırganlar hala aktifken tehdit avcılığı yapmak mümkündür.

---

## Geçmişe Dönük (Retrospective) Analiz

WAF geçmiş web trafiğini analiz etmek için logları arşivler. Geçmişe dönük analiz önceki saldırıları izlemek, tekrarlanan saldırı girişimlerini belirlemek ve saldırıların zaman içindeki gelişimini anlamak için kullanılır. Tehdit avcılarının saldırganların uzun vadeli stratejilerini anlamalarına ve gelecekteki saldırıları tahmin etmelerine yardımcı olur.

---

## Korelasyon ve Trend Analizi

Loglar web saldırılarıyla ilgili trendleri belirlemek için kullanılabilir. Bu trendler daha sonra diğer güvenlik sistemlerinden gelen verilerle ilişkilendirilebilir. Sonuç olarak büyük ölçekli ve karmaşık saldırılar anlaşılabilir ve gelecekteki tehditler daha erken tespit edilebilir.

Özetle WAF tabanlı tehdit avcılığı, web uygulamalarını hedef alan tehditlerin tespit edilmesinde ve analiz edilmesinde kritik bir rol oynar. WAF tehdit avcılarına web trafiğini izleme, saldırıları tespit etme ve etkilerini anlama konusunda değerli içgörüler sağlar. Tehdit avcıları hipotezlerini test edebilir ve veri toplama, log analizi, web saldırılarının derinlemesine incelenmesi ve hem gerçek zamanlı hem de geçmişe dönük trafik analizi yoluyla tehditlerin kaynağını belirleyebilirler. Bu süreç web uygulamalarının güvenliğini artırmak için temel bir yaklaşımdır. Ayrıca web uygulamalarını gelecekteki tehditlere karşı daha dirençli hale getirir.

---

## Web Tabanlı Kaba Kuvvet (Brute Force) Saldırı Hipotezi

---

## Hipotez

Bir tehdit aktörü yetkisiz erişim sağlamak ve kimlik bilgilerini çalmak için kaba kuvvet (brute force) yöntemlerini kullanarak bir web uygulamasındaki oturum açma formlarını hedefliyor olabilir.

![Bir tehdit aktörü yetkisiz erişim sağlamak ve kimlik bilgilerini çalmak için kaba kuvvet (brute force) yöntemlerini](./0_gqvC9lf2TrPcrMoB.webp)

( **Görsel Kaynağı** : <https://www.thesslstore.com/blog/brute-force-attack-definition-how-brute-force-works/> )

---

## Veri Kaynakları

* **WAF Logları:** Oturum açma formlarını hedefleyen tekrarlanan oturum açma girişimleri ve başarısız kimlik doğrulama istekleri.
* **Web Sunucu Logları:** Tekrarlanan isteklerde bulunan şüpheli IP adresleri ve olağandışı veri yüklemeleri/indirmeleri.
* **IPS/IDS Logları:** Web uygulamasını hedef alan anormal trafik artışları ve saldırı faaliyetleri.

---

## Analiz Adımları

* **Oturum Açma Girişimleri:** Belirli IP adreslerinden kaynaklanan çok sayıda başarısız oturum açma girişimi için WAF loglarını izleyin. Bu girişimler aynı kullanıcı adını kullanarak tekrarlanan denemeleri içerebilir.
* **IP Adresi Analizi:** Tekrarlanan oturum açma girişimlerine dahil olan IP adreslerini belirlemek için web sunucu loglarını kullanın ve bu adreslerle ilişkili diğer faaliyetleri araştırın.
* **Oturum Açma Zaman Damgaları:** Oturum açma girişimlerinin yoğunlaştığı zaman dilimlerini analiz edin. Mesai saatleri dışındaki alışılmadık oturum açma girişimleri bir kaba kuvvet saldırısına işaret edebilir.
* **WAF ve IPS/IDS Uyarıları:** Saldırganın diğer ağ bileşenleri üzerindeki faaliyetlerini belirlemek için WAF tarafından tetiklenen kaba kuvvet saldırı uyarılarını IPS/IDS loglarıyla ilişkilendirin.
* **User-Agent'lar:** Şüpheli oturum açma girişimleri sırasında kullanılan user-agent'ları inceleyin. Aynı user-agent ancak farklı kullanıcı adlarıyla yapılan tekrarlanan oturum açma girişimleri otomatik araçların kullanıldığını gösterebilir.
* **Kimlik Bilgisi Hırsızlığı:** Başarılı oturum açma girişimlerinden sonra kullanıcı hesaplarındaki şüpheli etkinlikleri kontrol edin. Beklenmedik veri erişimine veya verileri sızdırma girişimlerine dikkat edin.

---

## Hipotez Doğrulama ve Beklenen Bulgular

* WAF loglarında belirli IP adreslerinden gelen yoğun kaba kuvvet denemeleri.
* Başarısız oturum açma girişimlerini takiben aynı IP adresinden başarılı bir oturum açma.
* IPS/IDS loglarında web uygulamasını hedef alan anormal trafik artışları ve saldırı faaliyetleri.

---

## Hipotez Değerlendirmesi

WAF kaba kuvvet saldırılarını tespit etmede ve bunlara karşı korumada kritik bir rol oynar. Tehdit avcıları saldırganlar tarafından kullanılan kaynağı, hedefi ve teknikleri belirlemek için WAF ve IPS/IDS loglarını analiz edebilirler. WAF ile analiz kimlik bilgisi hırsızlığı gibi ciddi güvenlik ihlallerini önlemek ve web uygulamalarının güvenliğini artırmak için hayati önem taşır.

---

## Uygulamalı Laboratuvar

---

## Hipotez

**Not**: Bu bölümdeki sorular, aşağıdaki hipoteze dayalı olarak Tehdit Avcılığı için hazırlanmıştır.

**Hipotez**: Saldırganlar sunucudaki hassas dosyalara ve yapılandırma bilgilerine yetkisiz erişim sağlamak için kurumun web uygulamalarındaki Directory Traversal (Dizin Atlama) açığından yararlanmaya çalışıyor olabilir.

---

## Tehdit Avcılığı Laboratuvar Ortamı

* WAF Olayları (FortiWeb)
* SIEM (Wazuh)
* Güvenlik Duvarı Trafik Olayları
* CTI Olayları ([Threat Intel LetsDefend Platformu](https://app.letsdefend.io/threat-intelligence-feed))

---

## Laboratuvar Notları

* Aşağıdaki soruları yanıtlamak için "8 Ağustos 2024 00:00 - 13 Ağustos 2024 00:00" arasındaki logları analiz edin.
* Sonraki sorular bir öncekilerin doğru cevaplarını gerektirir. Tüm soruları kesinlikle göründükleri sırayla yanıtlayın.

---

## Sorular

**Not:** Aşağıdaki soruları yanıtlamak için "8 Ağustos 2024 00:00 - 13 Ağustos 2024 00:00" arasındaki logları analiz edin.

**Not**: Sonraki sorular bir öncekilerin doğru cevaplarını gerektirir. Tüm soruları kesinlikle göründükleri sırayla yanıtlayın.

> **WAF loglarına göre Directory Traversal saldırısının en sık gerçekleştiği URL nedir?**

SIEM'de "data.subtype: waf" filtresini kullanın. "data.url" alanındaki değerleri kontrol edin.

![SIEM'de "data.subtype: waf" filtresini kullanın](./1_woEGDa62G34NK56BDMyZuA.webp)

**Cevap:** /page.php?file=../../../../etc/shadow

> **WAF tarafından izin verilen Directory Traversal saldırısının URL'si nedir?**

SIEM'de "data.subtype: waf" ve "data.action: Alert" filtrelerini kullanın.

![SIEM'de "data.subtype: waf" ve "data.action: Alert" filtrelerini kullanın](./1_Lws_8FcuGAzvt12KfDiTag.webp)

**Cevap:** /page.php?file=../../../../home/user/.ssh/id_rsa

> **WAF tarafından izin verilen Directory Traversal saldırısının HTTP durum kodu nedir?**

SIEM'de "data.subtype: waf" ve "data.action: Alert" filtrelerini uygulayın. "full_log" içindeki "return_code" değerini bulun.

![SIEM'de "data.subtype: waf" ve "data.action: Alert" filtrelerini uygulayın](./1_d9VtggWq0LsNsz_UQPHo3w.webp)

**Cevap:** 200

> **Tehdit avcılığı sürecinin önceki aşamalarında, WAF tarafından izin verilen bir dizin atlama saldırısı gerçekleştiren bir IP adresi tespit edilmişti. Bu aynı IP adresi farklı bir web saldırısı türü daha başlatmıştır. Bu web saldırısının türü nedir?**

SIEM'de 'data.subtype: waf' ve 'data.action: Alert' filtrelerini uygulayarak oluşturulan çıktıdan IP adresini belirleyin. Ardından bu IP adresinden kaynaklanan farklı saldırı türlerini incelemek için WAF loglarını gözden geçirin.

Önceki aşamada kaynak adresi '16.61.7.181' olarak görmüştük.

![Önceki aşamada kaynak adresi '16.61.7.181' olarak görmüştük](./1_q81fiePDc9xz_VZuuVNpJg.webp)

**Cevap:** OS Command Injection

> **Tehdit avcılığı sürecinin önceki aşamalarında, WAF tarafından izin verilen bir dizin atlama saldırısı gerçekleştiren bir IP adresi tespit edilmişti. Bu aynı IP adresi farklı bir web saldırısı türü daha başlatmıştır. Bu web saldırısına karşı hangi WAF eylemi (action) alınmıştır?**

SIEM'de "data.subtype: waf" filtresini uygulayın. Web saldırısıyla ilgili log girişindeki "data.action" alanını kontrol edin.

![SIEM'de "data.subtype: waf" filtresini uygulayın](./1_GjvzG4LqTBHV78pIMF11wA.webp)

**Cevap:** Block

> **WAF tarafından izin verilen Directory Traversal saldırısının hedef sunucu IP adresi nedir?**

SIEM'de "data.subtype: waf" ve "data.action: Alert" filtrelerini uygulayın. "data.dstip" alanını kontrol edin.

![SIEM'de "data.subtype: waf" ve "data.action: Alert" filtrelerini uygulayın (2)](./1_-YsBUNDR59qsWgUmlG9NfA.webp)

**Cevap:** 10.10.10.88

> **WAF tarafından izin verilen dizin atlama saldırısını gerçekleştiren IP adresi hangi APT grubuna aittir?**

IP adresini Threat Intel LetsDefend Platformunda arayın.

![IP adresini Threat Intel LetsDefend Platformunda arayın](./1_xjtLg78ErcNdoPiGEDSOmQ.webp)

**Cevap:** APT-LL-23

> **WAF tarafından izin verilen dizin atlama saldırısını gerçekleştiren IP adresiyle aynı APT grubuna ait bildirilen başka bir IP adresi nedir?**

Threat Intel LetsDefend Platformunda APT grubunun adını arayın.

![Threat Intel LetsDefend Platformunda APT grubunun adını arayın](./1_s9Yy-aJyyWn5SLvFbUsNNA.webp)

**Cevap:** 101.203.172.3

> **Tehdit Avcılığının önceki aşamalarında, Dizin Atlama (Directory Traversal) saldırıları gerçekleştiren bir IP adresi tanımlanmıştı. Daha sonra, aynı tehdit grubuna ait başka bir IP adresi keşfedildi. Bir 'local → WAN' örüntüsünde bu ilgili harici IP adresine erişen kaynak IP adresi nedir?**

Threat Intel platformunda tanımlanan APT Grubunun IP adresini bulun. SIEM'de "rule.groups: firewall" ve "data.dstip: [Bulunan_IP]" filtrelerini uygulayın.

![Threat Intel platformunda tanımlanan APT Grubunun IP adresini bulun](./1_ZG3TWF9ZjxKMBzOivVWl4Q.webp)

**Cevap:** 10.10.10.88

> **Tehdit Avcılığı sürecinin başlarında, Dizin Atlama saldırıları gerçekleştiren bir IP adresi tanımlanmıştı. Aynı tehdit grubundan başka bir IP adresi daha sonra bulundu. Uç noktanın bu harici IP adresine erişim isteği üzerindeki güvenlik duvarı eylemi neydi?**

Threat Intel platformunda tanımlanan APT Grubunun IP adresini bulun. SIEM'de "rule.groups: firewall" ve "data.dstip: [IP_Adresi]" filtrelerini uygulayın. Ardından "data.action" alanını kontrol edin.

**Cevap:** block
---
