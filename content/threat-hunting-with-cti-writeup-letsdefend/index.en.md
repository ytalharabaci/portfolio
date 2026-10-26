---
date: '2025-09-29'
description: "A hands-on LetsDefend threat hunting writeup analyzing Cyber Threat Intelligence (CTI) feeds, IoC correlation, threat actor attribution, and proactive hunting hypotheses."
draft: false
image: featured.webp
title: Threat Hunting with CTI Writeup - LetsDefend
type: writeups
topic: detection-response
tags: ["LetsDefend", "Threat Hunting", "Write-up", "Blue Team", "SIEM", "Threat Intelligence", "CTI"]
featuredImageAlt: "LetsDefend Blue Team Training logo"
---

[Letsdefend Blue Team Training Platform](https://letsdefend.io/)

Cyber Threat Intelligence (CTI) refers to the information collected, evaluated, and analyzed about cyber threats. It includes how, where, and by whom cyber attacks are carried out, the targets of the attacks, and the techniques used. CTI helps security teams make informed decisions about cyber threats, develop defense strategies, and respond more effectively to cybersecurity incidents.

---

## Use of CTI

* **Threat Hunting:** CTI is used in threat hunting processes to help identify potential threats. Cybersecurity teams use CTI data to investigate suspicious activities and identify threats.
* **Security Operations Center (SOC):** SOC analysts use CTI data to monitor and analyze daily security incidents. Thus, it enables analysts to detect and respond to threats quickly.
* **Malware Analysis:** CTI is used in the analysis and detection of malware. Analysts use CTI data to understand the behavior and propagation methods of malicious software.
* **Security Policies and Strategies:** CTI contributes to the development of security policies and strategies. By providing information about the nature and scope of threats, it ensures that policies are more effective.
* **Risk Assessment:** CTI is used in the assessment of cyber risks. Integrated into risk management processes, it helps understand the potential impact and likelihood of threats.
* **Attack Surface Analysis:** CTI helps organizations analyze their attack surface and identify weak points. This enables the mitigation of vulnerabilities and the improvement of defense measures.

---

## CTI Resources

Cyber Threat Intelligence (CTI) resources are critical for detecting and analyzing cyber threats and developing defense strategies against them. CTI resources include information obtained from various sources such as open-source intelligence (OSINT), commercial CTI providers, dark web intelligence, and threat intelligence sharing networks (ISACs). These resources provide cybersecurity teams with up-to-date and accurate threat information, helping them prevent potential attacks and respond to incidents more quickly.## Open Source Intelligence (OSINT)

Open Source Intelligence (OSINT) is the process of creating threat intelligence using information collected from publicly available sources. It includes data and documents freely accessible on the internet.

![Open Source Intelligence (OSINT) is the process of creating threat intelligence using information collected from publicly](./0_QCFb2afqMZEyappU.webp)

( **Image Source** : <https://www.linkedin.com/pulse/osint-top-15-open-source-intelligence-tools-securetriad/> )

---

## Objectives of OSINT

* **Information Gathering:** To collect information from various open sources to gain a comprehensive understanding of threat actors.
* **Analysis and Evaluation:** To analyze collected information to assess potential threats.
* **Early Warning:** To provide early warnings about potential threats and develop security measures.

---

## Workflow of OSINT

* **Source Identification:** Identifying reliable and relevant sources on the Internet.
* **Data Collection:** The process of collecting data from identified sources can be manual or automated.
* **Data Analysis:** Analyzing the collected data and transforming it into meaningful information.
* **Reporting:** Reporting the results of the analysis and presenting them to the relevant parties.

---

## Sources of OSINT

* **Social Media:** Data from platforms like Twitter, Facebook, and LinkedIn.
* **Blogs and Forums:** Blogs by security researchers and cybersecurity forums.
* **News Websites:** Current news about cyberattacks and threats.
* **Official Publications:** Reports and announcements by government and security organizations.

---

## Advantages of OSINT

* **Accessibility:** Freely accessible information provides access to a wide range of data sources.
* **Cost-Effectiveness:** Threat intelligence is obtained using free or low-cost information sources.
* **Diversity:** Data from diverse sources enables comprehensive and multifaceted analysis.

---

## Disadvantages of OSINT

* **Lack of Accuracy and Reliability:** It canbe challenging to verify the accuracy and reliability of information from open sources.
* **Data Overload:** Large volumes of data can make it difficult to distinguish meaningful information.
* **Issues of Privacy and Ethics:** Privacy and ethical guidelines must be followed during the information-gathering process.

In summary, Open Source Intelligence (OSINT) provides a broad and accessible source of information about cyber threats. When used with the right sources and analysis methods, OSINT supports cybersecurity strategies and plays a significant role in detecting threats.

---

## Commercial CTI Providers

Commercial CTI providers are organizations that offer paid services to deliver comprehensive threat intelligence. Providers analyze data collected from various sources and present it to their clients.

---

## Objectives of Commercial CTI Providers

* **Professional Service:** To provide clients with high-quality and verified threat intelligence.
* **Risk Mitigation:** To help clients reduce cybersecurity risks.
* **Incident Response:** To provide necessary information for quick and effective responses to cybersecurity incidents.

---

## Workflow of CTI Products

* **Data Collection:** Data collection from multiple sources (open sources, dark web, specialized databases).
* **Analysis:** Analysis of data by advanced analysis tools and expert analysts.
* **Reporting and Notification:** Reporting of analysis results to clients.
* **Integration:** Automation of threat data processing through integration with systems such as SIEM and EDR.

---

## Commercial CTI Sources

* **Threat Intelligence Platforms:** Platforms like MISP, ThreatConnect, and Anomali.
* **Security Companies:** Companies like FireEye, CrowdStrike, and Recorded Future.
* **Special Reports and Analysis:** Reports on specific threats and attack campaigns.

---

## Advantages of Commercial CTI Sources

* **High Quality:** It offers verified and high-quality threat intelligence with analysis.
* **Time-Saving:** It eliminates the need for clients to collect and analyze data themselves.
* **Expert Analysis:** It provides in-depth analysis and recommendations provided by security experts.

---

## Disadvantages of Commercial CTI Sources

* **Cost:** Commercial CTI services are often expensive.
* **Privacy Issues:** Clients must ensure the confidentiality of shared information.
* **Dependency:** Clients may become overly reliant on commercial providers for their security strategies.

In summary, Commercial CTI providers offer in-depth knowledge and analysis, enhancing organizations' security capabilities. These services are particularly critical for organizations facing large-scale and targeted attacks.

---

## Dark Web Intelligence

Dark Web Intelligence refers to threat intelligence obtained from activities conducted in the hidden and restricted areas of the internet (dark web). The dark web is a hub for cybercriminal activities, where transactions are anonymous and difficult to trace.

![Dark Web Intelligence refers to threat intelligence obtained from activities conducted in the hidden and restricted areas of](./0_gLkIRKtsRkm_AvVk.webp)

( **Image Source** : <https://www.hawk-eye.io/2020/12/dark-web-and-threat-intelligence-darkint/> )

---

## Objectives of Dark Web Intelligence

* **Monitoring Cybercrime:** Monitoring and analyzing cybercriminal activities on the dark web.
* **Preventive Measures:** Using information from the dark web to take preventive measures against potential threats.
* **Incident Response:** Quickly detect threats on the dark web and respond to incidents.

---

## Workflow of Dark Web Intelligence

* **Access and Monitoring:** Accessing the dark web and collecting data from various sources.
* **Data Collection:** Collecting data from dark web marketplaces, forums, and other sources.
* **Analysis:** Analyzing collected data to extract meaningful insights.
* **Reporting:** Reporting findings and presenting them to relevant teams.

---

## Dark Web Intelligence Sources

* **Dark Markets:** Platforms where malware, stolen data, and counterfeit documents are sold.
* **Hacker Forums:** Platforms where attackers share information and collaborate.
* **Dark Web Search Engines:** Specialized search engines for finding information on the dark web.

---

## Advantages of Dark Web Intelligence

* **Early Warning:** It provides early warnings about activities on the dark web, enabling preparedness for potential threats.
* **In-Depth Knowledge:** It offers detailed insights into cybercriminal activities.
* **Preventive Measures:** It enables proactive preventive measuressources based on dark web intelligence.

---

## Disadvantages of Dark Web Intelligence

* **Access Challenges:** Accessing and collecting data from the dark web requires technical expertise and specialized tools.
* **Lack of Reliability:** Ensuring the accuracy and reliability of collected information can be challenging.
* **Privacy and Legal Issues:** Privacy and legal concerns may arise during the information-gathering process.

In summary, Dark Web Intelligence plays a critical role in the early detection and prevention of cybersecurity threats. Monitoring and analyzing activities on the dark web strengthens organizations' cybersecurity strategies and prepares them for potential threats.

---

## Threat Intelligence Sharing Networks (ISACs)

Information Sharing and Analysis Centers (ISACs) are organizations established to facilitate threat intelligence sharing and collaboration among specific sectors or regions. ISACs encourage trusted information exchange among members, creating a collective defense mechanism against cyber threats.

![Information Sharing and Analysis Centers (ISACs) are organizations established to facilitate threat intelligence sharing and](./0_ndThW-HJCSsjSzE-.webp)

( **Image Source** : <https://www.anomali.com/blog/the-power-of-active-collaboration-in-isacs-isaos-and-security-interest-groups> )

---

## Objectives of ISACs

* **Information Sharing:** They facilitate the sharing of information about cyber threats, vulnerabilities, and attacks among members.
* **Analysis and Evaluation:** They analyze collected information to produce sector-specific threat assessments and reports.
* **Defense Strategies:** They develop tailored security recommendations and defense strategies for members.
* **Incident Response Support:** They provide support and guidance to members during cybersecurity incidents.

---

## Workflow of ISACs

* **Membership:** ISACs are typically sector-based and accept organizations from specific industries as members.
* **Information Collection and Distribution:** ISACs collect threat information from members and various sources, analyze it, and distribute it back to members.
* **Collaboration and Coordination:** They encourage collaboration among members, coordinate information sharing, and develop joint defense strategies.
* **Training and Awareness:** ISACs organize training programs, workshops, and awareness campaigns for members.

---

## Examples of ISACs

* **Financial Services ISAC (FS-ISAC):** Threat intelligence sharing for the financial sector.
* **Health Information Sharing and Analysis Center (H-ISAC):** Threat intelligence sharing for the healthcare sector.
* **Automotive Information Sharing and Analysis Center (Auto-ISAC):** Threat intelligence sharing for the automotive sector.
* **Energy Information Sharing and Analysis Center (E-ISAC):** Threat intelligence sharing for the energy sector.

---

## Advantages of ISACs

* **Early Warning:** ISACs provide early warning of emerging threats across the industry.
* **Collective Defense:** ISACs enable you to develop stronger and more coordinated defense strategies through information sharing.
* **Resource Efficiency:** You can use security resources more efficiently through information sharing and collaboration.
* **Increased Trust:** You can increase security awareness and collaboration across the industry.

---

## Disadvantages of ISACs

* **Lack of Trust Between Partners:** Building trust among members for information sharing might be challenging.
* **Data Privacy:** Ensuring the confidentiality and proper use of shared information might be challenging.
* **Coordination Challenges:** Facilitating coordination and collaboration among different organizations.

Threat Intelligence Sharing Networks (ISACs) play a critical role in sector-specific cybersecurity. By promoting trusted information sharing among members, ISACs create a collective defense mechanism against cyber threats. Networks enhance the cybersecurity capabilities of sectors and provide a more resilient defense.

---

## Threat Hunting Process with CTI

Cyber Threat Intelligence (CTI) provides critical information for detecting, analyzing, and responding to threats, while threat hunting processes proactively search for potential threats using this information. It plays a vital role in every stage of the threat hunting cycle, from hypothesis creation to uncovering new threat patterns.

![Cyber Threat Intelligence (CTI) provides critical information for detecting, analyzing, and responding to threats, while](./0_166341rvbHYBcLS5.webp)

**(Image Source:** <https://www.researchgate.net/figure/The-Threat-Hunting-Loop_fig2_344319370> **)**

---

## Create Hypotheses

CTI plays a significant role in creating hypotheses during the threat hunting process. At this stage, it contributes in the following ways:

* **Threat Indicators (IOCs):** CTI provides threat indicators such as malware signatures, malicious IP addresses, and domains. These indicators serve as foundational information for creating hypotheses.
* **Information on Threat Actors:** CTI offers insights into the motivations, capabilities, and targets of specific threat actors. These insights are used to develop hypotheses about how and why potential threats might occur.

---

## Investigate With Tools and Techniques

CTI provides critical information for the tools and techniques used during the investigation phase. At this stage, CTI offers:

* **Threat Intelligence Integration:** CTI data is integrated into SIEM, EDR, and other security tools to support the threat hunting process.
* **Advanced Analysis Techniques:** CTI enables deeper analysis of threats. For example, understanding how specific malware operates and spreads allows this information to be used in analysis processes.
* **Threat Detection and Monitoring:** CTI provides information on specific threat indicators (IOCs) and attack methods (TTPs), making it easier for security tools to detect and monitor threats.

---

## Uncover New Patterns and TTPs

CTI plays a key role in uncovering new threat patterns and attack techniques (TTPs). At this stage, CTI's offers:

* **Data Enrichment:** CTI enriches existing data, enabling the discovery of new threat patterns and TTPs.
* **Anomaly Detection:** CTI helps identify deviations from normal behavior patterns and anomalies, leading to the identification of new threat patterns.
* **Continuously Updated Information:** CTI provides up-to-date information on the evolving tactics and techniques of threat actors. This information helps threat hunters detect new threats more quickly.

---

## Inform and Enrich Analytics

CTI plays a critical role in informing and enriching analytics during the threat hunting process. At this stage, CTI offers:

* **Providing Contextual Information:** CTI helps understand threats in a broader context. For example, it provides information not only about a malware file name but also about the threat actor group using it.
* **Data Correlation:** Comparing information from multiple data sources with CTI data accelerates the detection of anomalies and threats.
* **Incident Validation:** CTI data is used to validate detected incidents. For instance, when a security event matches an IOC in the CTI database, the event is verified.

---

## Threat Hunting Evaluation

CTI is essential in all threat hunting stages. From hypothesizing to uncovering new threat patterns, the information and analysis provided by CTI helps cybersecurity teams detect and respond to threats more effectively.

---

## Phishing Campaign Hypothesis

---

## Hypothesis

There may be a targeted phishing campaign against the employees of your organization. The campaign could be aimed at stealing employee credentials, accessing financial information, or installing malware.

---

## Data Sources

* **Cyber Threat Intelligence (CTI) Platform:** It collects and analyzes information about security threats.
* **Threat Intelligence Feeds:** They provide information on known email addresses, URLs, and IP addresses used in phishing campaigns.
* **SIEM System:** It is a tool for collecting and analyzing logs and security events.
* **Email Gateway Logs:** It monitors incoming and outgoing email traffic.
* **Web Proxy Logs:** It tracks users' internet access records.
* **Endpoint Detection and Response (EDR) Logs:** It monitors endpoint device activities and detects abnormal behavior.
* **User and Entity Behavior Analytics (UEBA):** It analyzes user and entity behavior to identify anomalies.

---

## Analysis Steps

* Collect logs from SIEM, email gateway, web proxy, and EDR systems.
* Gather data about phishing campaigns from the CTI platform and threat intelligence feeds.
* Compare logs with information from the CTI platform and feeds.
* Match logs with known phishing email addresses, URLs, and IP addresses.
* Identify techniques used in phishing campaigns (e.g., fake websites, phishing emails) and search for traces of these techniques in the logs.
* Detect emails from known phishing email addresses in email gateway logs.
* Check web proxy logs for user access to phishing URLs.
* Identify abnormal activities on devices of users exposed to phishing attacks in EDR logs.
* Analyze the content of phishing emails and identify social engineering techniques.
* Analyze user behavior to identify users who clicked on phishing emails or accessed fake websites.
* Use UEBA to detect unusual user behavior and potential account compromise attempts.
* Forward detected suspicious emails and web access incidents to the incident response team.
* The incident response team analyzes the details of the phishing campaign and identifies targeted users.
* Based on the findings, isolate affected accounts and devices to prevent further damage.

---

## Expected Outcomes

* Details and techniques of the targeted phishing campaign will be identified.
* Phishing emails sent during the campaign and fake websites accessed by users will be determined.
* Suspicious behavior and potential account compromise attempts will be detected, and relevant users will be informed while necessary measures are taken.
* By correlating with CTI data, phishing attacks can be detected earlier and proactive measures can be taken quickly.

---

## Threat Hunting Evaluation

This hypothesis outlines steps for detecting phishing campaigns on the network using CTI. In order to strengthen the company's security posture and prevent potential phishing attacks, these steps are critical.

---

## Practical Lab-1

---

## Hypothesis-1

**Note:** The questions in this section are designed for threat hunting based on the following hypothesis.

**Hypothesis:** Attackers may use social engineering techniques to deceive employees and deploy malware.

---

## Threat Hunting Lab Environment

* **Company Name:** RiverKids
* **Company Domain:** riverkidscorp.com
* CTI Events ([Threat Intel LetsDefend Platform](https://app.letsdefend.io/threat-intelligence-feed))
* Email Security ([LetsDefend Platform](https://app.letsdefend.io/email-security))
* SIEM (Wazuh)
* EDR Events (Sysmon)
* Firewall Traffic Events

---

## Lab Notes

* Analyze the logs between "Aug 1, 2024 00:00--Aug 7, 2024 00:00" to answer the questions below.
* Subsequent questions require correct answers from previous ones. **Answer all questions strictly in the order they appear.**

---

## Questions

**Note:** Analyze the logs between "Aug 1, 2024 00:00--Aug 7, 2024 00:00" to answer the questions below.

**Note:** Subsequent questions require correct answers from previous ones. Answer all questions strictly in the order they appear.

> **According to the CTI Platform (LetsDefend — Threat Intel), what domain was registered with a name similar to the company?**

Let's take a look at the information provided to us, then search for a domain similar to this name on the threat intelligence platform.

* **Company Name:** RiverKids
* **Company Domain:** riverkidscorp.com

![Company Domain: riverkidscorp.com](./1_yekAJru0KMyVhlg6bpmN6A.webp)

Threat Intel Platform

**Answer:** riverkidscompany.com

![According to the email security platform (LetsDefend — Email Security), what is the recipient email address of the email](./1_eqSXziyOfwwoJ53kaNcWOQ.webp)
> **According to the email security platform (LetsDefend — Email Security), what is the recipient email address of the email sent to company staff from the domain similar to the company's name?**

When we search for the email address we found in email security, we find the relevant email.

![When we search for the email address we found in email security, we find the relevant email](./1_Pxwjuuz1HFyqSglRUJg30A.webp)

Email Security

We caught the phishing email!

![Phishing email caught in the SIEM search results](./1_ZKap_okrbnuoS-Wx9yXUlw.webp)

Phishing Email

**Answer:** mike@riverkidscorp.com

![According to the email security platform (LetsDefend — Email Security) what is the sender's email address of the email sent](./1_5d15bAExCgOM6kBBzZSuLQ.webp)
> **According to the email security platform (**[**LetsDefend — Email Security**](https://app.letsdefend.io/email-security)**) what is the sender's email address of the email sent to company staff from the domain similar to the company's name?**

**Answer:** support@riverkidscompany.com

![According to the email security platform (LetsDefend — Email Security), what action was taken for the email sent to company](./1_7JSWzpHE1uJMtG9fX3vv_A.webp)
> **According to the email security platform (LetsDefend — Email Security), what action was taken for the email sent to company staff from the domain similar to the company's name?**

**Answer:** supportcenter.login.vpnccloudd.io

![According to the Threat Intel (LetsDefend) source, what is the category (TAG) of the domain included in the email sent to](./1_XnJPvu9tSbR-XsOLVEVkEA.webp)
> **According to the Threat Intel (**[**LetsDefend**](https://app.letsdefend.io/threat-intelligence-feed)**) source, what is the category (TAG) of the domain included in the email sent to company staff from the domain similar to the company's name?**

Search for the domain in the LetsDefend Threat Intel module.

![Search for the domain in the LetsDefend Threat Intel module](./1_g2esRTQHtNb0XrjnKlYQ8g.webp)

Threat Intel Module

**Answer:** phishing

![What is the IP address of the endpoint attempting to access the domain included in the email sent to company staff from the](./1_c0BoESPwDPtS1IFQOBMWPw.webp)
> **What is the IP address of the endpoint attempting to access the domain included in the email sent to company staff from the domain similar to the company's name?**

In the wazuh SIEM, search for the domain using the filter "data.win.eventdata.queryName: [domain\_name]" and find the "agent.ip" value in the results.

![In the wazuh SIEM, search for the domain using the filter "data.win.eventdata.queryName: domain name " and find the](./1_MnrquF9HFTs54z9kKVQHGQ.webp)

wazuh search

**Answer:** 192.168.16.54

![What process on the endpoint, identified in the previous question, sent the DNS request for the domain mentioned in the](./1_jnK249p3Rv6oQ_nZ94bJ-Q.webp)
> **What process on the endpoint, identified in the previous question, sent the DNS request for the domain mentioned in the email that was sent to company staff from the domain resembling the company's name?**

In the SIEM, search for the domain using the filter "data.win.eventdata.queryName: [domain\_name]" and find the "data.win.eventdata.image" value in the results.

![In the SIEM, search for the domain using the filter "data.win.eventdata.queryName: domain name " and find the](./1_Fq2HwaplZwaRH9a-_mO_Cw.webp)

wazuh search

**Answer:** outlook.exe

![What is the IP address of the URL contained in the email sent to company staff from the domain detected as similar to the](./1_-9bmE04JZ54U5ox3oR6IJA.webp)
> **What is the IP address of the URL contained in the email sent to company staff from the domain detected as similar to the company name?**

In the SIEM, search for the domain using the filter "data.win.eventdata.queryName: [domain\_name]" and find the "data.win.eventdata.queryResults" value in the results.

![In the SIEM, search for the domain using the filter "data.win.eventdata.queryName: domain name " and find the (2)](./1_lOwxv9KQu_KFIVzOY44tDA.webp)

**Answer:** 111.222.111.222

![What is the action taken for the access attempt to the IP address of the URL contained in the email sent to company staff](./1_tqKZvyHyVL6ksLSSaCj1nA.webp)
> **What is the action taken for the access attempt to the IP address of the URL contained in the email sent to company staff from the domain detected as similar to the company name?**

In the SIEM, apply the filter "data.dstip: [IP\_Address]" and check the "data.action" value in the results.

![In the SIEM, apply the filter "data.dstip: IP Address " and check the "data.action" value in the results](./1_ReStdK8t9Nb3Whp8CGUR-Q.webp)

wazuh search

**Answer:** deny

![LetsDefend lab questions](./1_Gmgyn6K9WEEeLku8z4fthQ.webp)

---

## Practical Lab-2

---

## Hypothesis-2

**Note:** The questions in this section are designed for threat hunting based on the following hypothesis.

**Hypothesis:** Published indicators of compromise (IoCs) associated with the APT-ENR-88 group that targets the energy sector may be present in system events.

---

## Threat Hunting Lab Environment

* **DMZ Server IP Block**: 172.16.8.0/24
* CTI Events ([Threat Intel LetsDefend Platform](https://app.letsdefend.io/threat-intelligence-feed))
* SIEM (Wazuh)
* EDR Events (Sysmon)
* Firewall Traffic Events

---

## Lab Notes

* Analyze the logs between "Aug 1, 2024 00:00--Aug 7, 2024 00:00" to answer the questions below.
* Subsequent questions require correct answers from previous ones. **Answer all questions strictly in the order they appear.**

---

## Questions

**Note:** Analyze the logs between "Aug 1, 2024 00:00--Aug 7, 2024 00:00" to answer the questions below.

**Note:** Subsequent questions require correct answers from previous ones. Answer all questions strictly in the order they appear.

> **According to the CTI Platform (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), how many different IoCs of the "APT-ENR-88" group were published?**

Search for the APT group name in the CTI platform.

![Search for the APT group name in the CTI platform](./1_5Yuk_f52Y7TVsNN1wozHhQ.webp)

CTI platform

**Answer:** 3

![According to the CTI Platform (LetsDefend — Threat Intel), what is the IP address of the system that communicated with the](./1_OFq10HlazVH4-1m47GftKA.webp)
> **According to the CTI Platform (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), what is the IP address of the system that communicated with the IP address listed in the IoCs of the "APT-ENR-88" group?**

Find the IP address among IoCs. Query IP address as destination IP address in SIEM. (data.dstip: 123.123.123.123)

![Find the IP address among IoCs](./1_0d8zs5GYGq5AfOg8lySnRg.webp)

**Answer:** 192.168.123.123

![According to the CTI Platform (LetsDefend — Threat Intel) what was the name of the process that communicated with the IP](./1_PC6mnau3Vpt421Z3joovIQ.webp)
> **According to the CTI Platform (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**) what was the name of the process that communicated with the IP address listed in the IOCs published regarding the group APT-ENR-88?**

Search for the IP address in SIEM using the destination IP address filter ("data.win.eventdata.destinationIp: [IP\_Address]").

![Search for the IP address in SIEM using the destination IP address filter ("data.win.eventdata.destinationIp: IP Address ")](./1_77gDh5EzbCf2l-IX5_fpfA.webp)

wazuh search

**Answer:** netapp0.exe

![According to the CTI Platform (LetsDefend — Threat Intel), what is the IP address of the system where the hash (listed in](./1_i9S0sk7Z3f8fGyoR_Zn5yQ.webp)
> **According to the CTI Platform (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), what is the IP address of the system where the hash (listed in the IOCs for threat group 'APT-ENR-88') was detected?**

Search for the hash in the SIEM using "\*[Hash\_Value]\*" or "data.win.eventdata.hashes" filter with "MD5=[Hash\_Value]".

![Search for the hash in the SIEM using " Hash Value " or "data.win.eventdata.hashes" filter with "MD5= Hash Value "](./1_EqomnGHWJy4E4AHcqXnRnA.webp)

wazuh search

**Answer:** 192.168.123.123

![According to the CTI Platform (LetsDefend — Threat Intel), what is the name of the process in the event where the hash](./1_kT63X4o_kgQsMH130lQfOA.webp)
> **According to the CTI Platform (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), what is the name of the process in the event where the hash listed in the IoCs of "APT-ENR-88" group was detected?**

Search for the hash as "\*[Hash\_Value]\*" in SIEM, or search by entering "MD5=[Hash\_Value]" in the "data.win.eventdata.hashes" field. Then, find the value "data.win.eventdata.image" in the output.

**Answer:** C:\\Program Files\\App\\app0.exe

![According to the CTI Platform (LetsDefend — Threat Intel), what is the firewall action for the access logs related to the IP](./1_OTzASTm8XfJBVN-KCNrN_g.webp)
> **According to the CTI Platform (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), what is the firewall action for the access logs related to the IP address listed in the IoCs of the "APT-ENR-88" group?**

In the SIEM's firewall events, apply the filter "data.dstip: [IP\_Address]" and find the "data.action" value.

![In the SIEM's firewall events, apply the filter "data.dstip: IP Address " and find the "data.action" value](./1_VfcxKaLhEbOxymFXcFH5og.webp)

wazuh search

**Answer:** deny

![According to the CTI Platform (LetsDefend — Threat Intel), what is the access log action for the IP address that the domain](./1_nKIDHVE_5oVV9mW1KJ-Z9A.webp)
> **According to the CTI Platform (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), what is the access log action for the IP address that the domain (listed in the IoCs of the group "APT-ENR-88") resolved to?**

Apply the "data.win.eventdata.queryName:" [Domain]" filter. Find the "QueryResults" value in the "data.win.system.message" field of the result, then search the firewall logs with the "data.dstip: [IP Address]" filter. Finally, check the "data.action" value in the result.

![Apply the "data.win.eventdata.queryName:" Domain " filter](./1_EtU9JpvdEEO5-a_z6uUVNg.webp)

wazuh search

We found the IP address returned by the query response to be "18.22.0.44." Let's check the firewall logs for access to this IP address.

![We found the IP address returned by the query response to be "18.22.0.44." Let's check the firewall logs for access to this](./1_GUauV7aGVrW6-Zo53Yujeg.webp)

"18.22.0.44" access logs

We see that access is allowed from here.

**Answer:** allow

![According to the CTI Platform (LetsDefend — Threat Intel), what was the target IP address within the organization's network](./1_AciJMgtZ5zsX86eXkZC1Yg.webp)
> **According to the CTI Platform (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), what was the target IP address within the organization's network that received connection attempts from the IP address listed in the IoCs of the "APT-ENR-88" group?**

In the SIEM's firewall events, apply the filter "data.srcip: [IP\_Address]" and check the "data.dstip" value.

![In the SIEM's firewall events, apply the filter "data.srcip: IP Address " and check the "data.dstip" value](./1_nnRFUmUVzzSZUTbvFe9S1g.webp)

wazuh search

**Answer:** 172.16.8.5

![According to the CTI Platform (LetsDefend — Threat Intel), what was the name of the IPS attack event triggered by access](./1_3pwV0CkT0kfvgtpif8qvYw.webp)
> **According to the CTI Platform (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), what was the name of the IPS attack event triggered by access attempts from the IP address (listed in IoCs for the "APT-ENR-88" group) to the organization's systems?**

In the SIEM's firewall events, apply the filters "data.srcip: [IP\_Address]" and "data.subtype: ips", then find the "data.attack" value.

![In the SIEM's firewall events, apply the filters "data.srcip: IP Address " and "data.subtype: ips", then find the](./1_yfpmGF6Qhoo7pWeuG2qfHQ.webp)

IPS log

**Answer:** Apache.Log4j.Remote.Code.Execution

![According to the CTI Platform (LetsDefend — Threat Intel), what action did the IPS product take against the attack event](./1_GlUWLDW7W8y8H4Yntn_OCw.webp)
> **According to the CTI Platform (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threat-intelligence-feed)**), what action did the IPS product take against the attack event triggered by access attempts from the IP address (listed in IoCs for "APT-ENR-88") to organization's systems?**

When we look at the action field in the log, we see the answer.

**Answer:** dropped

![LetsDefend lab questions (2)](./1_gYGSs3ryd1QXYwme6XrTEw.webp)

---

## Practical Lab-3

---

## Hypothesis-3

**Note:** The questions in this section are designed for threat hunting based on the following hypothesis.

**Hypothesis:** A threat actor group might be preparing a Business Email Compromise (BEC) attack targeting this organization.

---

## Threat Hunting Lab Environment

* **Company Name:** CNCHome
* **Company Domain:** cnchomecorp.io
* **Third-Party Companies:** vertexenterprise.io, universalventures.io, pioneersystems.io
* CTI Events ([Threat Intel LetsDefend Platform](https://app.letsdefend.io/threat-intelligence-feed))
* Email Security ([LetsDefend Platform](https://app.letsdefend.io/email-security))

---

## Lab Notes

* Analyze the logs between "Aug 1, 2024 00:00--Aug 7, 2024 00:00" to answer the questions below.
* Subsequent questions require correct answers from previous ones. **Answer all questions strictly in the order they appear.**

---

## Questions

**Note:** Analyze the logs between "Aug 1, 2024 00:00--Aug 7, 2024 00:00" to answer the questions below.

**Note:** Subsequent questions require correct answers from previous ones. Answer all questions strictly in the order they appear.

> **According to the CTI Platform (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threath-intelligence-feed)**), which suspicious domain, suspected to belong to a third-party company the organization works with, was reported?**

Search for domains similar to third-party company names in the CTI platform. we have three **Third-Party domain**s: vertexenterprise.io, universalventures.io, pioneersystems.io. When we search for universalventures, we find results.

![Search for domains similar to third-party company names in the CTI platform](./1_ua7S4nb6DNNl4oqnLNtrcQ.webp)

Threat Intel

**Answer:** universalventures.top

![According to the CTI Platform (LetsDefend — Threat Intel), what is the TAG (CTI category) of the suspicious domain suspected](./1_DDaOijlpvt4V2OpR9e_ixA.webp)
> **According to the CTI Platform (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threath-intelligence-feed)**), what is the TAG (CTI category) of the suspicious domain suspected to belong to a third-party company the organization works with, reported?**

Search for domains similar to third-party company names in the CTI platform. Check the TAG.

**Answer:** phishing

![According to the CTI Platform (LetsDefend — Threat Intel), what is the email address of the sender of the email sent to the](./1_VqdaS78Ws4oLPuNhFQolRg.webp)
> **According to the CTI Platform (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threath-intelligence-feed)**), what is the email address of the sender of the email sent to the organization from the suspicious domain suspected to belong to a third-party company?**

Search for the suspicious domain in the "Email Security" module.  
The subject line of the email indicates an urgent call regarding a bank account. This is a well-known phishing tactic. Three emails were quarantined, while one was delivered to the user.

![The subject line of the email indicates an urgent call regarding a bank account](./1_bGbWtToYCmuqTiLaa-fYAw.webp)

**Answer:** john@universalventures.top

![According to the CTI Platform (LetsDefend — Threat Intel), how many different email accounts in the organization received](./1_zE5kH1ztCuVG7cLF3hDUiQ.webp)
> **According to the CTI Platform (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threath-intelligence-feed)**), how many different email accounts in the organization received emails from the suspicious domain suspected to belong to a third-party company?**

We found the answer in the previous question. anna@cnchomecorp.io, suzan@cnchomecorp.io, and eric@cnchomecorp.io

**Answer: 3**

![According to the CTI Platform (LetsDefend — Threat Intel), what is the recipient email address of the successfully delivered](./1_Du_xuBHSPOaxb2OifGfqNQ.webp)
> **According to the CTI Platform (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threath-intelligence-feed)**), what is the recipient email address of the successfully delivered email sent from the suspicious domain (suspected to belong to a third-party company)?**

We found the answer in the previous question

**Answer:** anna@cnchomecorp.io

![According to the CTI Platform (LetsDefend — Threat Intel), were any emails sent from the organization to the suspicious](./1_tb_QjISiTu62kXXDp0CCUw.webp)
> **According to the CTI Platform (**[**LetsDefend — Threat Intel**](https://app.letsdefend.io/threath-intelligence-feed)**), were any emails sent from the organization to the suspicious domain suspected to belong to the third-party company?**

Search for the suspicious domain in the "Email Security" module using the "Recipients:" field in "Detailed Search". we see that no response mail exists.

**Answer: No**

![LetsDefend lab questions (3)](./1_lkGq5dGpu6eSWAY6ZSwKsA.webp)
