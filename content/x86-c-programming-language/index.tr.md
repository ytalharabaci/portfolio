---
title: Sistem Programlama Temelleri
date: 2022-12-13
draft: false
description: C dili ve x86 Assembly ile donanımın sınırlarında bir mühendislik yolculuğu. İşlemci mimarisinden bellek yönetimine, sistem programlamanın temellerini teorik ve pratik uygulamalarla keşfedin.
image: featured.webp
type: posts
topic: offensive-security
tags: ["C", "x86", "Assembly", "Pointers", "Low-Level Programming"]
featuredImageAlt: "Terminal kodunun yanında anakart üzerindeki işlemcinin yakın çekimi"
---

Modern bilgi işlem dünyasında yazılımlar genellikle soyutlama katmanlarının arkasına saklanır. Web framework'leri, mobil uygulamalar veya yapay zeka kütüphaneleri, geliştiriciyi donanımın karmaşık gerçeklerinden korur. Ancak tüm bu sistemlerin altında, işlemciyle doğrudan konuşan, belleğin her bir baytını yöneten ve işletim sistemlerine can veren görünmez bir katman vardır: **Sistem Programlama**.

Sistem programlama, donanımın sınırlarında yürütülen bir mühendislik sanatıdır. Bu sanatı icra edebilmek için yalnızca kod yazmayı bilmek yetmez, kodun işlemci mimarisinde nasıl bir karşılık bulduğunu, yazmaçların (registers) nasıl çalıştığını ve belleğin dinamik olarak nasıl yönetildiğini de anlamak gerekir. Bu rehberde, x86 mikroişlemci mimarisinin kalbinden başlayarak, donanımın ham dili olan Assembly'ye bakacak, ardından modern sistem programlamanın omurgasını oluşturan C dilinin derinliklerine inerek teoriyi pratikle birleştireceğiz. Donanım ve yazılım arasındaki o ince çizgiyi keşfetmeye hazırsanız, işlemcinin mimarisini inceleyerek başlayalım.

---

## x86 Mikroişlemci Mimarisi

Mikroişlemci, bir bilgisayarın merkezi işlem birimi gibi çalışır. Bilgisayarın hayati fonksiyonlarını yürütür. Bir mikroişlemcinin fonksiyonel konfigürasyonunu ise:

* Kaydediciler
* Komut kod-çözücüsü
* Aritmetik ve Mantık birimi
* Frekans üreteci
* Zamanlama ve Kontrol elemanları

oluşturur. Görüldüğü gibi mikroişlemci birçok bölümden meydana gelmiş bir yapıyı temsil eder.

![standart bir mikroişlemci mimarisi](0_3j-qADs2-A3sg6Jz.gif)

Bilgisayarın kalbi ve beyni olarak adlandırılan mikroişlemciler aynı zamanda Merkezi İşlem Birimi (CPU) olarak anılırlar. CPU genel olarak aşağıdaki işlemleri yapar:

* Bellekten komut alıp getirir
* Komutun kodunu çözer
* Sistemdeki tüm elemanlar ve birimlere kontrol sinyalleri sağlar
* Aritmetik ve Mantık işlemlerini yürütür
* Diğer donanım birimlerinden gelen taleplere cevap verir

Bir mikroişlemcinin mimari yapısı en basit şekilde ifade edilmek istenirse, bir grup kaydedici, Aritmetik Mantık Birimi ve sistemin ne zaman hangi işi yapacağını denetleyen Kontrol Biriminden meydana gelmektedir.

#### Kaydediciler (registers)

İşlemcide bir program yürütülürken, işlemcinin içerisinde yani yanı başında kaydedicilere (registers) ihtiyaç duyulur.

![Kaydediciler](0_0vAWs-tWxevtC27o.webp)

Kaydediciler mikroişlemci mimarisinde önemli bir yer tutar ve doğrudan işlemci mimarisini belirleyen elemanlardan birisidir. Kaydediciler, verinin manevrasında ve geçici olarak tutulmasında birinci dereceden görevlidirler.

#### Aritmetik ve Mantık Birimi (ALU)

ALU, mikroişlemcide aritmetik ve mantık işlemlerinin yapıldığı en önemli birimlerden birisidir. Bu birime giriş işlemleri, akümülatör kaydedicisiyle bellekten alınan veri arasında veya akümülatörle diğer kaydediciler arasında olabilir.

![ALU](0_42MUW3fUda9LsAzC.webp)

ALU'da gerçekleşen bütün işlemler kontrol sinyalleri vasıtasıyla Kontrol Biriminin gözetiminde eşzamanlı olarak yapılır. ALU, instruction(emir) ve verileri (operand) alır ve emri bu veriler üzerinde gerçekleştirir.

#### Kontrol Birimi

Merkezi İşlem Biriminin üçüncü bölümünü meydana getiren bu kısım, sistemin tüm işleyişinden ve işlemin zamanında yapılmasından sorumludur. Kontrol birimi, bellekte program bölümünde bulunan komut kodunun alınıp getirilmesi, kodunun çözülmesi, ALU tarafından işlenmesi ve sonucun alınıp belleğe geri konulması için gerekli olan kontrol sinyallerini üretir. Bilgisayar sisteminde bulunan dahili ve harici bütün elemanlar bu kontrol sinyalleri ile denetlenir.

![Control Unit](0_x0gYM5EH_2agDzdP.webp)

Basit bir mikroişlemcide bu bölüm üç değişik işlevi yerine getirir:

1. **Zamanlama Kontrolü:** İşlemci, harici saat sinyali üreten bir birimden giriş alan iç-saat devresine sahiptir. Bu sinyal alınarak talebe göre zamanlama sinyallerine çevrilerek sisteme dağıtılır.
2. **Komut kod-çözücüsü:** Bu devre komut kaydedicisinde (IR) tutulan komutları yorumlar ve ALU'ya kaydedicilerle çalışması için uygun sinyaller gönderir. (kastedilen zamanlama ve kesme sinyalleri)
3. **Kesme mantık birimi:** Bu birim de diğer kontrol elemanlarına benzer. Gerekli durumlarda kesme sinyallerini alarak işlemciyi uyarır.

X86 adı, orjinal Intel işlemci çekirdek lisansına dayanan işlemcilere verilen isimdir. Dünyada masaüstü ve dizüstü bilgisayarların %90'ından fazlasında X86 tabanlı mikroişlemciler(Intel ve AMD vb.) kullanılmaktadır. Çağdaş işlemcilerin tamamının temel yapısı birbirine benzemekte, sadece bazı özellikleri ile birbirinden ayrılmaktadır.

### Programlamaya Yönelik İşlemci Mimarisi

Gelişmiş mikroişlemciler de temel olarak 8-bitlik mikroişlemcilerde olduğu gibi kaydedici Bölümü, ALU ve Kontrol birimine sahiptir. Fakat daha sonra mimari yapısı çoklu görev ortamına uygun hale getirildiğinden, işlemci içerisindeki bölümlerin de fonksiyonel açıdan iki mantıksal ana bölüm halinde daha ayrıntılı açıklanması gerekmektedir.

![Gelişmiş mikroişlemciler de temel olarak 8-bitlik mikroişlemcilerde olduğu gibi kaydedici Bölümü, ALU ve Kontrol birimine](0_7PswzKiGH1B4pThm.webp)

X86 tabanlı işlemciler Veri Yolu Bağdaştırma Birimi(BIU) ve İcra Birimi(EU) olmak üzere iki ana bölümde incelenebilir. BIU birimi, EU birimini veriyle beslemekten sorumluyken, EU birimi talimatların icrasından sorumludur.

#### Veri Bağdaştırma Birimi (BIU)

Veriyolları üzerindeki tüm veri ve adres hareketlerini EU için halleder.

Görevleri:

* Emirleri getirme (Instruction Fetching)
* Operandların adreslerini hesaplama
* Belleğe operand yazma, bellekten operand okuma
* Emir baytlarını emir kuyruğuna(Instruction Queue) transfer etme

Ana Bileşenleri:

**1.Segment kaydedicileri:**

Gelişmiş mikroişlemcili sistemlerde kullanılan bellek adresleri günümüzde iki parça halinde ifade edilirler. Bunlar segment ve ofset adresleridir. Böyle ifade edilmesinin sebebi, bellek miktarının oldukça yüksek olma zorunuluğudur. Büyük kapasiteli belleklerde bilginin yönetimi oldukça karmaşıktır. Bu sebeple büyük bellekler belli amaçlarla 64kb'lik küçük gruplara(segmentlere) ayrılarak daha kolay yönetilirler. Bellekte bu bölümlerin başlangıç adresleri segment kaydedicileri tarafından tutulurlar. Bu bölümdeki verilerin adresleri ise, segment kaydedici içeriğine olan uzaklığıdır ve ofset adres olarak anılırlar.

Her segment kaydedicisi bir segmentin başlangıç adresini tutar. Segmentlerin özel işlevleri vardır. Gelişmiş işlemcilerde 6 segment bulunur:

* **CS — Code Segment:** Emirlerin tutulduğu segment
* **DS — Data Segment:** Verilerin tutulduğu segment
* **SS — Stack Segment:** Yığın segmentidir, gerektiğinde emrileri geçici olarak tutabilir.
* **ES — Extra Segment:** DS ve CS'nin yetmediği durumlarda ekstra kullanılan segmenttir.
* **FS — File Segment:** CPU tarafından önceden belirlenmiş bir amacı yoktur, i386 ve sonraki işlemcilerde windows işletim sistemi tarafından iş parçacığı bilgi bloğuna (TIB) işaret etmek için kullanılır.
* **GS — Graphic Segment:** CPU tarafından önceden belirlenmiş bir amacı yoktur, i386 ve sonraki işlemcilerde windows işletim sistemi tarafından iş parçacığına özgü belleğe erişmek için kullanır.

**2.Emir Kuyruğu (Instruction Queue):**

BIU emir kuyruğu olarak bilinen bir mekanizma kullanarak pipeline mimarisini yerine getirir. Alınan emirler FIFO(first-in first-out) mantığıyla çalışan bir kuyrukta tutulur. EU birimi sıradaki emrin icrası için hazır olduğunda kolayca BIU'daki bu kuyruktan sıradaki emri okur.

![pipeline mimarisi](0_5HINjHYeweY7DKic.webp)

**3. Emir İşaretçisi (Instruction Pointer-IP):**

16-bitlik bir kaydedicidir. kod segmentteki sıradaki emrin 16-bitlik offsetini tutar. BIU. IP ve CS registerlarını kullanarak bellekten getirilecek emrin 20 bitlik adresini üretir.

**4. Adres toplama bloğu(The Address Summing Block):**

Bellek adreslerini üretmek için kullanılır. Örneğin, bir sonraki emrin 20-bitlik adresini oluşturmak için IP kaydedicisinde bulunan 16-bitlik ofset adresi ile CS kaydedicisinde bulunan kod segment adresini birleştirir.

Bunun gibi, CS:IP, SS:SP, SS:BP, DS:BX, DS:SI, ES:DI, DS:DI birleştirmeler yaparak 20 bitlik adres üretir.

#### İcra Birimi (EU)

Emirlerin kodunun çözüldüğü ve icra edildiği birimdir.

Görevleri:

* Emirleri çözmek(decode)
* Emirlerin icrasını sağlamak(execute)
* Sonucu BIU'ya döndürmek

Ana Bileşenleri:

**1.Kod Çözücüsü(Instruction Decoder):**

Bellekten gelen emirleri çözerek icra birimi tarafından yerine getirilen bir dizi harekete dönüştürür.

**2. Kontrol Sistemi:**

İşlemcinin iç operasyonlarını gerçekleştirmesi için zamanlama ve kontrol sinyallaerini üretir.

**3. ALU:**

Daha öncede bahsettiğimiz gibi aritmetik ve lojik işlemlerden sorumlu birim.

**4. Genel Amaçlı Kaydediciler:**

EU, birçok genel amaçlı registera sahiptir. 32-bitlik, 16-bitlik, 8-bitlik olmak üzere 3 kategoriye ayırabiliriz. 32 -bit olmayan işlemciler E ile başlayan(extended genişletilmiş anlamında) 32-bitlik registerları desteklemez.

![Genel Amaçlı Kaydediciler](0_pzTX1-e1-p0u4LXW.webp)

16-bitlik kaydediciler, 8-bitlik türevlerinin birleşiminden oluşmuşlardır. Örneğin, AX kaydedicisi AH ve AL kaydedicilerinin birleşiminden ibarettir. AX'in ilk 8-bitini AH kaydedicisi son 8-bitini AL kaydedisicisi tutar. H-high, L-low anlamındadır. Aynı şekilde bu BX, CX, DX kaydedicileri için de geçerlidir.

Çok amaçlı kaydediciler genelde adlarına has işlemlerde kullanılır:

* **AX kaydedicisi (accumulator):** Akümülatör adıyla bilinen bu kaydedici verilen ele alınmasında başrol oynar. Aritmerik işlemlerde ve bazı I/O işlemlerinde etkin bir şekilde kullanılır.
* **BX kaydedicisi (base):** Taban adres kaydedicisi olarak bilinen kaydedici, bellekteki veri gruplarının ofset değerlerinin tutulmasında kullanılır.
* **CX kaydedicisi (count):** Sayaç kaydedicisi olarak bilinir özellikle döngülerde döngü değişkeni olarak kullanılır.
* **DX kaydedicisi (data):** Veri kaydedicisi genellikle akümülatöre destek olan ve bütün işlemlerde bir tampon gibi davranan kaydedicidir.

**5. İşaretçi ve İndis Kaydedicileri:**

Mikroişlemcili sistemlerde bellekteki ara adresleri gösteren kaydedicilere işaretçi (pointer) adı verilir. X86 mimarisinde bulnan işaretçi ve indis kaydedicileri:

* DI — destination-index
* SI — source-index
* SP — stack-pointer
* BP — base-pointer
* IP — instruction pointer

Bu kaydediciler 16-bitliktir. E ile başlayan genişletilmiş 32-bitlik türevleri de i386 üstü işlemcilerde desteklenir.

Kod segmentte bulunan bir komutun yerinin belirlenmesinde CS kaydedicisine ofset değerini bulmada IP-instruction pointer yardımcı olur. CS:IP çifti, kod segmentteki işlenecek bir sonraki komutun adresini verir.

Yığın segmentindeki bir verinin yerinin belirlenmesinde SS kaydediciyle birlikte SP ya da BP kaydedicisi yardımcı olur. SS:SP çifti, yığın segmentteki boş bir alanın adresini verir.

DS ve SI kaydedicileri adres indislemesi işlemlerinde kullanılmaktadır. Bu indis kaydedicilerine string ve dizi işlemlerinde ihtiyaç duyulur. DS:SI çifti string komutlarının adresini verir.

**6.Bayrak Kaydedicisi:**

Bayrak kaydedicisi, bir işlemin sonunda sonucun ne olduğunu kaydedici bitlerine yansıtan bir bellek hücresinden oluşur. Yapılan aritmetik işlemler X86 mimarisinde mevcut bulunan bayrakları etkiler. 6 durum ve 3 kontrol olmak üzere toplam 9 bayrak vardır

![Flag Register](0_ROPSMM_4v9sB0bPB.webp)

6 durum bayrağı:

* **Elde Bayrağı (CF-Carry Flag):** Elde bitini tutar.
* **Eşlik Biti (PF-Parity Flag):** Eşlik bitini tutar.
* **Yardımcı Elde Bayrağı (AC-Auxilary Carry):** 3.bitten bir fazlalık olursa setlenir. CF ile aynı işi yapar.
* **Sıfır Bayrağı (ZF-Zero Flag):** işlem sonucu 0 ise setlenir.
* **İşaret Bayrağı (SF-Sign Flag):** negatif sayılar için 1 pozitif sayılar için 0'dır.
* **Taşma Bayrağı (OF-Overflow Flag):** işlem sonucunda taşma meydana gelirse setlenir.

3 kontrol bayrağı:

* **Tuzak Bayrağı (TF-Trap Flag):** Hata ayıklama işlemlerinde(debug) komutların adım adım yürütülmesi maksadıyla kullanılır.
* **Kesme Bayrağı (IF-Interrupt Flag):** sisteme bağlı diğer işlemelrden gelen kesme taleplerine izin verir.
* **Yön Bayrağı (DF- Direction Flag):** hafrdizi(string) işlemlerinde indis kaydedicisinin ileri veya geri hareket etmesini sağlar.

Buraya kadar temel ve programlamaya dayalı X86 tabanlı mikroişlemci mimarisinden bahsettim. Assembly ile program yazabilmek için kullandığınız işlemcinin mimarisini bilmek zorundasınız. X86 ailesinde de daha ilkel işlemcilerden şimdiki gelişmiş işlemcilere mimari olarak pek çok değişiklik olmuştur. Burda mimariyi genel olarak ele almaya çalıştık.

---

## x86 Assembly Programlama

Mimariyi tanıdıktan sonra, işlemciyle doğrudan konuşmamızı sağlayan Assembly diline geçebiliriz.

### Assembly diline Genel Bakış

Bir bilgisayar sistemi temel olarak donanım ve yazılım gini unsurlardan meydana gelmektedir. Donanım, bilgisayarın elektronik ve mekamik sistemlerini birbirine bağdaştıran oluşumdur. Bir kişisel bilgisayar ele alınırsa, monitör, klavye, sistem birimi ve diğer fiziksel kablo ve cihazların tümü donanım parçalarını oluştururlar. Bütün bu elemanların var olması yazılım olmadan bir işe yaramaz. Yazılım, sistemin açılmasından kapanmasına kadar olan bütün işlemlerini düzenler. Yazılımlar, sistem yazılımları ve uygulama yazılımları olmak üzere ikiye ayrılır. Uygulama yazılımları,istatiksel analizlerin yapılmasında, oyun programlarının yürütülmesinde vb. işlemlerde kullanılır. Sistem yazılımları sistemin işlevlerinin yerine getirilmesinde kullanılır. Uygulama yazılımları sistem yazılımları vasıtasıyla yönlendirilir. Sistem yazılımlarına en güzel örnek işletim sistemleridir (windows, linux, unix) .

#### **Makine Dili**

İnsan oğlunun makine ile iletişimde bulunabilmesi için onun dilinden anlaması gerekmektedir. Bunun için sistemin çalışmasında temel unsur olan mantıksal 0 ve 1 değerlerinin belli oranlarda dizi haline getrilmesi ve belli bir düzene göre yorumlanması ile sistemin dili oluşturulur.

![İnsan oğlunun makine ile iletişimde bulunabilmesi için onun dilinden anlaması gerekmektedir](0_ORZKX7SQuqXG8bU2.webp)

Mikroişlemcili sistemlerde mantıksal 0 ve 1'lerden oluşan ve belli bir görevi yerine getirek üzere yazılmış dile makine dili denir. Makine dilini meydana getiren bu sayıların yan yana gelmesi programcı için anlaşılmayan bir dizi oluşturur.

Makine dilinde yazılan programlar programcılar veya kullanıcılar tarafından çok zor yorumlanır ve hatırlaması zordur. Doğrudan makine dilince bir program yazmanın birkaç mahzuru vardır. Küçük programlar dışında hatasız program yazmak çok zordur. Yazılanlar 0 ya da 1'lerden oluştuğu için herşey birbirine benzer ve hatalardan arındırma kolay olmaz.

#### Assembly Dili

Makine dilinde ortaya çıkan zorlukların üstesinden gelmek için düşük seviyeli dil grubuna giren assembly dili kullanılır. Komut kodlarının ikili veya hex gösteriminin yerine assembly dili mnemonik denilen komut kısaltmaları kullanır.

Mnemonik kullanımı:

```
MOV AX,05  
ADD AX,10  
SUB AX,05  
NOT AX  
MOV BX,AX  
INT 21H
```

Her firma ürettiği mikroişlemciyle ilgili mnemonikleri de piyasaya sunmaktadır. Yukarıdaki küçük program parçasında her bir satır tam bir komutu ele alır. Her bir komut, bir iki veya 3 baytlık ikili koda karşılık gelir.

![assembler](0_JB_H9rRUMsl76-cW.webp)

Assembly dilinde yazılan her program bellekte saklanırken ya da işlenirken makine koduna çevrilmeye ihtiyaç duyar. Bu çevirme işlemi elle veya bir assembler yardımıyla yapılır.

#### ISA (Instruction Set Architecture)

Komutlardan bahsederken [ISA](https://en.wikipedia.org/wiki/Instruction_set_architecture)'dan bahsetmemek olmaz. Komut Seti Mimarisi (ISA), CPU'nun yazılım tarafından nasıl kontrol edildiğini tanımlayan soyut bir bilgisayar modelinin parçasıdır. ISA, donanım ve yazılım arasında bir arabirim görevi görerek, hem işlemcinin neler yapabileceğini hem de nasıl yaptığını belirtir.

ISA, bir kullanıcının donanımla etkileşime geçebilmesi için tek yolu sağlar. Bir programcının el kitabı olarak görülebilir, çünkü makinenin birleştirme dili programcısı, derleyici yazarı ve uygulama programcısı tarafından görülebilen kısmıdır.

#### Program Formatı

Komutlar ve Talimatlardan meydana gelen assembly dilinde yazılmış kaynak kodlarnın her bir satrında, dört ayrı alan tanımlanabilir.

* Etiket alanı
* Komut alanı
* Operand alanı
* Açıklama alanı

Etiket, komut ve operand alanları birbirinden bir veya daha fazla boşluk ya da tab ile ayrılırlar. Açıklama alanı ise mutlaka noktalı virgül ile ayrılmalıdır.

```
Start:  
  MOV EDX, 2025H;  ;2025H sayısını EDX kaydedicine yükle  
  ADD EAX, EDX;    ;Bu değeri EAX kaydedicisine ekle  
End:
```

Yukarıdaki küçük kod parçasında görülen *Start* ve *End* etiket, *MOV* ve *ADD* komut, *EDX, 2025H* ve *EAX, EDX* operand, noktalı virgülden sonrası ise açıklama alanıdır.

### X86 Komut Kümesi

X86 tabanlı işlemcilerin kullandığı komut kümesi, program yazımı sırasında kullanılan bir dizi mnemoiklerden meydana gelmiştir. Komut kümesindeki bazı komutlar birbiriyle aynı işlevi yerine getirebilir. Programcının komut kümesindeki tüm komutları bilmesi gerekmez. 500 adet komut içerisinden yaklaşık 100 tanesini bilmesi assembly diline program yazmak için yeterli olaracaktır.

Komutları kullanılış amançlarına göre gruplara ayırabiliriz:

* Veri aktarım komutları
* Artimetik ve Mantık komutları
* Program Kontrol Komutları

Bu komutlardan yaygın olarak kullanılanlara bakalım.

#### Veri Aktarım Komutları

* **MOV**operand2'yi operand1'e kopyalar. CS ve IP kaydedicilerinin değerini değiştiremez. Bir segment kaydının değerini veya immediate bir değeri başka bir segment kaydına direk olarak kopyalamaz. Durum bayraklarını etkilemez. **Operandlar:  
  -** REG, memory  
  - memory, REG  
  - REG, REG  
  - memory, immediate  
  - REG, immediate
* **PUSH/POP**PUSH ve POP komutları verileri stack segmentte saklamamıza sağlar. PUSH verileri yığına iter, POP verileri yığından çeker. Tek operand alır. Durum bayraklarını etkilemez.  
  **Openrandlar:**- REG  
  - memory  
  - immediate
* **IN/OUT**IN komutu portlar üzerinden AL veya AX'e veri aktarımını sağlar, gerekirse DX'de kullanılabilir.İkinci operand bir port numarasıdır.   
  Out komutu bunun tersidir. **Operandlar:  
  -** AL, im.byte — im.byte, AL  
  - AL, DX — DX, AL  
  - AX, im.byte — im.byte, AX  
  - AX, DX — DX, AX

#### **Aritmetik ve Mantık Komutları**

* **ADD/ADC**operand2'yi operand1'e ekler ve sonucu operand1'e atar. ADC'nin farkı carry bitini de toplamaya dahil etmesidir. Tüm durum bayraklarını etkiler.  
  **Operandlar:  
  -** REG, memory  
  - memory, REG  
  - REG, REG  
  - memory, immediate  
  - REG, immediate
* **SUB/SBB**operand2'yi operand1'den çıkarır ve sonucu operand1'e atar. SBB'nin farkı carry bitini de çıkarmaya dahil etmesidir. Tüm durum bayraklarını etkiler.  
  **Operandlar:  
  -** REG, memory  
  - memory, REG  
  - REG, REG  
  - memory, immediate  
  - REG, immediate
* **MUL/IMUL**MUL ve İMUL komutu 8-bitlik sayılar için aldığı operandı AL ile çarpıp sonucu AX'e atar. 16-bitlik sayılar için ise aldığı operandı AX ile çarpıp sonucu DX:AX kaydedicilerine atar. İMUL'un MUL komutundan farkı işaretli sayılar için olmasıdır.Sadece carry ve overflow bayraklarını etkiler. **Operandlar:  
  -** REG  
  - memory
* **DIV/IDIV**DIV ve IDIV komutu 8-bitlik operand için AX kaydedicisini operanda bölü sonucu AL'ye atar. 16- bitlik operand için ise DX:AX kaydedicilerini operanda bölüm sonucu AX'e atar. IDIV'in DIV komutundan farkı işaretli sayılar için olmasıdır.**Operandlar:  
  -** REG  
  - memory
* **INC/DEC**INC komutu operandın değerini bir arttırmak için DEC komutu ise 1 azaltmak için kullanılır. Carry bayrağı hariç tüm bayrakları etkiler. **Operandlar:  
  -** REG  
  - memory
* **NEG**Operandın 2'ye tümleyenini geri operanda atar.  
  **Operandlar:  
  -** REG  
  - memory
* **AND/OR/XOR/NOT**Mantıksal işlemleri yerine getirmek için kullanılan komutlardır. NOT komutu hariç iki operand alırlar. Zero, sign ve parity bayraklarını etkilerler. **Operandlar:  
  -** REG, memory  
  - memory, REG  
  - REG, REG  
  - memory, immediate  
  - REG, immediate
* **SHR/SHL**SHR komutu operand1'i, operand2'de belirtilen sayı kadar sağa kaydırır. Kaydırılan kısımdan içeri lojik-0 alır çıkan değer carry'e kopyalanır. SHL ise aynı işlemi sola kaydırarak yapar. Carry ve Overflow bayraklarını etkiler. OF=0, eğer ilk işlenen orijinal işareti koruyorsa.  
  **Operandlar:**  
  - memory, immediate  
  - REG, immediate  
  - memory, CL  
  - REG, CL
* **ROR/ROL**ROR komutu operand1'i, operand2 de belirtilen sayı kadar sağa döndürür. Çıkan değer tekrar baştan geri alınır ayrıca Carry'e kopyalanır. ROL komutu ise bu işlemin sola döndürülen halidir. Carry ve Overflow bayraklarını etkiler. OF=0, eğer ilk işlenen orijinal işareti koruyorsa. **Operandlar:**  
  - memory, immediate  
  - REG, immediate  
  - memory, CL  
  - REG, CL
* **RCR/RCL**RCR komutu operand1'i, operand2 de belirtilen sayı kadar carry bayrağı üzerinden sağa döndürür. Çıkan değer carry'e kopyalanır, carry'nin değeri ise baştan geri alınır. RCL komutu ise bu işlemin sola döndürülen halidir. Carry ve Overflow bayraklarını etkiler. OF=0, eğer ilk işlenen orijinal işareti koruyorsa. **Operandlar:**  
  - memory, immediate  
  - REG, immediate  
  - memory, CL  
  - REG, CL
* **CMP**Karşılaştrma işlemi için kullanılan komuttur. İki operand alır, operand2'yi operand1'den çıkarır ancak atama yapmaz. Bu çıkarma işlemine göre bayrakları düzenler.  
  **Operandlar:  
  -** REG, memory  
  - memory, REG  
  - REG, REG  
  - memory, immediate  
  - REG, immediate

![CMP işleminin sonunda bayrakların durumları](1_cTFBzk0u0qRVO5sdUCTZtw.webp)

#### Program Kontrol Komutları

* **JMP**  
  Program akışında dallanmalar yapmamızı sağlayan komutlardır. JMP komutu koşulsuz dallanma için kullanılır. Operand olarak program akışının dallanma yapılacak bölümünü bir label ile alır. Koşulu bağlı dallanma yapmamıza yarayan pek çok komut vardır.

![JUMP INSTRUCTIONS](0_rqiV9TW4c9eHSlii.webp)

* **LOOP**  
  LOOP komutu, döngü kurmamızı kolaylaştırır. Her tekrarda CX kaydedcisini bir azaltır ve CX sıfır ise döngüyü sonlandırır.Operand olarak program akışının dallanma yapılacak bölümünü bir label ile alır.

### Assembly Talimatları

Assembly dilinde program geliştirmek için bazı temel kuralların bilinmesi gerekmektedir. Bu kurallar içerisinde, genel kodlama formatı, açıklama alanları, çevrilecek program listesinin denetimini sağlayan talimatlar, segment ve prosedürlerin tanımlanması aşamaları vardır.

Daha önce belirtildiği gibi komut alanında iki tip ifade kullanılmaktadır. Bunlar, komut(instruction) ve talimatlardır(directive). Her ikiside emir kelimesini ifade eder, fakat komutlar işlemci, talimatlar assembler içindir. Talimatlar, segmentlerin ve altyordam gibi prosedürlerin kurulumunda, sembollerin tanımı, geçici saklama yapmak için bellek ayırmaları ve benzer işleri yapmak için kullanılır. Talimatları, data, listeleme ve çalışma modu olmak üzere 3 grupda ele alabiliriz.

#### Listeme Talimatları

Assemble edilmiş bir programda, sayfa formatı, program başlığı ve alt başlıklar gibi tanımlar ve yazım formatını berlirler.

```
Page 60,120 ;sayfa 60 satır ve 120 sütündan oluşacak  
Title prog1 ;prog1 başlık
```

Satır ve sütun sayısı assembly dilinde yazılı programın yazdırılmasında bir sayfanın enini ve boyunu belirler. Title talimatıyla, programın genel olarak ne yaptığı her listenin ikinci satırına yazdırılır.

#### Data Talimatları

Veri talimatları kendi arasında beş gruba ayrılır. Bunlar segment veya prosedür tanımlamaları, sembol tanımlamaları, veri tanımlamaları, harici referanslar ve assembly kontrol tanımlamalarıdır.

**SEGMENT Talimatı**Segment talimatı, bir segmentin başlangıcını tanımlamada kullanılır. Her segment mutlaka bir anlamlı etiket ile ifade edilmelidir.bir segmentin açılması bir adla başlarken aynı adla ve ENDS ile kapanmalıdır.

```
ISIM SEGMENT  
...    ...  
...    ...  
...    ...  
...    ...  
ISIM ENDS
```

Bir programda tipine göre (exe veya com) bir veya birden fazla segment tanımlanabilir. X86 mikroişlemci mimarisinden hatırlayacağımız üzere, kod segment komutların yerleştirildiği, data segmenti verilerin depolandığı alanı ve yığın segmenti verilerin geçici bir süre için atıldığı bellek alanını ifade ederler. Yığının dışında, data segmentleri ve kod segmentleri birden fazla tanımlanabilirler.

**PROC Talimatı**Özel bir amaçla yazılmış kodları içerisine alan program parçalarına prosedür denir. Kod segmentinin içerisine, birisi ana olmak üzere pek çok prosedür konulabilir. Ana prosedür, programın kurulum (giriş-initial) ve icra (gelişme-executing) ve sonuç aşamasını barındırır. İcra bölümünde genelde prosedür çağrıları yapılır. Basit bir prosedür mekanizması segment içerisinde şu şekilde ifade edilir:

```
PROCADI PROC FAR/NEAR  
   <ifadeler>  
PROCADI ENDP
```

Görüldüğü gibi, etiket adlandırması dışında prosedür tanımlaması aynı segment tanımlamasına benzemektedir. Ana prosedür içerisinden ya da ana prosedür içerisinden çağrılan başka bir prosedür içerisinden başka bir prosedür çağrılabilir. Fakat dikkat edilecek nokta her prosedürün kendine has adının ve dönüş komutunun olmasıdır. Alt prosedürler genelde ana prosedür içerisinden CALL komutuyla adı verilerek çağrılırlar.

**ASSUME Talimatı**Asuume talimatı, assembleri kullanılan segment hakkında bilgilendirir ve hangi segmentlerin hangi segment kaydedicilerini kullanacağını tanımlar. Formatı aşağıdaki gibidir:

```
ASSUME Segment kaydedicisi:segment adı
```

Segment kaydedicileri. CS, DS, SS, ve ES, segment adları ise programcı tarafından segmentlere verilen adlardır. JMP, CALL ve benzeri kod referansları o anki kod segmentine görecelidir. Assembler hangi segmentin veri, hangi segmentin kod segmenti olduğunu bilmek zorundadır. Çünkü assembler, programcı tarafından yazılan assembl dilindeki programı makine koduna çevirirken, segmentlerin belleğe yerleşecekleri yerleri tanımlarken, program çalışması sırasında segmentlerin etiket adresine göre hareket etmek durumundadır.

**Çalışma Modları** 8086 ve 8088 işlemcilerinin ortaya çıkmasıyla birlikte işletim sistemi olarak da DOS gündeme gelmiştir. DOS'un o zamanki işlemcide çalıştırabileceği komutlar ve bellek kullanımı halihazırdaki sistem için yeterli gelmekteydi.

X86 mikromimarisini kullanan işlemcilerin geriye uyumlu olması zorunludur. Fakat işlemcilerin gelişimi ve performansının artması geriye uyumluluğu zorlar duruma gelmiştir. Bu uyumluluğu sağlamak için işlemci çeşitli çalışma modlarına ayrılmıştır.

* Real Mode: DOS işletim sisteminin üzerinde çalıştığı sistemler Real Mode altında çalışmaktadır.
* Protected Mode: Verilerin korunması öncelikli olan Korumalı Mod programları Protected Mode altında çalışmaktadır.
* Virtual Mode: Sanal bellek uzayını kullanarak birden fazla real mode programını aynı anda çalıştırabilen ve aynı zamanda protected mode programlarını da çalıştırabilen bir sanallaştırma teknolojisidir.

### İşlemcisini Kullanan Bir Assembly Programı

```
;EMU8086'nın sanal portlarından klavyeden alinan artis  
;miktarını bir sayacta biriktirerek sanal portlardan display  
;portunda belirli bir gecikme ile yansitan program  
  
PORTA EQU 110 ; Klayveden giris yapmaya yarayan sanal giris portu  
PORTB EQU 199 ; Sanal cikis portu, diplay  
  
org 100h  
  MOV SI,1 ;displayde gosterilecek sayac degeri  
  MOV CX,1 ; artis miktari  
  
tekrar:  
  MOV DX,PORTA  
  IN AL,DX ;Giris portundan klavyeden girilen degeri oku  
  cbw ;ax registerindeki byte worde çcevir  
  MOV CX,AX ;klavyeden girilen artis miktarini yedekle  
  ADD SI,CX ;sayactaki degeri guncelle  
  MOV DX,PORTB  
  MOV AX,SI  
  OUT PORTB,AX ;sayacytaki degeri diplaye tasi  
  CALL DELAY ;displaydeki degerin gorunebilmesi icin gecikme  
  JMP tekrar  
  RET  
  
  
;Prosedür tanımalaması  
DELAY PROC  
  PUSH CX ; ana programda kullanilan registerlari yigina yedekle  
  MOV CX,020H  
J1:  
  NOP  
  NOP  
  LOOP J1  
  POP CX ;yeeklenen reg yigindan geri cek  
  RET  
DELAY ENDP
```

X86 tabanlı mikroişlemcilerde assembly programlama, komut setleri, kayıtçı (register) yönetimi ve bellek adresleme modlarının donanım düzeyinde anlaşılmasını gerektirir. Düşük seviyeli bu mekanikler, ikili (binary) analiz ve bellek güvenliği açıklarının temelini oluşturur.

---

## C Dili ile Sistem Entegrasyonu

Assembly'nin ardından, donanıma yakın kalırken daha yüksek seviyeli bir soyutlama sunan C diline geçiyoruz.

### **Programlama Dili Nedir?**

Programlama bir bilgisayara yürütmesi için bir dizi talimat vermektir. Bilgisayar verilen talimatları sıra ile yürütür. Bir bilgisayarı programlamak için ilk bilgisayarlardan itibaren çeşitli yöntemler kullanılmıştır.

Programlama dilleri, bilgisayarların izleyeceği talimatları yazmak için kullandığımız araçlardır. Bilgisayarlar ikili olarak düşünür yani 1'ler ve 0'lardan oluşan diziler ile işlemlerini gerçekleştirir. Programlama dilleri, 1'leri ve 0'ları insanların anlayabileceği ve yazabileceği bir şeye çevirmemizi sağlar. Bir programlama dili, insanların düşüncelerimizi bilgisayarların anlayabileceği talimatlara çevirmesini sağlayan bir köprü görevi gören bir dizi sembolden oluşur. Bu sembollerden oluşan cümleler derleyici aracılığıyla makine koduna(ikili koda) çevrilir.

![Derleyicinin Görevi](1_JTvQeZhMZ--8BDeKaABmKw.webp)

### Programlama Dillerinin Sınıflandırılması

Gelişen teknoloji ile günümüzde pek çok farklı uygulama türü ortaya çıkmıştır ve programlama dilleri bu uygulama türlerine göre özelleşmiştir. Programlama dillerinin bir listesine [buradan](https://tr.wikipedia.org/wiki/Programlama_dilleri_listesi) ulaşabilirsiniz.

Örnek olarak,

* web uygulaması geliştirmek için PHP, JavaScript.
* mobil uygulama geliştirmek için kotlin, swift.
* yapay zeka uygulamaları geliştirmek için Python, R.
* sistem programı geliştirmek için C, C++.

verilebilir. Peki her işe yarayan tek bir programlama dili var mıdır? Bilgisayar programları bu kadar çeşitli iken her işte iyi olan bir dil geliştirmek oldukça zor olsa gerek.

Programlama dillerini, insan diline ve makine diline yakınlıklarına göre sınıflandırabiliriz. Bu görselde programlama dili, üste çıkıldıkça konuşma diline, aşağı indikçe makine diline yaklaşır.

![Programlama Dillerinin Sınıflandırılması](1_ezQx18YckMStFClue9R1qg.webp)

### C Programlama Dili

C çoğunlukla orta seviye dili olarak bilinse de, bu onun diğer dillerden daha az güçlü, daha az kullanışlı olduğu anlamına gelmez. Böyle adlandırılmasının sebebi hem assembly dili gibi düşük seviyeli dillerin hem de C#, Pascal gibi yüksek seviyeli dillerin sahip olduğu fonksiyonlara sahip olmasındandır.

C bugün üst düzey profesyonel programcıların kullandığı bir sistem dilidir. C'nin en belirgin özelliği işaretçilere(pointer), kelimelere(word), bit ve baytlara doğrudan doğruya erişime izin vermesidir. Bu durum C'nin sistem programlarının yazımında -gömülü sistemlerde- kullanılabilmesine olanak tanır.

C'nin diğer üstün yanı da anahtar sözcük sayısının az olmasıdır. Bir dilde anahtar sözcükler çok önemlidir. Örneğin, Basic'te 159 adet anahtar sözcük varken bu sayı C'de sadece 27'dir.

Sonuç olarak C programcıya neye ihtiyaç duyuyorsa onu yapabilme imkanı veren profesyonel programcıların kullandığı bir dildir. Programcı C'yi kullanarak inanılmaz programlar yapabilir. Bu inanılmaz programlardan biri de işletim sistemidir.

### C dilinin Tarihi

İşletim sistemi yazılımları geliştirmek amacıyla önce BCPL dili, ardından da B dili kullanıldı. BCPL 1967 yılında geliştirildi ancak bu dilin yetersizlikleri 1970 yılında B dilinin geliştirilmesine neden oldu. Gerek BCPL dilinde gerekse de B dilinde veri türü kavramı yoktur. Unix işletim sistemi önceleri B dili ile yazıldı. Ancak B dili işletim sistemi yazılımını gerçekleştirmek için yeterli olmadı. Bunun üzerine 1972 yılında, UNIX işletim sisteminde kullanılan DEC PDP-11 bilgisayarları üzerinde [Dennis Ritchie](https://en.wikipedia.org/wiki/Dennis_Ritchie) tarafından C programlama dili geliştirildi. C dilinde birçok veri türü vardır. UNIX işletim sisteminin geliştirilmesinde C dili başarılı bir şekilde kullanılmıştır.

Daha sonraki yıllarda C dili işletim sistemi dışında da kullanılır hale geldi. Özellikle mühendislik çalışmalarında ve bilimsel uygulamalarda kullanıldı. C çevrebirimleri, kaynak kodu seviyesinde ve makine diline uyarlamasında çok iyi olmasına karşın, bu dönemde standartların olmayışı olumsuz bir durumdu. Pek çok C türü türemişti ve hepsinin sözdiziminde farklılıklar vardı. Bu durumu düzeltmek için ANSI(American National Standarts Institue) 1983 yılında bir kurul oluşturarak C için bir stansart hazırladı. Bu kurul C derleyicisinde bulunması gereken fonksiyonalrı başka bir söyleyişle standart kütüphane fonksiyonlarını belirlemiştir.

### Programlamaya Giriş

C Programlamaya giriş yaparken her programlama dilinde olduğu "hello world" programından başlıyoruz. Bu programdan dilin sözdizimi(syntax) hakkında bir fikir edinebiliriz.

```
#include <stdio.h>  
#include <stdlib.h>  
  
int main()  
{  
    printf("Hello world!\n");  
    return 0;  
}
```

C program yapısına baktığımızda

* ilk bölümde kütüphane ekleme olduğunu görüyoruz. Bir C programnının en başında programda kullanılacak fonksiyonlara ait kütüphanelerin eklenmesi gerekir. Örneğin, ekranda bir mesaj gösterilecekse bunun için gerekli olan fonksiyon printf() fonksiyonu olup bu fonksiyonun da içinde yer aldığı <stdio.h> kütüphanesi #include<stdio.h> şeklinde en başa eklenmelidir.
* ikinci bölümde main() fonksiyonunu görmekteyiz. Bu komut programın başladığı yeri gösterir. main() fonksiyonu iki kısımdan oluşur. fonksiyon tanımı ve fonksiyon gövdesi.  
  - int main(): fonksiyon tanımı  
  -{} süslü parantezler arası: fonksiyon gövdesi  
  Fonksiyon tanımında fonksiyonun ismi ve giriş-çıkış türleri belitrilir. Fonksiyon gövdesinde ise istenilen işlemleri yapmak ve bunların sonuçlarını görmek için gerekli deyimler bulunur.
* return() deyimi, fonksiyonun işinin bittiğini gösterir. Program bu fonksiyondan çıkarak kendini çağıran satıra geri döner.

Programlama dillerinde kuralların ve ifade biçimlerinin bütününe sözdizimi (syntax) adı verilir. C dilinin donanım üzerindeki doğrudan kontrol gücünden yararlanabilmek için temel değişken tanımlarından bellek dizilerine kadar bu sözdizimi kurallarını eksiksiz kavramak gerekir.

### Tanımlar

#### Değişken & Sabit Tanımlama

Değişenler ve Sabitler verileri tutmak için kullandığımız bileşenlerdir. Bu bileşenleri tanımlarken dikkat etmemiz gereken nokta değiken veya sabitin kabul ettiği veri türüdür. Standart C dilinde 5 çeşit veri türü vardır:

* int — tam sayı değerleri için kullanılır.
* float — ondalıklı sayı değerleri için kullanılır.
* double — büyük ondalıklı sayı değerleri için kullanılır.
* char — karakter değerleri için kullanılır.
* void — türü olmayan demektir.

Bu veri türlerini kullanarak değişkenler tanımlayabiliriz:

```
int a = 5;            // integer türünde a isminde '5' değerinde bir değişken  
float b = 7.5;        //float türünde b isminde '7.5' değerinde bir değişken  
char c = 'a';         //char türüne c isminde 'a' değerinde bir değişken  
double d = 8965.3645; //double türünde d isminde '8965.3645' değerinde bir değişken
```

bu veri türleri ile sabit tanımlamak istiyorsak tek yapmamız gereken değişken tanımlamasının başına 'const' anahtar kelimesini getirmek.

```
const int a = 5;            // integer türünde a isminde '5' değerinde bir sabit  
const float b = 7.5;        //float türünde b isminde '7.5' değerinde bir sabit  
const char c = 'a';         //char türüne c isminde 'a' değerinde bir sabit  
const double d = 8965.3645; //double türünde d isminde '8965.3645' değerinde bir sabit
```

Sabitler, değişkenlerden farklı olarak programın çalışma zamanı boyunca aynı değerde kalırlar. Tuttukları değer program akışında değiştirilmeye çalışılırsa hata veririler.

#### Dizi Tanımlama

Dizilerin tanımlaması da değişkenlere oldukça benzerdir. Aslında diziler aynı türde birden fazla değişken tutan yapılardır. Örneğin int türünde bir dizi, içinde integer değişebilen değerler tutar.

Dizileri tanımlarken en önemli nokta dizi boyutunun belitirtilmesidir. Program çalıştırıldığında bu dizi boyutuna göre bellekten yer talep eder ve programın çalışma zamanı boyunca bu boyut değişmez.

Dizileri iki şekilde tanımlayabiliriz. Bunlardan biri boyutunu belirterek diğeri alacağı değerleri belirterek:

```
int dizi1[10];            //10 elemanlı integer türünde bir dizi.  
int dizi2[] = {1,2,3,4}   //4 elemanlı integer türünde bir dizi.
```

Dizilerin elemanlarına erişmek için köşeli parantezler içine erişeceğimiz elemanın indisini yazarız. Bir elemanın indisi, o elemanın dizide kaçıncı sırada olduğunu belirten sayıdır. Bir dizinin ilk elemanı 0. indistedir, her yeni eleman sıradaki indis değerini alır:

```
sayi1 = dizi2[0];  //dizi2'nin ilk elemanını sayi1'e atar  
sayi2 = dizi2[1];  //dizi2'nin ikinci elemanını sayi2'e atar  
sayi3 = dizi3[2];  //dizi2'nin üçüncü elemanını sayi3'e atar  
sayi4 = dizi4[3];  //dizi2'nin dördüncü elemanını sayi4'e atar
```

Bir önceki örnekte tanımladığımız dizi2 isimli dizinin elemanlarını yukarıdaki gibi erişebiliriz.

char değişken türüyle sadece tek bir karakter alabiliyorduk. Bir kelime almak için karakter dizilerine ihtiyacımız var.

```
char str1[20]; //20 karakterlik bir karakter dizisi(string) tanımı  
char str2[] = "string ifadesi"; //değeri belli karakter dizisi(string)
```

#### printf() & scanf() fonksiyonları

C diliyle konsol uygulamaları yaparken kullanıcıyla etkileşim kurmak için kullandığımız iki fonksiyondur. printf() kullanıcıya bir mesaj döndürmek için scanf() ise kullanıcından bir değer almak için kullanılır.

```
printf("Hello World\n");
```

printf ile çift tırnaklar içinde istediğimiz mesajı kullanıcıya döndürebiliriz. Sondaki '\n' ifadesi konsolda alt satıra geçmek için kullanılır.

Eğer bir değişkenden geleni konsol ekranını bastırmak veya konsoldan bir değer almak istiyorsak belirleyicilere (specifiers) ihtiyacımız var. Bunlardan bazıları:

* %d : integer değerler için kullanılır.
* %f : float değerler için kullanılır.
* %lf : double değerler için kullanılır.
* %c : char değerleri için kullanılır.
* %s : string değerleri için kullanılır.
* %x : hexadecimal değerleri için kullanılır.

Bu belirleyicileri kullanarak kullanıcıdan girdi alıp çıktı verebiliriz:

```
int sayi;  
printf("Bir sayi giriniz: ");  
scanf("%d", &sayi);  
printf("Girilen sayi %d'dir", sayi);
```

Burada dikkat etmemiz gerekenler
scanf() fonksiyonunda değerin atanacağı değişkeni belirtirken '&' işareti koymak ve belirleyicilerin her iki fonksiyon içinde ilk parametrede ve çift tırnak içinde kullanmak.

```
char[20] isim;  //20 karakterlik isim adında bir karakter dizisi tanımı  
printf("isminizi giriniz: ");
```

Yukarıdaki örnekte kullanıcıdan bir karakter dizisi(string) alıp bu değeri mesaj içinde kullanıcıya döndüren bir program yazılmıştır.

### Koşul Yapıları

C dilinde program akışını ve mantıksal kararları yönetmek için üç temel koşul ifadesi kullanılır. Bu yapılarda karşılaştırma ve mantıksal operatörler birlikte değerlendirilir.

Karşılaştırma operatörleri:

* ==--eşitse
* !=--eşit değilse
* >--büyükse
* <--küçükse
* < =--büyük eşitse
* > =--küçük eşitse

Mantıksal operatörler:

* &&--ve
* ||--veya
* !--değil

#### if-else yapısı

if else yapısı, koşul ifadelerini tanımlamak için kullanabileceğimiz yapılardan biridir. Her zaman *if* deyimiyle başlar, koşulun sağlanmadığı durumda varsa *else* durumuna düşer. Birden fazla koşul tanımlamak için *else if* ifadesi kullanılabilir.

```
if(a==b){  
  printf("a ve b esit");  
}else if(a>b){  
  printf("a, b den buyuk");  
}else{  
  printf("a, b den kucuk");  
}  
printf("kosulun disi);
```

Eğer if koşulu sağlanırsa koşul içindeki deyimler yürütülür ve program akışı koşul ifadesinin dışından devam eder. Eğer *if* koşulu sağlanmaz ise sıradaki *else if*'de bulunan koşula bakar(eğer varsa), hiçbir koşul sağlanmaz ise *else*'e düşer(eğer varsa).

#### switch-case yapısı

switch-case yapısı çoklu durumlarla baş edebilmek için geliştirilmiş bir yapıdır.

```
int sayi;  
printf("Bir sayi giriniz: ");   
scanf("%d", &sayi);  
  
switch(sayi){  
  case 1:  
    printf("1 sayisi girildi");  
    break;  
  case 2:  
    //break koymadığımız için case3 ile çalıştırmaya devam eder, case 3:  
    printf("2 veya 3 sayisi girildi");  
    break;  
  case 4:  
    printf("4 sayisi girildi");  
    //break ifadesi koymadığımız için default da çalışır  
  default:  
    printf("tanimlanmamis sayi");  
}
```

Verilen koşul değişkeninin değerine göre uygun olan *case* içindeki deyimleri çalıştırır. Bu koşul değişkeni sadece *int* ve *char* türünde olabilir. deyimlerin çalıştırılması *break* ifadesi görene kadar devam eder. Yani, *break* olmadığı sürece program diğer *case*lerde bulunan deyimleri çalıştırmaya devam eder.

#### ternary operator

ternaty operator, tek satırda hızlı ve kısa kosul ifadeleri tanımlamak icin kullanılır.

```
(a==b)?printf("a ve b eesittir"):printf("a ve b esit değildir");
```

parantezler içine koşul yazılır ardından bir soru işareti konur. soru işaretinden sonra gelen bölüm koşul doğruysa çalıştırılacak bölümdür. Bu bölümden sonra iki nokta konur. Sonraki bölüm ise koşul yanlışsa çalışır.

### Döngüler

Bir döngü deyimi, bir deyimi veya deyimler grubunu birden çok kez yürütmemize izin verir. Aşağıda, programlama dillerinin çoğunda bir döngü ifadesinin genel biçimi verilmiştir:

![Bir döngü deyimi, bir deyimi veya deyimler grubunu birden çok kez yürütmemize izin verir](0_tZ55-KwCaatkE92j.webp)

C dilinde 3 çeşit döngü vardır. Bunlar for, while ve do-while döngüleridir.

#### for döngüsü

Deyimleri birden çok kez yürütür ve döngü değişkenini yöneten kodu kısaltır.

```
//0'dan 10a kadar olan sayıları yazdıran program  
for(int i=0;i<=10;++i){  
    printf("sayi: %d \n",i);  
}
```

Döngü ifadeleri iç içe kullanılabilir buna iç-içe döngü(nested loop) denir. Bu daha çok matris işlemlerinde kullanılır.

```
//20x20lik bir matrisin indislerini yazdıran program  
for(int i=1;i<=20;++i}{  
  for(int j=1;j<=20;++j){  
    printf("(%d,%d)\n",i,j);  
  }  
}
```

![for döngüsü](0_oZLlTX132HC6pdpw.webp)

#### while döngüsü

Belirli bir koşul doğruyken bir ifadeyi veya ifade grubunu tekrarlar. Döngü gövdesini yürütmeden önce durumu test eder.

```
//10dan 1'e kadar olan sayıları yazdıran program  
int i = 10;  
while(i>0){  
  printf("sayi: %d \n",i);  
  i--;  
}
```

while döngüsü içindeki koşul sürekli doğru olursa sonsuz döngü oluşur. Döngüyü durduracak bir koşul olmadığı için döngü program sonlandırılana dek devam eder.

```
//1 değeri doğru(True) değeri temsil eder  
while(1){  
  printf("bu bir sonsuz dongudur");  
}
```

#### do while döngüsü

while döngüsünden farklı olarak döngü koşulunu başta değil sonda kontrol eder.

```
//10dan 1'e kadar olan sayıları yazdıran program  
int sayi=10;  
do{  
  printf("sayi: %d \n", sayi);  
  sayi--;  
}while(sayi>0);
```

do-while döngüsü önce deyimleri yürütür sonra koşulu sorgular. Bu bazı durumlarda oldukça kullanışlı olabilir.

```
//kullanıcıdan 0 gelinceye kadar alınan sayıları ekrana bastıran program.  
int sayi;  
do{  
  printf(" Bir sayi giriniz: ");  
  scanf("%d", &sayi);  
  printf("\n Girilen sayi: %d",sayi);  
}while(sayi!=0);
```

![do while döngüsü](0_LIayjiTDiNr-k5rJ.webp)

#### Döngü kontrol deyimleri

**break deyimi:** Döngü ifadesini sonlandırır ve yürütmeyi döngünün hemen sonrasındaki ifadeye aktarır.

```
//donguden çıkmak için q'ya basmak gereken program  
char c;  
while(1){  
  printf("bir karakter giriniz: ");  
  scanf("%c", &c);  
  if(c=='q'){  
    break;  
  }  
  printf("\n dongu devam ediyor");  
}  
printf("\n dongu sonlandı");
```

**continue deyimi:** Döngünün gövdesinin geri kalanını atlar ve döngünün sonraki iterasyonuna geçer.

```
for(;;){    // for ile sonsuz döngü  
  printf("bu deyim çalışır");  
  continue;  
  printf("bu deyim çalışmaz");  
}
```

yukarıdaki örnekte continue deyiminin altınsa kalan printf(), continue altında kalan deyimleri atlayıp döngüyü başa aldığı için hiç çalışmaz.

### Fonksiyonlar ve Yapılar

Fonksiyonlar ve yapıların temel işlevi deyimleri gruplamak/paketlemektir. Genel olarak fonskiyonlar çalışan deyimleri, yapılar verileri gruplar diyebiliriz.

#### Struct Tanımlama

Structlar bir kaydı temsil etmek için kullanılır. Kitaplıktaki kitaplarınızın kaydını tutmak istediğinizi varsayalım. Her kitapla ilgili aşağıdaki özellikleri tutmak isteyebilirsiniz:

* Kitap adı
* Konu
* Yazar
* Sayfa Sayısı

Bu kitabı bir struct ile tanımlamak istersek:

```
struct Books {  
   char  title[50];  
   char  author[50];  
   char  subject[100];  
   int   pages;  
} book;
```

şeklinde tanımlayabiliriz. Görüldüğü gibi bir çok veri türünü kullanarak daha geniş bir veri türü elde ediyoruz. Bu geniş veri türünü kullanmak için:

```
struct Books kitap1;   
//struct books türünde kitap1 isminde bir veri tipi tanımı  
strcpy( kitap1.title, "C programlama");  
strcpy( kitap1.author, "yazar adi");   
strcpy( kitap1.subject, "C");  
kitap1.pages = 680;
```

Yukaridaki kod parçasında karakter dizisi(string) değerlerini atamak için strcpy() fonksiyonu kullanılır. Diğer değerler '=' operatörü ile atanabilir.

#### **typedef**

typedef, C programlamasında mevcut veri türlerine yeni bir ad sağlamak için kullanılan bir anahtar kelimedir. typedef anahtar sözcüğü, zaten var olan adı yeniden tanımlamak için kullanılır. struct deyimiyle kullanımı çok yaygındır. Bu sayede struct anahtar kelimesini her tanımlamada tekrar kullanmamız gerekmez:

```
#include <stdio.h>  
#include <string.h>  
    
typedef struct students   
{  
  char name[50];  
  char branch[50];  
  int ID_no;  
} students;  
    
int main()  
{  
  students st;  //Tanımlamadas struct anahtar kelimesini kullanmadık  
  strcpy(st.name,   
         "Ahmet Yılmaz");  
  strcpy(st.branch,   
         "Bilgisayar Bilimleri");  
  st.ID_no = 108;  
      
  return 0;  
}
```

#### Fonksiyon Tanımlama

Bir fonksiyon, birlikte bir görevi gerçekleştiren deyimler grubudur. Her C programının en az bir işlevi vardır, bu da main()'dir. Fonksiyonlar devamında gelen () işaretleriyle simgelenir.

Bir fonksiyon tanımlama:

```
dönüş_tipi fonksiyon_ismi( parametreler) {  
   fonksiyon gövdesi  
  return   
}
```

* **dönüş tipi:** Fonksiyonun return deyimiyle döndürdüğü değerin türünü belirtir.
* **fonksiyon ismi:** fonksiyonu cağırırken kullandığımız isim.
* **parametreler:** parametre bir yer tutucu gibidir. Fonksiyon çağrıldığında parametrelere değerler verilir ve bu gerçek değer olarak adlandırılır.
* **fonksiyon gövdesi:** fonksiyonun içindeki deyimlerin yazıldığı bölüm.

```
//integer türünde değer dönen ve integer türünde num1 ve num2 değerlerini   
//alan max isminde bir fonksiyon  
int max(int num1, int num2) {  
int result;  
   
   if (num1 > num2)  
      result = num1;  
   else  
      result = num2;  
   
   return result;   
}
```

**fonksiyon imzası/bildirimi**

Bir fonksiyon bildirimi, derleyiciye bir işlev adı ve işlevin nasıl çağrılacağı hakkında bilgi verir. Fonksiyonun gerçek gövdesi ayrı ayrı tanımlanabilir.

```
int max(int num1, int num2);   //fonksiyon imzası
```

**fonksiyon çağrısı**

Bir fonksiyonu kullanmak için, tanımlanan parametrelere göre o fonksiyonu çağırmanız gerekir.

```
#include <stdio.h>  
   
/* fonksiyon imzası*/  
int max(int num1, int num2);  
/* main fonksiyonu */  
int main () {  
   int a = 100;  
   int b = 200;  
   int ret;  
   
   /* fonksiyon çağrısı*/  
   ret = max(a, b);  
   
   printf( "Max value is : %d\n", ret );  
   
   return 0;  
}  
   
/* fonksiyon tanımı */  
int max(int num1, int num2) {  
   int result;  
   
   if (num1 > num2)  
      result = num1;  
   else  
      result = num2;  
   
   return result;   
}
```

#### Özyinelemeli Fonksiyonlar

Kendini çağıran fonksiyonlarla oluşturulmuş döngüye benzer yapılardır. Kısaca bir fonksiyonun kendini çağırmasıdır.

```
void recursion() {  
   recursion(); /* fonksiyon kendini çağırıyor*/  
}  
  
int main() {  
   recursion();  
}
```

Yukarıda görüldüğü gibi recursion isimli fonksiyon kendini çağırıyor. Ancak bu kullanımda program sonsuza dek devam eder, çünkü durduracak bir koşul yok. Bu yüzden, özyinelemeli fonksiyonların kullanımında 2 durum gereklidir:

Temel durum: fonksiyonun kendini çağırmayı bıraktığı durumudur.

Rekürsif durum: fonksiyonun kendini çağırdığı durumdur.

```
int factorial(unsigned int i) {  
if(i <= 1) {  
      return 1;  //temel durum  
   }  
   return i * factorial(i - 1); //rekürsif durum  
}
```

---

## Bellek ve Dosya Yönetimi

Bu bölümde referanslama (işaretçiler) ve dosya işlemleriyle C'de bellek ve dosyaların nasıl yönetildiğini ele alıyoruz.

### Referanslama

#### İşaretçiler (pointers)

İşaretçi(pointer), C programlama dilini bir sistem dili yapan parçasıdır. İşaretçiler ile işletim sisteminin izin veriği ölçüde belleğe erişebilir ve yönetebiliriz. Bazı C programlama görevleri, işaretçiler ile daha kolay gerçekleştirilir ve dinamik bellek ayırma gibi diğer görevler, işaretçiler kullanılmadan gerçekleştirilemez.

İşaretçi, değeri başka bir değişkenin adresi, yani bellek konumunun doğrudan adresi(fiziksel adresi) olan bir değişkendir. İşaretçileri kullanarak bellek hücrelerine doğrudan erişim sağlayabiliriz. C'deki bir dizi veya vir fonksiyon da aslında bir işaretçidir, dizinin veya fonksiyonun bellekteki başlangıç adresini işaret eder.

```
int    *ip;    /* pointer to an integer */  
double *dp;    /* pointer to a double */  
float  *fp;    /* pointer to a float */  
char   *ch     /* pointer to a character */
```

Yukarıda farklı türlerde işaretçi tanımlarını görüyorsunuz. İşaretçilerin kullanımında iki operatörün önemi büyüktür:

* referencing \* : referansı verilen adreste tutlan değeri getirir.
* de-referencing & : bir değerin bellek konum adresini getirir.

Bu iki operatörü birbirinin zıttı olarak düşünebilriz. \* operatörü değerin bellek adresini getirirken, & operatörü verilen adresteki değeri getirir.

![Bu iki operatörü birbirinin zıttı olarak düşünebilriz](0_xhwIoaH5XH3vBH9k.webp)

referencing de-referencing

p bellek adresi tutan bir değişken olsun yani pointer. \*p, p'de tutulan bellek adresindeki değeri verir, &p ise p'nin kendi bellek adresini verir.

Bu mantıkla bir pointerı referans eden başka bir pointer yaratabiliriz.

![pointer to pointer](0_fqOhphnMCqrtdVI2.webp)

var isminde bir değişkenimiz olsun, bu değişenin adresini ptr'ye atalım. Sonrasında, ptr'nin adresini de pptr isminde başka bir pointera atalım.

```
int var = 1234;  
int *ptr = &var;  
int **pptr = &ptr;
```

Yukarıda pointer to pointer durumunu tanımladık. Bu durumu bir zincir şeklinde istediğimiz kadar uzatabiliriz. Aşağıda çalışan bir örnek verilmiştir.

```
#include <stdio.h>  
   
int main () {  
  
   int  var;  
   int  *ptr;  
   int  **pptr;  
  
   var = 3000;  
  
   /* take the address of var */  
   ptr = &var;  
  
   /* take the address of ptr using address of operator & */  
   pptr = &ptr;  
  
   /* take the value using pptr */  
   printf("Value of var = %d\n", var );  
   printf("Value available at *ptr = %d\n", *ptr );  
   printf("Value available at **pptr = %d\n", **pptr);  
  
   return 0;  
}
```

#### pointer aritmertiği

Bir önceki bölümde pointerların bellek adresi tutan değişkenler olduğundan bahsetmiştik. Yani, tuttuğu değer tek sadece bellek adresi tutuyor. Buna rağmen, int, float, char, double gibi farklı türlerde tanımlandığını görmüştük. Bu 4 tanımlamada aslında aynı tür değeri tutuyor. Peki farkları ne?

Burada pointer aritmetiği devreye giriyor. c'deki işaretçi, sayısal bir değer olan bir adrestir. Bu nedenle, sayısal bir değerde olduğu gibi bir işaretçide de aritmetik işlemler gerçekleştirebilirsiniz. İşaretçiyi tanımladığınız türe göre bu aritmetik işlemler yapılacaktır. Örneğin:

* char — 1 byte: işaretçiyi bir arttırdığınızda bellekte 1 bayt sonraki konumu gösterecektir.
* int — 4 byte: işaretçiyi bir arttırdığınızda bellekte 4bayt sonraki konumu gösterecektir.
* float — 4byte: işaretçiyi bir arttırdığınızda bellekte 4bayt sonraki konumu gösterecektir.
* double — 8byte: işaretçiyi bir arttırdığınızda bellekte 8 bayt sonraki konumu gösterecektir.

Bu mantık dizilerde çok işimize yarar. 10 elemanlı bir integer dizisi düşünün, bir integer pointer ile o diziyi rahatlıkla dolaşabilirsiniz. pointerı bir arttırdığınızda sonraki elemana geçmiş olur. Bir aalltığınızda önceki elemana geçer. Ancak, dizinin dışına çıkmamaya dikkat etmelisiniz!

```
#include <stdio.h>  
  
const int MAX = 3;  
  
int main () {  
  
   int  var[] = {10, 100, 200};  
   int  i, *ptr;  
  
   /* let us have array address in pointer */  
   ptr = var;  
   
   for ( i = 0; i < MAX; i++) {  
  
      printf("Address of var[%d] = %x\n", i, ptr );  
      printf("Value of var[%d] = %d\n", i, *ptr );  
  
      /* move to the next location */  
      ptr++;  
   }  
   
   return 0;  
}
```

Yukarıdaki örnekte, pointerlar ile bir dizide gezmeye örnek verilmiştir. ptr++ bellekte 4 bayt sonraki konuma işaret eder.

#### Dinamik Bellek Yönetimi

Bu bölüm, C'deki dinamik bellek yönetimini açıklar. C programlama dili, bellek tahsisi ve yönetimi için çeşitli işlevler sağlar. Bunlar:

* **malloc():** bellekten belirli boyutta bir alan tahsis eder.
* **calloc():** bellekten belirli boyutta bir alanı temizleyip tahsis eder.
* **realloc():** bellekteki bir alanın boyutunu değiştirip yeniden tahsis eder.
* **free():** bellekteki bir alanın tahsisini sonlandırır.

Programlama yaparken bir dizinin boyutunu bilirseniz onu statik bir dizi olarak tanımlayabilirsiniz. Bu dizinin alanı, program başladığında tahsis edilir ve program sonlanana kadar devam eder. Ancak, program akışı içinde bir dizi tanımlamak veya değiştirmek isterseniz bunu statik olarak yapamazsınız. Dinamik olarak bir dizi tanımlamak için dinamik bellek yönetimini kullanmak zorundasınız.

```
#include <stdio.h>  
#include <stdlib.h>  
#include <string.h>  
  
int main() {  
  
   char name[100];  
   char *a1;  
  
   strcpy(name, "Zara Ali");  
  
   /* allocate memory dynamically */  
   a1 = malloc( 200 * sizeof(char) );  
   
   printf("Name = %s\n", name );  
   printf("Description: %s\n", a1);  
    
  free(a1);  
}
```

Yukarıki programda, 200 charlık bir alan bellekten dinamik olarak tahisis edilmiştir. Program sonunda free() ile bu alan bırakılmıştır.

### Dosya işlemleri

C dilinde bir dosyadan okuma/yazma yapmak için bazı fonksiyonlara ihtiyaç duyarız. Bunlar, fopen() ve fclose() fonksiyonlarıdır. Bu fonksiyonlarla birlikte yapılacak işlemlerde dosya açma modları önemlidir. Dosya hangi modda açıldıysa o moddaki işlemler yapılabilir.   
Dosya açma modları:

* r: Okuma amacıyla mevcut bir metin dosyasını açar.
* w: Yazmak için bir metin dosyası açar. Mevcut değilse, yeni bir dosya oluşturulur. Mevcut ise üstüne yazar.
* a: Ekleme moduda yazmak için bir metin dosyası açar. Mevcut değilse, yeni bir dosya oluşturulur. Mevcut ise dosya içeriğine içerik eklemeye başlayacaktır.
* r+: Hem okuma hem de yazma için bir metin dosyası açar.
* w+: Hem okuma hem de yazma için bir metin dosyası açar. Varsa, önce dosyayı sıfırlar,. Yoksa bir dosya oluşturur.
* a+: Hem okuma hem de yazma için bir metin dosyası açar. Dosya yoksa, dosyayı oluşturur. Okuma baştan başlayacak, ancak yazı sadece eklenebilir.

Dosya açmak ve kapatmak için bu fonksiyonları ve modları beraber kullanabiliriz.

```
FILE *fp;  
fp = fopen( filename, mode );
```

Aşağıda dosya işlemleriyle ilgili çalışan bir örnek verilmiştir.

```
#include <stdio.h>  
  
void main() {  
   FILE *fp;  
  
   fp = fopen("/tmp/test.txt", "w+");  
   fprintf(fp, "This is testing for fprintf...\n");  
   fputs("This is testing for fputs...\n", fp);  
   fclose(fp);  
}
```

---

## Uygulama Laboratuvarı

Eğitim boyunca çözülen alıştırma soruları aşağıda bir araya getirilmiştir.

### Temel Algoritma ve Karar Yapısı Soruları

#### soru-1

Verilen iki sayının toplamını konsol ekranında gösteren bir C programı yazınız.

#### soru-2

Kullanıcıdan alınan iki sayı ile dört işlemi yerine getiren ve konsol ekranında sonuçları gösteren bir C programı yazınız.

#### soru-3

İki kenar uzunluğu verilen bir dikdörtgenin alanını hesaplayıp ekrana yazan bir C programı yazınız.

#### soru-4

Kullanıcıdan alınan 3 sayıdan en büyüğünü bulan C programını yazınız.

#### soru-5

Klavyeden girilen bir işlem kodu ve iki sayıya göre dört işlem arasında belirtilen işlemi yapan ve sonucu ekrana bastıran bir C programı yazınız.

#### soru-6

Bir derse ait üç farklı not değerinin ortalamasını hesaplayın, sonuc 50'den küçükse kaldınız büyükse geçtiniz yazan bir C programı yazınız.

#### soru-7

Kullanıcıdan 3 sayı alınız. switch yapısı kullanarak 1 girdiğinizde birinci sayının karesini 2 girdiğinizde ikinci sayının karesini, 3 girdiğinizde 3.sayının karesini hesaplayan bir C programı yazınız.

### İleri Seviye Yapı (Struct) ve Fonksiyon Soruları

#### soru-1

Bilgisayar isminde bir struct oluşturup, işlemcisi, bellek kapasitesi, disk kapasitesi gibi tanımlamalar yapınız ve bu tanımlamalara atamalar yapınız.

#### soru-2

Ders isminde bir struct oluşturup, dersin adını, dersi veren öğretmeni, dersin sınıfını ve dersin kodunu bu structta tanımlayınız. Bu verileri kayıt bölümünde kullanıcıdan alıp, kontrol bölümünde istenilen dersi ekrana basan programı yazınız.

#### soru-3

Parametre olarak bir isim alan ve aldığı isimle ekrana "merhaba \_isim\_" yazdıran fonksiyonu yazınız.

#### soru-4

seçilen bir işlem türüne göre dairenin alanını veya çevresini hesaplayabilecek fonksiyonu yazınız ve programda kullanınız.

#### soru-5

25 elemanlı bir veri dizisi için ortalamayı hesaplayan fonksiyonu yazıp programda kullanınız.

#### soru-6

klavyeden girilen iki sayı için minimum değer, maximum değer ve ortalama değerleri dönen 3 foksiyon tanımlayıp bunları kullanan programı yazınız.

#### soru-7

Verilen bir stringi tersine çeviren fonksiyonu tanımlayınız ve programda kullanınız.
