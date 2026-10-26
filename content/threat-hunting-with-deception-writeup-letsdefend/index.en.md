---
date: '2025-10-31'
description: In the world of cybersecurity, threat hunting requires developing proactive approaches to detect attackers and stop their activities. While traditional security measures offer passive methods to stop attackers, deception-based threat hunting takes th...
draft: false
image: featured.webp
title: Threat Hunting with Deception Writeup - LetsDefend
type: writeups
topic: detection-response
tags: ["LetsDefend", "Threat Hunting", "Write-up", "Blue Team", "SIEM", "Deception", "Honeypot"]
featuredImageAlt: "LetsDefend Blue Team Training logo"
---

[Letsdefend Blue Team Training Platform](https://letsdefend.io/)

In the world of cybersecurity, threat hunting requires developing proactive approaches to detect attackers and stop their activities. While traditional security measures offer passive methods to stop attackers, deception-based threat hunting takes this strategy a step further. Deception-based threat hunting is a method that misleads attackers, preventing them from reaching their real targets while exposing their tactics in the process.

This technique involves intentionally placing misleading information and decoy targets (such as honeypots and honeynets) within an organization's network to distract attackers and detect them. Attackers, believing these decoys to be real systems, target them, allowing security teams to better understand the attackers' methods and intentions. This approach enables the detection of attacks at earlier stages and significantly strengthens an organization's security posture.

Deception-based threat hunting not only detects attackers but also monitors their movements, contributing to the development of defense strategies against future attacks.

![Deception-based threat hunting not only detects attackers but also monitors their movements, contributing to the development](./0_4SwuHlqMCpR60r3u.webp)

( **Image Source** : <https://www.wwt.com/article/deception-technology> )

---

## Threat Hunting with Deception Technologies

Threat hunting is an active process designed to detect and stop cyberattacks. Deception technologies help by revealing attacker behavior and helping security teams understand their methods. Deception-based threat hunting not only detects attacks, but also provides a broader security perspective by monitoring how attackers move.

These technologies integrate various deception elements (such as honeypots, honeynets, fake files, and fake databases) into an organization's network. Attackers mistake these decoys for real targets and engage with them, allowing security teams to analyze attackers' techniques, tools, and intentions. As a result, organizations can strengthen their defenses against current attacks and develop more effective security strategies for future threats.

---

## The Role of Deception Technologies in Threat Hunting

The role of deception technologies in threat hunting is to mislead attackers, expose their methods, and help security teams understand the stage of the attack. By strategically placing decoys within networks and systems, these technologies deceive attackers and make it harder for them to reach their actual targets.

![The role of deception technologies in threat hunting is to mislead attackers, expose their methods, and help security teams](./0_odeYx4pWwkrGi8tW.webp)

( **Image Source** : <https://www.youtube.com/watch?app=desktop&v=N9TkDjzeVDc> )

Deception technologies play several critical roles in the threat hunting process:

* **Redirecting Attackers:** Attackers are tricked into targeting decoys, believing them to be real resources. This diverts their attention from actual targets and prevents them from causing harm.
* **Detecting Attacks:** When attackers interact with or manipulate decoys, deception systems immediately alert security teams. These alerts enable the early detection of attacks.
* **Analyzing Attacker Behavior:** Deception technologies record every step of the attackers' interaction with decoys. This data is analyzed to understand the methods, tools, and intentions of the attackers.
* **Developing Defense Strategies:** The insights gained from deception technologies allow security teams to develop more effective defense strategies. By identifying attackers' weak points, teams can enhance the security of their networks.

---

## Deception-Based Threat Detection

Deception-based detection is a cybersecurity approach that is triggered when attackers interact with deceptive elements. This method uses fake resources and targets to mislead attackers and reveal their presence.

Deception-based detection is carried out through the following steps:

* **Deploying Decoys:** Fake elements are strategically placed within networks and systems. These decoys are designed to attract and trap attackers.
* **Detecting Attackers:** When an attacker attempts to access or manipulate a decoy, the deception system detects the activity and alerts security teams. This ensures early detection of the attack.
* **Recording Activity:** Every step of the attacker's interaction with the decoys is recorded. This data is used to analyze how the attack unfolded and which techniques were employed.
* **Rapid Response:** Deception-based detection enables quick identification of attacks, allowing security teams to respond immediately. Early detection minimizes the impact of the attack and prevents the attacker from progressing.

Deception-based detection is a powerful component of cybersecurity defense. By engaging with decoys, attackers reveal their presence, allowing for a more complete assessment of the attack and helping to strengthen security strategies.

![Deception-based detection is a powerful component of cybersecurity defense](./0_DDJsAx3m8Nvq7bkT.webp)

---

## Threat Hunting Evaluation

Deception technologies in cybersecurity provide an effective way to reveal the movements and intentions of attackers by misleading them. These technologies redirect attackers to fake targets, enabling early detection and allowing security teams to respond quickly to threats. Deception-based detection creates a proactive line of defense against cyber threats, supported by anomaly detection and behavioral analysis. These approaches maximize network security by strengthening an organization's security strategy while making it more difficult for attackers to reach their intended targets.

This lesson has discussed the importance of deception technologies in the threat hunting process. The next lesson will cover " **Using Deception in the Threat Hunting Process.** "

---

## Using Deception in Threat Hunting Process

Threat hunting is a proactive security strategy aimed at detecting cyberattacks before they occur. In this strategy, deception systems play a critical role. Deception systems are designed to mislead cyber attackers, prevent them from reaching their real targets, and provide valuable insights to security teams by using fake targets and traps. These systems serve as a vital component in the threat hunting process, helping to track and identify attackers.

Deception systems use decoys, such as honeypots, fake databases, and fake files, that are strategically placed within networks, systems, or applications. When attackers mistake these decoys for real targets and engage with them, security teams can gather essential information about the attackers' techniques, tools, and objectives. This way, organizations can strengthen their defenses by detecting and analyzing attacker behavior in the early stages of an attack.

In other words, deception systems accelerate the threat hunting process, revealing the methods used by attackers and supporting the development of more effective defense measures against future threats.

![In other words, deception systems accelerate the threat hunting process, revealing the methods used by attackers and](./0_ksZ7i8tqfKMwS-Wk.webp)

( **Image Source** : <https://www.countercraftsec.com/blog/benefits-and-use-cases-of-deception-for-threat-hunting/> )

---

## Collection and Analysis of Deception System Logs

Deception systems record every interaction attackers have with decoys and store this information in logs. These log data are critical for understanding the intentions, techniques, and methods of attackers. The collection and analysis of deception log data form a crucial part of the threat hunting process.

* **Data Collection:** Deception systems log all attempts to attack decoys. This data includes tools when, how, and which attackers used to carry out their attacks. The collected logs can contain critical information such as timestamps, attacker IP addresses, commands used, and other interactions with the system.
* **Centralized Log Management:** Transferring logs of detection systems to a centralized log management system or a SIEM (Security Information and Event Management) platform ensures efficient management and analysis of this data. A centralized log management system can store large volumes of data, analyze it, and identify connections between attacker behaviors.
* **Identifying Normal and Abnormal Patterns:** Analyzing the log data helps understand typical attacker behavior patterns. Identifying anomalies that deviate from normal patterns is critical to determining the stage of an attack and whether attackers can be stopped before they reach their real targets.
* **Behavioral Analysis:** Log data is used to analyze how attackers interact with decoys. Behavioral analysis reveals the steps attackers follow, the tools they use, and theirattack methods. As a result, security teams can develop more effective defense strategies.

---

## Detection and Analysis of Activities

Detection and analysis of activity begins the moment attackers interact with decoys in deception-based threat hunting. This process involves identifying attacks, understanding the intentions and techniques of attackers, and optimizing security measures based on this information.

* **Anomaly Detection:** Deception systems detect anomalies by identifying differences between normal network activity and attempts to attack decoys. These anomalies are often the first signs of attack attempts and are therefore critical. For example, a user suddenly deviating from normal behavior and attempting to access a fake database may indicate that an attacker is active in the system.
* **Signature- and Behavior-based Identification** : Suspicious activity in deception systems is identified using both signature-based and behavior-based detection methods. Signature-based detection focuses on identifying known attack patterns, while behavior-based detection identifies abnormal attacker behaviors. When used together, these methods can detect a broader spectrum of attacks.
* **Real-time Monitoring:** Deception systems monitor attack attempts on decoys in real time and immediately detect attacker activity, allowing necessary action to be taken before the attack can cause damage. Real-time monitoring is a critical defensive mechanism, especially for fast-moving or high-impact attacks.
* **Tracking and Analyzing Attackers:** Data captured during an attacker's interaction with decoys is analyzed to understand the steps they took and how they attempted to execute the attack. The analysis provides deep insight into the tools, commands, and strategies used by the attacker.
* **Mitigating the Impact of Attacks:** Detecting and analyzing attacker activity on decoys not only identifies attacks. It also minimizes their impact. Armed with this data, security teams can respond quickly and stop the attacker before they can cause damage to the system.

---

## Threat Hunting Evaluation

Deception systems provide an effective way to mislead attackers and expose their techniques in the threat hunting process. Collecting and analyzing log data in deception systems plays a critical role in understanding attacker behavior. Detecting and analyzing activity on decoys ensures that attacks are detected early and stopped effectively. These processes help organizations strengthen their security strategies, better understand the intent of attackers, and prepare for future threats. The effective use of deception systems is a powerful tool in cybersecurity defense and plays a critical role in improving network security.

---

## Unauthorized Access Attempts Hypothesis

---

## Hypothesis

Unusual access attempts to a fake database or file server from a specific internal IP address might indicate that an attacker has gained unauthorized access to the network and is attempting to obtain valuable data.

![Unusual access attempts to a fake database or file server from a specific internal IP address might indicate that an](./0_U0kGx4evnPoACruo.webp)

( **Image Source** : <https://www.linkedin.com/pulse/deception-technology-aditya-mukherjee-phd-information-security-/> )

---

## Data Sources

* **Deception System Logs:** Logs containing all access attempts to fake databases or file servers, along with details of these attempts.
* **SIEM Logs:** Logs collected from the detection system and analyzed on a centralized platform.
* **Network Flow Analysis:** Examination of network traffic data to monitor suspicious connection flows.
* **User Activity Logs:** Logs tracking user activities accessing systems and recording abnormal behaviors.
* **Threat Intelligence Databases:** Databases containing up-to-date information on known attack methods and malicious actors.

---

## Analysis Steps

* Transfer detection system logs to the SIEM platform.
* Record all access attempts to the fake database or file server.
* Analyze normal network traffic and user activities.
* Determine the level of traffic directed to decoys and which users attempted to access these fake targets.
* Detect unusual access attempts to decoys.
* Investigate activities deviating from normal behavior, especially internal IP addresses making numerous access attempts to decoys.
* Compare network flow analysis and user activity logs with other security logs.
* Determine whether the attacker has accessed other systems and the current stage of the attack.
* Conduct a detailed analysis of activities logged in deception systems.
* Analyze the commands used by the attacker, the data they attempted to access, and their interactions with the system.
* Evaluate the validity and severity of suspicious activities.
* Determine the attacker's intentions and potential targets.
* Gather additional data to confirm the incident and determine the stage of the attack.
* Use additional logs and threat intelligence data to clarify the scope of the attack.

---

## Hypothesis Validation and Expected Findings

* Anomalous access attempts from a specific internal IP address will be detected in deception systems.
* The attempts to access fake databases or file servers may indicate that an attacker is attempting to gain unauthorized access.
* Correlation analysis with SIEM and other security logs is used to assess whether this activity represents a potential attack.
* The techniques used by the attacker and the data targeted are identified, which can allow the attack to be stopped at an early stage.

---

## Threat Hunting Evaluation

These analysis steps provide strategies for detecting unusual access attempts to decoys from a specific internal IP address. Deception systems serve as a critical data source for monitoring and identifying such abnormal activity. Detected anomalies may indicate that an attacker is attempting to gain unauthorized access to the network, allowing for rapid response. This process plays a critical role in ensuring network security and proactively managing threats.

---

## Practical Lab

---

## Hypothesis

**Note**: The questions in this section are prepared for Threat Hunting based on the following hypothesis:

**Hypothesis**: Attackers may target critical systems in an organization's network in an attempt to gain control of them.

---

## Threat Hunting Lab Environment

* Deception Events(FortiDeceptor)
* SIEM (Wazuh)
* Vulnerability Scanner Tools (192.168.1.50)
* Windows Security Events
* Linux Security Events

---

## Lab Notes

* Analyze the logs between "Aug 8, 2024 00:00--Aug 13, 2024 00:00" to answer the questions below.
* Subsequent questions require correct answers from previous ones. Answer all questions strictly in the order they appear.

---

## Questions

**Note:** Analyze the logs between "Aug 8, 2024 00:00--Aug 13, 2024 00:00" to answer the questions below.

**Note**: Subsequent questions require correct answers from previous ones. Answer all questions strictly in the order they appear.

> What is the source IP address of the system that caused the most alerts related to the SSH service to be created in deception systems?

In SIEM, use the filters "rule.groups: fortideceptor" and "data.event\_type: ssh-logon-failure", and check the "data.src\_ip" field.

![In SIEM, use the filters "rule.groups: fortideceptor" and "data.event type: ssh-logon-failure", and check the "data.src ip"](./1__yV0rLPLtrB2U6kkZtcOgA.webp)

**Answer**: 192.168.1.50

> What is the source IP address of the system that caused the most alerts related to the SSH service to be created in deception systems, apart from "Vulnerability Scanner Tools"?

In SIEM, apply the following filters: "rule.groups: fortideceptor" and "data.event\_type: ssh-logon-failure." Then, exclude the "Vulnerability Scanner Tools" IP address and check the "data.src\_ip" field.

![In SIEM, apply the following filters: "rule.groups: fortideceptor" and "data.event type: ssh-logon-failure." Then, exclude](./1_NPyVTgbcMuydzEzFelg-Vw.webp)

**Answer**: 192.168.1.76

> How many different targets (destination port 22) did the system that caused the most SSH-related alerts, excluding "Vulnerability Scanner Tools", attempt to access?

In SIEM, use the filters "rule.groups: fortigate," "data.dstport: 22," and "data.srcip: [IP\_Address]."

![In SIEM, use the filters "rule.groups: fortigate," "data.dstport: 22," and "data.srcip: IP Address ."](./1_xHiYiQFQKwmepPD1tV2oSA.webp)

**Answer**: 5

> Apart from the Vulnerability Scanner Tools, the system that caused the most alerts to be created in the SSH service of the detection systems was identified in previous stages of the threat hunting process. Which target system (agent.name) did the aforementioned system attempt to access, resulting in the most "SSH logon failure" events?

In SIEM, use the filters "data.srcip: [IP\_Address]" and "rule.groups: sshd," then analyze the ssh logon failure events. Find the "agent.name" value.

![In SIEM, use the filters "data.srcip: IP Address " and "rule.groups: sshd," then analyze the ssh logon failure events](./1_gfyv_zB8RA7qRQyjbQhRbQ.webp)

**Answer**: linuxtestvm.cc

> Apart from the Vulnerability Scanner Tools, the system that caused the most alerts to be created in the SSH service of the deception systems was identified in previous stages of the threat hunting process. What is the IP address of the target system to which this system successfully established an SSH connection?

In SIEM, use the filters "data.srcip: [IP\_Address]" and "rule.groups: sshd," then review the "ssh logon success" events. Check the "agent.ip" value.

![In SIEM, use the filters "data.srcip: IP Address " and "rule.groups: sshd," then review the "ssh logon success" events](./1_McdnnB0ygN3zkJsgJgYqKA.webp)

**Answer**: 192.168.5.14

> Apart from the Vulnerability Scanner Tools, the system that caused the most alerts to be created in the SSH service of the detection systems was identified in previous stages of the threat hunting process. What protocol other than the SSH service has been used to access the target system successfully?

Search the IP address with full text search in SIEM and check the values in the "data.service" field.

![Search the IP address with full text search in SIEM and check the values in the "data.service" field](./1_tAeS4yEA5WMER68mkSE4oQ.webp)

**Answer**: RDP

> What is the IP address that caused the most alerts to be created in deception systems' RDP service?

In SIEM, use the filter "rule.groups: windows" and search for the IP address.

![In SIEM, use the filter "rule.groups: windows" and search for the IP address](./1_wHTuqJRDfuebq0FzoTOqKg.webp)

**Answer**: 192.168.1.76

> During previous stages of the threat hunting process, the system that caused the most alerts in the RDP services of the deception systems was identified. What is the IP address of the target system that this system successfully accessed using RDP?

In SIEM, use the filter "rule.groups: windows" and search for the IP address.

![In SIEM, use the filter "rule.groups: windows" and search for the IP address (2)](./1__k9jpHQ6SYdJyuQaJfUV1A.webp)

**Answer**: 172.16.8.159

> During previous stages of the threat hunting process, the system that caused the most alerts in the RDP services of the deception systems was identified. What user account (username) was used to access the target system from this system?

In SIEM, use the filter "rule.groups: windows" and search for the IP address.

![In SIEM, use the filter "rule.groups: windows" and search for the IP address (3)](./1_5QpfgrHRBMxAIKffD3rmOQ.webp)

**Answer**: Administrator
