import type { Lang } from "../config/site";

export type ProjectCategory = "engineering" | "research" | "books";

/** Section headings for the Projects page, in display order. */
export const PROJECT_CATEGORIES: Record<ProjectCategory, Record<Lang, string>> = {
  engineering: { tr: "Güvenlik Mühendisliği ve Araçlar", en: "Security Engineering & Tooling" },
  research: { tr: "Araştırma", en: "Research" },
  books: { tr: "Açık Kaynak Web Kitapları", en: "Open-Source Web Books" },
};

export interface Project {
  name: Record<Lang, string>;
  description: Record<Lang, string>;
  /** Font Awesome solid icon name. */
  icon: string;
  repo: string;
  demo?: string;
  tags: string[];
  category: ProjectCategory;
  /** Shown on the home page. */
  featured?: boolean;
}

/** Ordered by relevance to security engineering; the Projects page groups them by category in this order. */
export const PROJECTS: Project[] = [
  {
    name: { tr: "Elastic GenAI SecOps", en: "Elastic GenAI SecOps" },
    description: {
      tr: "Basic lisanslı Elastic Stack üzerinde açık, yapay zeka destekli SecOps platformu: Logstash/Beats ile log toplama, 30 tespit kuralı, NATS JetStream üzerinde alarm korelasyonu, KVKK uyumlu PII maskeleme, analist onaylı LLM triyajı ve salt okunur MCP sunucusu.",
      en: "An open, AI-assisted SecOps platform on the Basic-licensed Elastic Stack: Logstash/Beats ingestion, 30 detection rules, alert-to-incident correlation over NATS JetStream, PII masking, human-reviewed LLM triage, and a read-only MCP server.",
    },
    icon: "shield-halved",
    repo: "https://github.com/ytalharabaci/elastic-genai-secops",
    demo: "https://ytalharabaci.github.io/elastic-genai-secops/",
    tags: ["SIEM", "Detection Engineering", "Elastic Stack", "LLM Triage", "Go"],
    category: "engineering",
    featured: true,
  },
  {
    name: { tr: "Vantage", en: "Vantage" },
    description: {
      tr: "Gophish tabanlı, Go ile geliştirilmiş asenkron SecOps Hub platformu. ProjectDiscovery araçları (Nuclei, Subfinder) orkestrasyonu, Chisel ile ters L3 tünelleme üzerinden iç ağ taraması ve oltalama simülasyonu yönetimi sunar.",
      en: "An asynchronous Go-based SecOps hub forked from Gophish that orchestrates ProjectDiscovery tools (Nuclei, Subfinder), runs internal network scans over Chisel-based reverse L3 tunnels, and manages phishing simulations.",
    },
    icon: "crosshairs",
    repo: "https://github.com/ytalharabaci/vantage",
    tags: ["Go", "SecOps", "ProjectDiscovery", "Gophish", "L3 Tunneling"],
    category: "engineering",
  },
  {
    name: { tr: "MCP Agentic AI Security", en: "MCP Agentic AI Security" },
    description: {
      tr: "Model Context Protocol (MCP) ekosisteminin güvenlik analizi, otonom ajan tehdit taksonomisi (Prompt Injection, Tool Poisoning), IEEE formatında araştırma makalesi ve interaktif Slidev sunumu.",
      en: "Security analysis of the Model Context Protocol (MCP) ecosystem: an agentic threat taxonomy (prompt injection, tool poisoning), an IEEE-format research paper, and an interactive Slidev presentation.",
    },
    icon: "robot",
    repo: "https://github.com/ytalharabaci/mcp-agentic-ai-security",
    demo: "https://ytalharabaci.github.io/mcp-agentic-ai-security/",
    tags: ["MCP", "Agentic AI", "LLM Security", "Threat Modeling"],
    category: "research",
    featured: true,
  },
  {
    name: { tr: "Apache BigData SIEM", en: "Apache BigData SIEM" },
    description: {
      tr: "Kafka KRaft, Spark Streaming, Hadoop HDFS ve Hive ile Lakehouse mimarisinde gerçek zamanlı log akışı işleyen, akış tabanlı K-Means ile ağ anomalilerini tespit eden ölçeklenebilir SIEM/NDR platformu.",
      en: "A scalable lakehouse SIEM/NDR platform built on Kafka KRaft, Spark Streaming, Hadoop HDFS, and Hive, using streaming K-Means for real-time network anomaly detection.",
    },
    icon: "magnifying-glass-chart",
    repo: "https://github.com/ytalharabaci/Apache-BigData-SIEM",
    demo: "https://ytalharabaci.github.io/Apache-BigData-SIEM/",
    tags: ["SIEM", "NDR", "Kafka", "Spark Streaming", "Anomaly Detection"],
    category: "engineering",
  },
  {
    name: { tr: "ApiGoat", en: "ApiGoat" },
    description: {
      tr: "OWASP API Security Top 10 (2023) zafiyetlerini uygulamalı deneyimlemek için Node.js, Express ve MongoDB ile tek Docker konteynerinde geliştirilmiş, kasıtlı olarak güvensiz RESTful API eğitim platformu.",
      en: "A deliberately vulnerable RESTful API built with Node.js, Express, and MongoDB in a single Docker container for hands-on practice with the OWASP API Security Top 10 (2023).",
    },
    icon: "bug",
    repo: "https://github.com/ytalharabaci/apigoat",
    demo: "https://ytalharabaci.github.io/apigoat/",
    tags: ["API Security", "OWASP", "Node.js", "Docker"],
    category: "engineering",
  },
  {
    name: { tr: "WebVuln Runner", en: "WebVuln Runner" },
    description: {
      tr: "15+ zafiyetli laboratuvar ortamını (Juice Shop, DVWA, WebGoat vb.) Whiptail TUI ve statik web arayüzüyle saniyeler içinde ayağa kaldıran, güvenlik eğitimi için Docker tabanlı araç.",
      en: "A Docker-based launcher with a Whiptail TUI and a static dashboard that spins up 15+ vulnerable web labs (OWASP Juice Shop, DVWA, WebGoat, and more) for security training.",
    },
    icon: "flask",
    repo: "https://github.com/ytalharabaci/webvuln-runner",
    demo: "https://webvulnrunner.dev/",
    tags: ["AppSec", "Docker", "Bash", "CTF Labs"],
    category: "engineering",
  },
  {
    name: { tr: "Ubuntu Sovereign Stack", en: "Ubuntu Sovereign Stack" },
    description: {
      tr: "Bulut bağımlılığını ortadan kaldıran on-premise açık kaynak kurumsal referans mimari: Ubuntu LTS, RKE2/Rancher, rootless Podman, Samba 4 AD + Authentik (SSO/MFA), Wazuh SIEM/XDR, Ansible ile kurulum ve ağ politikası, RBAC ve pod güvenliği sıkılaştırma rehberi.",
      en: "An on-premise, open-source enterprise reference architecture for data sovereignty: Ubuntu LTS, RKE2/Rancher, rootless Podman, Samba 4 AD + Authentik (SSO/MFA), Wazuh SIEM/XDR, Ansible provisioning, and network-policy, RBAC, and pod-security hardening guides.",
    },
    icon: "server",
    repo: "https://github.com/ytalharabaci/ubuntu-sovereign-stack",
    demo: "https://ytalharabaci.github.io/ubuntu-sovereign-stack/",
    tags: ["Kubernetes", "Wazuh", "IAM", "Hardening", "Ansible"],
    category: "engineering",
    featured: true,
  },
  {
    name: { tr: "Serverless E-Commerce", en: "Serverless E-Commerce" },
    description: {
      tr: "Cloudflare ekosistemi (Workers, Pages, D1, R2) üzerinde React, Hono ve Prisma ile geliştirilmiş, uç telemetri, KVKK uyumu ve modüler ödeme geçitlerine sahip tamamen serverless PWA e-ticaret platformu.",
      en: "A fully serverless PWA e-commerce platform on Cloudflare (Workers, Pages, D1, R2) built with React, Hono, and Prisma, with edge telemetry, KVKK compliance, and modular payment gateways.",
    },
    icon: "cart-shopping",
    repo: "https://github.com/ytalharabaci/e-commerce-cloudflare",
    demo: "https://ecommerceflaredev.web.tr/",
    tags: ["Serverless", "Cloudflare D1/R2", "Hono", "React"],
    category: "engineering",
  },
  {
    name: { tr: "Intel NPU GNN Benchmarking", en: "Intel NPU GNN Benchmarking" },
    description: {
      tr: "Graf Sinir Ağlarının (GNN) Intel Core Ultra NPU üzerinde OpenVINO ve ONNX ile FP32/INT8 gecikme ve enerji verimliliği analizi, IEEE HPEC 2026 yayını ve interaktif poster çalışması.",
      en: "FP32/INT8 latency and energy-efficiency characterization of Graph Neural Networks on the Intel Core Ultra NPU with OpenVINO and ONNX, featuring an IEEE HPEC 2026 paper and interactive poster.",
    },
    icon: "microchip",
    repo: "https://github.com/ytalharabaci/intel-npu-gnn-benchmarking",
    demo: "https://ytalharabaci.github.io/intel-npu-gnn-benchmarking/",
    tags: ["Edge AI", "Intel NPU", "OpenVINO", "IEEE HPEC"],
    category: "research",
  },
  {
    name: { tr: "Ağ Yönetimi ve Güvenliği", en: "Network Management & Security (TR web book)" },
    description: {
      tr: "Kurumsal ağ mimarisinden derin paket incelemesine 12 bölüm ve 39 alt bölümlük açık kaynak Türkçe web kitabı: Wireshark PCAP analizleri, DoS/DDoS ve C2 tünel tespiti, Active Directory/Kerberos güvenliği, NetDevOps, bulut ağları ve SOC/NOC ağ adli bilişimi.",
      en: "An open-source Turkish web book in 12 chapters and 39 sections, from enterprise network architecture to deep packet inspection: Wireshark PCAP analysis, DoS/DDoS and C2 tunnel detection, Active Directory/Kerberos security, NetDevOps, cloud networking, and SOC/NOC network forensics.",
    },
    icon: "network-wired",
    repo: "https://github.com/ytalharabaci/ag-yonetimi-ve-guvenligi",
    demo: "https://ytalharabaci.github.io/ag-yonetimi-ve-guvenligi/",
    tags: ["Web Book", "Network Security", "Wireshark", "Threat Hunting", "DFIR"],
    category: "books",
  },
  {
    name: { tr: "Uygulamalı Kriptoloji", en: "Applied Cryptography (TR web book)" },
    description: {
      tr: "Matematiksel temellerden simetrik/asimetrik şifrelemeye, özet fonksiyonlarından TLS ve kuantum sonrası kriptografiye (PQC) 7 modül ve 35 alt bölümlük açık kaynak Türkçe web kitabı: Go ve Python uygulamaları ile pratik kriptanaliz senaryoları.",
      en: "An open-source Turkish web book in 7 modules and 35 chapters covering mathematical foundations, modern ciphers (AES, ChaCha20, RSA, ECC), digital signatures, TLS 1.3, PQC, and cryptanalysis with Python and Go.",
    },
    icon: "key",
    repo: "https://github.com/ytalharabaci/uygulamali-kriptoloji",
    demo: "https://ytalharabaci.github.io/uygulamali-kriptoloji/",
    tags: ["Web Book", "Applied Cryptography", "Cryptanalysis", "Go", "Python", "AES/ECC"],
    category: "books",
  },
  {
    name: { tr: "Siber Güvenlik Operasyonları", en: "Cyber Security Operations (TR web book)" },
    description: {
      tr: "Bilgi, kimlik, veri, ağ, uç nokta, bulut, OT/ICS ve yapay zeka güvenliğinden SOC operasyonlarına 14 bölüm ve 49 başlıkta uzanan, NIST, ISO 27001, MITRE ATT&CK ve KVKK/5651/BDDK eşlemelerini içeren açık kaynak Türkçe web kitabı.",
      en: "An open-source Turkish web book covering 14 security domains and 49 topics, from identity, data, network, endpoint, cloud, OT/ICS, and AI security to SOC operations, mapped to NIST, ISO 27001, MITRE ATT&CK, and Turkish regulations (KVKK, 5651, BDDK).",
    },
    icon: "book-open",
    repo: "https://github.com/ytalharabaci/siber-guvenlik-operasyonlari",
    demo: "https://ytalharabaci.github.io/siber-guvenlik-operasyonlari/",
    tags: ["Web Book", "SOC", "NIST", "ISO 27001", "MITRE ATT&CK"],
    category: "books",
  },
];
