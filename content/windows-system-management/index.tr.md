---
title: "Windows Sistem Yönetimi Rehberi"
date: '2025-03-09'
description: "Windows sistem yönetimi süreçleri, CMD ve PowerShell komutları, MMC yönetim konsolları, Active Directory yönetim araçları ve WMI altyapısına kapsamlı bir bakış."
draft: false
type: posts
topic: cloud-infrastructure
tags: ["Windows Server", "Active Directory", "Sistem Yönetimi", "PowerShell", "CMD"]
image: featured.webp
featuredImageAlt: "Büyük izleme panellerine sahip sunucu odası kontrol merkezi"
---

Windows Sistem Yönetimi, Windows işletim sistemlerini yönetmeyi içeren bir dizi süreç ve araçtır. Bu süreçler, kullanıcı ve hesap yönetiminden kaynakların optimize edilmesine, güvenlik politikalarının uygulanmasından ağ yapılandırmalarının kontrol edilmesine kadar geniş bir yelpazeyi kapsar. Sistem yöneticileri, Microsoft Management Console (MMC), PowerShell ve Grup İlkesi Yönetimi (GPO) gibi araçları kullanarak sistem performansını izler, sorun giderir ve otomasyon sağlayarak operasyonel verimliliği artırır. Ayrıca, kullanıcıların ve sistem kaynaklarının merkezi veya yerel düzeyde uyum içinde çalışmasını sağlamak için gerekli yapılandırmaları gerçekleştirir. Windows sistem yönetimi, bireysel kullanıcılar ve kurumsal ağların ihtiyaçlarını karşılamak için kritik bir rol oynar.

---

## Command Prompt (CMD) ile Sistem Yönetimi

**Command Prompt (CMD)**, Windows işletim sisteminin komut satırı arayüzüdür ve temel sistem yönetimi işlemleri dahil olmak üzere birçok görevi gerçekleştirmek için kullanılabilir. Otomasyon veya tekrar eden görevler için CMD komutları **BAT dosyası** (veya **Batch dosyası**) içinde toplanabilir. Bu dosyalar `.bat` uzantısına sahiptir ve çift tıklanarak veya CMD üzerinden çalıştırılabilir.

### Sistem ve Donanım Bilgisi Komutları

#### Sistem Bilgilerini Görüntüleme (`systeminfo`)
İşletim sistemi, donanım ve ağ bilgileri gibi detaylı sistem bilgilerini listeler.
```cmd
systeminfo
```

#### İşletim Sistemi Sürümünü Görüntüleme (`ver`)
İşletim sisteminin sürüm ve derleme numarasını gösterir.
```cmd
ver
```

#### Bilgisayar Adını Görüntüleme (`hostname`)
Ağ üzerinde tanımlı yerel bilgisayar adını gösterir.
```cmd
hostname
```

#### Sistem Zamanı ve Tarihi (`time` / `date`)
Sistem saatini ve tarihini görüntüler, yetkili oturumlarda değiştirmeye olanak tanır.
```cmd
time
date
```

#### Komut Ekranını Temizleme (`cls`)
Komut istemcisi penceresindeki önceki çıktıları temizler.
```cmd
cls
```

### Dosya ve Dizin Yönetimi Komutları

#### Dizin İçeriğini Görüntüleme (`dir`)
Bulunulan veya belirtilen dizindeki dosya ve alt dizinlerin adlarını, boyutlarını ve oluşturulma tarihlerini listeler.
```cmd
dir
```

#### Dizin Değiştirme (`cd`)
Dizinler arasında gezinmeyi ve belirtilen hedef klasöre geçiş yapmayı sağlar.
```cmd
cd <hedef_dizin>
```

#### Dosya ve Dizin Kopyalama (`copy`)
Dosya veya dosyaları bir konumdan başka bir konuma kopyalamak için kullanılır.
```cmd
copy <kaynak> <hedef>
```

#### Dosya İçeriğini Ekrana Yazdırma (`type`)
Belirtilen metin dosyasının içeriğini doğrudan terminal ekranına basar.
```cmd
type <dosya_adi>
```

#### Değişken veya Metin Yazdırma (`echo`)
Bir dizeyi veya ortam değişkeninin değerini ekrana yazdırır.
```cmd
echo Merhaba Dunya
```

#### Dosya Silme (`del`)
Belirtilen dosyayı kalıcı olarak siler.
```cmd
del <dosya_adi>
```

#### Dizin Silme (`rmdir`)
Belirtilen boş dizini siler (`/s` anahtarıyla alt dizinleri de kapsar).
```cmd
rmdir <dizin_adi>
```

### Ağ Yapılandırması ve Sorun Giderme Komutları

#### IP Yapılandırmasını Görüntüleme (`ipconfig`)
Ağ bağdaştırıcılarının IP adresi, alt ağ maskesi ve varsayılan ağ geçidi gibi bilgilerini listeler.
```cmd
ipconfig
```

#### DNS Önbelleğini Temizleme (`ipconfig /flushdns`)
Yerel DNS çözümleyici önbelleğini boşaltarak alan adı çözünürlük sorunlarını giderir.
```cmd
ipconfig /flushdns
```

#### Ağ Bağlantılarını Test Etme (`ping`)
Belirtilen IP adresine veya etki alanına ICMP paketleri göndererek erişilebilirliği ve gecikmeyi test eder.
```cmd
ping <hedef_adres>
```

#### Ağ Yönlendirme Tablosu (`route print`)
Sistemin yerel IP yönlendirme tablosunu ve aktif ağ arabirimlerini görüntüler.
```cmd
route print
```

#### Ağ Paylaşımlarını Listeleme (`net share`)
Yerel sistemde ağ üzerinden paylaşıma açılmış tüm kaynakları listeler.
```cmd
net share
```

### Süreç, Hizmet ve Güç Yönetimi Komutları

#### Çalışan Görevleri Listeleme (`tasklist`)
Sistemde o anda çalışan tüm süreçlerin adlarını, PID numaralarını ve bellek kullanımlarını listeler.
```cmd
tasklist
```

#### Görevi Sonlandırma (`taskkill`)
Belirtilen işlem kimliğine (PID) veya dosya adına sahip süreci zorla sonlandırır.
```cmd
taskkill /pid <surec_id> /f
```

#### Sistem Hizmetlerini Yönetme (`sc`)
Windows arka plan hizmetlerini başlatır, durdurur veya yapılandırır.
```cmd
sc start <hizmet_adi>
sc stop <hizmet_adi>
```

#### Sistemi Kapatma ve Yeniden Başlatma (`shutdown`)
Bilgisayarı belirlenen süre parametreleriyle kapatır veya yeniden başlatır.
```cmd
shutdown /s /t 0
shutdown /r /t 0
```

#### Güç Seçeneklerini Yönetme (`powercfg`)
Sistemdeki aktif ve mevcut güç planlarını yapılandırır ve listeler.
```cmd
powercfg /list
```

### Disk Yönetimi ve Dosya Sistemi Denetimi

#### Disk Bölümlerini Yönetme (`diskpart`)
Gelişmiş komut satırı disk yönetim aracını başlatır ve birimleri listeler.
```cmd
diskpart
list volume
```

#### Disk Temizleme Aracı (`cleanmgr`)
Geçici dosyaları ve sistem artıklarını temizlemek için disk temizleme yardımcı programını başlatır.
```cmd
cleanmgr
```

#### Disk Denetimi ve Onarımı (`chkdsk`)
Dosya sistemindeki mantıksal ve fiziksel hataları denetler ve onarır.
```cmd
chkdsk C: /f
```

### Yerel Kullanıcı ve Grup Yönetimi

#### Kullanıcı Hesaplarını Yönetme (`net user`)
Yerel kullanıcı hesaplarını listeler, yeni hesap oluşturur veya mevcut hesabı kaldırır.
```cmd
net user
net user <kullanici_adi> <sifre> /add
net user <kullanici_adi> /delete
```

#### Yerel Grupları Görüntüleme (`net localgroup`)
Yerel kullanıcı gruplarını ve bu gruplara atanmış üyeleri listeler.
```cmd
net localgroup
```

---

## Microsoft Management Console (MMC) Yönetim Konsolları

Windows işletim sisteminde sistem yönetimini, donanım kontrolünü ve güvenlik politikalarını merkezi bir arayüzden yapılandırmak için Microsoft Management Console bileşenleri kullanılır. **MSC**, MMC konsol dosyalarının uzantısıdır. Bu dosyalar `Win + R` (Çalıştır) penceresine yazılarak doğrudan açılabilir.

### Temel Sistem ve Donanım Konsolları

#### Bilgisayar Yönetimi (`compmgmt.msc`)
Sistem kaynaklarını ve hizmetlerini bir arada yönetmeyi sağlayan ana kontrol panelidir. Üç ana bölüm içerir: Sistem Araçları (Olay Görüntüleyici, Aygıt Yöneticisi, Paylaşılan Klasörler), Depolama (Disk Yönetimi) ve Hizmetler.

![Bilgisayar Yönetimi: compmgmt.msc](./1_MpU8TSbaM6qR2u2-ihXfqg.webp)

![Bilgisayar Yönetimi: compmgmt.msc (2)](./1_qYkUr1fgV87iFe6utqzSdA.webp)

#### Aygıt Yöneticisi (`devmgmt.msc`)
Bilgisayarda bulunan donanım aygıtlarını görüntülemeyi ve sürücülerini güncellemeyi, devre dışı bırakmayı veya kaldırmayı sağlar. Hatalı aygıtlar sarı uyarı simgesiyle gösterilir.

![Aygıt Yöneticisi: devmgmt.msc](./1_-9-W8H4OOTMvEsRMj-Hqdw.webp)

![Aygıt Yöneticisi: devmgmt.msc (2)](./1_7w5iLQ5wGIt1r8PDdJxh9A.webp)

#### Disk Yönetimi (`diskmgmt.msc`)
Sabit disklerin ve depolama birimlerinin bölümleme, biçimlendirme, birim küçültme/genişletme ve sürücü harfi atama işlemlerini yürütür.

![Disk Yönetimi: diskmgmt.msc](./1_R4PceSSdAKcNpyGNmeTdkw.webp)

![Disk Yönetimi: diskmgmt.msc (2)](./1_eBTghtHiVBRBsAQj8f8e_w.webp)

#### Hizmetler (`services.msc`)
Windows arka planında çalışan tüm hizmetlerin başlangıç türlerini (Otomatik, Manuel, Devre Dışı) düzenlemeyi ve hizmetleri anlık durdurup başlatmayı sağlar.

![Hizmetler: services.msc](./1_0KIsamFvchIgkx-NituRgg.webp)

![Hizmetler: services.msc (2)](./1_6uv3dpx_XipXh_qbq01PFg.webp)

#### Olay Görüntüleyici (`eventvwr.msc`)
Sistem, güvenlik ve uygulama log kayıtlarını (Windows Event Logs) inceleyerek hataları, uyarıları ve güvenlik ihlallerini teşhis etmek için kullanılır.

![Olay Görüntüleyici: eventvwr.msc](./1_ULhrQ5wKEn3HO73IVquJtw.webp)

![Olay Görüntüleyici: eventvwr.msc (2)](./1_N8gONxQA7kwwBszjUEvAWg.webp)

#### Performans İzleyicisi (`perfmon.msc`)
CPU, bellek, disk ve ağ kaynaklarının anlık kullanımını ve geçmiş performans verilerini özel sayaçlarla izlemeyi sağlar.

![Performans İzleyicisi: perfmon.msc](./1_drGVabk1_JuCxoBQLN9ldw.webp)

![Performans İzleyicisi: perfmon.msc (2)](./1_PkQsxpMaGI2TSQDpb9R8wQ.webp)

#### Görev Zamanlayıcı (`taskschd.msc`)
Belirli saatlerde veya sistem olayları gerçekleştiğinde betiklerin ve programların otomatik çalıştırılmasını planlar.

![Görev Zamanlayıcı: taskschd.msc](./1_aw0BmV1O3rpNqEEpvbv07Q.webp)

![Görev Zamanlayıcı: taskschd.msc (2)](./1_771nW9DentMsT-0R_XxE2w.webp)

### Güvenlik, Politika ve Paylaşım Konsolları

#### Yerel Güvenlik İlkesi (`secpol.msc`)
Hesap politikaları (parola karmaşıklığı), denetim kuralları ve kullanıcı hakları atamalarını yerel makine düzeyinde yapılandırır.

![Yerel Güvenlik İlkesi: secpol.msc](./1_eQz3psGx6dDTuQOk0rRyCA.webp)

![Yerel Güvenlik İlkesi: secpol.msc (2)](./1_l3kApq4SYaZ7M-8L5KQVKg.webp)

#### Yerel Grup İlkesi Düzenleyicisi (`gpedit.msc`)
Kullanıcı ve bilgisayar yapılandırmalarını kapsayan kuralları, yazılım kısıtlamalarını ve ağ ayarlarını merkezi olarak düzenler (Windows Pro ve Enterprise sürümlerinde bulunur).

![Yerel Grup İlkesi Düzenleyicisi: gpedit.msc](./1_dQsN3KsDl549381FOo6nDA.webp)

![Yerel Grup İlkesi Düzenleyicisi: gpedit.msc (2)](./1_XETMBSBOzK7D4tqp1o8mrQ.webp)

#### Yerel Kullanıcılar ve Gruplar (`lusrmgr.msc`)
Bilgisayardaki yerel hesapları, grup üyeliklerini ve erişim kısıtlamalarını yönetir.

![Yerel Kullanıcılar ve Gruplar: lusrmgr.msc](./1_Ph4cBMvCzWWC8F4wSrBKMA.webp)

![Yerel Kullanıcılar ve Gruplar: lusrmgr.msc (2)](./1_PpzC4VflE9EQfpHgFzywDA.webp)

#### Windows Defender Güvenlik Duvarı (`wf.msc`)
Gelen ve giden ağ trafiği için detaylı port, IP ve uygulama bazlı gelişmiş güvenlik duvarı kuralları tanımlar.

![Windows Defender Güvenlik Duvarı ile Gelişmiş Güvenlik](./1_XejYGc58spUFIjCG_1iN2A.webp)

![Windows Defender Güvenlik Duvarı](./1_ChA1HxpNqJ7ucgVk_cA-mw.webp)

#### Paylaşılan Klasörler (`fsmgmt.msc`)
Ağda paylaşıma açılan klasörleri, aktif kullanıcı oturumlarını ve açık dosyaları denetler.

![Paylaşılan Klasörler: fsmgmt.msc](./1_1_05HPAMwCvgzwqHjRKYKw.webp)

![Paylaşılan Klasörler: fsmgmt.msc (2)](./1_weE9YAJ7nRYtMRsPpYRszw.webp)

#### Yerel Sertifika Yönetimi (`certlm.msc`)
Bilgisayarda yüklü olan dijital sertifikaları, güvenilir kök otoritelerini ve şifreleme anahtarlarını yönetir.

![Sertifika Yönetimi: certlm.msc](./1_cijWlhOxGxjRqXHwSebeOQ.webp)

![Sertifika Yönetimi: certlm.msc (2)](./1_4kxWFhlcjgX6STpedTFqDA.webp)

### Kurumsal ve Ağ Hizmetleri Konsolları

#### Yazdırma Yönetimi (`printmanagement.msc`)
Ağ ve yerel yazıcılarını, yazdırma kuyruklarını ve sürücülerini tek bir arayüzden yönetir.

![Yazdırma Yönetimi: printmanagement.msc](./1_MTSqO1OEapX1hDEQ_s7QuA.webp)

![Yazdırma Yönetimi: printmanagement.msc (2)](./1_HmtdMCPwr-n95OLQwRQFNg.webp)

#### Uzak Masaüstü Hizmetleri Yöneticisi (`tsadmin.msc`)
Terminal Server oturumlarını izlemek ve yönetmek için kullanılan eski nesil yönetim aracıdır.

![Uzak Masaüstü Hizmetleri Yöneticisi: tsadmin.msc](./1_kO1BtfC5frTaF-qbfuBCaQ.webp)

![Uzak Masaüstü Hizmetleri Yöneticisi: tsadmin.msc (2)](./1_BPLbsJAB4eySqgSpwwG3uw.webp)

#### Yetkilendirme Yöneticisi (`azman.msc`)
.NET uygulamaları için rol tabanlı erişim kontrolü (RBAC) sağlayan yönetim aracıdır.

![Yetkilendirme Yöneticisi: azman.msc](./1_5ycPzQAAhzh_4Ut2SLA1Ow.webp)

![Yetkilendirme Yöneticisi: azman.msc (2)](./1_tPmIFI6iET881lNc83L8EQ.webp)

#### Bileşen Hizmetleri (`comexp.msc`)
COM+ uygulamalarını, dağıtık işlemleri (DTC) ve sistem bileşen yapılandırmalarını yönetir.

![Bileşen Hizmetleri: comexp.msc](./1_q5vZ5cZncnQHSTB3ADbqzg.webp)

![Bileşen Hizmetleri: comexp.msc (2)](./1_pIdbGHCOEizkpzvXjro0aA.webp)

---

## Çalıştır (Win+R) Hızlı Başvuru Tabloları

Yukarıdaki araçların çoğu doğrudan **Çalıştır** penceresinden (`Win + R`) açılabilir. Aşağıdaki tablolar, ezberlemeye değer kısayolları amaçlarına göre gruplar.

### Yönetim Konsolları (MMC)

| Komut | Açtığı Araç / Yaptığı İş |
| :--- | :--- |
| `eventvwr.msc` | Olay Görüntüleyicisi |
| `devmgmt.msc` | Aygıt Yöneticisi |
| `compmgmt.msc` | Bilgisayar Yönetimi |
| `diskmgmt.msc` | Disk Yönetimi |
| `perfmon.msc` | Performans İzleyicisi |
| `resmon` | Kaynak İzleyicisi |
| `secpol.msc` | Yerel Güvenlik İlkesi |
| `gpedit.msc` | Yerel Grup İlkesi Düzenleyicisi |
| `lusrmgr.msc` | Yerel Kullanıcılar ve Gruplar |
| `services.msc` | Hizmetler |
| `taskschd.msc` | Görev Zamanlayıcı |
| `certlm.msc` | Sertifikalar (Yerel Bilgisayar) |
| `certmgr.msc` | Sertifikalar (Geçerli Kullanıcı) |
| `fsmgmt.msc` | Paylaşılan Klasörler |
| `wf.msc` | Gelişmiş Güvenlik Özellikli Windows Defender Güvenlik Duvarı |
| `printmanagement.msc` | Yazdırma Yönetimi |

### Sistem Ayarları (Denetim Masası Öğeleri)

| Komut | Açtığı Araç / Yaptığı İş |
| :--- | :--- |
| `control` | Denetim Masası |
| `control admintools` | Yönetimsel Araçlar |
| `sysdm.cpl` | Sistem Özellikleri (Ortam değişkenleri, bilgisayar adı vb.) |
| `ncpa.cpl` | Ağ Bağlantıları (Ağ bağdaştırıcıları listesi) |
| `firewall.cpl` | Windows Defender Güvenlik Duvarı |
| `appwiz.cpl` | Programlar ve Özellikler (Yazılım kaldır/değiştir) |
| `powercfg.cpl` | Güç Seçenekleri |
| `timedate.cpl` | Tarih ve Saat Ayarları |
| `intl.cpl` | Bölge ve Dil Ayarları |
| `main.cpl` | Fare Özellikleri |
| `mmsys.cpl` | Ses Ayarları |
| `inetcpl.cpl` | İnternet Özellikleri |
| `desk.cpl` | Ekran Çözünürlüğü / Ayarları |

### Tanılama ve Bakım

| Komut | Açtığı Araç / Yaptığı İş |
| :--- | :--- |
| `msconfig` | Sistem Yapılandırması (Başlangıç ve önyükleme ayarları) |
| `taskmgr` | Görev Yöneticisi |
| `dxdiag` | DirectX Tanı Aracı |
| `cleanmgr` | Disk Temizleme |
| `dfrgui` | Sürücüleri İyileştir / Disk Birleştiricisi |
| `regedit` | Kayıt Defteri Düzenleyicisi |
| `charmap` | Karakter Eşlem |
| `snippingtool` | Ekran Alıntısı Aracı |
| `magnify` | Büyüteç |
| `osk` | Ekran Klavyesi |

### Komut Satırı ve Ağ

| Komut | Açtığı Araç / Yaptığı İş |
| :--- | :--- |
| `cmd` | Komut İstemi |
| `powershell` | Windows PowerShell |
| `powershell_ise` | PowerShell ISE |
| `mstsc` | Uzak Masaüstü Bağlantısı (RDP) |
| `calc` | Hesap Makinesi |
| `notepad` | Not Defteri |
| `msinfo32` | Sistem Bilgisi |
| `winver` | Windows Sürümü Bilgisi |

---

## Active Directory Yönetim Araçları (ADAT)

Windows Active Directory Administrative Tools (ADAT), kurumsal Active Directory (AD) ortamını yönetmek ve yapılandırmak için kullanılan merkezi araçlardır.

![Windows Active Directory Administrative Tools (ADAT), bir Active Directory (AD) ortamını yönetmek ve yapılandırmak için](./1_KUc3xyohoMX461oMMITE7g.webp)

### Active Directory Users and Computers (ADUC)
Kullanıcı hesaplarını, bilgisayarları, güvenlik gruplarını ve organizasyonel birimleri (OU) yönetmek için kullanılır. Yöneticiler yeni kullanıcılar oluşturabilir, parola politikaları uygulayabilir ve nesneleri OU'lar arasında organize edebilir.

![Microsoft'un Active Directory hizmeti içinde, kullanıcı hesaplarını, bilgisayarları, grupları ve organizasyon birimlerini](./1_K_zUm1r0QVCnLQgnDwczLA.webp)

### Active Directory Domains and Trusts
Etki alanları (domain) ve ormanlar (forest) arasındaki tek yönlü veya çift yönlü güven ilişkilerini yapılandırır. Etki alanı işlevsel düzeyinin (Functional Level) yükseltilmesi de bu araç üzerinden yönetilir.

![Microsoft'un Active Directory hizmeti içinde, etki alanları (domain) arasındaki güven ilişkilerini yönetmek için kullanılır](./1_QDVkcGG3felLhq9GADjBeA.webp)

### Active Directory Sites and Services
Active Directory replikasyon topolojisini optimize etmek için fiziksel siteleri, IP alt ağlarını (subnets) ve site bağlantılarını (site links) yapılandırır.

![AD'nin fiziksel topolojisini yönetmek için kullanılır](./1_eFJ89GnmWgGiAWAFvMmwsQ.webp)

### Active Directory Administrative Center (ADAC)
PowerShell geçmişi gösteren, parola politikalarını (Fine-Grained Password Policies) ve Active Directory Geri Dönüşüm Kutusunu (Recycle Bin) destekleyen modern grafik yönetim arayüzüdür.

![AD nesnelerini yönetmek için daha modern bir arayüz sunar](./1_gVvHgx857TBhTzD6NmW7jQ.webp)

### Group Policy Management Console (GPMC)
Tüm etki alanı genelinde bilgisayar ve kullanıcı bazlı güvenlik, denetim ve yazılım dağıtım politikalarını (GPO) merkezi olarak oluşturur ve bağlar.

![Grup Politikalarını (Group Policy) yönetmek için kullanılır](./1_xbLyZ5DCZebIw1hn2NsiVw.webp)

### Active Directory Module for Windows PowerShell
Active Directory yönetimini komut satırı ve betik düzeyine taşır. `Get-ADUser`, `New-ADGroup`, `Set-ADAccountPassword` gibi cmdlet'ler ile toplu kullanıcı işlemleri ve rutin yönetim görevleri otomatikleştirilir.

![AD yönetim işlemlerini komut satırı üzerinden gerçekleştirmek için kullanılır](./1_26CfeO0LwUnxTiVbXoBOxg.webp)

---

## Windows Management Instrumentation (WMI)

**Windows Management Instrumentation (WMI)**, Microsoft'un Windows tabanlı işletim sistemlerinde sistem yönetimi ve veri erişimi için geliştirdiği bir altyapıdır.

WMI, sistem yöneticilerine aşağıdaki işlemleri yapma imkanı sağlar:

* Sistem bilgilerini sorgulama (işlemci, bellek, disk kullanımı vb.).
* Arka plan hizmetlerini başlatma, durdurma veya yeniden başlatma.
* Olayları izleme ve yönetme (WMI Event Consumers ile tetiklenen otomasyonlar).
* Uzak bilgisayarları ağ üzerinden sorgulama ve yönetme.

WMI, **WMI Provider'lar** aracılığıyla çalışır. Bu sağlayıcılar, donanım, yazılım ve işletim sistemi bileşenleri hakkında bilgi toplar ve bu bilgileri **WMI Query Language (WQL)** ile sorgulanabilir hale getirir.

![WMI, WMI Provider'lar aracılığıyla çalışır](./1_8Uxx0e4xpvHQA5JVh43iIQ.webp)

### WMI Erişim Yöntemleri ve Örnekleri

#### PowerShell ile WMI Sorgulama
PowerShell, komut satırı ve betik desteğiyle WMI nesnelerine erişmek için ideal ortamdır:
```powershell
Get-WmiObject -Class Win32_Processor
```

#### VBScript ile WMI Sorgulama
Görev otomasyonu için klasik Windows ortamlarında kullanılan hafif betik yaklaşımıdır:
```vbscript
strComputer = "."  
Set objWMIService = GetObject("winmgmts:\\" & strComputer & "\root\cimv2")  
Set colDisks = objWMIService.ExecQuery("SELECT * FROM Win32_DiskDrive")  
For Each objDisk in colDisks  
    WScript.Echo "DeviceID: " & objDisk.DeviceID  
Next
```

#### .NET ile WMI Entegrasyonu
Kurumsal yazılımlarda `System.Management` isim alanı kullanılarak WMI sınıfları programatik olarak sorgulanabilir:
```csharp
using System.Management;  
  
ManagementObjectSearcher searcher = new ManagementObjectSearcher("SELECT * FROM Win32_Processor");
```

#### WMIC (Command-Line) Aracı
Komut istemcisi üzerinden doğrudan WMI verisine erişim sağlar:
```cmd
wmic cpu get name
```

---

## Bulut Kimlik Yönetimi: Azure Active Directory (Entra ID)

**Azure Active Directory (Azure AD / Microsoft Entra ID)**, Microsoft'un bulut tabanlı kimlik ve erişim yönetimi çözümüdür. Şirket içi Active Directory ile entegre çalışarak hibrit kimlik mimarisini destekler.

* **Bulut ve Hibrit Entegrasyon:** Şirket içi Active Directory ile senkronize olarak hem bulut hem de yerel kaynaklara kesintisiz erişim sunar.
* **Zero Trust Güvenlik Modeli:** Her erişim isteğini doğrular, kimlik ve cihaz sağlığını denetler ve en az ayrıcalık (Least Privilege) ilkesini uygular.
* **Koşullu Erişim (Conditional Access):** Kullanıcı konumu, cihaz uyumluluğu ve risk skoruna göre çok faktörlü kimlik doğrulama (MFA) veya erişim engelleme uygular.
* **Kimlik Koruması (Identity Protection):** Yapay zekâ analizleriyle şüpheli oturum açma girişimlerini ve kimlik hırsızlığını tespit eder.
* **Uç Nokta Yönetimi:** Microsoft Intune ile entegre çalışarak mobil cihazların ve uzaktan çalışan sistemlerin merkezi denetimini sağlar.

![Microsoft'un bulut tabanlı kimlik ve erişim yönetimi çözümüdür](./1_pqT3BvT-gibeMBhl0SiIFg.webp)

Azure AD ekosistemine kurumsal hesabınızla <https://portal.azure.com> adresinden erişebilir ve yönetim süreçlerini bulut konsolu üzerinden yürütebilirsiniz.
