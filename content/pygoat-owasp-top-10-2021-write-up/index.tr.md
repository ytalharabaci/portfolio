---
title: "PyGoat OWASP Top 10 (2021) Çözüm ve Analiz Rehberi"
date: '2023-08-27'
description: "PyGoat zafiyetli laboratuvar ortamı üzerinde OWASP Top 10 (2021) güvenlik açıklarının teknik analizi, sömürü yöntemleri ve güvenli kodlama çözümleri."
image: featured.webp
draft: false
type: writeups
topic: appsec-devsecops
tags: ["OWASP Top 10", "PyGoat", "Web Application Security", "Write-up", "Django"]
featuredImageAlt: "PyGoat OWASP Top 10 (2021) Write-Up Kapak Görseli"
---

PyGoat zafiyetli laboratuvar ortamı üzerinde, OWASP Top 10 (2021) standartlarında yer alan kritik web güvenlik açıklarının teknik analizini ve sömürü senaryolarını adım adım inceliyoruz. Zafiyetlerin kök nedenlerini ve kaynak kod düzeyinde nasıl giderileceğini ele alacağız.

---

## **Pygoat nedir?**

[Pygoat](https://owasp.org/www-project-pygoat/), OWASP(Open Worldwide Application Security Project**)** tarafından geliştirilmiş zafiyetli bir web uygulamasıdır. Amaç, hem geliştiricilere hem de test uzmanlarına uygulamaların nasıl test edileceğini ve güvenli bir şekilde nasıl kodlanacağını öğretmek için bir platform sağlamaktır. PyGoat python dilinde yazılmıştır ve Django Frameworkünü kullanmaktadır.  
PyGoat ayrıca, güvenlik açığına neden olan hatanın nerede yapıldığını belirlemek için kaynak kodunu görebileceğiniz ve güvenli hale getirmek için değişiklikler yapmanıza izin veren bir alana sahiptir.

![PyGoat ayrıca, güvenlik açığına neden olan hatanın nerede yapıldığını belirlemek için kaynak kodunu görebileceğiniz ve](./1_1XctNRMmZBVl7M-IYHpuGA.webp)

OWASP TOP 10 2021

Aşağıdaki bölümlerde, PyGoat 2021 kategorilerindeki zafiyetleri ve çözüm adımlarını teknik detaylarıyla inceliyoruz.

---

## Pygoat Kurulum

Uygulamanın kurulumu için birkaç farklı yol var:

1. Kaynak Kod ile çalıştırmak: github reposundan kaynak kodunu indirip django kurulumu yapıp python ile çalıştırabilirsiniz. Bu kaynak kodunun elinizin altında olması nedeniyle daha anlaşılır bir şekilde çalışmanızı sağlayabilir. Github reposu: <https://github.com/adeyosemanputra/pygoat>
2. Docker ile çalıştırmak: Pygoat'ın, içinde uygulamanın kurulumu yapılmış hazır bir docker konteynırı vardır. Bunun kurulumu için de bilgisayarınıza docker kurulumu yapıp konteynırı çalıştırabilirsiniz. Docker Konteynırı: <https://hub.docker.com/r/pygoat/pygoat>
3. DockerVuln ile çalıştırmak: DockerVuln zafiyetli web uygulamalarını içinde bulunduran arayüzlü bir program. Bu programı herhangi bir linux dağıtımına kurarak içerisindeki web uygulamalarını iki tuşla çalıştırabilirsiniz. DockerVuln: <https://github.com/ytalharabaci/webvuln-runner>

---

## A1: Broken Access Control

Bazen yetkilendirme olarak da adlandırılan erişim kontrolü, bir web uygulamasının bazı kullanıcılara içerik ve işlevlere erişim izni verirken diğerlerine vermemesidir. Bu kontroller kimlik doğrulamasından sonra gerçekleştirilir ve 'yetkili' kullanıcıların neler yapabileceğini yönetir. Bir web uygulamasının erişim kontrol modeli, sitenin sağladığı içerik ve işlevlerle yakından bağlantılıdır. Buna ek olarak, kullanıcılar farklı yeteneklere veya ayrıcalıklara sahip bir dizi gruba veya role dahil olabilir.

Erişim kontrolü, kullanıcıların amaçlanan izinlerinin dışında hareket edemeyecekleri şekilde politikayı uygular. Buradaki hatalar genellikle yetkisiz bilgi ifşasına, tüm verilerin değiştirilmesine veya imha edilmesine ya da kullanıcının yetkisi dışında bir iş eylemini gerçekleştirilmesine yol açar.

### LAB 1

Laba girip `jack:jacktheripper`credentialları ile oturum açtımızda bu hesabın bir secret keye sahip olamadığını görüyoruz. Secret Keyin admin hesabında olduğu bilgisi bize verilmiş.

![Laba girip jack:jacktherippercredentialları ile oturum açtımızda bu hesabın bir secret keye sahip olamadığını görüyoruz](./1_GsZNTPkjGJW-0WQxjN1qcA.webp)

İsteği burp suite ile yakalayıp inceledeiğimizde admin isminde bir parametre olduğumu ve 0 değeri verildiğini görüyoruz. Erişim kontrolü bu parametre tarafından sağlanıyor ancak biz bu isteği manipüle edebiliyoruz.

![İsteği burp suite ile yakalayıp inceledeiğimizde admin isminde bir parametre olduğumu ve 0 değeri verildiğini görüyoruz](./1_IivQnGS-EFYtyfRXhWnwhQ.webp)

Bu parametreyi 1 yapıp isteği gönderdiğimizde ise admin yetkisiyle giriş yapıp şifreyi elde ediyoruz.

![Bu parametreyi 1 yapıp isteği gönderdiğimizde ise admin yetkisiyle giriş yapıp şifreyi elde ediyoruz](./1__NrmHQfYRTk810LH9v3Y9g.webp)

### LAB 2

Laba girip `jack:jacktheripper`credentialları ile oturum açtımızda yine aynı şekilde jack kullanıcısının admin olmadığını ve secret keye sahip olmadığını görüyoruz.

![Laba girip jack:jacktherippercredentialları ile oturum açtımızda yine aynı şekilde jack kullanıcısının admin olmadığını ve](./1_XShmDM3Ad_TSrybSm54s7g.webp)

Sayfanın kaynak koduna baktığımızda adminin google chrome mozilla gibi bir bowser kullanamayacağı sadece pygoat\_admin browserı kullanabileceği yazıyor. İlginç.

![Sayfanın kaynak koduna baktığımızda adminin google chrome mozilla gibi bir bowser kullanamayacağı sadece pygoat admin](./1_7vSIhg1mgru3MNPtFyd6NA.webp)

Bur suite isteğini yakalayıp baktığımızda user-agent parametresinde bizim browser bilgimizi ilettiğimizi görüyoruz.

![Bur suite isteğini yakalayıp baktığımızda user-agent parametresinde bizim browser bilgimizi ilettiğimizi görüyoruz](./1_Rrh4mc0pJBjaud60_9MaqQ.webp)

Buradaki değeri **pygoat\_admin** olarak değiştiriyorum. Ve evet secret keyi elde ettik.

![Buradaki değeri pygoat admin olarak değiştiriyorum](./1_m7zvfQB4SXxVgwtPEJ1xxw.webp)

---

## A2: Cryptographic Failures

Kriptografik hatalar hassas bilgi sızıntılarına(Sensitive Data Exposure) neden olabilirler. Bilgi sızıntısı, bir web sitesinin kullanıcılarına hassas bilgileri istemeden ifşa etmesidir. Bağlama bağlı olarak, web siteleri potansiyel bir saldırgana aşağıdakiler de dahil olmak üzere her türlü bilgiyi sızdırabilir:

* Kullanıcı adları veya finansal bilgiler gibi diğer kullanıcılar hakkındaki veriler
* Hassas ticari veya iş verileri
* Web sitesi ve altyapısı hakkında teknik detaylar

### LAB

Django Frameworkünde geliştirme yapan geliştiricilere hataların gösterilmesini içeren bir DEBUG niteliği vardır. DEBUG=True'ya sahip olmanın özelliklerinden biri, bir istisna oluştuğunda tüm settings.py yapılandırmaları da dahil olmak üzere ortamınızdan çok sayıda meta veri dökmektir. Bu geliştiricinin hatayı çözümlemesi için gereklidir. Ancak, yayınlanmış bir uygulamada bu niteliğin aktif olması saldırgana web uygulaması hakkında çok fazla bilgi sağlar.

![Django Frameworkünde geliştirme yapan geliştiricilere hataların gösterilmesini içeren bir DEBUG niteliği vardır](./1_fhpBBGKlmmV1iXT13OaZrg.webp)

LAB'da bizden 500error sayfasını bulmamızı istiyordu.

Şekildeki gibi olmayan bir sayfaya gitmek istediğimizde bize web site dizinlerini verdi.

![Şekildeki gibi olmayan bir sayfaya gitmek istediğimizde bize web site dizinlerini verdi](./1_l6WtGnxTx2_q3CFa-4R4tw.webp)

DEBUG=TRUE

![LAB: DEBUG=TRUE](./1_gQbuy4Ff0h56u41Kz8tfhQ.webp)

500error

Bulduğumuz sayfaya gittiğimizde bize web uygulaması ile ilgili pek çok metadata sağlıyor.

---

## A3: Injection

En yaygın enjeksiyonlardan bazıları SQL, NoSQL, OS komutu, Nesne İlişkisel Eşleme (ORM), LDAP ve İfade Dili (EL) veya Nesne Grafiği Gezinme Kütüphanesi (OGNL) enjeksiyonudur.

Kaynak kodu incelemesi, uygulamaların enjeksiyonlara karşı savunmasız olup olmadığını tespit etmenin en iyi yöntemidir. Tüm parametrelerin, başlıkların, URL'lerin, çerezlerin, JSON, SOAP ve XML veri girişlerinin otomatik olarak test edilmesi şiddetle tavsiye edilir. Kuruluşlar, uygulamanın dağıtımından önce ortaya çıkan enjeksiyon zafiyetlerini belirlemek için statik (SAST), dinamik (DAST) ve etkileşimli (IAST) uygulama güvenlik testi araçlarını kullanalabilir.

Bir uygulama şu durumlarda enjeksiyon saldırısına açıktır:

1. Kullanıcı tarafından sağlanan veriler uygulama tarafından doğrulanmaz, filtrelenmez veya sterilize edilmez.
2. Dinamik sorgular veya bağlama duyarlı kaçış olmadan parametrelendirilmemiş çağrılar doğrudan yorumlayıcıda kullanılır.
3. Doğrulanmamış veriler, ek, hassas kayıtları ayıklamak için nesne-ilişkisel eşleme (ORM) arama parametreleri içinde kullanılır.
4. Doğrulanmamış veriler doğrudan kullanılır veya birleştirilir. SQL veya komut, dinamik sorgular, komutlar veya saklı yordamlardaki yapıyı ve kötü amaçlı verileri(genellikle kod parçası) içerir.

### SQL Injection LAB

SQL enjeksiyonu, istemciden uygulamaya gelen girdi verileri aracılığıyla bir SQL sorgusunun eklenmesi veya "enjeksiyonundan" oluşan ünlü bir Enjeksiyon saldırısıdır. Başarılı bir SQL enjeksiyonu, veritabanından hassas verileri okuyabilir, veritabanı verilerini değiştirebilir (Ekle/Güncelle/Sil), veritabanı üzerinde yönetim işlemleri yürütebilir (VTYS'yi kapatmak gibi), VTYS dosya sisteminde bulunan belirli bir dosyanın içeriğini kurtarabilir ve bazı durumlarda işletim sistemine komutlar verebilir. SQL enjeksiyon saldırıları, önceden tanımlanmış SQL komutlarının yürütülmesini etkilemek amacıyla veri düzlemi girdisine SQL komutlarının enjekte edildiği bir enjeksiyon saldırısı türüdür.

![SQL enjeksiyonu, istemciden uygulamaya gelen girdi verileri aracılığıyla bir SQL sorgusunun eklenmesi veya "enjeksiyonundan"](./1_J_T1XcqsCJsdhjlVM3W8CQ.webp)

Login Form

LAB ortamında user/password credentialları ile giriş yapmaya çalıştığımızda aşağıdaki SQL sorgusunu görüyoruz.

![LAB ortamında user/password credentialları ile giriş yapmaya çalıştığımızda aşağıdaki SQL sorgusunu görüyoruz](./1_qm6EomyLqxhWtSqbs71eeg.webp)

SQL Script

admin hesabına giriş yapmak için username kısmına "admin" değerini vermemiz lazım. Ancak parolasını bilmiyoruz. Ancak bu SQL scriptini manipule edebiliriz.

password='password' kısmında tırnak içindeki password değeri forma girdiğimiz değer. Formda ilk olarak tırnağı kapatıp sonrasında işlediğimi SQL komutunu çalıştırabiliriz.

> kullamıcı adı: admin  
> password: ' OR '1' ='1

SQL deyimindeki 1=1 ifadesi sonucun TRUE dönmesini ve SQL deyiminin çalışmasını dolayısıyla sayfaya login olmamızı sağlayacak.

![SQL deyimindeki 1=1 ifadesi sonucun TRUE dönmesini ve SQL deyiminin çalışmasını dolayısıyla sayfaya login olmamızı](./1_P5dPNgsWkHGPMNaBrM93Ag.webp)

Admin olarak oturum açma

### Command Injection LAB

Komut enjeksiyonu, hedefin savunmasız bir uygulama aracılığıyla ana bilgisayar işletim sistemi üzerinde keyfi komutların yürütülmesi olduğu bir saldırıdır. Komut enjeksiyonu saldırıları, bir uygulama kullanıcı tarafından sağlanan güvenli olmayan verileri (formlar, çerezler, HTTP başlıkları vb.) bir sistem kabuğuna aktardığında mümkündür. Bu saldırıda, saldırgan tarafından sağlanan işletim sistemi komutları genellikle savunmasız uygulamanın ayrıcalıklarıyla yürütülür. Komut enjeksiyon saldırıları büyük ölçüde yetersiz girdi doğrulaması nedeniyle mümkündür.

LAB ortamında bir Name Server Lookup uygulaması bulunuyor. Kullanıcıdan aldığı domain name'i çalıştırdığı işletim sistemi üzerinde name lookup yapan bir komuta parametre olarak verip çıktısını bize döndürüyor.

![LAB ortamında bir Name Server Lookup uygulaması bulunuyor](./1_VnYmabNdtLZtM6BUoOcZtA.webp)

Linux sistemler için ***dig*** Windows sistemler için ***nslookup*** aracını kullanıyor. Hem linux hem de windows sistemlerde komut deyimini bitirmemize ve farklı bir komut çalıştırmamıza yarayan , ifadesi vardır.

Linux sistemler için, input alanına bir domain yazdıktan sonra , ile komutu bitirip istediğimiz komutu çalıştırabiliriz. Örneğin cat komutuyla linux sistemlerde kullanıcıları içeren passwd dosyasını okumaya çalışabiliriz.

> google.com, cat /etc/passwd

![Command Injection LAB: google.com, cat /etc/passwd](./1_F4asRoROjUr_7L0q4Q5xSw.webp)

Bu komutu çalıştırdığımızda dig sonuçlarından sonra passwd dosyası web sayfasına yazdırılacaktır.

![Bu komutu çalıştırdığımızda dig sonuçlarından sonra passwd dosyası web sayfasına yazdırılacaktır](./1_J8PdroB-PCC9Nr1JKUyrPQ.webp)

Windows sistemelr için, input alanına domain yazdıkdan yine , ile komutu bitirip istediğimiz komutu çalıştırabiliriz. Örneğin dir komutuyla Windows sistemlerde dizindeki dosyaları yazdırabilriz.

> google.com, dir

![Command Injection LAB: google.com, dir](./1_3db0eRrvAffAM059j0rRDg.webp)

Bu komutu çalıştırdıktan sonra nslookup sonuçlarından sonra dizindeki dosyalar web sayfasına yazdırılacaktır.

![Bu komutu çalıştırdıktan sonra nslookup sonuçlarından sonra dizindeki dosyalar web sayfasına yazdırılacaktır](./1_8V6HolR2RmDh9ctp7OKeeA.webp)

---

## A4: Insecure Design

Güvensiz tasarım, farklı zayıflıkları temsil eden geniş bir kategoridir. Güvensiz tasarım ile güvensiz uygulama arasında bir fark vardır. Tasarım kusurları ile uygulama kusurları arasında ayrım yapmamızın bir nedeni vardır, bunların farklı kök nedenleri ve düzeltme yolları vardır. Güvenli bir tasarım yine de istismar edilebilecek güvenlik açıklarına yol açan uygulama kusurlarına sahip olabilir. Güvensiz bir tasarım mükemmel bir uygulama ile düzeltilemez çünkü tanım gereği, gerekli güvenlik kontrolleri hiçbir zaman belirli saldırılara karşı savunmak için oluşturulmamıştır. Güvensiz tasarıma katkıda bulunan faktörlerden biri, geliştirilmekte olan yazılım veya sistemin doğasında bulunan iş riski profilinin eksikliği ve dolayısıyla hangi düzeyde güvenlik tasarımının gerekli olduğunun belirlenememesidir.

### LAB

Lab ortamındaki örneğe baktığımızda, bize 5 ücretsiz bilet veren ancak tüm biletler satılana kadar filmi izlememize izin ver meyen bir uygulama ile karşı kaşıyayız.

![Lab ortamındaki örneğe baktığımızda, bize 5 ücretsiz bilet veren ancak tüm biletler satılana kadar filmi izlememize izin ver](./1_9IoF-emuRmtPxiJs5cnZsg.webp)

Bu uygulama bize sadece 5 bileti ücretsiz sağlıyor. Burp isteğini yakalayıp baktığımda da herhangi bir zafiyet unsuru görmedim.

Lab ortamındaki açıklamada, bizim bütün biletleri alabileceğimizi söylüyordu. Peki ya nasıl? ipucu olarak logout and think(çıkış yap ve düşün) demiş. Acaba çıkış yapıp yeni bir hesap oluşturup ordan da ücretsiz bilet alabilir miyiz?

![Lab ortamındaki açıklamada, bizim bütün biletleri alabileceğimizi söylüyordu](./1_mnAdcOtUSgaXb-rZwJwdbQ.webp)

Evet işe yaradı başka bir hesap oluşturup ücretsiz 5 bilet daha aldık. Bu şekilde 9 hesap daha oluşturursak tüm biletleri alabiliriz ve filmimizi izleyabiliriz:)   
Görüldüğü üzere uygulamada bilinen anlamda herhangi bir zafiyet yok ancak tasarımdaki yani iş kurallarını oluşturmadaki bir hata bizi bu noktaya getirdi.

---

## A5: Security Misconfiguration

Yanlış yapılandırmalar, ağ hizmetleri, platform, web sunucusu, uygulama sunucusu, veritabanı, çerçeveler, özel kod ve önceden yüklenmiş sanal makineler, konteynerler veya depolama dahil olmak üzere bir uygulama yığınının herhangi bir seviyesinde ortaya çıkabilir. Otomatik araçlar yanlış yapılandırmaları, varsayılan hesapların veya yapılandırmaların kullanımını, gereksiz hizmetleri, eski seçenekleri vb. tespit etmek için kullanışlıdır.

Bu tür kusurlar sayesinde saldırganlar, bazı sistem verilerine veya işlevlerine yetkisiz erişim sağlar. Bazen bu tür kusurlar sistemin tamamen tehlikeye girmesine neden olur.

### LAB

Bu laboratuvarda bir yanlış yapılandırma var. Gizli anahtarı ortaya çıkaran ve ancak admin bu anahtarı görüntüleyebilir. Burada sormamız gereken şey admin olduğunu nasıl doğruluyor? Bir cookie ya da header mı var?

![Bu laboratuvarda bir yanlış yapılandırma var](./1_Vhai1BxfJiRuY6pVLqN5xQ.webp)

Labda secret key düğmesine bastığımızda sadece admin.localhost:8000'in bu secret keye erişebildiğini bie söylüyor. Nasıl olabilir? Hadi Burp ile isteği yakalayalım.

![Labda secret key düğmesine bastığımızda sadece admin.localhost:8000'in bu secret keye erişebildiğini bie söylüyor](./1_OY_YZmeVurlhV4MKW4UOdA.webp)

Bu burp isteğinde secret'a bir GET isteği attığını görüyoruz. Ancak hata mesajında bize belirtilen X-Host headerı burada yok. Zaten değerinin none yani olmadığını da bize iletmemiş. Burada yapmamız gerek bu X-Host adında bir header ekleyip değerini admin.localhost:8000 olarak vermek.  
Bu uygulama admin hesabını istekteki X-Host değerine bakarak doğruluyor ancak client tarafında bizim bu isteği manipüle edebileceğimizi göz ardı etmiş durumda.

![Bu uygulama admin hesabını istekteki X-Host değerine bakarak doğruluyor ancak client tarafında bizim bu isteği manipüle](./1_9DIQ37iE1AYtGP1rZfv2fA.webp)

Burpün Proxy menüsünde isteği yakaladığımızda hemen sağ tarafta headerları görebildiğimiz ve düzenleyebildiğimiz bir menü var. Buradan X-Host headerını ekleyerek olması gereken değeri veriyoruz. Ardından isteği gönderebiliriz. Ve secret keyi elde ettik.

![Burpün Proxy menüsünde isteği yakaladığımızda hemen sağ tarafta headerları görebildiğimiz ve düzenleyebildiğimiz bir menü](./1_RIaCAdysvIY_On1WNfJcZw.webp)

---

## A6: Vulnerable and Outdated Components

Bir geliştirici halihazırda bilinen bir güvenlik açığı olan bir kod parçası veya kütüphane kullandığında, bu durum tüm uygulamanın tehlikeye girmesine neden olabilir. Bu durum, uygulama içinde kullanılan kütüphaneler ve çerçeveler gibi bileşenler çoğunlukla tam yetkiyle çalıştığında ortaya çıkar. Güvenlik açığı olan bir bileşen ciddi bir veri kaybına veya sunucunun ele geçirilmesine neden olabilir.

### LAB

Bu lab ortamında, yaml dosyalarını json dosyalarına çeviren bir uygulama vardır. Json verilerini almak için bir yaml dosyasının seçilmesi ve yüklenmesi gerekir. Ayrıca, kullanıcıya uygulamanın kullandığı kütüphanenin sürümünü söyleyen bir get version özelliği de vardır.

![Bu lab ortamında, yaml dosyalarını json dosyalarına çeviren bir uygulama vardır](./1_EppokYoSMghu5tW6l4_ezQ.webp)

Get Version düğmesine bastığımızda bu uygulamada pyyaml v5.1 kullanıldığını görüyoruz. Bu versiyonu internette biraz araştıralım.

![Get Version düğmesine bastığımızda bu uygulamada pyyaml v5.1 kullanıldığını görüyoruz](./1_mWcoGEUEuFd_E0ne0P1PxA.webp)

Zafiyet Araştırması

Araştırmalar sonucunda, kullanılan modülün ***Arbitary Code Executio***n isminde **kritik** bir zafiyete sahip olduğunu gördüm. Ardından bu zafiyetin nasıl exploit edileceğine dair araştırmalar yapabilirsiniz.

Bu zafiyetti sömürebilmek için(exploit) bir yaml dosyası-payload hazırlamamız lazım. Aşağıaki scripti bir yaml dosyasına kaydettim.

```
!!python/object/apply:subprocess.check_output  
- ls
```

Ardından oluşturduğum dosyayı seçip upload butonuna tıkladım.

![Ardından oluşturduğum dosyayı seçip upload butonuna tıkladım](./1_Xts7McZlvSLGwS9-OBnsaQ.webp)

Hazırladığımız payload çalıştığında verdiğimiz komut olan ***ls*** komutu çalışacak ve bize sunucuda bulunduğu dizidneki dosyaları yazdıracak. Ve geelen çıktıda dizin ve dosyaları görebiliyoruz.

![Hazırladığımız payload çalıştığında verdiğimiz komut olan ls komutu çalışacak ve bize sunucuda bulunduğu dizidneki dosyaları](./1_N8TX7K3Ls7X5y90S1M-3Rg.webp)

---

## A7: Identification and Authentication Failures

Hatalı kimlik doğrulama(Authantication and Idenntification Failures), saldırganların çevrimiçi ortamda meşru kullanıcıları taklit etmek için kullandıkları çeşitli güvenlik açıkları için kullanılan bir terimdir.

Saldırganlar bu zayıflıklardan yararlanmak için kimlik doğrulama saldırılarından belirli bir kişinin kimlik bilgilerine erişim sağlamayı amaçlayan yüksek hedefli planlara kadar çok çeşitli stratejiler kullanır.

### LAB

Laboratuvar, kullanıcılardan kullanıcı adı ve şifrelerini isteyen bir giriş sayfasından oluşur. Şifreyi bilmiyorsanız, otp(one-time-pad) ile giriş için bir özellik de vardır! Kullanıcılar otp ile giriş özelliğine tıkladığında, kullanıcı otp göndermek için e-posta kimliğini soran bir sayfaya yönlendirilir. Kullanıcı bir e-posta kimliği sağladığında, 3 haneli opt'un sayfanın kendisine geri gönderildiğini görebilirsiniz. Bu genel senaryo değildir, genellikle kod kullanıcının kayıtlı e-postasına gönderilir.  
Kullanıcı 3 haneli kodu aldıktan sonra artık kodu OTP'nizi girin yazan giriş kutusuna girebilir Geçerli OTP'yi girdikten sonra kullanıcı, Login Successful as user : email yazan bir sayfa alır. Eğer OTP yanlışsa, kullanıcı Geçersiz OTP yazan bir mesaj alır.

![Kullanıcı 3 haneli kodu aldıktan sonra artık kodu OTP'nizi girin yazan giriş kutusuna girebilir Geçerli OTP'yi girdikten](./1_qFdtiAX04zdzBl7_E85_vA.webp)

Admin e-posta adresi`admin@pygoat.com` olarak verilmiş. Uygulama arayüzünde OTP ile giriş bölümüne geldiğimizde bu e-postayı yazarak bir OTP kodu aldım. OTP kodu 3 haneli ve herhangi bir kısıtlama captcha vs. yok. Uygulama üzerinde kaba kuvvet ile OTP'i bulabiliriz.

Burp isteğini yakalayıp intrudera atıp buradan bir kaba kuvvet saldırısı yapmayı deneyebiliriz.

![Burp isteğini yakalayıp intrudera atıp buradan bir kaba kuvvet saldırısı yapmayı deneyebiliriz](./1_TmoJ6_qjHN6N7SlDtUe5Cw.webp)

Intruderda otp header değerini seçerek add butonuna tıklıyoruz ve bu değeri payload olacak şekilde işaretliyoruz. Ardından sağ üstte bulunan ikinci sekme olan payload sekmesine geçiyoruz.

![Intruderda otp header değerini seçerek add butonuna tıklıyoruz ve bu değeri payload olacak şekilde işaretliyoruz](./1_1nO5T5g9KjrCm8pf4YuZ6Q.webp)

Payload sekmesinde 111–999 arası tüm değerleri deneyeceğimiz bir payload tanımlıyoruz. Ardından saldırıyı başlatabiliriz. Burp'un community versiyonunda kaba kuvvet saldırı hızları yavaşlatılmıştır. Bunun için biraz uzun sürebilir.

![Payload sekmesinde 111–999 arası tüm değerleri deneyeceğimiz bir payload tanımlıyoruz](./1_p4ge2cHqlrhq1SSXwMgSAg.webp)

Sonuçta length değeri farklı olan istekde OTP'yi bulmuş olacağız.

---

## A8: Software and Data Integrity Failures

Serilizasyon ve Deserilazsyo exploitleri nadiren bir hataya sebep olmadan çalışır. Bazı araçlar deserializasyon kusurlarını keşfedebilir, ancak sorunu doğrulamak için genellikle insan yardımına ihtiyaç duyulur. Tanımlanmasına ve ele alınmasına yardımcı olacak araçlar geliştirildikçe serileştirme kusurlarına ilişkin yaygınlık verilerinin artması beklenmektedir. Bu kusurlar, mümkün olan en ciddi saldırılardan biri olan uzaktan kod yürütme zafiyetlerine yol açabilir.

Serilizasyon, nesneler ve alanları gibi karmaşık veri yapılarını, sıralı bir bayt akışı olarak gönderilip alınabilecek "daha düz" bir biçime dönüştürme işlemidir. Deserilazsyon, bu bayt akışını orijinal nesnenin tamamen işlevsel bir kopyasına, tam olarak serileştirildiği durumdaki haline geri yükleme işlemidir.

Uygulamalar ve API'ler, bir saldırgan tarafından sağlanan zararlı veya tahrif edilmiş nesneleri deserilize edilmesiye savunmasız kalacaktır. Bu durum iki temel saldırı türüyle sonuçlanabilir:

1. Nesne ve veri yapısıyla ilgili saldırılar: Saldırganın uygulama mantığını değiştirdiği ya da uygulamada deserializasyon sırasında veya sonrasında davranışı değiştirebilecek sınıflar varsa keyfi uzaktan kod çalıştırma elde ettiği saldırılar.
2. Mevcut veri yapılarının kullanıldığı ancak içeriğin değiştirildiği erişim kontrolü ile ilgili saldırılar gibi tipik veri manipülasyon saldırıları.

**Serileştirme şu amaçlarla uygulamalarda kullanılabilir:**

* Uzak ve süreçler arası iletişim (RPC/IPC)
* Tel protokolleri, web hizmetleri, mesaj aracıları
* Önbellekleme/Süreklilik
* Veritabanları, önbellek sunucuları, dosya sistemleri
* HTTP çerezleri, HTML form parametreleri, API kimlik doğrulama belirteçleri

### Insecure Deserialization LAB

Lab ortamında yine sadece adminin girevileceği bir sayfa ile karşı karşıyayız. Admin olduğunun doğrulaması nasıl yapılıyor? Bunu araştırmamız lazım.

![Lab ortamında yine sadece adminin girevileceği bir sayfa ile karşı karşıyayız](./1_f3FKpcsOgW_L9m5pNit8RQ.webp)

Sayfaya giden isteği burp ile yakalayalım. Bu istekte cookie bilgisinin base64 encode edildiğini görüyoruz.

![Sayfaya giden isteği burp ile yakalayalım](./1_iRZrBcOzuR164doOB8G6dQ.webp)

Burp Suite'in decoder aracıyla base64 encodelu token değerini decode edebiliriz.

![Burp Suite'in decoder aracıyla base64 encodelu token değerini decode edebiliriz](./1_2gXLtT_iTD0Y68VkYWaSKw.webp)

---

## A9: Security Logging and Monitoring Failures

Uygunsuz günlük kaydı(log) ve izleme neredeyse her büyük siber saldırının temelini oluşturmaktadır. Saldırganlar, tespit edilmeden hedeflerine ulaşmak için izleme ve zamanında müdahale eksikliğine güvenirler.  
Başarılı saldırıların çoğu güvenlik açığı araştırması ile başlar. Bu tür probların devam etmesine izin vermek, başarılı bir istismar olasılığını neredeyse %100'e çıkarabilir.

### LAB

Bu laboratuvar, bazen uygunsuz günlük kaydının bilgi ifşasına nasıl yol açabileceği hakkında bir fikir edinmenize yardımcı olur. Laboratuvara erişen kullanıcıya, günlüklerin sızdırıldığını söyleyen bir giriş sayfası verilir. Kullanıcının sızıntıyı bulması ve günlüklerde sızdırılan kimlik bilgilerini elde etmeye çalışması gerekir.

![Bu laboratuvar, bazen uygunsuz günlük kaydının bilgi ifşasına nasıl yol açabileceği hakkında bir fikir edinmenize yardımcı](./1_D52QViZ-2QoHV1MkEeSY6A.webp)

Sayfaya sıradan bir kullanıcı adı şifre girdiğimde normal olarak hatalı kullanıcı adı veya şifre diye hata dönüyor. Dirb ile bir tarama yaptığımda /debug isminde bir diin keşfettim.

![Sayfaya sıradan bir kullanıcı adı şifre girdiğimde normal olarak hatalı kullanıcı adı veya şifre diye hata dönüyor](./1_Rf867AJeBGAnDM_sCOvPOQ.webp)

/debug dizini üzerinde sistemin tuttuğu loglar görüntülenebiliyor. Bu logların üzerinde a10 sayfasını aratınca ilginç bir log görüyoruz.

![/debug dizini üzerinde sistemin tuttuğu loglar görüntülenebiliyor](./1_H9BTdl1b8IkpVoqIqWhliQ.webp)

Login sayfası GET isteğiyle çalıştığı için oturum açmada kullanılan credentiallar urle yazılmış ve loglara düşmüş. Bu credentiallarla login olabiliriz.

---

## A10: Server-Side Request Forgery

SSRF kusurları, bir web uygulaması kullanıcı tarafından sağlanan URL'yi doğrulamadan uzak bir kaynağı getirdiğinde ortaya çıkar. Bir saldırganın, bir güvenlik duvarı, VPN veya başka bir tür ağ erişim kontrol listesi (ACL) ile korunsa bile, uygulamayı beklenmedik bir hedefe hazırlanmış bir istek göndermeye zorlamasına olanak tanır. Modern web uygulamaları (mikroservis mimarisi) son kullanıcılara kullanışlı özellikler sağladıkça, URL almak yaygın bir senaryo haline gelmektedir. Sonuç olarak, SSRF görülme sıklığı artmaktadır. Ayrıca, bulut hizmetleri ve mimarilerin karmaşıklığı nedeniyle SSRF'nin ciddiyeti daha da artmaktadır.

### LAB

Bu lab ortamı sayfaları bazı blogları gösterir, ancak blogların nasıl sunulduğunu anlayabilir misiniz?

![Bu lab ortamı sayfaları bazı blogları gösterir, ancak blogların nasıl sunulduğunu anlayabilir misiniz?](./1_GdaChpvQ0G435rzb3g8a2g.webp)

Lab ortamında arka planda çalışan kod verilmiş ve bizden env dosyasını bulmamız isteniyor. İsteği burp ile bakıp incelediğimizde

![Lab ortamında arka planda çalışan kod verilmiş ve bizden env dosyasını bulmamız isteniyor](./1_vMxFjxvIZabnGY3Fn47S1w.webp)

blog parametresitle bir dizin verildiği bu dizindeli text dosyasının okunup sayfaya bastırıldığını görüyoruz. Bu değeri manipüle ederek dizindeki istediğimiz dosyayı okuyabiliriz. Bizden a.env dosyasını okumamız istenmiş. Deneme yanılma yoluyla a.env dosyasını arayarak okuyabiliriz.

---

## Kaynaklar

OWASP TOP 10 2021: <https://owasp.org/Top10/>

Web Security Academy: <https://portswigger.net/web-security/>

Mastering Modern Web Penetration Testing
