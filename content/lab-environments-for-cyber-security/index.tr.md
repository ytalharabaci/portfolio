---
title: Siber Güvenlik için İşletim Sistemi Dağıtımları ve Lab Ortamları
description: Sızma testi, dijital adli tıp (DFIR), zararlı yazılım analizi, gizlilik dağıtımları ve Active Directory saldırı simülasyon lab ortamlarına (GOAD, DetectionLab, Attack Range) kapsamlı bakış.
date: 2024-12-02
draft: false
type: posts
topic: detection-response
tags:
  - Home Lab
  - Virtualization
  - Kali Linux
  - Parrot OS
  - BackBox
  - Penetration Testing
featured: false
image: featured.webp
featuredImageAlt: Sunucu, kilitli bir monitör ve test ekipmanlarından oluşan izometrik laboratuvar düzeni
---

Merhaba bu yazımda siber güvenlik alanında sk kullanılan dağıtımlardan ve lab ortamlarından bahsedeceğim.

---

## Sızma Testi Dağıtımları

Genel olarak ofansif tarafta ve pentest amaçlı dağıtımlara bakalım.

#### [Kali Linux](https://www.kali.org/)

Kali Linux, siber güvenlik ve etik hackerlar için özel olarak tasarlanmış bir Linux dağıtımıdır. Penetrasyon testleri, bilgisayar adli tıp incelemeleri ve güvenlik araştırmaları için kullanılır. Kali Linux, önceden yüklenmiş birçok güvenlik aracı ile gelir ve bu sayede kullanıcılar güvenlik açıklarını tespit etmek ve gidermek için gerekli olan araçları kolayca kullanabilirler.

![Kali Linux, siber güvenlik ve etik hackerlar için özel olarak tasarlanmış bir Linux dağıtımıdır](1_6kVOdYfemK90uvdQMWa_Mg.webp)

Kali Linux

Özellikle sızma testleri ve güvenlik araştırmaları yaparken çok değerli bir platform sağlar.

#### [ParrotOS](https://www.parrotsec.org/)

ParrotOS, bilgi güvenliği, geliştirici araçları ve kişisel veri koruması için tasarlanmış bir başka Linux dağıtımıdır. Kali Linux gibi, ParrotOS da siber güvenlik ve penetrasyon testleri için kullanılan birçok araçla birlikte gelir. Ancak ParrotOS, ayrıca gelişmiş kodlama ve yazılım geliştirme araçları da sunarak, hem güvenlik profesyonelleri hem de geliştiriciler için uygun hale gelmiştir.

![ParrotOS, bilgi güvenliği, geliştirici araçları ve kişisel veri koruması için tasarlanmış bir başka Linux dağıtımıdır](1_9pRFLbO4beEU8Hu6nZD-0A.webp)

ParrotOS

ParrotOS, daha hafif ve kullanıcı dostu bir arayüz sunar. Bu, onu düşük donanım özelliklerine sahip cihazlarda bile rahatça kullanılabilir kılar. Aynı zamanda gizlilik ve anonimlik üzerine odaklanan özellikler içerir, bu nedenle çevrimiçi gizliliğe önem veren kullanıcılar tarafından da tercih edilebilir.

#### [BackBox](https://www.backbox.org/)

BackBox, siber güvenlik uzmanları ve penetrasyon testi profesyonelleri için tasarlanmış bir Linux dağıtımıdır. Ubuntu tabanlı olan BackBox, sızma testleri, güvenlik değerlendirmeleri ve ağ analizleri için çeşitli açık kaynak araçları içerir. Kullanıcı dostu bir arayüze ve gelişmiş özelleştirme seçeneklerine sahip olan BackBox, özellikle güvenlik analizleri yapmak isteyen kullanıcılar için idealdir.

![BackBox, siber güvenlik uzmanları ve penetrasyon testi profesyonelleri için tasarlanmış bir Linux dağıtımıdır](1_tWO6fvwh67LLnG4-8zo4Sw.webp)

BackBox

#### [SamuraiWTF](https://www.samurai-wtf.org/)

SamuraiWTF (Web Training Framework), uygulama güvenliği eğitimi için tasarlanmış bir Linux masaüstü dağıtımıdır. OWASP (Open Web Application Security Project) tarafından geliştirilmiştir ve web uygulama test araçlarını içeren bir eğitim ortamı sağlar. Bu dağıtım, önceden yapılandırılmış sanal makineler olarak sunulur ve çeşitli güvenlik araçları ile birlikte gelir.

![SamuraiWTF (Web Training Framework), uygulama güvenliği eğitimi için tasarlanmış bir Linux masaüstü dağıtımıdır](1_tPPLOSp8K5ltCgS6iENnUQ.webp)

SamuraiWTF

SamuraiWTF, özellikle web uygulama güvenliği testleri ve eğitimleri için kullanılır. İçerisinde OWASP Juice Shop, OWASP Zed Attack Proxy (ZAP) ve SQLMap gibi popüler araçlar bulunur. Ayrıca, PortSwigger’ın Burp Suite Community Edition gibi bazı tescilli yazılımlar da içerir.

#### [ArchStrike](https://archstrike.org/)

ArchStrike, Arch Linux tabanlı güvenlik odaklı bir Linux dağıtımıdır. Bu dağıtım, siber güvenlik profesyonelleri ve meraklıları için tasarlanmıştır ve OWASP (Open Web Application Security Project) gibi güvenlik araçlarını içerir. ArchStrike, Arch Linux’in “Arch Way” prensiplerine uygun olarak tasarlanmıştır ve i686, x86\_64, ARMv6, ARMv7 ve ARMv8 mimarileri için optimize edilmiştir.

![ArchStrike, Arch Linux tabanlı güvenlik odaklı bir Linux dağıtımıdır](1_CS2ETH60l6zAyrIgDk5ODQ.webp)

ArchStrike

#### [BlackArch](https://www.blackarch.org/)

BlackArch, Arch Linux tabanlı bir siber güvenlik ve penetrasyon testi dağıtımıdır. Bu dağıtım, siber güvenlik profesyonelleri ve araştırmacılar için tasarlanmıştır ve OWASP (Open Web Application Security Project) gibi güvenlik araçlarını içerir. BlackArch, geniş bir araç yelpazesi sunar ve sadece siber güvenlik testleri için değil, genel güvenlik araştırmaları için de kullanılabilir.

![BlackArch, Arch Linux tabanlı bir siber güvenlik ve penetrasyon testi dağıtımıdır](1_f5Q5KSaKKmMTupUyBMSeqw.webp)

BlackArch

BlackArch, Arch Linux’in “Arch Way” prensiplerine uygun olarak tasarlanmıştır ve i686, x86\_64, ARMv6, ARMv7 ve ARMv8 mimarileri için optimize edilmiştir. Ayrıca, BlackArch’un tam ISO’su ve Slim ISO’su farklı kullanıcı deneyimleri sunar.

#### [Fedora Security Spin](https://fedoraproject.org/wiki/Security_Lab)

**Fedora Security Spin**, Fedora Linux’un özel bir sürümüdür ve bilgi güvenliği, sızma testleri, forensik analizler ve güvenlik eğitimleri için optimize edilmiştir. Bu spin, önceden yüklenmiş birçok güvenlik aracıyla birlikte gelir ve kullanıcılara kapsamlı bir güvenlik test ortamı sunar. Xfce masaüstü ortamını kullanarak, düşük kaynaklı sistemlerde bile rahatça çalışabilir.

![Fedora Security Spin, Fedora Linux’un özel bir sürümüdür ve bilgi güvenliği, sızma testleri, forensik analizler ve güvenlik](1_0MuE03ZAT1L5AegUaxdrQw.webp)

Fedora Security Spin

#### [Pentoo Linux](https://pentoo.org/)

Pentoo Linux, siber güvenlik ve penetrasyon testleri için tasarlanmış bir Linux dağıtımıdır. Gentoo Linux tabanlı olan Pentoo, sızma testleri ve güvenlik değerlendirmeleri için birçok araç ve yazılım içerir. Pentoo, hem 32 bit hem de 64 bit sistemlerde çalışabilir ve canlı CD veya USB üzerinden kullanılabilir.

![Pentoo Linux, siber güvenlik ve penetrasyon testleri için tasarlanmış bir Linux dağıtımıdır](1_2a-FUAUE-IgWrgQu4IY4GA.webp)

Pentoo Linux

Pentoo Linux, özellikle siber güvenlik uzmanları ve araştırmacılar için ideal bir platformdır. 

---

## Adli Bilişim Dağıtımları

Genel olarak defansif tarafta ve adli bilişim amaçlı dağıtımlara bakalım.

#### [Tsurugi Linux](https://tsurugi-linux.org/)

Tsurugi Linux, dijital adli tıp (DFIR) ve OSINT (Open Source Intelligence) araştırmaları için özel olarak tasarlanmış bir Linux dağıtımıdır. Bu dağıtım, Ubuntu 22.04.3 LTS tabanlıdır ve özelleştirilmiş bir 6.9.3çekirdeği kullanır. Tsurugi Linux, malware analizi, olaylara müdahale ve dijital kanıt toplama gibi görevler için kullanılabilir.

![Tsurugi Linux, dijital adli tıp (DFIR) ve OSINT (Open Source Intelligence) araştırmaları için özel olarak tasarlanmış bir](1_WcOK1Za6fFtqHVcwOZFj5w.webp)

[Tsurugi Linux](https://tsurugi-linux.org/)

Tsurugi Linux, özellikle dijital adli tıp ve OSINT araştırmaları yapmak isteyenler için ideal bir platformdır.

#### [Santoku Linux](https://github.com/santoku/Santoku-Linux)

Santoku Linux, mobil güvenlik, malware analizi ve dijital adli tıp (DFIR) araştırmaları için tasarlanmış bir Linux dağıtımıdır. Bu dağıtım, Android ve iOS gibi mobil platformlar üzerinde çalışan güvenlik araçlarını içerir ve kullanıcı dostu bir arayüze sahiptir. Santoku Linux, canlı CD veya USB üzerinden çalıştırılabilir ve sabit diske kurulamadan kullanılabilir.

![Santoku Linux, mobil güvenlik, malware analizi ve dijital adli tıp (DFIR) araştırmaları için tasarlanmış bir Linux](1_3NOMJEWXqqvokNUrrTr62w.webp)

Santoku Linux

Santoku Linux, özellikle mobil güvenlik ve dijital adli tıp araştırmaları yapmak isteyenler için ideal bir platformdır.

#### CAINE Linux

CAINE Linux (Computer Aided Investigative Environment), Giovanni “Nanni” Bassetti tarafından geliştirilen bir İtalyan Linux dağıtımıdır. CAINE, dijital adli tıp (DFIR) ve olaylara müdahale (Incident Response) için tasarlanmıştır. Bu dağıtım, veri koruma, toplama, inceleme ve analiz gibi dijital adli tıp süreçlerini gerçekleştirmek için gereken tüm araçları bir araya getirir.

![CAINE Linux (Computer Aided Investigative Environment), Giovanni “Nanni” Bassetti tarafından geliştirilen bir İtalyan Linux](1_QQluwIM94H2dUgXH6TR8WA.webp)

CAINE Linux

CAINE Linux, dijital adli tıp uzmanları için güçlü bir araçtır.

#### [REMnux](https://docs.remnux.org/)

REMnux (Reverse Engineering Malware Linux), kötü amaçlı yazılımların analizine ve tersine mühendislikine yönelik bir Linux dağıtımıdır. Bu dağıtım, kötü amaçlı yazılımları incelemek ve analiz etmek için önceden yüklenmiş birçok araç ve yazılım içerir. REMnux, özellikle güvenlik uzmanları ve araştırmacılar için ideal bir platformdır.

![REMnux (Reverse Engineering Malware Linux), kötü amaçlı yazılımların analizine ve tersine mühendislikine yönelik bir Linux](1_dQk2J0VsBRiE0r_NXB_vCA.webp)

REMnux

REMnux, kötü amaçlı yazılımların analizinde ve güvenlik araştırmalarında kullanılan güçlü bir araçtır. 

#### [FLAREVM](https://github.com/mandiant/flare-vm)

FLAREVM (FireEye Labs Reverse Engineering VM), FireEye tarafından geliştirilen ve Windows tabanlı bir tersine mühendislik ve zararlı yazılım analizi için kullanılan bir sanal makine dağıtımıdır. FLARE VM, birçok popüler güvenlik aracını ve yazılımını içerir ve kullanıcıların tersine mühendislik ve malware analizi yapmalarına yardımcı olur.

![FLAREVM (FireEye Labs Reverse Engineering VM), FireEye tarafından geliştirilen ve Windows tabanlı bir tersine mühendislik ve](1_h14mVtflvvT08Rbz52ZQiA.webp)

FLAREVM

FLARE VM, güvenlik uzmanları ve araştırmacılar için güçlü bir araçtır. 

#### [Security Onion](https://securityonionsolutions.com/)

Security Onion, bir ağ güvenliği ve olay izleme platformudur. Bu platform, ağ trafiğini izlemek, tehditleri tespit etmek ve güvenlik olaylarına yanıt vermek için kullanılır. Security Onion, Elasticsearch, Logstash, Kibana (ELK Stack) gibi araçlarla birlikte gelir ve Snort, Suricata, Bro, Wazuh, Sguil, Squert, CyberChef, NetworkMiner gibi birçok güvenlik aracını içerir.

![Security Onion, bir ağ güvenliği ve olay izleme platformudur](1_TvipQFtDzN0-MiAj55ypdw.webp)

Security Onion

Security Onion, özellikle büyük ölçekli ağlarda güvenlik izleme ve tehdit analizi yapmak isteyenler için ideal bir platformdır.

#### [CSI Linux](https://csilinux.com/)

CSI Linux, dijital adli tıp (DFIR) ve siber güvenlik araştırmaları için tasarlanmış bir Linux dağıtımıdır. CSI Linux, önceden yüklenmiş birçok araç ve yazılım ile birlikte gelir ve kullanıcıların dijital kanıt toplama, malware analizi ve ağ araştırmaları gibi görevleri gerçekleştirmelerine yardımcı olur.

![CSI Linux, dijital adli tıp (DFIR) ve siber güvenlik araştırmaları için tasarlanmış bir Linux dağıtımıdır](1_Ls3qjzmN_MJbJ9WGpDJyFw.webp)

CSI Linux

#### [Network Security Toolkit](https://www.networksecuritytoolkit.org)

Network Security Toolkit (NST), Fedora tabanlı bir Linux dağıtımıdır ve ağ güvenliği ve analiz araçları içerir. NST, ağ trafiğini izlemek, tehditleri tespit etmek ve güvenlik olaylarına yanıt vermek için tasarlanmıştır. Bu dağıtım, birçok popüler açık kaynaklı ağ güvenlik aracını içerir ve kullanıcı dostu bir web kullanıcı arayüzü (WUI) sunar.

![Network Security Toolkit (NST), Fedora tabanlı bir Linux dağıtımıdır ve ağ güvenliği ve analiz araçları içerir ( )](1_p6-f-z4SqaWqmgRfF9X-FQ.webp)

NST

NST, özellikle ağ güvenliği uzmanları ve yöneticiler için ideal bir platformdır.

---

## Anonimleştirme Dağıtımları

Anonimleştirme ve gizlilik için kullanılan dağıtımlarda mevcuttur. Bunlara bakalım.

#### **1-** [**Tails**](https://tails.net/)

Tails(The Amnesic Incognito Live System), anonim ve gizlilik odaklı bir Linux dağıtımıdır. İnternet trafiğinizi şifreler ve kullanıcı verilerinizi korur.

#### **2-**[**Whonix**](https://www.whonix.org/)

Whonix, anonimliği ve güvenliği artırmak için KVM veya VirtualBox sanal makinelerinde çalışır.

#### **3-** [**Qubes OS**](https://www.qubes-os.org/)

Qubes OS, güvenlik odaklı bir dağıtımdır ve kullanıcı verilerini ve işlemlerini yalıtır.

---

## Lab Ortamları

Pentest pratikeri ve eğitimler için kullanılan lab ortamlarına bakalım.

#### [**BloodHound**](https://github.com/BloodHoundAD/BloodHound)

BloodHound, Active Directory (AD) ortamlarında gizlenmiş ve genellikle planlanmamış ilişkileri ortaya çıkarmanıza yardımcı olan bir tek sayfa JavaScript web uygulamasıdır. Bu uygulama, Linkurious üzerine inşa edilmiş, Electron ile derlenmiş ve Neo4j veritabanına bağlanmıştır. BloodHound, AD veya Azure ortamlarında gizli ilişkileri ve potansiyel saldırı yollarını gösterir.

![BloodHound, Active Directory (AD) ortamlarında gizlenmiş ve genellikle planlanmamış ilişkileri ortaya çıkarmanıza yardımcı](1_RMLb-YKHxEx1C-4yu2jqIA.webp)

BloodHound

BloodHound, AD ortamlarında güvenlik analizlerinde ve saldırı yollarının belirlenmesinde kullanılan güçlü bir araçtır.

#### [GOAD](https://github.com/Orange-Cyberdefense/GOAD)

GOAD (Game of Active Directory), Orange Cyberdefense tarafından geliştirilen ve GitHub’da bulunan bir projedir. GOAD, Active Directory (AD) ortamlarında sızma testleri ve güvenlik analizleri yapmak için tasarlanmış bir laboratuvar projesidir. Bu proje, pentesterlere AD ortamlarında yaygın saldırı tekniklerini pratik yapmalarını sağlar.

![GOAD (Game of Active Directory), Orange Cyberdefense tarafından geliştirilen ve GitHub’da bulunan bir projedir](1_yjYePcnjHde7j2BchrLHJQ.webp)

GOAD

GOAD, sızma testleri ve güvenlik analizlerinde kullanılan güçlü bir araçtır. 

#### [DetectionLab](https://github.com/clong/DetectionLab)

DetectionLab, bir Active Directory (AD) ortamını kurmak ve güvenlik araçlarıyla birlikte güvenlik izleme yapmak için tasarlanmış bir laboratuvar projesidir. Bu proje, \*\*Packer, Vagrant, PowerShell, Ansible ve Terraform\*\* gibi araçlar kullanılarak otomatikleştirilmiştir. DetectionLab, Windows tabanlı bir AD ortamını kurar ve güvenlik izleme ve analiz araçlarını içerir.

![DetectionLab, bir Active Directory (AD) ortamını kurmak ve güvenlik araçlarıyla birlikte güvenlik izleme yapmak için](1_GLWv6E89EmKwP433ItVOOA.webp)

DetectionLab

DetectionLab, savunma odaklı güvenlik uzmanları için hızlı bir AD ortamı kurma ve güvenlik araçlarını kullanma imkanı sunar.

#### [Attack Range](https://github.com/splunk/attack_range)

Splunk Attack Range, Splunk Threat Research Team tarafından geliştirilen ve GitHub’da bulunan açık kaynaklı bir proje olarak, \*\*güvenlik tehditlerini ve saldırılarını simüle eden yerel veya bulut ortamlarını oluşturmanıza\*\* olanak tanır. Bu ortamlar, Splunk örneğine tehdit veri analizlerini toplar ve bu verileri kullanarak tehdit tespiti kurallarını geliştirmenize yardımcı olur.

![Splunk Attack Range, Splunk Threat Research Team tarafından geliştirilen ve GitHub’da bulunan açık kaynaklı bir proje](1_FUPaCLyHG9iewygx0sVMmQ.webp)

Attack Range

Splunk Attack Range, güvenlik uzmanları ve araştırmacılar için güçlü bir araçtır.

#### [BlueTeam.Lab](https://github.com/op7ic/BlueTeam.Lab?tab=readme-ov-file)

BlueTeam.Lab, op7i tarafından geliştirilen ve GitHub’da bulunan bir proje olarak, Terraform ve Ansible kullanarak Azure’da kurulan bir Blue Team (savunma ekibi) tespit laboratuvarıdır\*\*. Bu laboratuvar, red (saldırı) ve blue (savunma) ekibin, çeşitli saldırı tekniklerini test etmek ve forensik kanıtları analiz etmek için kullanılabilir.

![BlueTeam.Lab, op7i tarafından geliştirilen ve GitHub’da bulunan bir proje olarak, Terraform ve Ansible kullanarak Azure’da](1_Ojyy49GIR4ytCjm48fQ87g.webp)

BlueTeam.Lab

BlueTeam.Lab, savunma odaklı güvenlik uzmanları ve araştırmacılar için güçlü bir araçtır.

#### [Vulnhub](https://www.vulnhub.com/)

Vulnhub, siber güvenlik uzmanları ve meraklıları için eğitim amaçlı hazırlanmış bir platformdur. İçinde birçok çeşitli zorluk seviyelerindeki sanal makineler bulunur. Bu sanal makineler, kullanıcıların siber güvenlik bilgilerini ve deneyimlerini geliştirmelerine yardımcı olur.

![Vulnhub, siber güvenlik uzmanları ve meraklıları için eğitim amaçlı hazırlanmış bir platformdur](1_zSdkBH7dSenG5D7dOrOswQ.webp)

Vulnhub

Vulnhub, özellikle sızma testleri ve ağ güvenliği konularında pratik yapmak isteyenler için ideal bir kaynaktır. 

---
![Laboratuvar ortamları, teorik siber güvenlik ve savunma konseptlerini izole ve kontrollü ağlarda test etmek için vazgeçilmez](1_sMFj24PKbkp3fYj2Cy3S6w.webp)

## Sanallaştırma ve Ağ İzolasyon Mimarisi (Home Lab Rehberi)

Bir güvenlik laboratuvarı kurarken en kritik öncelik, test trafiğinin ve zararlı yazılımların fiziksel ağınıza ya da internete taşmasını kesin olarak engellemektir:

### Hipervizör Seçimi: Tip-1 vs. Tip-2
* **Tip-2 (VirtualBox, VMware Workstation):** Günlük kullandığınız işletim sistemi üzerinde çalışan, hızlı testler ve tekil sanal makineler için ideal başlangıç seviyesidir.
* **Tip-1 Bare-Metal (Proxmox VE, ESXi):** Doğrudan donanım üzerinde çalışan, birden fazla sanal makinenin (AD Domain Controller, SIEM, kurban uç noktalar) 7/24 kesintisiz çalışabileceği profesyonel ev laboratuvarı (Home Lab) standardıdır.

### Ağ Segmentasyonu ve Güvenlik Sınırları
* **Köprü (Bridged) Modu Tuzağı:** Sızma testi ve zararlı yazılım analiz makinelerini asla evinizin veya şirketinizin fiziksel ağına doğrudan bağlamayın.
* **Host-Only ve Dahili Ağ (Internal Network):** Sanal makinelerin yalnızca kendi aralarında ve kontrolünüzdeki yönlendirici (ör. pfSense) üzerinden haberleştiği izole ağ segmentleri oluşturun.
* **Sahte İnternet Simülasyonu:** Analiz ortamında zararlı yazılıma gerçek internet çıkışı vermek yerine, `INetSim` veya `FakeNet-NG` kullanarak sahte DNS ve HTTP yanıtları üretin, böylece C2 trafiğini dış dünyaya taşmadan izole biçimde kaydedin.

### Anlık Görüntü (Snapshot) Disiplini
Her test veya saldırı simülasyonu öncesinde sanal makinelerin temiz durumunu (Clean Snapshot) kaydedin. İstismar tamamlandığında veya sistem bütünlüğü bozulduğunda saniyeler içinde bu temiz duruma geri dönerek sıfırdan kurulum zahmetinden kurtulun.

---

Laboratuvar ortamları, teorik siber güvenlik ve savunma konseptlerini izole ve kontrollü ağlarda test etmek için vazgeçilmez bir altyapıdır. Gerek tersine mühendislik ve zararlı yazılım analizi (REMnux, FLARE VM), gerekse Active Directory saldırı simülasyonları (GOAD, DetectionLab) için doğru dağıtım ve sanallaştırma mimarisini seçmek, güvenli ve sürdürülebilir bir öğrenme sürecinin temelini oluşturur.
